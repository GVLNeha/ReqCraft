import os
import json
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="ReqCraft API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "openai/gpt-4o-mini"

SYSTEM_PROMPT = """You are an HTTP request builder. Convert natural language descriptions into structured HTTP requests.

ALWAYS respond with ONLY valid JSON — no explanations, no markdown, no code fences.

Use this exact schema:
{
  "method": "GET|POST|PUT|PATCH|DELETE",
  "url": "full URL or path",
  "headers": { "Header-Name": "value" },
  "body": null or { "key": "value" },
  "code_snippets": {
    "curl": "complete curl command",
    "python": "complete Python requests code",
    "javascript": "complete fetch() code"
  }
}

Rules:
- method: uppercase HTTP verb inferred from the description
- url: use https://api.example.com as base if no host is given
- headers: always include Content-Type: application/json for POST/PUT/PATCH; omit body-related headers for GET/DELETE
- body: null for GET/DELETE; realistic sample JSON for POST/PUT/PATCH with plausible field values
- code_snippets.curl: full working curl command with -X, -H, -d flags as needed
- code_snippets.python: import requests + full working code block
- code_snippets.javascript: full fetch() call with async/await
- Use realistic placeholder values (e.g. "John Doe", "john@example.com", 1, true)
- Never include comments or explanations — pure JSON only"""


class GenerateRequest(BaseModel):
    description: str


class ExecuteRequest(BaseModel):
    method: str
    url: str
    headers: dict[str, str] = {}
    body: Any = None


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/generate")
async def generate_request(req: GenerateRequest):
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY not configured")

    if not req.description.strip():
        raise HTTPException(status_code=400, detail="Description cannot be empty")

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": req.description.strip()},
        ],
        "temperature": 0.2,
        "max_tokens": 1200,
    }

    async with httpx.AsyncClient(timeout=30) as client:
        try:
            resp = await client.post(
                OPENROUTER_URL,
                json=payload,
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://reqcraft.app",
                    "X-Title": "ReqCraft",
                },
            )
            resp.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=502, detail=f"LLM API error: {e.response.text}")
        except httpx.RequestError as e:
            raise HTTPException(status_code=502, detail=f"LLM connection error: {str(e)}")

    data = resp.json()
    raw = data["choices"][0]["message"]["content"].strip()

    # Strip markdown fences if model ignored instructions
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        raise HTTPException(status_code=502, detail=f"LLM returned invalid JSON: {raw[:200]}")

    required = {"method", "url", "headers", "body", "code_snippets"}
    missing = required - set(parsed.keys())
    if missing:
        raise HTTPException(status_code=502, detail=f"LLM response missing fields: {missing}")

    return parsed


@app.post("/execute")
async def execute_request(req: ExecuteRequest):
    method = req.method.upper()
    allowed_methods = {"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"}
    if method not in allowed_methods:
        raise HTTPException(status_code=400, detail=f"Method {method} not allowed")

    url = req.url
    if not url.startswith(("http://", "https://")):
        raise HTTPException(status_code=400, detail="URL must start with http:// or https://")

    # Safety: block internal/local addresses
    blocked = ("localhost", "127.", "0.0.0.0", "192.168.", "10.", "172.")
    from urllib.parse import urlparse
    host = urlparse(url).hostname or ""
    if any(host.startswith(b) or host == b.strip(".") for b in blocked):
        raise HTTPException(status_code=400, detail="Requests to internal addresses are not allowed")

    async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
        try:
            response = await client.request(
                method=method,
                url=url,
                headers=req.headers,
                json=req.body if req.body else None,
            )
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="Request timed out after 15s")
        except httpx.RequestError as e:
            raise HTTPException(status_code=502, detail=f"Request failed: {str(e)}")

    # Try to parse response as JSON
    try:
        body = response.json()
    except Exception:
        body = response.text

    return {
        "status_code": response.status_code,
        "headers": dict(response.headers),
        "body": body,
        "elapsed_ms": round(response.elapsed.total_seconds() * 1000, 2),
    }