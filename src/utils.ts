import { PresetTemplate } from "./types";

// Supported Multi-Provider LLM Models list for the Scrapling AI Assistant
export const PROVIDER_MODELS: Record<string, { id: string; label: string }[]> = {
  google: [
    { id: "gemini-3.5-flash", label: "Gemini 3.5 Flash (Rapid & Modular)" },
    { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash (Balanced Reasoning)" },
    { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro (Precision Parsing)" },
    { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro (Legacy Deep Context)" },
    { id: "gemini-1.5-flash", label: "Gemini 1.5 Flash (Legacy Speed)" },
  ],
  openai: [
    { id: "gpt-4o", label: "GPT-4o (High-Intelligence Flagship)" },
    { id: "gpt-4o-mini", label: "GPT-4o Mini (Cost-efficient Speed)" },
    { id: "o1-mini", label: "o1-mini (Reasoning Specialist)" },
    { id: "o3-mini", label: "o3-mini (Advanced Analysis)" },
    { id: "gpt-4-turbo", label: "GPT-4 Turbo (Legacy Developer Classic)" },
  ],
  anthropic: [
    { id: "claude-3-5-sonnet-latest", label: "Claude 3.5 Sonnet (State-of-the-Art Structured)" },
    { id: "claude-3-5-haiku-latest", label: "Claude 3.5 Haiku (Lightning Fast Reasoning)" },
    { id: "claude-3-opus-latest", label: "Claude 3 Opus (Extreme Narrative Accuracy)" },
  ],
  deepseek: [
    { id: "deepseek-chat", label: "DeepSeek V3 (Chat & Parsing)" },
    { id: "deepseek-reasoner", label: "DeepSeek R1 (Reinforced Reasoning)" },
  ],
  groq: [
    { id: "llama-3.3-70b-versatile", label: "LLaMA 3.3 70B (High Versatility)" },
    { id: "mixtral-8x7b-32768", label: "Mixtral 8x7B (High-throughput MoE)" },
    { id: "gemma2-9b-it", label: "Gemma 1 9B (Ultra-fast Instruction)" },
  ],
  openrouter: [
    { id: "meta-llama/llama-3.3-70b-instruct", label: "LLaMA 3.3 70B Instruct (via OpenRouter)" },
    { id: "deepseek/deepseek-r1", label: "DeepSeek R1 Raw (via OpenRouter)" },
    { id: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet (via OpenRouter)" },
    { id: "mistralai/mistral-large", label: "Mistral Large 2 (via OpenRouter)" },
  ],
  opencode: [
    { id: "opencode-qwen-2.5-coder-32b", label: "OpenCode Qwen 2.5 Coder 32B" },
    { id: "opencode-llama-3-8b", label: "OpenCode LLaMA 3 8B" },
  ],
  browseruse: [
    { id: "browser-use-gpt-4o", label: "Browser Use Agent (GPT-4o Backend)" },
    { id: "browser-use-claude-3-5", label: "Browser Use Agent (Claude 3.5 Backend)" },
  ],
  agentrouter: [
    { id: "agent-router-default", label: "Agent Router (Default Engine)" },
    { id: "agent-llama-3.3-70b", label: "Agent Router (LLaMA 3.3 70B)" },
  ],
  ollama: [
    { id: "llama3.3:latest", label: "Ollama (LLaMA 3.3)" },
    { id: "mistral:latest", label: "Ollama (Mistral)" },
    { id: "qwen2.5-coder:latest", label: "Ollama (Qwen 2.5 Coder)" },
    { id: "phi3:latest", label: "Ollama (Phi 3)" },
  ],
  exa: [
    { id: "exa-search-neural", label: "Exa Neural Search Grounding" },
    { id: "exa-find-similar", label: "Exa Similar Document Extractor" },
  ],
  querit: [
    { id: "querit-parser-v2", label: "Querit Parser V2 Structure" },
    { id: "querit-extract-pro", label: "Querit Extract Pro Engine" },
  ],
  tavily: [
    { id: "tavily-search-extract", label: "Tavily Web Search & Extraction" },
    { id: "tavily-get-search-context", label: "Tavily Scraped Web context" },
  ],
  mistral: [
    { id: "mistral-large-latest", label: "Mistral Large (Latest Flagship)" },
    { id: "pixtral-large-latest", label: "Pixtral Large (Latest Multimodal)" },
    { id: "codestral-latest", label: "Codestral (Scraping/Coding Specialist)" },
    { id: "open-mistral-nemo", label: "Mistral Nemo (Light & Fast)" },
  ],
  modelscope: [
    { id: "qwen-max", label: "ModelScope DashScope Qwen Max" },
    { id: "qwen-plus", label: "ModelScope DashScope Qwen Plus" },
    { id: "qwen-turbo", label: "ModelScope DashScope Qwen Turbo" },
  ],
  firecrawl: [
    { id: "firecrawl-scrape", label: "Firecrawl Scrape API" },
    { id: "firecrawl-crawl", label: "Firecrawl Crawl API" },
    { id: "firecrawl-map", label: "Firecrawl Sitemap Locator" },
  ],
  "21st": [
    { id: "21st-coder-v1", label: "21st.dev Coder V1" },
    { id: "21st-extractor", label: "21st.dev Intelligent Extractor" },
  ],
};

// Preset Scrapling targets and configurations
export const PRESETS: PresetTemplate[] = [
  {
    name: "Hacker News",
    logo: "Y",
    description: "Trending developers news. Best for parsing nested grids and structural tabular lists.",
    url: "https://news.ycombinator.com",
    extraction_type: "html",
    impersonate: "chrome",
    css_selector: "span.titleline > a",
  },
  {
    name: "Wikipedia: Scrape",
    logo: "W",
    description: "An offline mirror of Wikipedia. Ideal for parsing infoboxes, paragraphs, and headings.",
    url: "https://en.wikipedia.org/wiki/Web_scraping",
    extraction_type: "markdown",
    impersonate: "firefox",
    css_selector: "table.infobox th.infobox-label",
  },
  {
    name: "GadgetWorld Store",
    logo: "G",
    description: "Multi-item shopping card layout. Best for testing title, discounts, and prices matrix.",
    url: "https://gadgetworld-example.store/products",
    extraction_type: "html",
    impersonate: "safari",
    css_selector: "div.product-card",
  },
];

// Dynamic Python Script Builder
export const generatePythonScript = (config: {
  url: string;
  extraction_type: string;
  impersonate: string;
  main_content_only: boolean;
  css_selector: string;
  headers: Record<string, string>;
  cookies: Record<string, string>;
  timeout: number;
  follow_redirects: string | boolean;
}) => {
  const headersStr = Object.keys(config.headers).length > 0
    ? `,\n    headers=${JSON.stringify(config.headers, null, 4).replace(/\n/g, "\n    ")}`
    : "";
  const cookiesStr = Object.keys(config.cookies).length > 0
    ? `,\n    cookies=${JSON.stringify(config.cookies, null, 4).replace(/\n/g, "\n    ")}`
    : "";

  return `from scrapling import Fetcher

# Initialize Scrapling Fetcher with stealth active browser fingerprint
# Fingerprint: "${config.impersonate}" (Spoofs browser headers, SSL/TLS handshakes, and canvas metrics)
fetcher = Fetcher(
    "${config.url}"${headersStr}${cookiesStr},
    impersonate="${config.impersonate}",
    timeout=${config.timeout},
    follow_redirects=${config.follow_redirects === "safe" ? '"safe"' : config.follow_redirects}
)

# HTTP metadata
print(f"Status Code: {fetcher.status}")
print(f"Final Resolving URL: {fetcher.url}")

# Extractions config:
# - extraction_type: "${config.extraction_type}"
# - main_content_only: ${config.main_content_only}
${
  config.css_selector
    ? `
# Querying matching elements using CSS Selector: "${config.css_selector}"
elements = fetcher.css("${config.css_selector}")
print(f"Found {len(elements)} matching target nodes")

for el in elements:
    # Print the clean node text or direct HTML representation
    print(el.text)
`
    : `
# Extract entire page contents
print(fetcher.text)
`
}
`;
};

// Helper to convert hex to rgba
const hexToRgba = (hex: string, alpha: number) => {
  let cleanHex = hex.replace("#", "");
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map(c => c + c).join("");
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return hex;
};

// Dynamic source document modifier for DOM Visualizer iframe
export const getVisualizerSrcDoc = (
  rawHtml: string,
  baseUrl: string,
  selector: string,
  enableHighlight: boolean = true,
  borderColor: string = "#9b72f3",
  borderWidth: number = 3
) => {
  if (!rawHtml) return "";

  // Base URL tag to safely load relative assets/stylesheets/images from original server
  const baseTag = baseUrl ? `<base href="${baseUrl}">` : "";

  const rgbaBackground = hexToRgba(borderColor, 0.15);
  const rgbaShadow = hexToRgba(borderColor, 0.4);
  const hoverRgbaBackground = hexToRgba(borderColor, 0.25);
  const hoverRgbaShadow = hexToRgba(borderColor, 0.55);

  // High quality hover and highlight outline CSS definition
  const highlightStyles = (enableHighlight && selector.trim()) ? `
    <style id="scrapling-highlighter">
      /* High-contrast animated highlight on matched nodes */
      ${selector.trim()} {
        outline: ${borderWidth}px solid ${borderColor} !important;
        outline-offset: 1px !important;
        background-color: ${rgbaBackground} !important;
        box-shadow: 0 0 12px ${rgbaShadow} !important;
        position: relative !important;
        transition: outline 0.15s ease-in-out, background-color 0.15s ease-in-out !important;
        z-index: 10 !important;
      }
      /* Hover transition to brighter for focused visual check */
      ${selector.trim()}:hover {
        outline: ${borderWidth + 1}px solid ${borderColor} !important;
        background-color: ${hoverRgbaBackground} !important;
        box-shadow: 0 0 14px ${hoverRgbaShadow} !important;
      }
    </style>
  ` : "";

  const commonEmbedStyles = `
    <style>
      /* Smooth high precision scrolling */
      html {
        scroll-behavior: smooth;
        color-scheme: dark light;
      }
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      ::-webkit-scrollbar-track {
        background: #0e0e11;
      }
      ::-webkit-scrollbar-thumb {
        background: #2d2f31;
        border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #3c4043;
      }
    </style>
  `;

  let processed = rawHtml;

  // Let's remove conflicting base tag if already defined on target site
  processed = processed.replace(/<base\b[^>]*>/gi, "");

  const fullInjection = baseTag + commonEmbedStyles + highlightStyles;

  // Prepend inside Head tag
  if (processed.includes("</head>")) {
    processed = processed.replace("</head>", `${fullInjection}</head>`);
  } else if (processed.includes("<head>")) {
    processed = processed.replace("<head>", `<head>${fullInjection}`);
  } else {
    processed = fullInjection + processed;
  }

  return processed;
};
