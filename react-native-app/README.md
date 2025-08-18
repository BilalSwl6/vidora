# Connect this Expo app to a FastAPI backend (including attachments)

This guide shows how to wire the app to a FastAPI server, send/receive JSON, and upload attachments (files/images/videos) via multipart/form-data from mobile and web.

## 1) FastAPI backend

### Install
```bash
pip install fastapi uvicorn[standard] python-multipart pydantic
```

### Minimal server with CORS and auth
```python
# main.py
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow your Expo dev origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8081",   # Expo web
        "http://localhost:19006",  # Expo classic web port
        "http://127.0.0.1:8081",
        "exp://127.0.0.1:*",       # Expo Go schemes (dev)
        "exp+websocket://*",
        "http://localhost:*",
        "http://192.168.0.*:*",    # your LAN range; adjust as needed
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

@app.post("/auth/login", response_model=LoginResponse)
async def login(body: LoginRequest):
    if body.email == "demo@demo.com" and body.password == "demo":
        return {"access_token": "demo-token"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

# Accept single or multiple attachments with metadata
@app.post("/upload")
async def upload(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    files: List[UploadFile] = File(...),  # name="files"
    # If you want single: file: UploadFile = File(...)
):
    # Persist files as needed (disk, S3, etc.)
    stored = []
    for f in files:
        content = await f.read()  # bytes
        stored.append({"filename": f.filename, "size": len(content), "content_type": f.content_type})
    return {"ok": True, "title": title, "description": description, "files": stored}

@app.get("/videos")
async def list_videos():
    return [{"id": "1", "title": "Sample", "thumb": "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1"}]
```

Run the server:
```bash
uvicorn main:app --reload --port 8000
```

## 2) Configure the app to point to your API

Set a base URL according to where FastAPI runs on your LAN.

- iOS Simulator/Android Emulator: http://127.0.0.1:8000
- Real device on same Wi‑Fi: use your computer’s LAN IP, e.g. http://192.168.0.42:8000
- Web (Expo for web): http://localhost:8000

Create a small API helper (recommended):
```ts
// utils/api.ts
export const API_BASE = __DEV__ ? "http://192.168.0.42:8000" : "https://your-domain.com";

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Accept': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}
```

Use it anywhere in the app via import { api } from '@/utils/api'.

## 3) Auth (JSON request)

Client example for login:
```ts
type LoginResponse = { access_token: string; token_type: string };

async function login(email: string, password: string) {
  return api<LoginResponse>("/auth/login", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}
```

Attach the token on subsequent requests:
```ts
async function getVideos(token: string) {
  return api<Array<{ id: string; title: string; thumb: string }>>('/videos', {
    headers: { Authorization: `Bearer ${token}` },
  });
}
```

## 4) Attachments: upload files from Expo (mobile + web)

Important:
- Use FormData. Do NOT manually set the Content-Type header; let fetch set it with the boundary.
- For native (Expo Go), you must pass files as `{ uri, name, type }`.
- For web, pass a `File` or `Blob`.

### Single file + fields
```ts
type UploadResponse = { ok: boolean; title: string; description?: string | null; files: Array<{ filename: string; size: number; content_type: string }>; };

async function uploadOne({ uri, name, mime, title, description }: { uri: string; name: string; mime: string; title: string; description?: string; }) {
  const fd = new FormData();
  fd.append('title', title);
  if (description) fd.append('description', description);
  fd.append('files', { uri, name, type: mime } as any);

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: fd,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return res.json() as Promise<UploadResponse>;
}
```

### Multiple files
```ts
async function uploadMany(items: Array<{ uri: string; name: string; mime: string }>, title: string) {
  const fd = new FormData();
  fd.append('title', title);
  for (const it of items) fd.append('files', { uri: it.uri, name: it.name, type: it.mime } as any);
  const r = await fetch(`${API_BASE}/upload`, { method: 'POST', body: fd });
  if (!r.ok) throw new Error('Upload failed');
  return r.json();
}
```

### Web-specific usage
```ts
async function uploadFromWebInput(input: HTMLInputElement, title: string) {
  const fd = new FormData();
  fd.append('title', title);
  if (input.files) {
    for (const f of Array.from(input.files)) fd.append('files', f);
  }
  const r = await fetch(`${API_BASE}/upload`, { method: 'POST', body: fd });
  if (!r.ok) throw new Error('Upload failed');
  return r.json();
}
```

## 5) Picking files in Expo

- Images/video: use `expo-image-picker` to get a `uri` and `mimeType`.
- Documents: `expo-document-picker` (works in Expo Go). Both return a `uri` you can send in FormData as shown above.

Example with `expo-image-picker`:
```ts
import * as ImagePicker from 'expo-image-picker';

async function pickAndUpload() {
  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All, quality: 0.8 });
  if (res.canceled) return;
  const asset = res.assets[0];
  const mime = asset.mimeType ?? 'application/octet-stream';
  await uploadOne({ uri: asset.uri, name: asset.fileName ?? 'upload', mime, title: 'My upload' });
}
```

## 6) Downloading/serving attachments

- If you return public URLs from FastAPI, the app can render them directly (e.g., Image source={{ uri }})
- To serve raw files from FastAPI: use `from fastapi.responses import FileResponse` or mount static.

```python
from fastapi.responses import FileResponse
@app.get('/files/{name}')
async def get_file(name: str):
    return FileResponse(path=f"./uploads/{name}")
```

## 7) Common pitfalls

- CORS: ensure `allow_origins` includes your dev origins (Expo web and device/LAN). For cookies, set `allow_credentials=True` and return proper `Set-Cookie`.
- Content-Type: never set it manually for FormData.
- LAN IP: real devices cannot reach `localhost`; use the computer’s LAN IP.
- Large uploads: set server/client timeouts and consider chunked uploads for videos. For FastAPI behind reverse proxies (nginx), increase `client_max_body_size`.

## 8) Quick tests with curl

JSON auth:
```bash
curl -X POST http://127.0.0.1:8000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email": "demo@demo.com", "password": "demo"}'
```

Multipart upload (two files):
```bash
curl -X POST http://127.0.0.1:8000/upload \
  -F title=Demo \
  -F description=Test \
  -F files=@/path/to/a.jpg \
  -F files=@/path/to/b.mp4
```

You’re set—point the API_BASE to your server and start making requests. If you need a backend in this project, open the “Backend” menu in the editor to enable one.