import os
import csv
from datetime import datetime, timezone

import torch
from transformers import AutoTokenizer
from transformers import AutoModelForSequenceClassification
from scipy.special import softmax

MODEL = "cardiffnlp/twitter-roberta-base-sentiment"

# Where sentiment history is logged. Override with the SENTIMENT_LOG_PATH env
# var if you want it written somewhere else (e.g. a shared volume).
LOG_PATH = os.environ.get("SENTIMENT_LOG_PATH", "sentiment_log.csv")
LOG_FIELDS = ["timestamp", "character_id", "text", "label", "negative", "neutral", "positive"]


class SentimentAnalysis:
    def __init__(self):
        """
        Initialize the sentiment analysis model and tokenizer, and record model load metrics.
        """
        import time
        self._timer = time.perf_counter

        self.MODEL = MODEL
        load_start = self._timer()
        self.tokenizer = AutoTokenizer.from_pretrained(self.MODEL)
        self.model = AutoModelForSequenceClassification.from_pretrained(self.MODEL)
        self.model_load_ms = (self._timer() - load_start) * 1000.0

        self.text = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model.to(self.device)

        # logging
        self._ensure_log_file()
        self.METRICS_LOG_PATH = os.environ.get("SENTIMENT_METRICS_PATH", "sentiment_metrics.csv")
        self.METRICS_FIELDS = [
            "timestamp",
            "character_id",
            "label",
            "input_chars",
            "token_count",
            "tokenization_ms",
            "inference_ms",
            "total_ms",
            "model",
            "device",
            "model_load_ms",
        ]
        self._ensure_metrics_file()

    def _ensure_log_file(self):
        """Create the log file with a header row if it doesn't exist yet."""
        if not os.path.exists(LOG_PATH):
            with open(LOG_PATH, "w", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=LOG_FIELDS)
                writer.writeheader()

    def _ensure_metrics_file(self):
        if not os.path.exists(self.METRICS_LOG_PATH):
            try:
                with open(self.METRICS_LOG_PATH, "w", newline="", encoding="utf-8") as f:
                    writer = csv.DictWriter(f, fieldnames=self.METRICS_FIELDS)
                    writer.writeheader()
            except Exception as e:
                print(f"[sentiment_engine] failed to create metrics file: {e}")

    def _log(self, text, scores_dict, label, character_id):
        """Append one tracked sentiment record to the CSV log."""
        row = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "character_id": character_id or "",
            "text": text,
            "label": label,
            "negative": float(scores_dict["negative"]),
            "neutral": float(scores_dict["neutral"]),
            "positive": float(scores_dict["positive"]),
        }
        try:
            with open(LOG_PATH, "a", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=LOG_FIELDS)
                writer.writerow(row)
        except Exception as e:
            print(f"[sentiment_engine] failed to write log: {e}")

    def _log_metrics(self, metrics: dict):
        try:
            with open(self.METRICS_LOG_PATH, "a", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=self.METRICS_FIELDS)
                writer.writerow(metrics)
        except Exception as e:
            print(f"[sentiment_engine] failed to write metrics: {e}")

    def user_text(self, text: str, character_id: str = None, return_metrics: bool = False):
        """
        Analyze user-provided text for sentiment. Optionally return metrics about the inference.
        """
        self.text = text
        return self.polarity_scores(text, character_id=character_id, return_metrics=return_metrics)

    def polarity_scores(self, text: str, character_id: str = None, return_metrics: bool = False, log: bool = True):
        """
        Compute sentiment probabilities for the supplied text and log the result. When
        return_metrics=True, also return a metrics dict containing timing and token info.
        """
        import time
        t0 = time.perf_counter()

        # tokenization
        tok_start = time.perf_counter()
        encode_text = self.tokenizer(text, return_tensors="pt")
        tokenization_ms = (time.perf_counter() - tok_start) * 1000.0

        token_count = 0
        if "input_ids" in encode_text:
            ids = encode_text["input_ids"]
            try:
                token_count = int(ids.shape[1])
            except Exception:
                token_count = 0

        # move tensors to device
        encode_text = {k: v.to(self.device) for k, v in encode_text.items()}

        # inference
        inf_start = time.perf_counter()
        with torch.no_grad():
            output = self.model(**encode_text)
        inference_ms = (time.perf_counter() - inf_start) * 1000.0

        # scores
        scores = output.logits[0].cpu().numpy()
        scores = softmax(scores)
        scores_dict = {
            "negative": float(scores[0]),
            "neutral": float(scores[1]),
            "positive": float(scores[2]),
        }
        label = self.classify(scores_dict)

        total_ms = (time.perf_counter() - t0) * 1000.0

        # log sentiment and metrics (only if caller requests logging)
        metrics = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "character_id": character_id or "",
            "label": label,
            "input_chars": len(text),
            "token_count": token_count,
            "tokenization_ms": round(tokenization_ms, 3),
            "inference_ms": round(inference_ms, 3),
            "total_ms": round(total_ms, 3),
            "model": self.MODEL,
            "device": self.device,
            "model_load_ms": round(getattr(self, "model_load_ms", 0.0), 3),
        }
        if log:
            self._log(text, scores_dict, label, character_id)
            self._log_metrics(metrics)

        if return_metrics:
            return (scores_dict, metrics) if not log else (scores_dict, metrics)
        return scores_dict

    def classify(self, scores: dict):
        """
        Determine the sentiment label with the highest probability.
        """
        predicted_emotion = max(scores, key=scores.get)
        return predicted_emotion