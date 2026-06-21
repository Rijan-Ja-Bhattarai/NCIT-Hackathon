#!/usr/bin/env python3
"""
Admin panel for viewing tracked sentiment history.

Reads the CSV log written by sentiment_engine.py (one row per analyzed
message: timestamp, character_id, text, label, negative, neutral, positive)
and shows it as a filterable table plus a sentiment-over-time chart.

Also shows engine metrics (latency) recorded by the sentiment engine in
sentiment_metrics.csv so everything is available in this single admin UI.

Usage:
  streamlit run admin.py

Environment variables:
  SENTIMENT_LOG_PATH    - path to message log CSV (default: sentiment_log.csv)
  SENTIMENT_METRICS_PATH - path to metrics CSV (default: sentiment_metrics.csv)
"""

import os

import pandas as pd
import streamlit as st

LOG_PATH = os.environ.get("SENTIMENT_LOG_PATH", "sentiment_log.csv")
METRICS_PATH = os.environ.get("SENTIMENT_METRICS_PATH", "sentiment_metrics.csv")

st.set_page_config(page_title="Sentiment Admin", layout="wide")
st.title("Sentiment Tracking — Admin Panel")


@st.cache_data(ttl=5)
def load_log(path):
    if not os.path.exists(path):
        return pd.DataFrame(columns=[
            "timestamp", "character_id", "text", "label",
            "negative", "neutral", "positive",
        ])
    df = pd.read_csv(path)
    df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")
    return df.sort_values("timestamp")


@st.cache_data(ttl=5)
def load_metrics(path):
    """Load metrics CSV written by sentiment_engine and normalize types."""
    if not os.path.exists(path):
        return pd.DataFrame(columns=[
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
        ])
    df = pd.read_csv(path)
    # be tolerant of missing columns
    for col in ["token_count", "tokenization_ms", "inference_ms", "total_ms", "model_load_ms"]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")
        else:
            df[col] = pd.Series([None] * len(df))
    if "timestamp" in df.columns:
        df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")
    else:
        df["timestamp"] = pd.NaT
    return df.sort_values("timestamp")


# load both sources
log_df = load_log(LOG_PATH)
metrics_df = load_metrics(METRICS_PATH)

if log_df.empty and metrics_df.empty:
    st.info(
        f"No sentiment data found. Message log: '{LOG_PATH}', metrics: '{METRICS_PATH}'. Send a message in the chat app to start tracking."
    )
    st.stop()

# --- Top-level layout: two tabs for Message Log and Engine Metrics ---
tab1, tab2 = st.tabs(["Message Log", "Sentiment Engine Metrics"])

with tab1:
    st.header("Message log & charts")

    if log_df.empty:
        st.info(f"No message log found at '{LOG_PATH}'.")
    else:
        # --- Filters ---
        col1, col2 = st.columns(2)

        with col1:
            characters = sorted(c for c in log_df["character_id"].dropna().unique() if c)
            selected_characters = st.multiselect(
                "Filter by character", options=characters, default=characters,
            )

        with col2:
            labels = sorted(log_df["label"].dropna().unique())
            selected_labels = st.multiselect(
                "Filter by sentiment label", options=labels, default=labels,
            )

        filtered = log_df[
            log_df["character_id"].isin(selected_characters) & log_df["label"].isin(selected_labels)
        ] if selected_characters else log_df[log_df["label"].isin(selected_labels)]

        # --- Summary metrics ---
        m1, m2, m3, m4 = st.columns(4)
        m1.metric("Messages tracked", len(filtered))
        m2.metric("Avg positive", f"{filtered['positive'].mean():.2f}" if len(filtered) else "—")
        m3.metric("Avg neutral", f"{filtered['neutral'].mean():.2f}" if len(filtered) else "—")
        m4.metric("Avg negative", f"{filtered['negative'].mean():.2f}" if len(filtered) else "—")

        # --- Chart: sentiment scores over time ---
        st.subheader("Sentiment over time")
        if len(filtered) > 0:
            chart_df = filtered.set_index("timestamp")[['negative', 'neutral', 'positive']]
            st.line_chart(chart_df)
        else:
            st.caption("No data matches the current filters.")

        # --- Table: raw log ---
        st.subheader("Message log")
        st.dataframe(
            filtered.sort_values("timestamp", ascending=False),
            use_container_width=True,
            hide_index=True,
        )

        st.caption(f"Reading from `{LOG_PATH}`. Refreshes automatically every few seconds.")

with tab2:
    st.header("Sentiment engine metrics")

    if metrics_df.empty:
        st.info(f"No metrics CSV found at '{METRICS_PATH}'. Ensure the sentiment engine has run and the path is correct.")
    else:
        # controls
        col_a, col_b = st.columns([2, 1])
        with col_a:
            max_rows = st.number_input("Show recent rows (max)", min_value=10, max_value=2000, value=200, step=10)
        with col_b:
            sel_char = st.selectbox("Filter by character (all)", options=["(all)"] + sorted([c for c in metrics_df["character_id"].dropna().unique() if c]))

        mdf = metrics_df.copy()
        if sel_char and sel_char != "(all)":
            mdf = mdf[mdf["character_id"] == sel_char]

        # summary cards
        s1, s2, s3, s4 = st.columns(4)
        s1.metric("Metrics rows", len(mdf))
        s2.metric("Avg tokenization (ms)", f"{mdf['tokenization_ms'].mean():.2f}" if len(mdf) else "—")
        s3.metric("Avg inference (ms)", f"{mdf['inference_ms'].mean():.2f}" if len(mdf) else "—")
        s4.metric("Avg total (ms)", f"{mdf['total_ms'].mean():.2f}" if len(mdf) else "—")

        # time series of total_ms
        st.subheader("Inference latency over time")
        if 'timestamp' in mdf.columns and mdf['timestamp'].notna().any():
            latency_df = mdf.set_index('timestamp')[['total_ms']].dropna()
            if not latency_df.empty:
                st.line_chart(latency_df)
            else:
                st.caption('No timestamped latency values to chart.')
        else:
            st.caption('No timestamp column in metrics CSV.')

        st.subheader("Recent metric rows")
        to_show = mdf.sort_values('timestamp').tail(max_rows).fillna('—')
        st.dataframe(to_show[['timestamp', 'character_id', 'label', 'token_count', 'tokenization_ms', 'inference_ms', 'total_ms', 'model', 'device']].sort_values('timestamp', ascending=False), use_container_width=True)

        st.caption(f"Reading from `{METRICS_PATH}`. This view shows timing metrics (tokenization, inference, total) recorded by the sentiment engine.")
