# ReqCraft – Natural Language to HTTP Request Builder

ReqCraft is an AI-powered developer tool that converts plain English descriptions into structured HTTP requests and executable code snippets.

Instead of remembering syntax for different tools, users can simply describe the API request in natural language and ReqCraft will generate the corresponding request configuration and code.

Example input:

POST /api/users with name and email

ReqCraft generates:

* HTTP method
* URL
* Headers
* Request body
* Code snippets (curl, Python, JavaScript)

Users can also **execute the request directly** and view the response.

---

## Features

* Natural language → HTTP request generation
* Automatic code snippets for multiple languages
* Execute requests directly from the interface
* View response status, headers, and body
* Request history stored in browser LocalStorage
* Shareable links for generated requests

---

## Tech Stack

**Frontend**

* React
* TypeScript
* Tailwind CSS
* Monaco Editor

**Backend**

* Python
* FastAPI

**AI**

* OpenRouter API for LLM-powered request generation

---

## Example

Input:

GET /products?category=electronics

Generated output:

* HTTP request configuration
* curl command
* Python requests code
* JavaScript fetch code

---

## Project Structure

```
reqcraft
│
├── backend
│   ├── main.py
│   ├── llm_service.py
│   └── requirements.txt
│
├── frontend
│   ├── src
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Backend

```
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```
npm install
npm run dev
```

---

## Future Improvements

* Support more languages (Go, Rust, Java)
* Mock API response generator
* Better request editing before execution
* Response visualization

---

## Goal

ReqCraft demonstrates how natural language interfaces can simplify developer workflows by converting human intent into executable HTTP requests.
