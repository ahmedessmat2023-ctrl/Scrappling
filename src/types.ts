export interface ScrapeConfig {
  url: string;
  extraction_type: "markdown" | "html" | "text";
  impersonate: "chrome" | "firefox" | "safari" | "edge" | "safari_ios";
  main_content_only: boolean;
  css_selector: string;
  headers: Record<string, string>;
  cookies: Record<string, string>;
  timeout: number;
  follow_redirects: "safe" | "firstonly" | "obeycode" | "all" | boolean;
}

export interface ScrapeResponse {
  status: number;
  url: string;
  headers: Record<string, string>;
  rawHtml: string;
  content: string[];
  metadata: {
    isSandbox: boolean;
    presetName?: string;
    sizeBytes: number;
    durationMs: number;
    userAgent: string;
    warning?: string;
  };
}

export interface AIRecommendation {
  fieldName: string;
  cssSelector: string;
  explanation: string;
  sampleExtractedText?: string;
}

export interface AISuggestionResponse {
  recommendations: AIRecommendation[];
  overallPythonScript: string;
  scraplingTips: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model" | "system";
  text: string;
  timestamp: Date;
}

export interface PresetTemplate {
  name: string;
  logo: string;
  description: string;
  url: string;
  extraction_type: "markdown" | "html" | "text";
  impersonate: "chrome" | "firefox" | "safari" | "edge" | "safari_ios";
  css_selector: string;
}
