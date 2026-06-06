import type { ChatResponse, UploadResponse } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export async function uploadDocument(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, "Upload failed."));
  }

  return response.json() as Promise<UploadResponse>;
}

export async function queryChat(question: string): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/chat/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ question })
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, "Query failed."));
  }

  return response.json() as Promise<ChatResponse>;
}

async function extractErrorMessage(response: Response, fallbackMessage: string): Promise<string> {
  try {
    const data = (await response.json()) as { detail?: string };
    return data.detail || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}
