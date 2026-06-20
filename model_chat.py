import os
from ollama import Client

_host_env = (
    os.getenv("OLLAMA_HOST")
    or os.getenv("OLLAMA_BASE_URL")
    or "http://127.0.0.1:11434"
)

if _host_env.endswith("/v1"):
    _host_env = _host_env[:-3]

client = Client(host=_host_env)

from characters import CHARACTERS


class Character:
    def __init__(
        self,
        character_name,
        model="llama3.2:1b",
        temperature=0.8,
    ):
        if character_name not in CHARACTERS:
            raise ValueError(
                f"Unknown character '{character_name}'. "
                f"Available: {list(CHARACTERS.keys())}"
            )

        self.character_name = character_name
        self.system_prompt = CHARACTERS[character_name]["prompt"]

        self.model = model
        self.temperature = temperature
        self.history = []

    def chat(self, user_message):
        messages = [
            {
                "role": "system",
                "content": self.system_prompt,
            }
        ]

        messages.extend(self.history)

        messages.append(
            {
                "role": "user",
                "content": user_message,
            }
        )

        response = client.chat(
            model=self.model,
            messages=messages,
            options={
                "temperature": self.temperature
            }
        )

        reply = response["message"]["content"]

        self.history.extend([
            {
                "role": "user",
                "content": user_message,
            },
            {
                "role": "assistant",
                "content": reply,
            }
        ])

        return reply

    def reset(self):
        self.history.clear()