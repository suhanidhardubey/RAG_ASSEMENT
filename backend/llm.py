"""
LLM Integration Engine for RAGora.
Supports:
1. Google Gemini (gemini-2.5-flash, gemini-flash-latest, gemini-3-flash-preview, gemini-2.0-flash, gemini-1.5-flash)
2. OpenAI (gpt-4o-mini, gpt-4o)
3. Groq (llama-3.3-70b-versatile)
4. Local Ollama (llama3, mistral)

Keys can be provided via environment variables (GEMINI_API_KEY, OPENAI_API_KEY, GROQ_API_KEY)
or dynamically passed from the client per-request in headers or request body.
"""

import os
import json
import urllib.request
import urllib.error
from pathlib import Path

# Auto-load .env from backend/ or project root if present
def load_local_env():
    candidates = [
        Path(__file__).resolve().parent / ".env",
        Path(__file__).resolve().parent.parent / ".env",
    ]
    for env_file in candidates:
        if env_file.exists():
            try:
                with open(env_file, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if not line or line.startswith("#") or "=" not in line:
                            continue
                        k, v = line.split("=", 1)
                        k = k.strip()
                        v = v.strip().strip("'\"")
                        if k and v:
                            os.environ[k] = v
            except Exception:
                pass

load_local_env()


def call_gemini(prompt: str, api_key: str = None, model: str = "gemini-2.5-flash") -> str:
    key = api_key or os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not key:
        raise ValueError("No Gemini API key provided. Add GEMINI_API_KEY to backend/.env or enter your key in the web UI.")

    models_to_try = [model, "gemini-2.5-flash", "gemini-flash-latest", "gemini-3-flash-preview", "gemini-2.0-flash", "gemini-1.5-flash"]
    seen = set()
    ordered_models = [m for m in models_to_try if not (m in seen or seen.add(m))]

    last_error = None
    for m in ordered_models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={key}"
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.4,
                "maxOutputTokens": 1024
            }
        }

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        try:
            with urllib.request.urlopen(req, timeout=18) as response:
                res_data = json.loads(response.read().decode("utf-8"))
                candidates = res_data.get("candidates", [])
                if candidates and "content" in candidates[0]:
                    parts = candidates[0]["content"].get("parts", [])
                    if parts:
                        return parts[0].get("text", "").strip()
        except Exception as e:
            last_error = e
            continue

    raise ValueError(f"Gemini API request failed: {last_error or 'Empty response'}")


def call_openai(prompt: str, api_key: str = None, model: str = "gpt-4o-mini") -> str:
    key = api_key or os.environ.get("OPENAI_API_KEY")
    if not key:
        raise ValueError("No OpenAI API key provided. Set OPENAI_API_KEY or enter your key in Settings.")

    url = "https://api.openai.com/v1/chat/completions"
    payload = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are an expert AI engineering study tutor. Provide structured, accurate, "
                    "exam-oriented explanations with clean bullet points and step-by-step logic."
                )
            },
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3,
        "max_tokens": 1024
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {key}"
        },
        method="POST"
    )

    with urllib.request.urlopen(req, timeout=18) as response:
        res_data = json.loads(response.read().decode("utf-8"))
        choices = res_data.get("choices", [])
        if choices and "message" in choices[0]:
            return choices[0]["message"].get("content", "").strip()
        raise ValueError("Empty response from OpenAI API.")


def call_groq(prompt: str, api_key: str = None, model: str = "llama-3.3-70b-versatile") -> str:
    key = api_key or os.environ.get("GROQ_API_KEY")
    if not key:
        raise ValueError("No Groq API key provided. Set GROQ_API_KEY or enter your key in Settings.")

    url = "https://api.groq.com/openai/v1/chat/completions"
    payload = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": "You are a concise, high-yield computer science engineering exam assistant."
            },
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3,
        "max_tokens": 1024
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {key}"
        },
        method="POST"
    )

    with urllib.request.urlopen(req, timeout=15) as response:
        res_data = json.loads(response.read().decode("utf-8"))
        choices = res_data.get("choices", [])
        if choices and "message" in choices[0]:
            return choices[0]["message"].get("content", "").strip()
        raise ValueError("Empty response from Groq API.")


def call_ollama(prompt: str, endpoint: str = "http://localhost:11434", model: str = "llama3") -> str:
    url = f"{endpoint.rstrip('/')}/api/generate"
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    with urllib.request.urlopen(req, timeout=25) as response:
        res_data = json.loads(response.read().decode("utf-8"))
        return res_data.get("response", "").strip()


def query_llm(
    prompt: str,
    provider: str = None,
    api_key: str = None,
    model: str = None
) -> dict:
    """
    Unified entry point. Automatically detects available provider:
    1. Explicit provider passed
    2. GEMINI_API_KEY / OPENAI_API_KEY / GROQ_API_KEY in environment
    Returns dict: {"text": str, "provider": str, "model": str, "success": bool, "error": str}
    """
    prov = (provider or "").strip().lower()

    # Determine provider priority if not specified
    if not prov:
        if api_key:
            prov = "gemini" if (api_key.startswith("AIza") or api_key.startswith("AQ.")) else "openai"
        elif os.environ.get("GEMINI_API_KEY"):
            prov = "gemini"
        elif os.environ.get("OPENAI_API_KEY"):
            prov = "openai"
        elif os.environ.get("GROQ_API_KEY"):
            prov = "groq"
        else:
            return {
                "success": False,
                "error": "No LLM API key configured.",
                "text": None,
                "provider": None,
            }

    try:
        if prov == "gemini":
            chosen_model = model or "gemini-2.5-flash"
            text = call_gemini(prompt, api_key=api_key, model=chosen_model)
            return {"success": True, "text": text, "provider": "gemini", "model": chosen_model}

        elif prov == "openai":
            chosen_model = model or "gpt-4o-mini"
            text = call_openai(prompt, api_key=api_key, model=chosen_model)
            return {"success": True, "text": text, "provider": "openai", "model": chosen_model}

        elif prov == "groq":
            chosen_model = model or "llama-3.3-70b-versatile"
            text = call_groq(prompt, api_key=api_key, model=chosen_model)
            return {"success": True, "text": text, "provider": "groq", "model": chosen_model}

        elif prov == "ollama":
            chosen_model = model or "llama3"
            text = call_ollama(prompt, endpoint=api_key or "http://localhost:11434", model=chosen_model)
            return {"success": True, "text": text, "provider": "ollama", "model": chosen_model}

        else:
            return {"success": False, "error": f"Unknown provider: {prov}", "text": None}

    except Exception as e:
        return {"success": False, "error": str(e), "text": None, "provider": prov}


def is_llm_configured() -> bool:
    """Returns True if any environment API key is present."""
    return bool(
        os.environ.get("GEMINI_API_KEY")
        or os.environ.get("GOOGLE_API_KEY")
        or os.environ.get("OPENAI_API_KEY")
        or os.environ.get("GROQ_API_KEY")
    )
