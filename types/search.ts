export type SearchMode = "web" | "news" | "research" | "fast";

export interface Source {
  id: number;
  title: string;
  url: string;
  domain: string;
  snippet: string;
  content?: string;
}

export interface AskRequest {
  query: string;
  mode: SearchMode;
}

export interface AskResponse {
  answer: string;
  sources: Source[];
  followUps: string[];
}

export interface ApiError {
  error: string;
  details?: string;
}
