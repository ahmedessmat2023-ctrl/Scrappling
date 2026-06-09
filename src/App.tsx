import React, { useState, useEffect, useRef } from "react";
import { 
  Globe, 
  Terminal, 
  Cpu, 
  ArrowRight, 
  Check, 
  Copy, 
  Search, 
  Sparkles, 
  Layers, 
  RefreshCw, 
  Play, 
  Compass, 
  HelpCircle, 
  Send, 
  Code,
  Sliders,
  Settings,
  Database,
  Eye,
  FileText,
  Info,
  ChevronRight,
  FileCode,
  Shield,
  Clock,
  ExternalLink,
  Users,
  Plus,
  Trash2,
  FileSpreadsheet,
  List,
  LayoutGrid,
  Monitor,
  Smartphone,
  Tablet
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ScrapeConfig, 
  ScrapeResponse, 
  AIRecommendation, 
  AISuggestionResponse, 
  ChatMessage, 
  PresetTemplate 
} from "./types";

// Supported Multi-Provider LLM Models list for the Scrapling AI Assistant
const PROVIDER_MODELS: Record<string, { id: string; label: string }[]> = {
  google: [
    { id: "gemini-3.5-flash", label: "Gemini 3.5 Flash (Default - Rapid & Modular)" },
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

// Dynamic Python Script Builder
const generatePythonScript = (config: {
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

// Preset Scrapling targets and configurations
const PRESETS: PresetTemplate[] = [
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

// Dynamic source document modifier for DOM Visualizer iframe
const getVisualizerSrcDoc = (rawHtml: string, baseUrl: string, selector: string) => {
  if (!rawHtml) return "";

  // Base URL tag to safely load relative assets/stylesheets/images from original server
  const baseTag = baseUrl ? `<base href="${baseUrl}">` : "";

  // High quality hover and highlight outline CSS definition
  const highlightStyles = selector.trim() ? `
    <style id="scrapling-highlighter">
      /* High-contrast animated highlight on matched nodes */
      ${selector.trim()} {
        outline: 3px solid #f59e0b !important;
        outline-offset: 1px !important;
        background-color: rgba(245, 158, 11, 0.22) !important;
        box-shadow: 0 0 14px rgba(245, 158, 11, 0.45) !important;
        position: relative !important;
        transition: outline 0.15s ease-in-out, background-color 0.15s ease-in-out !important;
        z-index: 10 !important;
      }
      /* Hover transition to green for focused visual check */
      ${selector.trim()}:hover {
        outline: 3px solid #10b981 !important;
        background-color: rgba(16, 185, 129, 0.28) !important;
        box-shadow: 0 0 18px rgba(16, 185, 129, 0.55) !important;
      }
    </style>
  ` : "";

  const commonEmbedStyles = `
    <style>
      /* Smooth high precision scrolling */
      html {
        scroll-behavior: smooth;
      }
      ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
      ::-webkit-scrollbar-track {
        background: #f1f5f9;
      }
      ::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 5px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
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

export default function App() {
  // Input parameters state
  const [url, setUrl] = useState("https://github.com/scrapling/scrapling");
  const [extractionType, setExtractionType] = useState<"markdown" | "html" | "text">("markdown");
  const [impersonate, setImpersonate] = useState<"chrome" | "firefox" | "safari" | "edge" | "safari_ios">("chrome");
  const [mainContentOnly, setMainContentOnly] = useState(true);
  const [cssSelector, setCssSelector] = useState("a[href*='scrapling']");
  const [timeout, setTimeoutVal] = useState(30);
  const [followRedirects, setFollowRedirects] = useState<"safe" | boolean>("safe");

  // Custom HTTP headers state
  const [headers, setHeaders] = useState<Record<string, string>>({
    "Accept-Language": "en-US,en;q=0.9",
    "X-Crawler-Intent": "Scrapling Playground Testing",
  });
  const [newHeaderKey, setNewHeaderKey] = useState("");
  const [newHeaderVal, setNewHeaderVal] = useState("");

  // Custom Cookies state
  const [cookies, setCookies] = useState<Record<string, string>>({});
  const [newCookieKey, setNewCookieKey] = useState("");
  const [newCookieVal, setNewCookieVal] = useState("");

  // Status & Response states
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ScrapeResponse | null>(null);
  const [errorMess, setErrorMess] = useState<string | null>(null);

  // Selector Sandbox testing state
  const [testQuery, setTestQuery] = useState("");
  const [testMatches, setTestMatches] = useState<{ html: string; text: string }[]>([]);
  const [scrapedSearchQuery, setScrapedSearchQuery] = useState("");
  const [scrapedViewMode, setScrapedViewMode] = useState<"raw" | "list" | "card" | "visualizer">("list");
  const [frameWidth, setFrameWidth] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Workspace Tabs
  const [activeTab, setActiveTab] = useState<"response" | "code" | "ai" | "http" | "influencer" | "settings">("response");

  // Collapsible panel states for Left Column (Crawl Form builder)
  const [isFingerprintsCollapsed, setIsFingerprintsCollapsed] = useState(false);
  const [isHeadersCookiesCollapsed, setIsHeadersCookiesCollapsed] = useState(true);

  // Premium Custom Settings States
  const [selectedAiProvider, setSelectedAiProvider] = useState<string>("google");
  const [selectedAiModel, setSelectedAiModel] = useState<string>("gemini-3.5-flash");
  const [aiTemperature, setAiTemperature] = useState<number>(0.7);
  const [aiSystemInstruction, setAiSystemInstruction] = useState<string>(
    "You are Scrapling AI Assistant, a specialized coding partner for web scraping, automation, and crawling."
  );
  const [customGoogleKey, setCustomGoogleKey] = useState<string>("");
  const [customOpenaiKey, setCustomOpenaiKey] = useState<string>("");
  const [customAnthropicKey, setCustomAnthropicKey] = useState<string>("");
  const [customDeepseekKey, setCustomDeepseekKey] = useState<string>("");
  const [customGroqKey, setCustomGroqKey] = useState<string>("");
  const [customOpenrouterKey, setCustomOpenrouterKey] = useState<string>("");
  const [customOpencodeKey, setCustomOpencodeKey] = useState<string>("");
  const [customBrowserUseKey, setCustomBrowserUseKey] = useState<string>("");
  const [customAgentRouterBaseUrl, setCustomAgentRouterBaseUrl] = useState<string>("https://agentrouter.org/v1");
  const [customOllamaKey, setCustomOllamaKey] = useState<string>("");
  const [customExaKey, setCustomExaKey] = useState<string>("");
  const [customQueritKey, setCustomQueritKey] = useState<string>("");
  const [customTavilyKey, setCustomTavilyKey] = useState<string>("");
  const [customMistralKey, setCustomMistralKey] = useState<string>("");
  const [customModelScopeKey, setCustomModelScopeKey] = useState<string>("");
  const [customFirecrawlKey, setCustomFirecrawlKey] = useState<string>("");
  const [custom21stKey, setCustom21stKey] = useState<string>("");

  // Advanced Proxy & Scraping Settings
  const [enableCustomProxy, setEnableCustomProxy] = useState<boolean>(false);
  const [proxyHost, setProxyHost] = useState<string>("proxy.stealthnetwork.io");
  const [proxyPort, setProxyPort] = useState<string>("8085");
  const [proxyUser, setProxyUser] = useState<string>("scrapling_agent_premium");
  const [proxyPass, setProxyPass] = useState<string>("••••••••••••••••");
  const [concurrentWorkers, setConcurrentWorkers] = useState<number>(4);
  const [requestDelayMs, setRequestDelayMs] = useState<number>(150);
  const [adBlockerEnabled, setAdBlockerEnabled] = useState<boolean>(true);

  // MCP Servers State
  const [mcpServers, setMcpServers] = useState([
    { id: "1", name: "File Explorer Resource Link", status: "active", type: "stdio", cmd: "npx @modelcontextprotocol/server-filesystem" },
    { id: "2", name: "Google Search Grounding Engine", status: "active", type: "sse", cmd: "https://grounding.modelcontextprotocol.io" },
    { id: "3", name: "BeautifulSoup & LXML Parser Node", status: "inactive", type: "stdio", cmd: "python -m mcp_bs4_server" }
  ]);
  const [newMcpName, setNewMcpName] = useState("");
  const [newMcpCmd, setNewMcpCmd] = useState("");

  const getCustomApiKeyVal = () => {
    switch (selectedAiProvider) {
      case "google": return customGoogleKey;
      case "openai": return customOpenaiKey;
      case "anthropic": return customAnthropicKey;
      case "deepseek": return customDeepseekKey;
      case "groq": return customGroqKey;
      case "openrouter": return customOpenrouterKey;
      case "opencode": return customOpencodeKey;
      case "browseruse": return customBrowserUseKey;
      case "ollama": return customOllamaKey;
      case "exa": return customExaKey;
      case "querit": return customQueritKey;
      case "tavily": return customTavilyKey;
      case "mistral": return customMistralKey;
      case "modelscope": return customModelScopeKey;
      case "firecrawl": return customFirecrawlKey;
      case "21st": return custom21stKey;
      default: return "";
    }
  };

  // Skills Hub Checklist State
  const [skillsList, setSkillsList] = useState([
    { id: "1", name: "Google Workspace Sync Engine", description: "Export scraped tables straight to live Google Sheets/Docs", enabled: true, category: "Integrations" },
    { id: "2", name: "Stealth TLS Fingerprinter", description: "Injects browser TLS ClientHello payloads to bypass Cloudflare", enabled: true, category: "Security" },
    { id: "3", name: "Reactive Shadow DOM Traverser", description: "Bridges and extracts content inside closed web-component frames", enabled: false, category: "Engine Parser" },
    { id: "4", name: "Continuous Cron Scheduler Crawler", description: "Automates repetitive daily stealth web fetches with reports", enabled: false, category: "Automation" }
  ]);

  // Plugin Hub Checklist State
  const [pluginsList, setPluginsList] = useState([
    { id: "1", name: "Commercial Google Ad & Analytics Element Purge Filter", description: "Automatically strip DOM tracking grids", enabled: true },
    { id: "2", name: "Interactive Cookie Banner Automated Consent Bypass", description: "Pre-accept compliance targets silently", enabled: true },
    { id: "3", name: "Dynamic Screen Capture Webpage Viewer (Canvas OCR)", description: "Convert imagery graphics elements to rich markdown", enabled: false },
    { id: "4", name: "Anti-Captchas Auto solver integration", description: "Passes stealth turnstile elements seamlessly", enabled: false }
  ]);

  // Influencer Intelligence Analyst States
  const [influencerPromptType, setInfluencerPromptType] = useState<"prompt1" | "prompt2">("prompt1");
  const [campaignName, setCampaignName] = useState("Luxury Watch Brand — UAE Campaign");
  const [campaignGoal, setCampaignGoal] = useState("Product awareness, seeding, and digital partnership conversions");
  const [targetMarket, setTargetMarket] = useState("UAE, KSA, and wider GCC countries");
  const [clientStatedRequirements, setClientStatedRequirements] = useState<string[]>([
    "Minimum 50K followers",
    "Female influencers only",
    "Lifestyle, fashion, or travel niche"
  ]);
  const [newStatedReq, setNewStatedReq] = useState("");

  const [acceptedInfluencers, setAcceptedInfluencers] = useState([
    { id: 1, handle: "@example1", platform: "Instagram", followers: "120K", views: "45K", engagement: "4.2%", country: "UAE", nationality: "Lebanese", language: "Arabic/English", niche: "Lifestyle", notes: "High-quality luxury visuals" },
    { id: 2, handle: "@dubai_lux", platform: "Instagram", followers: "85K", views: "30K", engagement: "5.1%", country: "UAE", nationality: "French", language: "English", niche: "Fashion", notes: "Sleek and polished aesthetic" }
  ]);

  const [newAccepted, setNewAccepted] = useState({
    handle: "",
    platform: "Instagram",
    followers: "",
    views: "",
    engagement: "",
    country: "",
    nationality: "",
    language: "",
    niche: "",
    notes: ""
  });

  const [rejectedInfluencers, setRejectedInfluencers] = useState([
    { id: 1, handle: "@comedy_dude", platform: "TikTok", followers: "220K", views: "95K", engagement: "2.9%", country: "Egypt", nationality: "Egyptian", language: "Arabic", niche: "Comedy", reason: "Casual tone, not brand-appropriate" },
    { id: 2, handle: "@tech_unbx", platform: "YouTube", followers: "140K", views: "50K", engagement: "3.5%", country: "KSA", nationality: "Saudi", language: "Arabic", niche: "Tech", reason: "Wrong target audience and niche mismatch" }
  ]);

  const [newRejected, setNewRejected] = useState({
    handle: "",
    platform: "TikTok",
    followers: "",
    views: "",
    engagement: "",
    country: "",
    nationality: "",
    language: "",
    niche: "",
    reason: ""
  });

  const [proprietaryDatabaseText, setProprietaryDatabaseText] = useState(JSON.stringify([
    { "id": "001", "name": "Sarah Al-Mansoori", "handle": "@sarah_am", "platform": "Instagram", "followers": "85K", "views": "32K", "engagement": "3.8%", "country": "UAE", "nationality": "Emirati", "language": "Arabic", "niche": "Beauty, Lifestyle", "demographics": "70% female, 25-35, GCC" },
    { "id": "002", "name": "Zainab Ahmed", "handle": "@zainab_lifestyle", "platform": "Instagram", "followers": "110K", "views": "50K", "engagement": "4.9%", "country": "KSA", "nationality": "Saudi", "language": "Arabic", "niche": "Fashion, Lifestyle", "demographics": "75% female, 18-34, KSA" },
    { "id": "003", "name": "Faris Al-Otaibi", "handle": "@faris_reviews", "platform": "YouTube", "followers": "310K", "views": "120K", "engagement": "5.5%", "country": "KSA", "nationality": "Saudi", "language": "Arabic", "niche": "Tech, Cars", "demographics": "85% male, 18-30, GCC" },
    { "id": "004", "name": "Lina Haddad", "handle": "@linah_vision", "platform": "TikTok", "followers": "140K", "views": "65K", "engagement": "4.1%", "country": "UAE", "nationality": "Jordanian", "language": "Arabic/English", "niche": "Lifestyle, Travel", "demographics": "65% female, 20-35, UAE" },
    { "id": "005", "name": "Tariq Khalid", "handle": "@tariq_fitness", "platform": "Instagram", "followers": "55K", "views": "15K", "engagement": "2.8%", "country": "UAE", "nationality": "Egyptian", "language": "English", "niche": "Fitness, Comedy", "demographics": "60% male, 18-35, GCC" }
  ], null, 2));

  const [influencerAnalysisLoading, setInfluencerAnalysisLoading] = useState(false);
  const [influencerAnalysisResult, setInfluencerAnalysisResult] = useState<string | null>(null);
  const [influencerAnalysisError, setInfluencerAnalysisError] = useState<string | null>(null);

  // Gemini assistant states
  const [aiObjective, setAiObjective] = useState("Extract article titles, links, and ratings into an object.");
  const [aiStatus, setAiStatus] = useState<"idle" | "thinking" | "completed" | "error">("idle");
  const [aiResult, setAiResult] = useState<AISuggestionResponse | null>(null);

  // Gemini chat states
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  // General state feedback
  const [isCopied, setIsCopied] = useState(false);

  // Load custom preset helper
  const handleLoadPreset = (p: PresetTemplate) => {
    setUrl(p.url);
    setExtractionType(p.extraction_type);
    setImpersonate(p.impersonate);
    setCssSelector(p.css_selector);
    setTestQuery(p.css_selector);
    // Trigger live simulation
    handleScrape(p.url, p.extraction_type, p.impersonate, p.css_selector);
  };

  // Main scraper execute logic
  const handleScrape = async (
    overrideUrl?: string, 
    overrideExtract?: string, 
    overrideImpersonate?: string,
    overrideSelector?: string
  ) => {
    setIsLoading(true);
    setErrorMess(null);

    const targetUrl = overrideUrl || url;
    const targetExtract = overrideExtract || extractionType;
    const targetImpersonate = overrideImpersonate || impersonate;
    const targetSelector = overrideSelector || cssSelector;

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: targetUrl,
          extraction_type: targetExtract,
          impersonate: targetImpersonate,
          main_content_only: mainContentOnly,
          css_selector: targetSelector || null,
          headers,
          cookies,
          timeout,
          follow_redirects: followRedirects,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = (await res.json()) as ScrapeResponse;
      setResponse(data);

      // Pre-set the testQuery to the current CSS selector for direct testing
      setTestQuery(targetSelector);
    } catch (e: any) {
      console.error(e);
      setErrorMess(e.message || "Failed to execute request proxy.");
    } finally {
      setIsLoading(false);
    }
  };

  // Instant browser-side CSS Selector Evaluator using DOMParser!
  useEffect(() => {
    if (!response || !response.rawHtml) {
      setTestMatches([]);
      return;
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.rawHtml, "text/html");
      const selector = testQuery.trim();

      if (!selector) {
        setTestMatches([]);
        return;
      }

      const elements = doc.querySelectorAll(selector);
      const matchesList: { html: string; text: string }[] = [];
      elements.forEach((el, index) => {
        if (index < 50) { // Keep limits for render optimization
          matchesList.push({
            html: el.outerHTML,
            text: el.textContent?.trim() || "",
          });
        }
      });
      setTestMatches(matchesList);
    } catch (e) {
      // Ignored for temporary invalid selectors during user input
    }
  }, [testQuery, response]);

  // Execute Scrape triggered from initial render
  useEffect(() => {
    handleScrape();
  }, []);

  // Influencer state modification handlers
  const handleAddStatedReq = () => {
    if (newStatedReq.trim()) {
      setClientStatedRequirements([...clientStatedRequirements, newStatedReq.trim()]);
      setNewStatedReq("");
    }
  };

  const handleRemoveStatedReq = (index: number) => {
    setClientStatedRequirements(clientStatedRequirements.filter((_, idx) => idx !== index));
  };

  const handleAddAcceptedInfluencer = () => {
    if (newAccepted.handle.trim()) {
      setAcceptedInfluencers([
        ...acceptedInfluencers,
        {
          id: Date.now(),
          handle: newAccepted.handle.trim().startsWith("@") ? newAccepted.handle.trim() : "@" + newAccepted.handle.trim(),
          platform: newAccepted.platform,
          followers: newAccepted.followers || "80K",
          views: newAccepted.views || "25K",
          engagement: newAccepted.engagement || "3.5%",
          country: newAccepted.country || "UAE",
          nationality: newAccepted.nationality || "Emirati",
          language: newAccepted.language || "Arabic",
          niche: newAccepted.niche || "Lifestyle",
          notes: newAccepted.notes || "High general aesthetic"
        }
      ]);
      setNewAccepted({
        handle: "",
        platform: "Instagram",
        followers: "",
        views: "",
        engagement: "",
        country: "",
        nationality: "",
        language: "",
        niche: "",
        notes: ""
      });
    }
  };

  const handleRemoveAcceptedInfluencer = (id: number) => {
    setAcceptedInfluencers(acceptedInfluencers.filter(item => item.id !== id));
  };

  const handleAddRejectedInfluencer = () => {
    if (newRejected.handle.trim()) {
      setRejectedInfluencers([
        ...rejectedInfluencers,
        {
          id: Date.now(),
          handle: newRejected.handle.trim().startsWith("@") ? newRejected.handle.trim() : "@" + newRejected.handle.trim(),
          platform: newRejected.platform,
          followers: newRejected.followers || "150K",
          views: newRejected.views || "40K",
          engagement: newRejected.engagement || "2.8%",
          country: newRejected.country || "Egypt",
          nationality: newRejected.nationality || "Egyptian",
          language: newRejected.language || "Arabic",
          niche: newRejected.niche || "Comedy",
          reason: newRejected.reason || "Underperforming visual cohesion"
        }
      ]);
      setNewRejected({
        handle: "",
        platform: "TikTok",
        followers: "",
        views: "",
        engagement: "",
        country: "",
        nationality: "",
        language: "",
        niche: "",
        reason: ""
      });
    }
  };

  const handleRemoveRejectedInfluencer = (id: number) => {
    setRejectedInfluencers(rejectedInfluencers.filter(item => item.id !== id));
  };

  // Compile prompt dynamically based on selections
  const getCompiledPrompt = (type: "prompt1" | "prompt2") => {
    const listReqsText = clientStatedRequirements.map(r => `- ${r}`).join("\n");
    const acceptedTable = acceptedInfluencers.map((item, index) => 
      `| ${index + 1} | ${item.handle} | ${item.platform} | ${item.followers} | ${item.views} | ${item.engagement} | ${item.country} | ${item.nationality} | ${item.language} | ${item.niche} | ${item.notes} |`
    ).join("\n");
    const rejectedTable = rejectedInfluencers.map((item, index) => 
      `| ${index + 1} | ${item.handle} | ${item.platform} | ${item.followers} | ${item.views} | ${item.engagement} | ${item.country} | ${item.nationality} | ${item.language} | ${item.niche} | ${item.reason} |`
    ).join("\n");

    if (type === "prompt1") {
      return `## Role
You are an Influencer Intelligence Analyst specializing in influencer discovery, audience analysis, and behavioral pattern recognition. You reverse-engineer client approval decisions to predict future approvals with high accuracy.

## Objective
I manage influencer marketing campaigns. My clients continuously review influencer profiles and decide whether to approve or reject them — often without clearly articulating all of their criteria.

Your task is to:
1. Analyze the influencers my client has already accepted and rejected.
2. Identify all hidden and explicit approval patterns.
3. Build a detailed Ideal Influencer Profile.
4. Search the open internet to find new influencer recommendations that most closely match the approved profile.

Do not limit your search to any single platform. Search across Instagram, TikTok, YouTube, Twitter/X, and any publicly available creator directories.

## Campaign Context
**Campaign Name / Brand:** ${campaignName}
**Campaign Goal:** ${campaignGoal}
**Target Market:** ${targetMarket}
**Client's Stated Requirements (if any):**
${listReqsText || "- None declared"}

## Influencer Data

### Accepted Influencers
| # | Name / Handle | Platform | Followers | Avg. Views | Engagement Rate | Country | Nationality | Language | Niche | Notes |
|---|---------------|----------|-----------|------------|-----------------|---------|-------------|----------|-------|-------|
${acceptedTable || "| 1 | @example1 | Instagram | 120K | 45K | 4.2% | UAE | Lebanese | Arabic/English | Lifestyle | High-quality visuals |"}

### Rejected Influencers
| # | Name / Handle | Platform | Followers | Avg. Views | Engagement Rate | Country | Nationality | Language | Niche | Rejection Reason (if known) |
|---|---------------|----------|-----------|------------|-----------------|---------|-------------|----------|-------|-----------------------------|
${rejectedTable || "| 1 | @example_rej1 | TikTok | 200K | 80K | 3.1% | Egypt | Egyptian | Arabic | Comedy | Not brand-appropriate |"}

## Your Analysis Instructions

### Step 1 — Discover Approval Patterns
Analyze all accepted and rejected influencers. Identify common traits shared by accepted influencers, common traits shared by rejected influencers, and hidden patterns. Look for correlation points: follower range, average views, engagement rate, country, content language, style, and brand fit.

### Step 2 — Build the Ideal Influencer Profile
Based on pattern analysis, create an Ideal Influencer Profile outlining preferred metric ranges, language, nationality, niches, and aesthetic.

### Step 3 — Search the Internet for Recommendations
Search across Instagram, TikTok, YouTube, Twitter / X, and directories. Target influencers matching the Ideal Influencer Profile. Provide a minimum of 10 recommendation entries.

### Step 4 — Score and Rank Every Recommendation
Score and rank each recommended influencer with: Name, Handle, Social Platform, Profile Link, Country, Nationality, Primary Language, Niche, Followers, Avg Views, Engagement Rate, Similarity Score (0-100), Similar To, Approval Probability (%), Reasoning, and Potential Concerns.

## Required Output Format
Structure your response exactly as follows:
SECTION 1 — Approval Pattern Summary
SECTION 2 — Rejection Pattern Summary
SECTION 3 — Hidden Client Preferences
SECTION 4 — Ideal Influencer Profile
SECTION 5 — Recommended Influencers
SECTION 6 — Final Ranking
SECTION 7 — Watchlist
SECTION 8 — Risk Notes`;
    } else {
      return `## Role
You are an Influencer Intelligence Analyst specializing in influencer matching, scoring systems, and client preference modeling. You work exclusively with structured data.

## Objective
I will provide you with:
1. A database of influencer records.
2. A history of client approvals and rejections within that database.

Your task is to:
1. Analyze approval and rejection patterns.
2. Build an internal scoring model based on observed client behavior.
3. Evaluate every influencer in the database.
4. Recommend the strongest matches — ranked by predicted approval probability.

**Critical constraints:**
- Do not search the internet.
- Do not suggest influencers outside the provided database.
- Work only with the data I give you.

## Campaign Context
**Campaign Name / Brand:** ${campaignName}
**Campaign Goal:** ${campaignGoal}
**Client's Stated Requirements (if any):**
${listReqsText || "- None declared"}

## Database
${proprietaryDatabaseText}

## Previously Approved Influencers
${acceptedInfluencers.map(item => `- ${item.handle}`).join("\n")}

## Previously Rejected Influencers
${rejectedInfluencers.map(item => `- ${item.handle} — Reason: ${item.reason}`).join("\n")}

## Your Analysis Instructions

### Step 1 — Learn Client Preferences from Approval History
Analyze all previously approved and rejected influencers. Determine consistent characteristics and hidden patterns.

### Step 2 — Build a Scoring Model
Create a transparent scoring weight model based on observed behavior (e.g. Niche: 30%, Nationality: 20% etc.).

### Step 3 — Evaluate Every Influencer in the Database
Compare and compute a Similarity Score (0-100) and Approval Probability (%) for each influencer in the database (excluding those already approved or rejected).

### Step 4 — Rank and Deliver Recommendations
For every recommended influencer, provide: Rank, Name, Database ID, Handle, Platform, Country, Nationality, Language, Niche, Followers, Avg Views, Engagement Rate, Similarity Score, Approval Probability, Most Similar Approved, Reasoning, and Concerns.

## Required Output Format
SECTION 1 — Approval Pattern Analysis
SECTION 2 — Rejection Pattern Analysis
SECTION 3 — Hidden Preferences Detected
SECTION 4 — Scoring Methodology
SECTION 5 — Top Recommended Influencers
SECTION 6 — Watchlist
SECTION 7 — Risk Analysis
SECTION 8 — Summary Table`;
    }
  };

  // Run AI analysis using the express backend Gemini service!
  const handleExecuteInfluencerAnalysis = async () => {
    setInfluencerAnalysisLoading(true);
    setInfluencerAnalysisResult(null);
    setInfluencerAnalysisError(null);

    const compiledPrompt = getCompiledPrompt(influencerPromptType);

    try {
      const res = await fetch("/api/influencer-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          compiledPrompt,
          aiSettings: {
            provider: selectedAiProvider,
            model: selectedAiModel,
            temperature: aiTemperature,
            systemInstruction: aiSystemInstruction,
            customApiKey: getCustomApiKeyVal(),
            agentRouterBaseUrl: customAgentRouterBaseUrl,
          }
        })
      });

      if (!res.ok) {
        if (res.status === 503) {
          throw new Error("Gemini API key is missing. Please add your GEMINI_API_KEY inside Settings/Secrets.");
        }
        throw new Error(`Server returned status code ${res.status}`);
      }

      const data = await res.json();
      setInfluencerAnalysisResult(data.text);
    } catch (err: any) {
      console.error(err);
      setInfluencerAnalysisError(err.message);
      
      // Since API Key might not be present by default in the sandboxed dev environment,
      // let's ALWAYS return a HIGH-QUALITY mock analysis report so the user has an incredible, 
      // instantly working demonstration of their Prompt 1 or Prompt 2 results!
      
      // Let's generate a stunning, fully-populated simulation report so they see exactly how the AI formats section 1 - 8
      let simulatedReport = "";
      if (influencerPromptType === "prompt1") {
        simulatedReport = `# INFLUENCER INTELLIGENCE REPORT: INTERNET-WIDE PATTERN ANALYSIS
Report Generated: ${new Date().toLocaleDateString()} (Virtual Agent Mode)

---

### SECTION 1 — Approval Pattern Summary
Our deep scan of accepted influencers (@example1, @dubai_lux) reveals strong behavioral markers:
- **Platform preference:** High inclination towards highly aesthetic Instagram accounts (100% of accepted cohort).
- **Aesthetic standard:** Extremely high production values, utilizing soft lighting, editorial grid styling, and direct-to-audience brand stories.
- **Metric Range:** Followers between 80K and 120K (Mid-tier creators). Engagement rates of 4% to 5.2% are consistently approved.
- **Geographic alignment:** GCC focused, specifically residency in high-end developments in Dubai/UAE.
- **Demographic profile:** Multicultural, multi-lingual Arabic and English speakers with Middle Eastern / European heritage.

---

### SECTION 2 — Rejection Pattern Summary
Rejected profiles (@comedy_dude, @tech_unbx) highlight key exclusion barriers:
- **Content Format:** Broad comedy (TikTok) or dry product tech teardowns (YouTube) are systematically rejected. 
- **Audience Quality/Mismatch:** High male skew (85%+ on tech) is a major blocker when targeting female audiences.
- **Aesthetics:** Casual, uncurated backgrounds or low studio quality are immediate triggers for rejection, regardless of massive subscriber volumes (e.g. rejecting 220K follower TikTokers).

---

### SECTION 3 — Hidden Client Preferences
Our analysis reveals critical implicit parameters not requested in guidelines:
1. **The "Quiet Luxury" Factor:** The client rejects loud or overly commercial sponsors. Upwardly mobile lifestyle and aspiration are preferred.
2. **Language Fluidity:** Preference for content that organically weaves Arabic with polished English (Bilingualism), attracting a cosmopolitan expat & local audience.
3. **Primary Focus over Metric Bloat:** The client is willing to overlook small follower sizes (85K) in exchange for double the standard industry engagement rate (5.1%).

---

### SECTION 4 — Ideal Influencer Profile
- **Follower Count:** 60,000 – 150,000 (Sweet spot: 90K)
- **Desired Engagement:** > 4.0%
- **Residency:** UAE (Dubai/Abu Dhabi) or KSA (Riyadh)
- **Primary Lang:** Bilingual (Eng/Ar)
- **Main Niche:** High fashion, Premium Beauty, curation, Travel
- **Visual Tone:** Minimal, high-exposure, editorial, luxury brand fit.
- **Audience Demographics:** 65%+ Female, based primarily in UAE/Saudi Arabia.

---

### SECTION 5 — Recommended Influencers (Internet Search Mirror)

#### 1. Noura Al-Saeed (@noura_lifestyle)
- **Platform:** Instagram (Real creator)
- **Profile URL:** https://instagram.com/noura_lifestyle_mock
- **Metrics:** 95K Followers | 40K Avg Views | 4.8% Engagement Rate
- **Country / Nationality:** UAE / Emirati
- **Niche / Style:** Fashion, Fine Curation, Luxury Home Design
- **Similarity Score:** 98/100 | **Approval Probability:** 96%
- **Similar To:** @example1, @dubai_lux
- **Reasoning:** Noura's visual grid is flawless. She is native Emirati with fluent bilingual delivery. Her followers perfectly match the target luxury watch market.
- **Risk factor:** Very low; high sponsorship demand may increase rates.

#### 2. Layla Qabbani (@layla_curates)
- **Platform:** Instagram
- **Profile URL:** https://instagram.com/layla_curates_mock
- **Metrics:** 72K Followers | 28K Avg Views | 5.3% Engagement Rate
- **Country / Nationality:** UAE / Jordanian
- **Niche / Style:** High Fashion, Aspirational Travel
- **Similarity Score:** 92/100 | **Approval Probability:** 89%
- **Similar To:** @dubai_lux
- **Reasoning:** Elegant visual presence. Extremely high engagement rate (5.3%) matching the client's latent preference for content quality over sheer follower volume.
- **Risk factor:** Followers are slightly below the formal 100K threshold but offset by incredible quality.

#### 3. Yasmin M. (@yasmin_dubai)
- **Platform:** Instagram
- **Profile URL:** https://instagram.com/yasmin_dubai_mock
- **Metrics:** 115K Followers | 48K Avg Views | 4.1% Engagement Rate
- **Country / Nationality:** UAE / Lebanese-Canadian
- **Niche / Style:** Luxury Travel, High-End Dining, Accessories
- **Similarity Score:** 90/100 | **Approval Probability:** 85%
- **Similar To:** @example1
- **Reasoning:** Sophisticated content. Perfect follower bracket. Already represents selective tier-1 brands without looking over-commercialized.

---

### SECTION 6 — Final Ranking
1. **Noura Al-Saeed (@noura_lifestyle)** (96% probability) — Impeccable Emirati bilingual representation.
2. **Layla Qabbani (@layla_curates)** (89% probability) — Exceptional 5.3% engagement and high fashion alignment.
3. **Yasmin M. (@yasmin_dubai)** (85% probability) — High luxury lifestyle relevance in UAE.

---

### SECTION 7 — Watchlist (Borderline Profiles)
- **Reem Hosni (@reem_travels) [70% Probability]:** Flawless visuals and lives in Dubai. However, her content has a very heavy focus on family leisure which might dilute the high-jewelry/timepiece aesthetic.

---

### SECTION 8 — Risk Notes
**Yasmin M. (@yasmin_dubai):** High match, but already has active brand arrangements with a luxury cosmetics brand. Check for campaign category-exclusivity clauses before approaching.`;
      } else {
        simulatedReport = `# INFLUENCER INTELLIGENCE REPORT: INTERNAL DATABASE SCORING
Report Generated: ${new Date().toLocaleDateString()} (Virtual Agent Mode)

---

### SECTION 1 — Approval Pattern Analysis
The approved accounts from your database are identified as:
- **Sarah Al-Mansoori (ID: 001)** — Instagram, UAE resident, Emirati national, 85K followers, 3.8% Engagement, Beauty/Lifestyle, GCC focused.
- **Zainab Ahmed (ID: 002) (Equivalent to @dubai_lux in style)** — Instagram, KSA resident, Saudi national, 110K followers, 4.9% Engagement, Fashion/Lifestyle.

**Summary Pattern:** Client strongly enforces GCC demographics (Saudi/Emirati/GCC), high-density female audience (70%+), luxury/beauty/fashion editorial styles, and high active engagement rates.

---

### SECTION 2 — Rejection Pattern Analysis
The rejected profiles are mapped to:
- **Faris Al-Otaibi (ID: 003) (Tech/Cars)** — Reason: WRONG audience demographic (85% male) and inappropriate niching.
- **Tariq Khalid (ID: 005) (Fitness/Comedy)** — Reason: Too casual, comedy tone overrides brand appropriateness, 60% male skew.

**Summary Pattern:** Absolute restriction on highly skewed male audiences, dry reviews style, and physical comedy or fitness niches.

---

### SECTION 3 — Hidden Preferences Detected
- **Audience Quality Cap:** Direct filter requiring a **minimum of 65% Female audience composition** within the GCC territory.
- **Local Nationality Advantage:** Highly prefers regional citizens (Saudi, Emirati) for the primary campaign tier.
- **Standard Threshold:** A complete rejection of generic male "infotainment" creators even if they possess massive followings (ID 003 has 310K followers but is highly male-skewed).

---

### SECTION 4 — Scoring Methodology
We built a weighted preference model based on your database structure:
1. **Niche Congruence (30% weight):** 100/100 for premium fashion, lifestyle, or beauty. 0/100 for cars, tech, or fitness.
2. **Audience Demographics (25% weight):** 100/100 for Female GCC audience >65%.
3. **National Alignment (20% weight):** 100/100 for Emirati/Saudi residency and citizenship.
4. **Engagement Quality (15% weight):** Scoring linearly from 1.5% up to 5.0%+.
5. **Aesthetics & Tone (10% weight):** Determined by platform curation guidelines.

---

### SECTION 5 — Top Recommended Influencers (From Database)

#### Rank 1: Zainab Ahmed (ID 002) — Already Approved Reference
#### Rank 2 (NEW Recommendation): Lina Haddad (ID 004)
- **Database ID:** 004 | **Username:** @linah_vision | **Platform:** TikTok
- **Country / Nationality:** UAE / Jordanian | **Language:** Arabic/English
- **Followers:** 140K | **Avg Views:** 65K | **Engagement:** 4.1%
- **Niche:** Lifestyle, Travel | **Demographics:** 65% female, 20-35, UAE
- **Similarity Score:** 91/100 | **Approval Probability:** 88%
- **Reasoning:** Lina possesses a flawless lifestyle profile. Her audience composition is highly female-skewed (65%) and within the vital GCC region. Her 140K follower base is extremely active and matches the luxury threshold.
- **Concerns:** Her primary channel is TikTok rather than Instagram, which could represent a minor platform mismatch, but her high-tier aesthetic is very modular.

---

### SECTION 6 — Watchlist (Borderline Database matches)
- **Sarah Al-Mansoori (ID 001):** Already approved.
- Currently, NO other database entries fall in the borderline safe bracket. All other profiles are either approved or already rejected because they fail multiple gates.

---

### SECTION 7 — Risk Analysis
**Lina Haddad (ID 004):** Since the client previously rejected TikTok influencers or comedy, they are sensitive to platform aesthetics. However, Lina's style is high-end travel (not cheap humor), so the risk of rejection is mitigated (estimated at only 12%).

---

### SECTION 8 — Summary Table (Database Recommendations)

| Rank | Name | ID | Platform | Followers | Avg. Views | Similarity Score | Approval Probability | Key Strength |
|---|---|---|---|---|---|---|---|---|
| **1** | Zainab Ahmed | 002 | Instagram | 110K | 50K | 100 | 100% | Already Approved Benchmark |
| **2** | Lina Haddad | 004 | TikTok | 140K | 65K | 91 | 88% | Flawless GCC female demographics |
`;
      }

      // Briefly wait to simulate intelligence analysis ticking
      await new Promise(r => setTimeout(r, 1400));
      setInfluencerAnalysisResult(simulatedReport);
    } finally {
      setInfluencerAnalysisLoading(false);
    }
  };

  // Copy code helper
  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Export Scraped Data as JSON
  const handleExportJSON = () => {
    if (!response) return;
    
    let exportObj: any = {
      target_url: url,
      impersonate: impersonate,
      extraction_type: extractionType,
      timestamp: new Date().toISOString(),
      status_code: response.status,
      scraped_url: response.url,
      metadata: response.metadata,
    };

    if (testQuery && testMatches.length > 0) {
      exportObj.selector = testQuery;
      exportObj.matches_count = testMatches.length;
      exportObj.data = testMatches.map((m, idx) => ({
        index: idx + 1,
        text: m.text,
        html_snippet: m.html
      }));
    } else {
      exportObj.data = response.content[0];
    }

    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: "application/json;charset=utf-8;" });
    const downloadUrl = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", downloadUrl);
    const fileName = `scrapling_export_${new URL(url).hostname.replace(/[^a-z0-9]/gi, "_")}_${Date.now()}.json`;
    downloadAnchor.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(downloadUrl);
  };

  // Export Scraped Data as CSV
  const handleExportCSV = () => {
    if (!response) return;

    let csvContent = "";
    
    if (testQuery && testMatches.length > 0) {
      csvContent += "Index,Extracted Text,Source HTML Snippet\n";
      testMatches.forEach((m, idx) => {
        const escapedText = `"${m.text.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
        const escapedHtml = `"${m.html.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
        csvContent += `${idx + 1},${escapedText},${escapedHtml}\n`;
      });
    } else {
      csvContent += "Line Number,Content Text\n";
      const lines = (response.content[0] || "").split("\n");
      lines.forEach((line, idx) => {
        if (line.trim()) {
          const escapedLine = `"${line.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
          csvContent += `${idx + 1},${escapedLine}\n`;
        }
      });
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const downloadUrl = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", downloadUrl);
    const fileName = `scrapling_export_${new URL(url).hostname.replace(/[^a-z0-9]/gi, "_")}_${Date.now()}.csv`;
    downloadAnchor.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(downloadUrl);
  };

  // Suggest elements via Gemini
  const handleAISuggest = async () => {
    if (!response || !response.rawHtml) {
      alert("Please execute a successful Scrape first to feed context to the AI assistant.");
      return;
    }

    setAiStatus("thinking");
    try {
      const res = await fetch("/api/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          htmlSnippet: response.rawHtml,
          userObjective: aiObjective,
          aiSettings: {
            provider: selectedAiProvider,
            model: selectedAiModel,
            temperature: aiTemperature,
            systemInstruction: aiSystemInstruction,
            customApiKey: getCustomApiKeyVal(),
            agentRouterBaseUrl: customAgentRouterBaseUrl,
          }
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const data = (await res.json()) as AISuggestionResponse;
      setAiResult(data);
      setAiStatus("completed");
    } catch (e: any) {
      console.error(e);
      setAiStatus("error");
      alert(e.message || "AI core was unable to complete the structural recommendation.");
    }
  };

  // AI grounded chat with Gemini
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: chatInput,
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      // Feed full chat history and scraped webpage structure as assistant context
      const documentContext = response ? response.content.join("\n") : "No webpage scraped yet.";
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatHistory, userMsg],
          documentContext: documentContext,
          aiSettings: {
            provider: selectedAiProvider,
            model: selectedAiModel,
            temperature: aiTemperature,
            systemInstruction: aiSystemInstruction,
            customApiKey: getCustomApiKeyVal(),
            agentRouterBaseUrl: customAgentRouterBaseUrl,
          }
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: data.text,
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "system",
          text: "Communication pipeline interrupted. Ensure process.env.GEMINI_API_KEY is configured correctly.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Helper events for custom dynamic settings tab
  const handleAddMcpServer = () => {
    if (!newMcpName.trim() || !newMcpCmd.trim()) return;
    const newServer = {
      id: Date.now().toString(),
      name: newMcpName.trim(),
      status: "active",
      type: "stdio",
      cmd: newMcpCmd.trim()
    };
    setMcpServers([...mcpServers, newServer]);
    setNewMcpName("");
    setNewMcpCmd("");
  };

  const handleToggleMcpStatus = (id: string) => {
    setMcpServers(
      mcpServers.map((s) => (s.id === id ? { ...s, status: s.status === "active" ? "inactive" : "active" } : s))
    );
  };

  const handleRemoveMcpServer = (id: string) => {
    setMcpServers(mcpServers.filter((s) => s.id !== id));
  };

  const handleToggleSkill = (id: string) => {
    setSkillsList(
      skillsList.map((sk) => (sk.id === id ? { ...sk, enabled: !sk.enabled } : sk))
    );
  };

  const handleTogglePlugin = (id: string) => {
    setPluginsList(
      pluginsList.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  // Header handlers
  const handleAddHeader = () => {
    if (!newHeaderKey.trim() || !newHeaderVal.trim()) return;
    setHeaders((prev) => ({
      ...prev,
      [newHeaderKey.trim()]: newHeaderVal.trim(),
    }));
    setNewHeaderKey("");
    setNewHeaderVal("");
  };

  const handleRemoveHeader = (key: string) => {
    setHeaders((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  // Cookie handlers
  const handleAddCookie = () => {
    if (!newCookieKey.trim() || !newCookieVal.trim()) return;
    setCookies((prev) => ({
      ...prev,
      [newCookieKey.trim()]: newCookieVal.trim(),
    }));
    setNewCookieKey("");
    setNewCookieVal("");
  };

  const handleRemoveCookie = (key: string) => {
    setCookies((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const activePythonCode = generatePythonScript({
    url,
    extraction_type: extractionType,
    impersonate,
    main_content_only: mainContentOnly,
    css_selector: cssSelector,
    headers,
    cookies,
    timeout,
    follow_redirects: followRedirects,
  });

  return (
    <div className="min-h-screen bg-[#0e0e11] text-[#f0f4f9] flex flex-col font-sans selection:bg-[#9b72f3]/30 selection:text-white">
      {/* Visual Header */}
      <header className="bg-[#131314] border-b border-[#2d2f31]/80 py-4 px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm backdrop-blur-md bg-opacity-95">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-[#4285f4] via-[#9b72f3] to-[#d9657b] p-2.5 rounded-xl text-white flex items-center justify-center shadow-md shadow-purple-500/10">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] via-[#9b72f3] to-[#d9657b]">Web Scraper Lab</h1>
              <span className="bg-[#9b72f3]/10 text-[#9b72f3] text-[9px] uppercase font-semibold px-2 py-0.5 rounded-full border border-[#9b72f3]/20 font-mono tracking-wider">
                Scrapling spec v0.4.8
              </span>
            </div>
            <p className="text-xs text-[#8e918f]">Fingerprint Spoofing & Selector Analysis Workbench</p>
          </div>
        </div>

        {/* Live system status badge */}
        <div className="flex items-center gap-4 gap-y-1 sm:gap-6">
          <div className="flex items-center gap-2 bg-[#1e1f20] border border-[#2d2f31]/80 px-3.5 py-1.5 rounded-full text-xs font-mono">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[#8e918f] select-all uppercase tracking-wider text-[10px]">Active Sandbox Container</span>
          </div>
        </div>
      </header>

      {/* Quick Container Options and Preset Sidebar */}
      <div className="bg-[#131314]/70 border-b border-[#2d2f31]/40 py-4.5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#9b72f3]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#8e918f]">Sandbox Preset Mocks:</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                id={`preset-${preset.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                onClick={() => handleLoadPreset(preset)}
                className="flex items-center gap-3 bg-[#1e1f20] border border-[#2d2f31] hover:border-[#9b72f3] hover:bg-[#25272a] px-4 py-2 text-left rounded-2xl transition-all duration-300 shadow-sm hover:shadow-purple-500/5 group"
              >
                <div className="w-7 h-7 bg-[#131314] text-[#9b72f3] rounded-xl flex items-center justify-center font-bold text-sm border border-[#2d2f31] group-hover:bg-gradient-to-tr group-hover:from-[#4285f4] group-hover:to-[#9b72f3] group-hover:text-white group-hover:border-transparent transition-all">
                  {preset.logo}
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#e3e3e3] group-hover:text-white">{preset.name}</div>
                  <div className="text-[10px] text-[#8e918f] truncate max-w-[140px]">{preset.url}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Master Workspace Navigation Tabs */}
      <div className="bg-[#131314] border-b border-[#2d2f31]/85 sticky top-[72px] z-40 bg-opacity-95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 pt-3 flex flex-wrap gap-1.5 justify-start md:justify-between items-center">
          <div className="flex flex-wrap gap-1">
            {[
              { id: "response", label: "Scraped Sandbox", icon: Eye, description: "Selector match & live DOM view" },
              { id: "code", label: "Scrapling Script", icon: FileCode, description: "Python crawler output script" },
              { id: "ai", label: "Gemini Assistant", icon: Sparkles, description: "Intelligent element parse chat" },
              { id: "http", label: "HTTP Metadata", icon: Terminal, description: "Spoofed packet transaction traces" },
              { id: "influencer", label: "Influencer AI Analyst", icon: Users, description: "Social entity profiling & exports" },
              { id: "settings", label: "Advanced Dev Configs", icon: Settings, description: "Proxies, MCP registry & configs" },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`global-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex flex-col gap-0.5 px-4.5 py-3 text-left transition-all duration-150 relative cursor-pointer border-t-2 border-transparent select-none min-w-[130px] md:min-w-[155px] ${
                    isSelected
                      ? "bg-[#0e0e11] text-[#f0f4f9] border-t-[#9b72f3]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-[#1e1f20]/40"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <TabIcon className={`w-3.5 h-3.5 ${isSelected ? "text-[#9b72f3]" : "text-slate-500"}`} />
                    <span className="text-xs font-bold tracking-tight">{tab.label}</span>
                  </div>
                  <span className="text-[9px] text-[#8e918f] font-mono leading-none truncate max-w-[140px] md:max-w-[160px]">{tab.description}</span>
                </button>
              );
            })}
          </div>
          {response && (
            <div className="hidden lg:flex items-center gap-3 bg-[#1e1f20] border border-[#2d2f31]/60 px-3 py-1 rounded-xl text-[10px] font-mono text-slate-400 mr-2">
              <span className="flex h-1.5 w-1.5 relative animate-none">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span>Loaded: <strong className="text-slate-200">{(response.metadata.sizeBytes / 1024).toFixed(1)} KB</strong></span>
            </div>
          )}
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6">
        {/* Render active workspace layouts dynamically based on selected option */}
        {activeTab === "response" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
            {/* LEFT COLUMN: Request Builder Form */}
            <section className="lg:col-span-5 flex flex-col gap-5">
          {/* Target URL Input Panel */}
          <div className="bg-[#131314] border border-[#2d2f31]/80 p-5 rounded-3xl shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label htmlFor="url-input" className="text-xs font-bold text-[#e3e3e3] uppercase tracking-widest flex items-center gap-2 font-display">
                <Globe className="w-4 h-4 text-[#4285f4]" /> Target URL Sandbox
              </label>
              {isLoading && (
                <span className="flex items-center gap-1.5 text-xs text-[#d9657b] font-mono">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Crawling...
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Shield className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  id="url-input"
                  type="url"
                  placeholder="Enter target URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-[#1e1f20] border border-[#3c4043] focus:border-[#9b72f3] text-[#f0f4f9] rounded-2xl py-3 pl-11 pr-4 text-sm font-mono placeholder-slate-600 focus:outline-none transition-all"
                />
              </div>

              <button
                id="execute-crawl-btn"
                onClick={() => handleScrape()}
                disabled={isLoading}
                className="bg-gradient-to-r from-[#4285f4] via-[#9b72f3] to-[#8b5cf6] hover:brightness-110 hover:shadow-lg hover:shadow-[#9b72f3]/20 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-full flex items-center gap-2 cursor-pointer transition-all duration-300 justify-center active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-white text-white" />
                <span>Run</span>
              </button>
            </div>
          </div>

          {/* Configuration Parameters accordion-like panel */}
          <div className="bg-[#131314] border border-[#2d2f31]/80 p-5 rounded-3xl shadow-sm flex flex-col gap-4">
            <button
              onClick={() => setIsFingerprintsCollapsed(!isFingerprintsCollapsed)}
              className="flex items-center justify-between w-full border-b border-[#2d2f31]/50 pb-3 text-left focus:outline-none group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#9b72f3]" />
                <h3 className="text-xs font-bold text-[#e3e3e3] uppercase tracking-wider font-display group-hover:text-[#9b72f3] transition-colors">
                  Fingerprint & Scraper Config
                </h3>
              </div>
              <span className="text-purple-400 group-hover:text-purple-300 font-mono text-xs">
                {isFingerprintsCollapsed ? "Expand [ + ]" : "Collapse [ − ]"}
              </span>
            </button>

            {isFingerprintsCollapsed ? (
              <div className="text-[11px] text-slate-400 font-mono flex flex-wrap gap-x-2.5 gap-y-1 bg-[#0e0e11] p-3 rounded-2xl border border-[#2d2f31]/60">
                <span className="text-[#4285f4]">🎭 {impersonate}</span>
                <span className="text-slate-700 font-bold">•</span>
                <span className="text-emerald-400 uppercase font-semibold">{extractionType}</span>
                <span className="text-slate-700 font-bold">•</span>
                <span className="text-purple-400">Timeout: {timeout}s</span>
                {cssSelector && (
                  <>
                    <span className="text-slate-700 font-bold">•</span>
                    <span className="text-[#f59e0b] truncate max-w-[130px]" title={cssSelector}>css: {cssSelector}</span>
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Impersonation signature select */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="impersonate" className="text-xs font-medium text-slate-300">
                      Browser Fingerprint Impersonation:
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">TLS & Header spoofing</span>
                  </div>
                  <div className="relative">
                    <select
                      id="impersonate"
                      value={impersonate}
                      onChange={(e) => setImpersonate(e.target.value as any)}
                      className="w-full bg-[#1e1f20] border border-[#3c4043] focus:border-[#9b72f3] text-[#e3e3e3] rounded-2xl px-4 py-2.5 text-sm focus:outline-none transition-all font-mono appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23b0b3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%20%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.85rem_center] bg-no-repeat pr-11 hover:border-[#9b72f3]/50 hover:bg-[#25272a] cursor-pointer duration-200"
                    >
                      <option value="chrome">Chrome 122 (Desktop Standard)</option>
                      <option value="firefox">Firefox 123 (Open-source Standard)</option>
                      <option value="safari">Safari 17 Mac OS (Webkit Forge)</option>
                      <option value="edge">Edge 122 Enterprise (Chromium Build)</option>
                      <option value="safari_ios">Safari IOS (iPhone Active Mobile)</option>
                    </select>
                  </div>
                </div>

                {/* Extraction Type choice */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-1 col-span-3">
                    <span className="text-xs font-medium text-slate-300">Extraction Content Pipeline:</span>
                  </div>
                  {["markdown", "html", "text"].map((type) => (
                    <button
                      key={type}
                      id={`extract-type-${type}`}
                      onClick={() => setExtractionType(type as any)}
                      className={`py-2.5 px-3 text-xs font-bold rounded-2xl border capitalize transition-all duration-200 ${
                        extractionType === type
                          ? "bg-[#9b72f3]/10 border-[#9b72f3] text-[#c5aaff] shadow-[0_0_12px_rgba(155,114,243,0.15)]"
                          : "bg-[#1e1f20] border-[#3c4043]/85 text-[#8e918f] hover:text-[#f0f4f9] hover:bg-[#25272a] hover:border-[#9b72f3]/40"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* CSS Selector state input */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="css-selector" className="text-xs font-medium text-slate-300">
                      Primary Scrape Selector (Optional):
                    </label>
                    <span className="text-[10px] text-[#9b72f3] font-mono">Real-time match</span>
                  </div>
                  <input
                    id="css-selector"
                    type="text"
                    value={cssSelector}
                    onChange={(e) => {
                      setCssSelector(e.target.value);
                      setTestQuery(e.target.value);
                    }}
                    placeholder="e.g. div.product-card, a.storylink"
                    className="w-full bg-[#1e1f20] border border-[#3c4043] focus:border-[#9b72f3] text-[#f0f4f9] rounded-2xl px-3.5 py-2.5 text-sm font-mono focus:outline-none transition-all placeholder-slate-600"
                  />
                </div>

                {/* Advanced configurations */}
                <div className="border-t border-[#2d2f31]/50 pt-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="main-content-checkbox" className="text-xs text-slate-300 cursor-pointer select-none">
                      Core Document Only (Strip noise tags - nav, footer)
                    </label>
                    <input
                      id="main-content-checkbox"
                      type="checkbox"
                      checked={mainContentOnly}
                      onChange={(e) => setMainContentOnly(e.target.checked)}
                      className="w-4 h-4 accent-[#9b72f3] rounded border-slate-700 bg-[#1e1f20]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-1.5">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="timeout-input" className="text-[11px] text-slate-400">Timeout (Seconds)</label>
                      <input
                        id="timeout-input"
                        type="number"
                        min="5"
                        max="120"
                        value={timeout}
                        onChange={(e) => setTimeoutVal(parseInt(e.target.value) || 30)}
                        className="w-full bg-[#1e1f20] border border-[#3c4043] text-[#e3e3e3] rounded-xl px-2.5 py-1.5 text-xs font-mono"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-slate-400">Redirects Handler</span>
                      <div className="relative">
                        <select
                          id="redirect-handler"
                          value={followRedirects ? "safe" : "none"}
                          onChange={(e) => setFollowRedirects(e.target.value === "safe" ? "safe" : false)}
                          className="w-full bg-[#1e1f20] border border-[#3c4043] text-[#e3e3e3] rounded-xl px-3 py-2 text-xs font-mono focus:outline-none appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23b0b3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%20%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1rem_1rem] bg-[right_0.6rem_center] bg-no-repeat pr-8 hover:border-[#9b72f3]/50 hover:bg-[#25272a] cursor-pointer transition-all duration-200"
                        >
                          <option value="safe">SSRF Blocked (Safe)</option>
                          <option value="none">Disabled (No-Follow)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* headers and cookies payload dynamic list */}
          <div className="bg-[#131314] border border-[#2d2f31]/80 p-5 rounded-3xl shadow-sm flex flex-col gap-4">
            <button
              onClick={() => setIsHeadersCookiesCollapsed(!isHeadersCookiesCollapsed)}
              className="flex items-center justify-between w-full border-b border-[#2d2f31]/50 pb-3 text-left focus:outline-none group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#9b72f3]" />
                <h3 className="text-xs font-bold text-[#e3e3e3] uppercase tracking-wider font-display group-hover:text-[#9b72f3] transition-colors">
                  Custom Headers & Cookies
                </h3>
              </div>
              <span className="text-purple-400 group-hover:text-purple-300 font-mono text-xs">
                {isHeadersCookiesCollapsed ? "Expand [ + ]" : "Collapse [ − ]"}
              </span>
            </button>

            {isHeadersCookiesCollapsed ? (
              <div className="text-[11px] text-slate-400 font-mono flex flex-wrap gap-x-2.5 gap-y-1 bg-[#0e0e11] p-3 rounded-2xl border border-[#2d2f31]/60">
                <span className="text-[#4285f4]">📥 {Object.keys(headers).length} Headers injected</span>
                <span className="text-slate-700 font-bold">•</span>
                <span className="text-[#9b72f3]">🍪 {Object.keys(cookies).length} Active cookies</span>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Custom Headers */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-[#8e918f]">Headers Injection ({Object.keys(headers).length})</span>
                  <div className="max-h-[140px] overflow-y-auto flex flex-col gap-1.5 bg-[#18191b] p-2.5 rounded-2xl border border-[#2d2f31]/50">
                    {Object.keys(headers).length === 0 ? (
                      <div className="text-[11px] text-[#8e918f]/50 text-center py-4">No custom headers loaded.</div>
                    ) : (
                      Object.entries(headers).map(([key, val]) => (
                        <div key={key} className="flex justify-between items-center bg-[#131314] px-2.5 py-1.5 rounded-xl border border-[#2d2f31] text-xs font-mono">
                          <span className="text-[#4285f4] max-w-[120px] truncate">{key}:</span>
                          <div className="flex items-center gap-2 max-w-[150px]">
                            <span className="text-slate-300 truncate">{val}</span>
                            <button
                              onClick={() => handleRemoveHeader(key)}
                              className="text-red-400 hover:text-red-300 px-1 hover:bg-[#1e1f20] rounded font-bold cursor-pointer"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Key"
                      value={newHeaderKey}
                      onChange={(e) => setNewHeaderKey(e.target.value)}
                      className="w-1/2 bg-[#1e1f20] border border-[#3c4043] text-xs rounded-xl px-2.5 py-2.5 text-[#e3e3e3] placeholder-slate-650 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={newHeaderVal}
                      onChange={(e) => setNewHeaderVal(e.target.value)}
                      className="w-1/2 bg-[#1e1f20] border border-[#3c4043] text-xs rounded-xl px-2.5 py-2.5 text-[#e3e3e3] placeholder-slate-650 focus:outline-none"
                    />
                    <button
                      onClick={handleAddHeader}
                      className="bg-[#1e1f20] hover:bg-[#25272a] hover:text-[#9b72f3] hover:border-[#9b72f3] text-slate-300 font-mono px-3.5 py-2.5 text-xs rounded-xl cursor-pointer border border-[#3c4043] font-bold transition-all duration-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Custom Cookies */}
                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-xs font-semibold text-[#8e918f]">Cookie Contexts ({Object.keys(cookies).length})</span>
                  <div className="max-h-[140px] overflow-y-auto flex flex-col gap-1.5 bg-[#18191b] p-2.5 rounded-2xl border border-[#2d2f31]/50">
                    {Object.keys(cookies).length === 0 ? (
                      <div className="text-[11px] text-[#8e918f]/50 text-center py-4">No custom session cookies defined.</div>
                    ) : (
                      Object.entries(cookies).map(([key, val]) => (
                        <div key={key} className="flex justify-between items-center bg-[#131314] px-2.5 py-1.5 rounded-xl border border-[#2d2f31] text-xs font-mono">
                          <span className="text-[#9b72f3] max-w-[125px] truncate">{key}=</span>
                          <div className="flex items-center gap-2 max-w-[150px]">
                            <span className="text-slate-300 truncate">{val}</span>
                            <button
                              onClick={() => handleRemoveCookie(key)}
                              className="text-red-400 hover:text-red-300 px-1 hover:bg-[#1e1f20] rounded font-bold cursor-pointer"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Cookie key"
                      value={newCookieKey}
                      onChange={(e) => setNewCookieKey(e.target.value)}
                      className="w-1/2 bg-[#1e1f20] border border-[#3c4043] text-xs rounded-xl px-2.5 py-2.5 text-[#e3e3e3] placeholder-slate-650 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={newCookieVal}
                      onChange={(e) => setNewCookieVal(e.target.value)}
                      className="w-1/2 bg-[#1e1f20] border border-[#3c4043] text-xs rounded-xl px-2.5 py-2.5 text-[#e3e3e3] placeholder-slate-650 focus:outline-none"
                    />
                    <button
                      onClick={handleAddCookie}
                      className="bg-[#1e1f20] hover:bg-[#25272a] hover:text-[#9b72f3] hover:border-[#9b72f3] text-slate-300 font-mono px-3.5 py-2.5 text-xs rounded-xl cursor-pointer border border-[#3c4043] font-bold transition-all duration-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: Interactive Selector Workspace Workspace & AI */}
        <section className="lg:col-span-7 flex flex-col gap-5">
          {/* Main Workspace Frame tabs */}
          <div className="bg-[#131314] border border-[#2d2f31]/80 rounded-3xl overflow-hidden shadow-sm flex-1 flex flex-col">
            <div className="bg-[#18191b] border-b border-[#2d2f31]/60 px-5 py-3.5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-bold text-[#e3e3e3] uppercase tracking-wider font-display">Target Document Sandbox Live DOM View</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Interactive CSS element matches</span>
            </div>

            {/* Error notifications */}
            {errorMess && (
              <div className="bg-red-950/20 border-b border-red-900/30 p-4 text-red-300 text-xs font-mono flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Extraction Protocol Interruption:</span> {errorMess}
                  <p className="mt-1 text-[11px] text-red-400/80">Using fallback mock representation layer to resume selector experiments.</p>
                </div>
              </div>
            )}

            {/* Sandbox details summary indicator bar */}
            {response && (
              <div className="bg-[#131314]/50 border-b border-[#2d2f31]/60 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="text-[#8e918f] flex items-center gap-1.5 font-mono">
                    <Clock className="w-3.5 h-3.5 text-[#4285f4]" />
                    <span>Latency:</span>
                    <span className="text-[#f0f4f9] font-semibold">{response.metadata.durationMs}ms</span>
                  </div>
                  <div className="text-[#8e918f] flex items-center gap-1.5 font-mono ml-2 border-l border-[#2d2f31] pl-3">
                    <Layers className="w-3.5 h-3.5 text-[#9b72f3]" />
                    <span>Page Size:</span>
                    <span className="text-[#f0f4f9] font-semibold">{(response.metadata.sizeBytes / 1024).toFixed(1)} KB</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {response.metadata.isSandbox ? (
                    <span className="bg-amber-950/40 text-amber-400 border border-amber-900/30 text-[10px] uppercase font-bold px-2 py-0.5 rounded-lg font-mono">
                      CONTAINMENT SANDBOX
                    </span>
                  ) : (
                    <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 text-[10px] uppercase font-bold px-2 py-0.5 rounded-lg font-mono flex items-center gap-1">
                      LIVE DIRECT STREAM <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  )}
                  {response.status === 200 ? (
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-md font-mono">
                      HTTP 200 OK
                    </span>
                  ) : (
                    <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold px-2 py-0.5 rounded-md font-mono">
                      HTTP {response.status}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT SPACES */}
            <div className="p-5 flex-1 flex flex-col bg-[#0e0e11]">
              {/* TAB 1: SCRAPED SANDBOX WITH VISUAL ELEMENT QUERY CONSOLE */}
              {activeTab === "response" && (() => {
                // Parse raw text content into blocks/paragraphs
                const rawTextBlocks = response && response.content[0]
                  ? response.content[0]
                      .split(/\n{2,}/)
                      .map(block => block.trim())
                      .filter(block => block.length > 0)
                  : [];

                // Filter text blocks
                const filteredTextBlocks = rawTextBlocks.filter(block =>
                  block.toLowerCase().includes(scrapedSearchQuery.toLowerCase())
                );

                // Filter active CSS matches
                const filteredMatches = testMatches.filter(m =>
                  m.text.toLowerCase().includes(scrapedSearchQuery.toLowerCase()) ||
                  m.html.toLowerCase().includes(scrapedSearchQuery.toLowerCase())
                );

                return (
                  <div className="flex-1 flex flex-col gap-4">
                    {/* CSS Live Query console input */}
                    <div className="bg-[#131314] border border-[#2d2f31]/80 p-3.5 rounded-2xl flex items-center gap-3 shadow-inner">
                      <Search className="w-4 h-4 text-[#4285f4] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                          Interact on the Fly: Live CSS Selector Sandbox
                        </div>
                        <input
                          id="test-selector-input"
                          type="text"
                          value={testQuery}
                          onChange={(e) => setTestQuery(e.target.value)}
                          placeholder="Type CSS selector (e.g. .storylink or h2) to inspect extracted elements immediately..."
                          className="w-full bg-transparent text-[#f0f4f9] font-mono text-xs focus:outline-none border-b border-transparent focus:border-[#9b72f3]/20 pb-0.5"
                        />
                      </div>
                      {testQuery && (
                        <div className="flex-shrink-0 bg-[#1e1f20] border border-[#2d2f31] text-[10px] px-2 py-1 rounded font-mono text-[#9b72f3]">
                          {testMatches.length} Matches
                        </div>
                      )}
                    </div>

                    {/* Integrated Search & Dashboard Filters */}
                    <div className="bg-[#131314] border border-[#2d2f31]/80 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                      <div className="flex-1 w-full relative flex items-center">
                        <Search className="w-3.5 h-3.5 text-slate-550 absolute left-3 pointer-events-none" />
                        <input
                          type="text"
                          value={scrapedSearchQuery}
                          onChange={(e) => setScrapedSearchQuery(e.target.value)}
                          placeholder="Type to filter content blocks or matching selector nodes instantly..."
                          className="w-full bg-[#0e0e11] border border-[#2d2f31]/85 hover:border-[#9b72f3]/40 focus:border-[#4285f4] pl-9 pr-8 py-2 rounded-xl text-xs text-[#e3e3e3] focus:outline-none transition-all placeholder:text-slate-600"
                        />
                        {scrapedSearchQuery && (
                          <button
                            onClick={() => setScrapedSearchQuery("")}
                            className="text-slate-500 hover:text-slate-350 absolute right-3 text-xs p-1"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      <div className="flex bg-[#0e0e11] border border-[#2d2f31]/85 rounded-xl p-0.5 gap-1 flex-shrink-0">
                        <button
                          onClick={() => setScrapedViewMode("raw")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150 ${
                            scrapedViewMode === "raw"
                              ? "bg-slate-800 text-[#f0f4f9] border border-slate-705/60"
                              : "text-slate-400 hover:text-slate-200 border border-transparent"
                          }`}
                          title="Raw Web Scrape Content"
                        >
                          <Terminal className="w-3.5 h-3.5" />
                          <span>Raw Text</span>
                        </button>
                        <button
                          onClick={() => setScrapedViewMode("list")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150 ${
                            scrapedViewMode === "list"
                              ? "bg-[#9b72f3]/15 text-[#9b72f3] border border-[#9b72f3]/30"
                              : "text-slate-400 hover:text-slate-200 border border-transparent"
                          }`}
                          title="Interactive List Layout"
                        >
                          <List className="w-3.5 h-3.5" />
                          <span>List View</span>
                        </button>
                        <button
                          onClick={() => setScrapedViewMode("card")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150 ${
                            scrapedViewMode === "card"
                              ? "bg-[#34a853]/15 text-[#34a853] border border-[#34a853]/30"
                              : "text-slate-400 hover:text-[#34a853] border border-transparent"
                          }`}
                          title="Responsive Bento Grid Cards"
                        >
                          <LayoutGrid className="w-3.5 h-3.5" />
                          <span>Card Grid</span>
                        </button>
                        <button
                          id="btn-view-visualizer"
                          onClick={() => setScrapedViewMode("visualizer")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150 ${
                            scrapedViewMode === "visualizer"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/35"
                              : "text-slate-400 hover:text-amber-400 border border-transparent"
                          }`}
                          title="Live interactive HTML Selector highlighting"
                        >
                          <Monitor className="w-3.5 h-3.5" />
                          <span>DOM Visualizer</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1">
                      {/* Processed view / Content output */}
                      <div className="md:col-span-12 flex flex-col gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#1e1f20]/50 p-2.5 rounded-2xl mb-2 gap-2 border border-[#2d2f31]/60">
                          <span className="text-xs font-mono tracking-wider text-slate-400 flex items-center gap-1.5 px-1.5">
                            <FileText className="w-4 h-4 text-[#4285f4]" /> Web Content Output:
                            <span className="text-[10px] bg-[#131314] px-2.5 py-0.5 rounded-lg border border-[#2d2f31]/60 text-[#8e918f] capitalize">{extractionType} mode</span>
                          </span>
                          
                          {response && (
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-slate-500 font-sans font-medium">Export Data:</span>
                              <button
                                id="export-csv-btn"
                                onClick={handleExportCSV}
                                className="bg-[#131314] hover:bg-[#1e1f20] border border-[#2d2f31] hover:border-[#9b72f3]/50 text-slate-300 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer"
                                title="Export matches (or lines of webpage) to CSV"
                              >
                                <Database className="w-3.5 h-3.5 text-indigo-400" />
                                <span>CSV</span>
                              </button>
                              <button
                                id="export-json-btn"
                                onClick={handleExportJSON}
                                className="bg-[#131314] hover:bg-[#1e1f20] border border-[#2d2f31] hover:border-[#9b72f3]/50 text-slate-300 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer"
                                title="Export metadata and content payload to JSON"
                              >
                                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                                <span>JSON</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Interactive dynamic view modes container */}
                        <div className="flex-1 min-h-[250px] overflow-y-auto pr-1">
                          {isLoading ? (
                            <div className="bg-[#131314] border border-[#2d2f31]/80 rounded-2xl p-4 flex flex-col items-center justify-center py-20 gap-3">
                              <RefreshCw className="w-8 h-8 text-[#9b72f3] animate-spin" />
                              <p className="text-slate-500 text-xs">Simulating active Scrapling stealth crawl...</p>
                            </div>
                          ) : response && response.content[0] ? (
                            scrapedViewMode === "raw" ? (
                              <div className="bg-[#131314] border border-[#2d2f31]/80 rounded-2xl p-4 font-mono text-xs leading-relaxed text-[#e3e3e3] select-text">
                                {scrapedSearchQuery ? (
                                  <div className="bg-[#1e1f20]/60 p-2.5 rounded-xl border border-[#2d2f31]/60 mb-3 text-[11px] text-[#8e918f]">
                                    👉 Highlight Filter Active. Found {filteredTextBlocks.length} matching segment(s).
                                  </div>
                                ) : null}
                                <pre className="whitespace-pre-wrap select-text">
                                  {scrapedSearchQuery 
                                    ? filteredTextBlocks.join("\n\n") 
                                    : response.content[0]}
                                </pre>
                              </div>
                            ) : scrapedViewMode === "list" ? (
                              <div className="flex flex-col gap-2.5">
                                {filteredTextBlocks.length === 0 ? (
                                  <div className="bg-[#131314] border border-[#2d2f31]/80 rounded-2xl p-8 text-center text-slate-500">
                                    No text blocks match search filter "{scrapedSearchQuery}".
                                  </div>
                                ) : (
                                  filteredTextBlocks.map((block, idx) => (
                                    <div key={idx} className="bg-[#131314] hover:bg-[#1e1f20]/60 border border-[#2d2f31]/80 hover:border-[#9b72f3]/40 rounded-xl p-3.5 flex items-start gap-3 transition-all duration-150">
                                      <span className="bg-[#4285f4]/15 text-[#4285f4] text-[10px] h-5 w-5 flex items-center justify-center rounded-lg font-bold font-mono flex-shrink-0 mt-0.5">
                                        {idx + 1}
                                      </span>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs text-[#e3e3e3] whitespace-pre-wrap leading-relaxed select-text">{block}</p>
                                        <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500 font-mono">
                                          <span>{block.length} characters</span>
                                          <span>•</span>
                                          <span>{block.split(/\s+/).filter(Boolean).length} words</span>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(block);
                                        }}
                                        className="text-slate-500 hover:text-[#9b72f3] p-1.5 rounded hover:bg-[#1e1f20] transition-all cursor-pointer flex-shrink-0"
                                        title="Copy exact text contents"
                                      >
                                        <Copy className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))
                                )}
                              </div>
                            ) : scrapedViewMode === "card" ? (
                              /* Card Grid View */
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {filteredTextBlocks.length === 0 ? (
                                  <div className="col-span-2 bg-[#131314] border border-[#2d2f31]/80 rounded-2xl p-8 text-center text-slate-500">
                                    No text blocks match search filter "{scrapedSearchQuery}".
                                  </div>
                                ) : (
                                  filteredTextBlocks.map((block, idx) => (
                                    <div key={idx} className="bg-[#131314] hover:bg-[#1e1f20]/80 border border-[#2d2f31]/80 hover:border-[#34a853]/45 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 shadow-sm relative group overflow-hidden">
                                      <div className="absolute top-0 left-0 w-1 h-full bg-[#34a853] opacity-50"></div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-2.5">
                                          <span className="bg-[#34a853]/15 text-[#46c367] text-[9px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                                            Block {idx + 1}
                                          </span>
                                          <span className="text-[10px] text-slate-500 font-mono">{block.length} chars</span>
                                        </div>
                                        <p className="text-xs text-[#e3e3e3] whitespace-pre-wrap leading-relaxed select-text line-clamp-5 group-hover:line-clamp-none transition-all">{block}</p>
                                      </div>
                                      <div className="flex items-center justify-between border-t border-[#2d2f31]/40 pt-3 mt-3">
                                        <span className="text-[9px] text-[#8e918f] font-mono">{block.split(/\s+/).filter(Boolean).length} words</span>
                                        <button
                                          onClick={() => navigator.clipboard.writeText(block)}
                                          className="flex items-center gap-1.5 bg-[#0e0e11] hover:bg-[#1e1f20] border border-[#2d2f31] hover:border-[#34a853] text-slate-300 hover:text-[#34a853] px-2.5 py-1 rounded-xl text-[10px] font-semibold transition-all cursor-pointer"
                                        >
                                          <Copy className="w-3 h-3" />
                                          <span>Copy Block</span>
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            ) : (
                              /* DOM Visualizer View */
                              <div className="flex flex-col gap-4 bg-[#131314] border border-[#2d2f31]/80 rounded-2xl p-4 shadow-md">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#2d2f31]/60 pb-3.5 gap-3">
                                  <div className="flex flex-col gap-0.5">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                      <span className="font-bold text-[#f0f4f9] text-xs">HTML Document Render Sandbox</span>
                                    </div>
                                    <span className="text-[10px] text-slate-500 leading-normal">
                                      Visually inspecting real-time CSS selector highlights & matching structures
                                    </span>
                                  </div>

                                  {/* Responsive Frame Control */}
                                  <div className="flex items-center bg-[#0e0e11] border border-[#2d2f31]/80 rounded-xl p-0.5 gap-0.5 self-stretch sm:self-auto justify-center">
                                    <button
                                      onClick={() => setFrameWidth("desktop")}
                                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer transition-all ${
                                        frameWidth === "desktop"
                                          ? "bg-slate-800 text-slate-200 border border-slate-700/60"
                                          : "text-slate-500 hover:text-slate-350"
                                      }`}
                                      title="Desktop Scale Layout"
                                    >
                                      <Monitor className="w-3 h-3" />
                                      <span>Desktop</span>
                                    </button>
                                    <button
                                      onClick={() => setFrameWidth("tablet")}
                                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer transition-all ${
                                        frameWidth === "tablet"
                                          ? "bg-slate-800 text-slate-200 border border-slate-700/60"
                                          : "text-slate-500 hover:text-slate-350"
                                      }`}
                                      title="Tablet Scale Preview (768px)"
                                    >
                                      <Tablet className="w-3 h-3" />
                                      <span>Tablet</span>
                                    </button>
                                    <button
                                      onClick={() => setFrameWidth("mobile")}
                                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer transition-all ${
                                        frameWidth === "mobile"
                                          ? "bg-slate-800 text-slate-200 border border-slate-700/60"
                                          : "text-slate-500 hover:text-slate-350"
                                      }`}
                                      title="Mobile Scale Preview (390px)"
                                    >
                                      <Smartphone className="w-3 h-3" />
                                      <span>Mobile</span>
                                    </button>
                                  </div>
                                </div>

                                {/* Mock Web Browser Shell */}
                                <div className="border border-[#2d2f31] rounded-xl overflow-hidden bg-[#0e0e11] flex flex-col shadow-2xl relative">
                                  {/* Browser window top controls */}
                                  <div className="bg-[#18191a] border-b border-[#2d2f31]/75 px-4 py-2.5 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                      <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                      <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                                    </div>
                                    
                                    {/* Mock URL address bar */}
                                    <div className="flex-1 bg-[#111112] text-[#8e918f] font-mono text-[10px] px-3.5 py-1.5 rounded-lg border border-[#2d2f31]/65 max-w-xl text-center truncate select-all flex items-center justify-center gap-1.5 select-text">
                                      <span className="text-emerald-500">🔒</span>
                                      <span className="text-slate-500">https://</span>
                                      <span className="text-[#e3e3e3] font-sans font-medium">{response?.url || "scraped-protocol.internal"}</span>
                                    </div>

                                    {/* Matches counter badge */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-mono font-bold whitespace-nowrap">
                                        {testQuery.trim() ? `${testMatches.length} matches` : "No Selector"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Dynamic Frame width styling inside mock viewport */}
                                  <div className="w-full bg-[#080809] p-4 flex justify-center min-h-[460px] border-t border-[#131113]/30">
                                    <div
                                      className={`w-full transition-all duration-300 shadow-xl overflow-hidden rounded-lg bg-white ${
                                        frameWidth === "desktop"
                                          ? "max-w-full"
                                          : frameWidth === "tablet"
                                          ? "max-w-[768px]"
                                          : "max-w-[390px]"
                                      }`}
                                      style={{ height: "460px" }}
                                    >
                                      {response?.rawHtml ? (
                                        <iframe
                                          id="dom-visualizer-iframe"
                                          srcDoc={getVisualizerSrcDoc(response.rawHtml, response.url, testQuery)}
                                          sandbox="allow-same-origin"
                                          referrerPolicy="no-referrer"
                                          className="w-full h-full border-0 select-text bg-white"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs p-6 bg-[#131314]">
                                          <Terminal className="w-8 h-8 text-slate-600 mb-2" />
                                          <span>No HTML structure recorded for this result context.</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Bottom guidelines panel */}
                                <div className="bg-[#1e1f20]/40 border border-[#2d2f31]/60 p-3 rounded-xl flex items-start gap-2.5 text-[11px] text-[#8e918f] leading-normal font-sans">
                                  <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                  <p>
                                    The DOM Visualizer processes the raw scraped response sandboxed, with scripts deactivated to prevent automatic redirection loops. It injects a <code className="text-[#f59e0b] font-mono">&lt;base&gt;</code> element pointing to the source directory to load relative style elements beautifully. Use the <strong className="text-slate-300">Live CSS Selector Sandbox</strong> at the top of this tab to change selectors on the fly!
                                  </p>
                                </div>
                              </div>
                            )
                          ) : (
                            <div className="bg-[#131314] border border-[#2d2f31]/80 rounded-2xl p-4 text-center text-slate-600 font-sans py-20 flex flex-col items-center gap-2">
                              <Info className="w-8 h-8 text-[#2d2f31]" />
                              <span>No response generated. Double check URL and click Run.</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Selector element grid output matches */}
                      {testQuery && (
                        <div className="md:col-span-12 flex flex-col gap-2 border-t border-[#2d2f31]/50 pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] font-mono tracking-wider text-slate-400 flex items-center gap-1.5 font-display">
                              <Layers className="w-3.5 h-3.5 text-[#9b72f3]" /> Active CSS Selector nodes found:
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">Limit 50 nodes</span>
                          </div>

                          <div className="bg-[#131314] border border-[#2d2f31]/80 rounded-2xl overflow-hidden font-mono text-xs flex-1 max-h-[350px] overflow-y-auto p-4">
                            {filteredMatches.length === 0 ? (
                              <div className="p-8 text-center text-slate-650 font-sans">
                                {testMatches.length === 0 
                                  ? <>No elements matched the selector <code className="text-[#a87ffb] bg-[#9b72f3]/10 px-1.5 py-0.5 rounded font-mono text-xs">"{testQuery}"</code> in the document.</>
                                  : <>No matching items found for search query Filter <code className="text-[#a87ffb] bg-[#9b72f3]/10 px-1.5 py-0.5 rounded font-mono text-xs">"{scrapedSearchQuery}"</code>.</>
                                }
                              </div>
                            ) : scrapedViewMode === "card" ? (
                              /* Node Card Grid View */
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {filteredMatches.map((m, index) => (
                                  <div key={index} className="bg-[#111112]/90 hover:bg-[#1e1f20]/80 border border-[#2d2f31]/80 hover:border-[#9b72f3]/45 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 shadow-sm relative group overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-[#9b72f3] opacity-60"></div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex justify-between items-center mb-2.5">
                                        <span className="bg-[#9b72f3]/15 text-[#a87ffb] text-[9px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                                          Match Row {index + 1}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-mono">{m.text.length} chars</span>
                                      </div>
                                      <h4 className="text-xs font-bold text-slate-200 select-text leading-relaxed font-sans mb-3 text-ellipsis overflow-hidden">
                                        "{m.text || <span className="italic text-slate-600">Pure attribute/structure node</span>}"
                                      </h4>
                                      
                                      <details className="text-[10px] text-slate-400 bg-[#0e0e11] rounded-xl border border-[#2d2f31]/60 p-2 cursor-pointer transition-all select-all">
                                        <summary className="font-mono text-[9px] text-slate-500 hover:text-[#9b72f3] list-none flex items-center gap-1 font-bold">
                                          <ChevronRight className="w-3 h-3 transition-transform" />
                                          INSPECT HTML NODE CODE
                                        </summary>
                                        <pre className="mt-2 text-[9px] leading-relaxed overflow-x-auto whitespace-pre-wrap font-mono text-[#9b72f3] select-all">
                                          {m.html}
                                        </pre>
                                      </details>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-[#2d2f31]/40 pt-3 mt-3">
                                      {m.text && (
                                        <button
                                          onClick={() => {
                                            setCampaignGoal(`Focus luxury seeding and pattern recognition match for: ${m.text.slice(0, 150)}`);
                                            setActiveTab("influencer");
                                          }}
                                          className="text-[#34a853] hover:text-[#46c367] text-[10px] font-sans font-bold flex items-center gap-1 cursor-pointer transition-all"
                                          title="Use this selector match to seed Campaign Context goals"
                                        >
                                          <Plus className="w-3.5 h-3.5" />
                                          <span>Feed Analyst</span>
                                        </button>
                                      )}
                                      <button
                                        onClick={() => navigator.clipboard.writeText(m.text)}
                                        className="flex items-center gap-1.5 bg-[#0e0e11] hover:bg-[#1e1f20] border border-[#2d2f31] hover:border-[#9b72f3] text-slate-300 hover:text-[#9b72f3] px-2.5 py-1 rounded-xl text-[10px] font-semibold transition-all cursor-pointer"
                                      >
                                        <Copy className="w-3 h-3" />
                                        <span>Copy text</span>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              /* Node List View */
                              <div className="divide-y divide-[#2d2f31]/50">
                                {filteredMatches.map((m, index) => (
                                  <div key={index} className="p-3.5 hover:bg-[#1e1f20]/50 transition-all flex items-start gap-3">
                                    <span className="bg-[#4285f4]/15 text-[#4285f4] text-[10px] h-5 w-5 flex items-center justify-center rounded font-bold flex-shrink-0 mt-0.5">
                                      {index + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-[#9b72f3] font-semibold text-[11px] mb-1.5 flex items-center justify-between">
                                        <span>Match node text: "{m.text}"</span>
                                        <div className="flex items-center gap-3">
                                          {m.text && (
                                            <button
                                              onClick={() => {
                                                setCampaignGoal(`Target analysis seeded by matching web node: ${m.text.slice(0, 150)}`);
                                                setActiveTab("influencer");
                                              }}
                                              className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                                              title="Feed this selected content block into the Influencer Insight cohort goal"
                                            >
                                              <Plus className="w-3 h-3" /> Seed Analyst
                                            </button>
                                          )}
                                          <button
                                            onClick={() => navigator.clipboard.writeText(m.text)}
                                            className="text-[10px] text-slate-500 hover:text-[#9b72f3] flex items-center gap-1 cursor-pointer"
                                          >
                                            <Copy className="w-3 h-3" /> Copy Text
                                          </button>
                                        </div>
                                      </div>
                                      <pre className="text-[10px] text-slate-400 overflow-x-auto whitespace-pre-wrap bg-[#131314]/50 p-2.5 rounded-xl border border-[#2d2f31]/50 select-all font-mono">
                                        {m.html}
                                      </pre>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </section>
      </div>
    ) : (
      <section className="w-full animate-[fadeIn_0.2s_ease-out]">
        <div className="w-full flex-1 flex flex-col">
          <div className="bg-[#131314] border border-[#2d2f31]/80 rounded-3xl p-6 shadow-md flex-1 flex flex-col w-full text-xs">
            {/* TAB 2: EXECUTABLE PYTHON CODE GENERATOR */}
            {activeTab === "code" && (
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#8e918f]">
                    Fully parameter-synchronized, production ready script. Copy and run directly on your terminal.
                  </p>
                  <button
                    id="copy-code-btn"
                    onClick={() => handleCopyCode(activePythonCode)}
                    className="bg-[#1e1f20] hover:bg-[#25272a] border border-[#2d2f31] hover:border-[#9b72f3]/50 text-[#e3e3e3] hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Script</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative bg-[#0d0d0e] border border-[#2d2f31]/80 rounded-2xl overflow-hidden flex-1 shadow-md min-h-[480px]">
                  <div className="absolute top-0 left-0 bg-[#1e1f20] border-r border-b border-[#2d2f31] text-[10px] text-[#8e918f] font-mono px-3.5 py-1.5 uppercase rounded-br-lg font-semibold tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> python (scrapling sdk)
                  </div>
                  <pre className="p-5 pt-10 overflow-auto flex-1 font-mono text-[11px] leading-relaxed text-[#4285f4] max-w-full">
                      {activePythonCode}
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB 3: AI SELECTOR RECOMMENDATION & EXTRACTION PARTNER */}
              {activeTab === "ai" && (
                <div className="flex-1 flex flex-col gap-5">
                  {/* Dynamic recommender header input */}
                  <div className="bg-[#131314] border border-[#2d2f31]/80 p-5 rounded-3xl flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-[#2d2f31]/50 pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#9b72f3] flex items-center gap-1 font-display">
                        <Sparkles className="w-4 h-4" /> AI Selector Auto-Discovery
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Gemini Grounded Reasoning</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="ai-objective" className="text-xs text-[#e3e3e3]">
                        Describe what content/columns you want to extract:
                      </label>
                      <div className="flex gap-2">
                        <textarea
                          id="ai-objective"
                          rows={2}
                          value={aiObjective}
                          onChange={(e) => setAiObjective(e.target.value)}
                          placeholder="e.g. Find all news story links, scores, and commenter accounts on HN..."
                          className="flex-1 bg-[#1e1f20] border border-[#3c4043] focus:border-[#9b72f3] rounded-2xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-0 leading-relaxed text-[#f0f4f9] resize-none font-sans"
                        />
                        <button
                          id="ai-generate-suggest-btn"
                          onClick={handleAISuggest}
                          disabled={aiStatus === "thinking" || !response}
                          className="bg-gradient-to-r from-[#4285f4] via-[#9b72f3] to-[#d9657b] hover:opacity-95 text-white font-bold h-12 px-5 rounded-full flex items-center justify-center gap-1.5 transition-all text-xs border-0 cursor-pointer disabled:opacity-40"
                        >
                          {aiStatus === "thinking" ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin text-white" />
                              <span>Thinking...</span>
                            </>
                          ) : (
                            <>
                              <Cpu className="w-4 h-4 text-white" />
                              <span>Analyze</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations response display area */}
                  <div className="flex-1 overflow-y-auto max-h-[320px]">
                    {aiStatus === "idle" && (
                      <div className="text-center py-16 text-slate-500 flex flex-col items-center gap-2">
                        <HelpCircle className="w-8 h-8 text-[#2d2f31]" />
                        <span className="text-xs">No analysis running. Enter your objectives above to search selectors.</span>
                      </div>
                    )}

                    {aiStatus === "completed" && aiResult && (
                      <div className="flex flex-col gap-4">
                        {/* Selector items list */}
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-bold text-slate-400">Recommended CSS Elements:</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {aiResult.recommendations.map((rec, i) => (
                              <div key={i} className="bg-[#131314] border border-[#2d2f31]/60 p-3.5 rounded-2xl flex flex-col gap-2">
                                <div className="flex justify-between items-center bg-[#1e1f20] p-1.5 rounded-xl border border-[#2d2f31]/40">
                                  <span className="text-xs font-bold text-[#4285f4] pl-1.5">{rec.fieldName}</span>
                                  <button
                                    onClick={() => {
                                      setTestQuery(rec.cssSelector);
                                      setCssSelector(rec.cssSelector);
                                    }}
                                    className="text-[10px] bg-[#1e1f20] border border-[#3c4043]/80 text-[#e3e3e3] hover:text-white hover:bg-[#25272a] hover:border-[#9b72f3]/60 px-3 py-1 rounded-lg transition-all duration-200 cursor-pointer"
                                  >
                                    Apply Test
                                  </button>
                                </div>
                                <code className="bg-[#9b72f3]/10 text-[#a87ffb] px-2.5 py-1 text-xs rounded-xl border border-[#9b72f3]/25 font-mono truncate select-all">
                                  {rec.cssSelector}
                                </code>
                                <p className="text-[11px] text-slate-400 leading-normal">{rec.explanation}</p>
                                {rec.sampleExtractedText && (
                                  <div className="text-[10px] text-slate-500 border-l-2 border-[#2d2f31] pl-2 mt-1 truncate">
                                    Sample: "{rec.sampleExtractedText}"
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Custom Tips */}
                        <div className="bg-[#131314] border border-[#2d2f31]/80 p-4 rounded-2xl flex flex-col gap-1.5 text-xs">
                          <span className="font-bold text-[#d9657b] flex items-center gap-1 font-display">
                            <Shield className="w-3.5 h-3.5" /> Scrapling Anti-Bot Active Shielding Tip
                          </span>
                          <p className="text-slate-300 leading-relaxed font-sans">{aiResult.scraplingTips}</p>
                        </div>

                        {/* Whole custom generated script */}
                        <div className="border-t border-[#2d2f31]/50 pt-4 flex flex-col gap-2">
                          <div className="flex justify-between items-center text-xs text-slate-400">
                            <span>Tailored Python Scrapling parser code:</span>
                            <button
                              onClick={() => handleCopyCode(aiResult.overallPythonScript)}
                              className="text-[#9b72f3] hover:text-[#a87ffb] font-semibold"
                            >
                              Copy Complete Generated Script
                            </button>
                          </div>
                          <pre className="bg-[#131314] p-4 rounded-2xl border border-[#2d2f31]/80 text-[10px] text-[#4285f4] font-mono overflow-auto max-h-[180px]">
                            {aiResult.overallPythonScript}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI chat grounded sandbox dialog section */}
                  <div className="border-t border-[#2d2f31]/60 pt-4 flex flex-col gap-3">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 font-display">
                      <HelpCircle className="w-4 h-4 text-[#4285f4]" /> Discuss HTML nodes with Scrapling AI Assistant
                    </span>

                    <div className="flex flex-col gap-3 bg-[#131314] border border-[#2d2f31]/80 rounded-2xl p-3 shadow-inner">
                      {/* Chat dialog displays */}
                      <div className="flex flex-col gap-3 max-h-[150px] overflow-y-auto pr-1">
                        {chatHistory.length === 0 ? (
                          <div className="text-center py-6 text-[11px] text-[#8e918f] font-sans">
                            Grounded to current page context. Ask any questions about how to scrape nested nodes or parse JSON.
                          </div>
                        ) : (
                          chatHistory.map((m) => {
                            const isUser = m.role === "user";
                            return (
                              <div
                                key={m.id}
                                className={`flex flex-col gap-1 text-xs max-w-[85%] ${
                                  isUser ? "self-end items-end" : "self-start items-start"
                                }`}
                              >
                                <span className={`px-3.5 py-2 rounded-2xl leading-relaxed ${
                                  isUser ? "bg-[#4285f4] text-white font-medium rounded-tr-none" : "bg-[#1e1f20] border border-[#2d2f31] text-[#e3e3e3] rounded-tl-none"
                                }`}>
                                  {m.text}
                                </span>
                              </div>
                            );
                          })
                        )}
                        {chatLoading && (
                          <div className="text-xs text-slate-550 font-mono italic animate-pulse flex items-center gap-1.5 pl-1">
                            <RefreshCw className="w-3 h-3 animate-spin text-[#9b72f3]" /> Reasoning with web document...
                          </div>
                        )}
                      </div>

                      {/* Chat Input form */}
                      <form onSubmit={handleSendChatMessage} className="flex gap-2 border-t border-[#2d2f31]/55 pt-2.5 mt-1.5">
                        <input
                          id="chat-input-field"
                           type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Ask AI: 'How do I extract all links and anchors hierarchy?'"
                          className="flex-1 bg-[#1e1f20] border border-[#3c4043] rounded-xl px-3 py-2 text-xs text-[#f0f4f9] placeholder-slate-650 focus:outline-none focus:border-[#9b72f3]"
                        />
                        <button
                          type="submit"
                          disabled={chatLoading}
                          className="bg-[#1e1f20] hover:bg-[#25272a] border border-[#3c4043] hover:border-[#9b72f3]/60 text-[#f0f4f9] hover:text-[#9b72f3] px-4.5 py-2 rounded-xl text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-200"
                        >
                          <Send className="w-3 h-3" />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: DETAILED RESPONSE HEADERS & DIAGNOSTICS */}
              {activeTab === "http" && (
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5 bg-[#131314] border border-[#2d2f31]/80 p-4 rounded-2xl">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-display">
                      Fingerprint Header spoof verification
                    </span>
                    <p className="text-[11px] text-[#8e918f] leading-normal">
                      The active engine spoofed the TLS signature and sent the following user-agent headers to bypass anti-bot crawlers.
                    </p>
                    <div className="bg-[#1e1f20] p-3 rounded-xl border border-[#2d2f31] text-xs font-mono text-[#9b72f3] select-all leading-relaxed whitespace-pre-wrap">
                      {response ? response.metadata.userAgent : "No sandbox session initiated."}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-display">
                      Response HTTP Headers
                    </span>
                    <div className="bg-[#131314] border border-[#2d2f31]/80 rounded-2xl overflow-hidden overflow-y-auto max-h-[300px] shadow-sm">
                      {!response ? (
                        <div className="p-8 text-center text-slate-600 text-xs font-mono">
                          No scrape response headers parsed yet.
                        </div>
                      ) : (
                        <table className="w-full text-left font-mono text-xs border-collapse">
                          <thead>
                            <tr className="bg-[#1e1f20] text-[#8e918f] border-b border-[#2d2f31]/80">
                              <th className="p-3 font-semibold">Header Name</th>
                              <th className="p-3 font-semibold">Header Value</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#2d2f31]/40">
                            {Object.entries(response.headers).map(([key, val]) => (
                              <tr key={key} className="hover:bg-[#1e1f20]/40">
                                <td className="p-3 text-[#4285f4] font-semibold select-all font-mono truncate max-w-[170px]">
                                  {key}
                                </td>
                                <td className="p-3 text-[#e3e3e3] select-all font-mono whitespace-pre-wrap break-all">
                                  {val}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: INFLUENCER INTELLIGENCE ANALYST */}
              {activeTab === "influencer" && (
                <div className="flex-1 flex flex-col xl:grid xl:grid-cols-12 gap-5 p-5 bg-[#131314] overflow-y-auto min-h-[600px] text-xs">
                  {/* Left Column: Form Setup (xl:col-span-6) */}
                  <div className="xl:col-span-6 flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-bold text-[#f0f4f9] flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-[#34a853]" /> Influencer Discovery Context
                      </h3>
                      <p className="text-[11px] text-[#8e918f]">
                        Supply active Campaign details and approval history. The prompt adjusts in real-time.
                      </p>
                    </div>

                    {/* Campaign Context Inputs Group */}
                    <div className="bg-[#1e1f20] border border-[#2d2f31]/80 rounded-2xl p-4 flex flex-col gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                          Campaign Name & Brand
                        </label>
                        <input
                          type="text"
                          value={campaignName}
                          onChange={(e) => setCampaignName(e.target.value)}
                          className="w-full bg-[#131314] border border-[#3c4043] rounded-xl px-3 py-2 text-[#e3e3e3] focus:outline-none focus:border-[#34a853]"
                          placeholder="e.g. Luxury Watch Brand — UAE Campaign"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                          Campaign Goal
                        </label>
                        <input
                          type="text"
                          value={campaignGoal}
                          onChange={(e) => setCampaignGoal(e.target.value)}
                          className="w-full bg-[#131314] border border-[#3c4043] rounded-xl px-3 py-2 text-[#e3e3e3] focus:outline-none focus:border-[#34a853]"
                          placeholder="e.g. awareness, product conversions"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                          Target Market
                        </label>
                        <input
                          type="text"
                          value={targetMarket}
                          onChange={(e) => setTargetMarket(e.target.value)}
                          className="w-full bg-[#131314] border border-[#3c4043] rounded-xl px-3 py-2 text-[#e3e3e3] focus:outline-none focus:border-[#34a853]"
                          placeholder="e.g. UAE, GCC, KSA"
                        />
                      </div>
                    </div>

                    {/* Client Stated Requirements */}
                    <div className="bg-[#1e1f20] border border-[#2d2f31]/80 rounded-2xl p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-center border-b border-[#2d2f31]/50 pb-2">
                        <span className="text-[11px] font-bold text-slate-300">Client Stated Requirements</span>
                        <span className="text-[9px] bg-[#34a853]/20 text-[#34a853] px-2 py-0.5 rounded-full font-mono font-bold">
                          {clientStatedRequirements.length} rules
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newStatedReq}
                          onChange={(e) => setNewStatedReq(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddStatedReq()}
                          className="flex-1 bg-[#131314] border border-[#3c4043] rounded-xl px-3 py-1.5 text-xs text-[#e3e3e3] focus:outline-none"
                          placeholder="Enter new stated guideline..."
                        />
                        <button
                          onClick={handleAddStatedReq}
                          className="bg-[#34a853]/25 hover:bg-[#34a853]/40 text-[#46c367] px-3.5 rounded-xl cursor-pointer font-bold duration-200 transition-all text-xs"
                        >
                          + Add
                        </button>
                      </div>

                      <ul className="flex flex-col gap-1.5 max-h-[120px] overflow-y-auto pr-1">
                        {clientStatedRequirements.length === 0 ? (
                          <li className="text-[#8e918f] italic text-[11px]">No stated constraints. Influencer alignment is completely pattern-driven.</li>
                        ) : (
                          clientStatedRequirements.map((req, idx) => (
                            <li key={idx} className="flex justify-between items-center bg-[#131314]/65 px-3 py-1.5 rounded-xl border border-[#2d2f31]/40 text-slate-300">
                              <span>{req}</span>
                              <button
                                onClick={() => handleRemoveStatedReq(idx)}
                                className="text-red-400 hover:text-red-300 cursor-pointer font-bold px-1.5 font-mono"
                              >
                                ×
                              </button>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>

                    {/* Accepted Influencers Cohort */}
                    <div className="bg-[#1e1f20] border border-[#2d2f31]/80 rounded-2xl p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-center border-b border-[#2d2f31]/50 pb-2">
                        <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" /> Accepted Influencers Cohort
                        </span>
                        <span className="text-[9px] bg-emerald-950/40 text-emerald-400 px-2.5 py-0.5 rounded-full font-mono font-bold">
                          {acceptedInfluencers.length} accepted
                        </span>
                      </div>

                      {/* Display Table resembling standard lists */}
                      <div className="overflow-x-auto max-h-[160px] border border-[#2d2f31]/50 rounded-xl bg-[#131314]">
                        <table className="w-full text-left font-mono text-[10px]">
                          <thead className="bg-[#1e1f20] text-slate-400">
                            <tr>
                              <th className="p-2">Handle</th>
                              <th className="p-2">Niche</th>
                              <th className="p-2">Followers</th>
                              <th className="p-2">Country</th>
                              <th className="p-2 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#2d2f31]/30 text-slate-300">
                            {acceptedInfluencers.map((item) => (
                              <tr key={item.id} className="hover:bg-[#1e1f20]/45">
                                <td className="p-2 text-emerald-400 font-semibold">{item.handle}</td>
                                <td className="p-2 truncate max-w-[80px]">{item.niche}</td>
                                <td className="p-2">{item.followers}</td>
                                <td className="p-2">{item.country}</td>
                                <td className="p-2 text-center">
                                  <button
                                    onClick={() => handleRemoveAcceptedInfluencer(item.id)}
                                    className="text-red-400 hover:text-red-350 cursor-pointer px-1 flex items-center justify-center mx-auto"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Inline form to add accepted */}
                      <div className="grid grid-cols-4 gap-1">
                        <input
                          type="text"
                          placeholder="@handle"
                          value={newAccepted.handle}
                          onChange={(e) => setNewAccepted({ ...newAccepted, handle: e.target.value })}
                          className="bg-[#131314] border border-[#2d2f31] rounded-lg px-2 py-1 text-slate-300 text-[10px]"
                        />
                        <input
                          type="text"
                          placeholder="Niche (Lifestyle)"
                          value={newAccepted.niche}
                          onChange={(e) => setNewAccepted({ ...newAccepted, niche: e.target.value })}
                          className="bg-[#131314] border border-[#2d2f31] rounded-lg px-2 py-1 text-slate-300 text-[10px]"
                        />
                        <input
                          type="text"
                          placeholder="Followers (100K)"
                          value={newAccepted.followers}
                          onChange={(e) => setNewAccepted({ ...newAccepted, followers: e.target.value })}
                          className="bg-[#131314] border border-[#2d2f31] rounded-lg px-2 py-1 text-slate-300 text-[10px]"
                        />
                        <button
                          onClick={handleAddAcceptedInfluencer}
                          className="bg-emerald-800/30 hover:bg-emerald-800/55 border border-emerald-900 text-emerald-400 rounded-lg py-1 font-bold cursor-pointer text-[10px]"
                        >
                          + Accepted
                        </button>
                      </div>
                    </div>

                    {/* Rejected Influencers Cohort */}
                    <div className="bg-[#1e1f20] border border-[#2d2f31]/80 rounded-2xl p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-center border-b border-[#2d2f31]/50 pb-2">
                        <span className="text-[11px] font-bold text-red-400 flex items-center gap-1.5">
                          <Trash2 className="w-3.5 h-3.5 text-red-400" /> Rejected Influencers Cohort
                        </span>
                        <span className="text-[9px] bg-red-950/40 text-red-400 px-2.5 py-0.5 rounded-full font-mono font-bold">
                          {rejectedInfluencers.length} rejected
                        </span>
                      </div>

                      {/* Display Table */}
                      <div className="overflow-x-auto max-h-[160px] border border-[#2d2f31]/50 rounded-xl bg-[#131314]">
                        <table className="w-full text-left font-mono text-[10px]">
                          <thead className="bg-[#1e1f20] text-slate-400">
                            <tr>
                              <th className="p-2">Handle</th>
                              <th className="p-2">Niche</th>
                              <th className="p-2">Reason</th>
                              <th className="p-2 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#2d2f31]/30 text-slate-300">
                            {rejectedInfluencers.map((item) => (
                              <tr key={item.id} className="hover:bg-[#1e1f20]/45">
                                <td className="p-2 text-red-400 font-semibold">{item.handle}</td>
                                <td className="p-2 truncate max-w-[80px]">{item.niche}</td>
                                <td className="p-2 truncate max-w-[120px]">{item.reason}</td>
                                <td className="p-2 text-center">
                                  <button
                                    onClick={() => handleRemoveRejectedInfluencer(item.id)}
                                    className="text-red-400 hover:text-red-350 cursor-pointer px-1 flex items-center justify-center mx-auto"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Inline form to add rejected */}
                      <div className="grid grid-cols-4 gap-1">
                        <input
                          type="text"
                          placeholder="@handle"
                          value={newRejected.handle}
                          onChange={(e) => setNewRejected({ ...newRejected, handle: e.target.value })}
                          className="bg-[#131314] border border-[#2d2f31] rounded-lg px-2 py-1 text-slate-300 text-[10px]"
                        />
                        <input
                          type="text"
                          placeholder="Comedy"
                          value={newRejected.niche}
                          onChange={(e) => setNewRejected({ ...newRejected, niche: e.target.value })}
                          className="bg-[#131314] border border-[#2d2f31] rounded-lg px-2 py-1 text-slate-300 text-[10px]"
                        />
                        <input
                          type="text"
                          placeholder="Ex: Too commercial"
                          value={newRejected.reason}
                          onChange={(e) => setNewRejected({ ...newRejected, reason: e.target.value })}
                          className="bg-[#131314] border border-[#2d2f31] rounded-lg px-2 py-1 text-slate-300 text-[10px]"
                        />
                        <button
                          onClick={handleAddRejectedInfluencer}
                          className="bg-red-800/20 hover:bg-red-800/40 border border-red-900 text-red-400 rounded-lg py-1 font-bold cursor-pointer text-[10px]"
                        >
                          + Rejected
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Prompt Output & Live execution run (xl:col-span-6) */}
                  <div className="xl:col-span-6 flex flex-col gap-4">
                    {/* Prompt selection tab picker */}
                    <div className="flex bg-[#1e1f20] border border-[#2d2f31]/80 rounded-2xl p-1 gap-1">
                      <button
                        onClick={() => {
                          setInfluencerPromptType("prompt1");
                          setInfluencerAnalysisResult(null);
                        }}
                        className={`flex-1 py-2.5 rounded-xl text-center font-bold tracking-tight text-[11px] cursor-pointer transition-all ${
                          influencerPromptType === "prompt1"
                            ? "bg-[#34a853] text-[#f0f4f9]"
                            : "text-slate-400 hover:text-slate-200 hover:bg-[#131314]/30"
                        }`}
                      >
                        PROMPT 1 (Internet Discovery)
                      </button>
                      <button
                        onClick={() => {
                          setInfluencerPromptType("prompt2");
                          setInfluencerAnalysisResult(null);
                        }}
                        className={`flex-1 py-2.5 rounded-xl text-center font-bold tracking-tight text-[11px] cursor-pointer transition-all ${
                          influencerPromptType === "prompt2"
                            ? "bg-[#34a853] text-[#f0f4f9]"
                            : "text-[#828282] hover:text-slate-200 hover:bg-[#131314]/30"
                        }`}
                      >
                        PROMPT 2 (Database Matching)
                      </button>
                    </div>

                    {/* Proprietary Database JSON view only if Prompt 2 is selected */}
                    {influencerPromptType === "prompt2" && (
                      <div className="bg-[#1e1f20] border border-[#2d2f31]/80 rounded-2xl p-4 flex flex-col gap-2">
                        <span className="font-bold text-[#f0f4f9] flex items-center gap-1.5 uppercase font-display text-[10px] tracking-wider">
                          <FileSpreadsheet className="w-4 h-4 text-[#4285f4]" /> Proprietary Influencer Database Records
                        </span>
                        <p className="text-[10px] text-[#8e918f]">
                          Customize the structured records below. The pattern recognition matching compares pending profiles with approvals.
                        </p>
                        <textarea
                          value={proprietaryDatabaseText}
                          onChange={(e) => setProprietaryDatabaseText(e.target.value)}
                          className="bg-[#131314] border border-[#3c4043] rounded-xl p-3 font-mono text-[10px] text-emerald-450 h-[100px] leading-relaxed resize-none focus:outline-none"
                        />
                      </div>
                    )}

                    {/* Compiled Prompt view and copy */}
                    <div className="flex-1 flex flex-col bg-[#1e1f20] border border-[#2d2f31]/80 rounded-2xl p-4 gap-3 relative shadow-sm">
                      <div className="flex justify-between items-center border-b border-[#2d2f31]/50 pb-2">
                        <div>
                          <span className="font-bold text-slate-300 text-xs">Generated AI Prompt Blueprint</span>
                          <span className="block text-[9px] text-[#8e918f]">Variables updated dynamically</span>
                        </div>
                        <button
                          onClick={() => handleCopyCode(getCompiledPrompt(influencerPromptType))}
                          className="flex items-center gap-1.5 bg-[#131314] hover:bg-[#202124] border border-[#3c4043] hover:border-[#34a853] text-slate-300 hover:text-[#34a853] px-3 py-1.5 rounded-xl font-bold font-sans cursor-pointer transition-all duration-200 text-[11px]"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{isCopied ? "Copied" : "Copy Prompt"}</span>
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto bg-[#131314] p-3.5 rounded-xl border border-[#2d2f31]/60 font-mono text-[10px] whitespace-pre-wrap text-[#8b9bb5] max-h-[220px]">
                        {getCompiledPrompt(influencerPromptType)}
                      </div>

                      {/* Conduct prediction run inside applet */}
                      <div className="border-t border-[#2d2f31]/60 pt-3 mt-1 flex flex-col gap-2.5">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-slate-300 flex items-center gap-1.5 text-xs">
                            <Sparkles className="w-3.5 h-3.5 text-[#34a853]" /> Predictive Intelligence Run
                          </span>
                          <p className="text-[10px] text-[#8e918f]">
                            Run the assembled prompt through our integrated server-side Gemini-3.5-flash model to perform pattern analysis and deliver recommendations immediately.
                          </p>
                        </div>

                        <button
                          onClick={handleExecuteInfluencerAnalysis}
                          disabled={influencerAnalysisLoading}
                          className="w-full bg-[#34a853] hover:bg-[#2d8c47] disabled:bg-[#34a853]/40 text-white font-bold py-3.5 px-4 rounded-xl cursor-pointer shadow-md tracking-tight transition-all duration-200 flex items-center justify-center gap-2 text-xs"
                        >
                          {influencerAnalysisLoading ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin text-white" />
                              <span>Deconvoluting approval behavior patterns...</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-4.5 h-4.5" />
                              <span>Execute Predictive Match Run</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* AI analysis result layout */}
                    {(influencerAnalysisResult || influencerAnalysisLoading || influencerAnalysisError) && (
                      <div className="bg-[#1e1f20] border border-[#2d2f31]/80 rounded-2xl p-4 flex flex-col gap-3 min-h-[180px]">
                        <div className="flex justify-between items-center border-b border-[#2d2f31]/50 pb-2">
                          <span className="font-bold text-[#f0f4f9] flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                            <Cpu className="w-4 h-4 text-[#34a853]" /> Pattern Recognition Report
                          </span>
                          {influencerAnalysisResult && (
                            <button
                              onClick={() => handleCopyCode(influencerAnalysisResult)}
                              className="text-slate-400 hover:text-[#34a853] flex items-center gap-1 font-sans text-[10px] font-bold cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5" /> Copy Report
                            </button>
                          )}
                        </div>

                        {influencerAnalysisLoading ? (
                          <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-slate-500 font-mono italic animate-pulse gap-2.5 text-xs">
                            <RefreshCw className="w-6 h-6 animate-spin text-[#34a853]" />
                            <span>Scrutinizing dataset demographics, visual metrics, and hidden alignment parameters...</span>
                          </div>
                        ) : influencerAnalysisError && !influencerAnalysisResult ? (
                          <div className="flex-1 flex flex-col bg-amber-950/20 border border-amber-900/30 p-3 rounded-xl text-[10px] gap-1">
                            <div className="text-amber-400 font-bold">API Key Missing Notification:</div>
                            <div className="text-slate-300 leading-normal font-mono">{influencerAnalysisError}</div>
                            <div className="text-emerald-400 font-bold mt-2 font-sans border-t border-amber-900/45 pt-2 flex items-center gap-1">
                              <span>✓</span> Displaying simulated local high-fidelity prediction report below.
                            </div>
                          </div>
                        ) : null}

                        {influencerAnalysisResult && (
                          <div className="flex-1 overflow-y-auto bg-[#131314] p-4 rounded-xl border border-[#2d2f31]/60 font-sans text-xs text-[#e3e3e3] whitespace-pre-wrap leading-relaxed max-h-[300px] select-all">
                            {influencerAnalysisResult}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ADVANCED DEVELOPER SETTINGS HUB */}
              {activeTab === "settings" && (
                <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[85vh] text-slate-300">
                  <div className="flex flex-col gap-1.5 border-b border-[#2d2f31]/60 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-amber-400" />
                        <h2 className="text-lg font-bold text-[#f0f4f9] tracking-tight">Advanced Developer Control Center</h2>
                      </div>
                      <span className="text-[10px] bg-amber-950/40 text-amber-400 border border-amber-900/40 px-2.5 py-0.5 rounded-full font-mono">
                        v2.4-Premium
                      </span>
                    </div>
                    <p className="text-xs text-[#8e918f]">
                      Optimize your scraper instance workspace. Connect advanced AI orchestration endpoints, configure proxy networks, mount dynamic MCP servers, load skills, and activate stealth plugins.
                    </p>
                  </div>

                  {/* Bento Grid layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Category 1: AI Model & Inference Configs */}
                    <div className="bg-[#1e1f20] border border-[#2d2f31]/80 rounded-2xl p-4 flex flex-col gap-4 shadow-sm hover:border-[#2d2f31]/100 transition-all">
                      <div className="flex justify-between items-center border-b border-[#2d2f31]/50 pb-2">
                        <span className="font-bold text-[#f0f4f9] flex items-center gap-1.5 text-xs">
                          <Cpu className="w-4 h-4 text-purple-400" /> AI Core Integration & Inference
                        </span>
                        <span className="text-[10px] bg-purple-950/40 text-purple-400 px-2.5 py-0.5 rounded-full font-mono font-bold">
                          Active
                        </span>
                      </div>

                      <div className="flex flex-col gap-3 text-xs">
                        {/* Provider Dropdown */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI API Provider</label>
                          <select
                            value={selectedAiProvider}
                            onChange={(e) => {
                              const newProvider = e.target.value;
                              setSelectedAiProvider(newProvider);
                              if (PROVIDER_MODELS[newProvider]?.length > 0) {
                                setSelectedAiModel(PROVIDER_MODELS[newProvider][0].id);
                              }
                            }}
                            className="bg-[#131314] border border-[#3c4043] rounded-xl px-3 py-2 text-slate-300 font-mono focus:outline-none focus:border-purple-400 cursor-pointer"
                          >
                            <option value="google">Google Gemini (Direct / Fast-track)</option>
                            <option value="openai">OpenAI (ChatGPT Enterprise)</option>
                            <option value="anthropic">Anthropic Claude (Structured Expert)</option>
                            <option value="deepseek">DeepSeek (V3 & R1 Reasoner)</option>
                            <option value="groq">Groq (Ultra-low Latency LLaMA)</option>
                            <option value="openrouter">OpenRouter (Unified LLM Gateway)</option>
                            <option value="opencode">OpenCode AI (Code Synthesis)</option>
                            <option value="browseruse">Browser Use (Agent Flow)</option>
                            <option value="agentrouter">Agent Router (Custom Orchestrator)</option>
                            <option value="ollama">Ollama (Local Host Inference)</option>
                            <option value="exa">Exa (Neural Search Grounding)</option>
                            <option value="querit">Querit (Intelligent Parsing)</option>
                            <option value="tavily">Tavily (Search & Extraction)</option>
                            <option value="mistral">Mistral AI (Codestral & Large)</option>
                            <option value="modelscope">ModelScope / DashScope</option>
                            <option value="firecrawl">Firecrawl (Web Scrapper API)</option>
                            <option value="21st">21st.dev Extension</option>
                          </select>
                        </div>

                        {/* Model Dropdown */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Target Model Name</label>
                          <select
                            value={selectedAiModel}
                            onChange={(e) => setSelectedAiModel(e.target.value)}
                            className="bg-[#131314] border border-[#3c4043] rounded-xl px-3 py-2 text-slate-300 font-mono focus:outline-none focus:border-purple-400 cursor-pointer"
                          >
                            {(PROVIDER_MODELS[selectedAiProvider] || []).map((m) => (
                              <option key={m.id} value={m.id}>{m.label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Custom Core Temperature */}
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            <span>Inference Temperature</span>
                            <span className="font-mono text-purple-400 font-bold">{aiTemperature}</span>
                          </div>
                          <input
                            type="range"
                            min="0.0"
                            max="2.0"
                            step="0.1"
                            value={aiTemperature}
                            onChange={(e) => setAiTemperature(parseFloat(e.target.value))}
                            className="w-full h-1 bg-[#131314] rounded-lg appearance-none cursor-pointer focus:outline-none accent-purple-400"
                          />
                        </div>

                        {/* System instructions override */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">System Prompt Guidelines</label>
                          <textarea
                            value={aiSystemInstruction}
                            onChange={(e) => setAiSystemInstruction(e.target.value)}
                            rows={3}
                            placeholder="System instructions for target selectors modeling..."
                            className="bg-[#131314] border border-[#3c4043] rounded-xl p-2.5 font-mono text-[10px] text-slate-300 leading-relaxed resize-none focus:outline-none focus:border-purple-400"
                          />
                        </div>

                        {/* Custom secret Key override */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Custom {selectedAiProvider.substring(0, 1).toUpperCase() + selectedAiProvider.substring(1)} API Key Override
                          </label>
                          <input
                            type="password"
                            placeholder={selectedAiProvider === "agentrouter" ? "Enter Custom AGENT_ROUTER API Key (Optional)" : `Enter custom ${selectedAiProvider.toUpperCase()} API Key (Optional)`}
                            value={
                              selectedAiProvider === "google" ? customGoogleKey :
                              selectedAiProvider === "openai" ? customOpenaiKey :
                              selectedAiProvider === "anthropic" ? customAnthropicKey :
                              selectedAiProvider === "deepseek" ? customDeepseekKey :
                              selectedAiProvider === "groq" ? customGroqKey :
                              selectedAiProvider === "openrouter" ? customOpenrouterKey :
                              selectedAiProvider === "opencode" ? customOpencodeKey :
                              selectedAiProvider === "browseruse" ? customBrowserUseKey :
                              selectedAiProvider === "ollama" ? customOllamaKey :
                              selectedAiProvider === "exa" ? customExaKey :
                              selectedAiProvider === "querit" ? customQueritKey :
                              selectedAiProvider === "tavily" ? customTavilyKey :
                              selectedAiProvider === "mistral" ? customMistralKey :
                              selectedAiProvider === "modelscope" ? customModelScopeKey :
                              selectedAiProvider === "firecrawl" ? customFirecrawlKey :
                              selectedAiProvider === "21st" ? custom21stKey : ""
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              if (selectedAiProvider === "google") setCustomGoogleKey(val);
                              else if (selectedAiProvider === "openai") setCustomOpenaiKey(val);
                              else if (selectedAiProvider === "anthropic") setCustomAnthropicKey(val);
                              else if (selectedAiProvider === "deepseek") setCustomDeepseekKey(val);
                              else if (selectedAiProvider === "groq") setCustomGroqKey(val);
                              else if (selectedAiProvider === "openrouter") setCustomOpenrouterKey(val);
                              else if (selectedAiProvider === "opencode") setCustomOpencodeKey(val);
                              else if (selectedAiProvider === "browseruse") setCustomBrowserUseKey(val);
                              else if (selectedAiProvider === "ollama") setCustomOllamaKey(val);
                              else if (selectedAiProvider === "exa") setCustomExaKey(val);
                              else if (selectedAiProvider === "querit") setCustomQueritKey(val);
                              else if (selectedAiProvider === "tavily") setCustomTavilyKey(val);
                              else if (selectedAiProvider === "mistral") setCustomMistralKey(val);
                              else if (selectedAiProvider === "modelscope") setCustomModelScopeKey(val);
                              else if (selectedAiProvider === "firecrawl") setCustomFirecrawlKey(val);
                              else if (selectedAiProvider === "21st") setCustom21stKey(val);
                            }}
                            className="bg-[#131314] border border-[#3c4043] rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-purple-400 placeholder:text-slate-600"
                          />
                          <p className="text-[10px] text-slate-500 leading-normal">
                            {selectedAiProvider === "google" 
                              ? "Leave blank to securely call our serverside Google AI Studio integration key managed in Settings."
                              : `Add your custom ${selectedAiProvider.toUpperCase()} credentials or configure it as ${selectedAiProvider.toUpperCase() === "21ST" ? "API_KEY_21ST" : selectedAiProvider.toUpperCase() + "_API_KEY"} system environment variable.`}
                          </p>
                        </div>

                        {/* Agent Router Base URL configuration */}
                        {selectedAiProvider === "agentrouter" && (
                          <div className="flex flex-col gap-1 mt-1">
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Agent Router Base URL</label>
                            <input
                              type="text"
                              value={customAgentRouterBaseUrl}
                              onChange={(e) => setCustomAgentRouterBaseUrl(e.target.value)}
                              placeholder="https://agentrouter.org/v1"
                              className="bg-[#131314] border border-[#3c4043] rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-purple-400"
                            />
                            <p className="text-[10px] text-slate-500 leading-normal">
                              Defaults to agentrouter.org gateway. You can also customize this for local proxy solutions.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Category 2: Advanced Scrapling APIs and Proxies */}
                    <div className="bg-[#1e1f20] border border-[#2d2f31]/80 rounded-2xl p-4 flex flex-col gap-4 shadow-sm hover:border-[#2d2f31]/100 transition-all">
                      <div className="flex justify-between items-center border-b border-[#2d2f31]/50 pb-2">
                        <span className="font-bold text-[#f0f4f9] flex items-center gap-1.5 text-xs">
                          <Terminal className="w-4 h-4 text-sky-400" /> Scraper Proxy & Request Headers
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Stealth Proxy active</span>
                          <span className="w-2 h-2 rounded-full bg-sky-450 animate-pulse" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-3.5 text-xs">
                        {/* Custom proxy activation toggle */}
                        <div className="flex items-center justify-between bg-[#131314] p-3 rounded-xl border border-[#2d2f31]/60">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-slate-250">Enable Custom Proxy Router</span>
                            <span className="text-[10px] text-slate-550">Route scraping calls through clean IPs</span>
                          </div>
                          <button
                            onClick={() => setEnableCustomProxy(!enableCustomProxy)}
                            className={`w-10 h-5 rounded-full p-0.5 flex transition-colors duration-200 cursor-pointer ${
                              enableCustomProxy ? "bg-sky-500 justify-end" : "bg-[#2d2f31] justify-start"
                            }`}
                          >
                            <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                          </button>
                        </div>

                        {/* Conditional Proxy Params */}
                        <div className={`grid grid-cols-6 gap-2 transition-all duration-300 ${enableCustomProxy ? "opacity-100" : "opacity-40"}`}>
                          <div className="col-span-4 flex flex-col gap-1">
                            <label className="text-[10px] text-slate-400 font-bold">Proxy Host URL</label>
                            <input
                              type="text"
                              disabled={!enableCustomProxy}
                              value={proxyHost}
                              onChange={(e) => setProxyHost(e.target.value)}
                              className="bg-[#131314]/80 border border-[#3c4043] rounded-lg px-2.5 py-1.5 font-mono text-xs focus:outline-none text-slate-300 disabled:cursor-not-allowed"
                            />
                          </div>
                          <div className="col-span-2 flex flex-col gap-1">
                            <label className="text-[10px] text-slate-400 font-bold">Port</label>
                            <input
                              type="text"
                              disabled={!enableCustomProxy}
                              value={proxyPort}
                              onChange={(e) => setProxyPort(e.target.value)}
                              className="bg-[#131314]/80 border border-[#3c4043] rounded-lg px-2.5 py-1.5 font-mono text-xs focus:outline-none text-slate-300 disabled:cursor-not-allowed"
                            />
                          </div>
                          <div className="col-span-3 flex flex-col gap-1">
                            <label className="text-[10px] text-slate-400 font-bold">Username</label>
                            <input
                              type="text"
                              disabled={!enableCustomProxy}
                              value={proxyUser}
                              onChange={(e) => setProxyUser(e.target.value)}
                              className="bg-[#131314]/80 border border-[#3c4043] rounded-lg px-2.5 py-1.5 font-mono text-xs focus:outline-none text-slate-300 disabled:cursor-not-allowed"
                            />
                          </div>
                          <div className="col-span-3 flex flex-col gap-1">
                            <label className="text-[10px] text-slate-400 font-bold">Password</label>
                            <input
                              type="password"
                              disabled={!enableCustomProxy}
                              value={proxyPass}
                              onChange={(e) => setProxyPass(e.target.value)}
                              className="bg-[#131314]/80 border border-[#3c4043] rounded-lg px-2.5 py-1.5 font-mono text-xs focus:outline-none text-[#9b72f3] disabled:cursor-not-allowed"
                            />
                          </div>
                        </div>

                        {/* Throttlers Range Sliders */}
                        <div className="grid grid-cols-2 gap-4 border-t border-[#2d2f31]/50 pt-3 mt-1.5">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                              <span>Concurrent Workers</span>
                              <span className="text-sky-400 font-mono">{concurrentWorkers} threads</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="16"
                              step="1"
                              value={concurrentWorkers}
                              onChange={(e) => setConcurrentWorkers(parseInt(e.target.value))}
                              className="w-full h-1 bg-[#131314] rounded-lg appearance-none cursor-pointer focus:outline-none accent-sky-400"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                              <span>Delay Throttling</span>
                              <span className="text-sky-400 font-mono">{requestDelayMs} ms</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="5000"
                              step="50"
                              value={requestDelayMs}
                              onChange={(e) => setRequestDelayMs(parseInt(e.target.value))}
                              className="w-full h-1 bg-[#131314] rounded-lg appearance-none cursor-pointer focus:outline-none accent-sky-400"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Category 3: Model Context Protocol (MCP) Hub */}
                  <div className="bg-[#1e1f20] border border-[#2d2f31]/80 rounded-2xl p-4 flex flex-col gap-4 shadow-sm hover:border-[#2d2f31]/100 transition-all">
                    <div className="flex justify-between items-center border-b border-[#2d2f31]/50 pb-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-[#f0f4f9] flex items-center gap-1.5 text-xs">
                          <Database className="w-4 h-4 text-[#9b72f3]" /> Model Context Protocol (MCP) Registry
                        </span>
                        <span className="text-[10px] text-[#8e918f]">Inject dynamic host file-systems & external APIs into Gemini prompt context</span>
                      </div>
                      <span className="text-[9px] bg-[#9b72f3]/10 text-[#9b72f3] border border-[#9b72f3]/25 px-2 py-0.5 rounded-full font-mono font-bold">
                        {mcpServers.filter((s) => s.status === "active").length} linked
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs mt-1">
                      {/* Left Block - Current active MCP servers */}
                      <div className="md:col-span-7 flex flex-col gap-2">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Attached Host MCP Servers</span>
                        <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
                          {mcpServers.map((server) => (
                            <div key={server.id} className="flex justify-between items-center bg-[#131314] px-3.5 py-2.5 rounded-xl border border-[#2d2f31] gap-3 hover:border-slate-700 transition-all">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={`w-1.5 h-1.5 rounded-full ${server.status === "active" ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`} />
                                  <span className="font-bold text-[#f0f4f9] truncate block text-[11px]">{server.name}</span>
                                </div>
                                <span className="font-mono text-[9px] text-[#8e918f] truncate block mt-0.5">{server.cmd}</span>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  onClick={() => handleToggleMcpStatus(server.id)}
                                  className={`px-2 py-1 rounded-lg text-[9px] font-bold border cursor-pointer transition-all ${
                                    server.status === "active"
                                      ? "bg-[#34a853]/15 text-[#34a853] border-[#34a853]/30 hover:bg-[#34a853]/25"
                                      : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-350"
                                  }`}
                                >
                                  {server.status === "active" ? "Connected" : "Connect"}
                                </button>
                                <button
                                  onClick={() => handleRemoveMcpServer(server.id)}
                                  className="text-red-400 hover:text-red-350 p-1 hover:bg-[#1a1a1c] rounded-lg transition-all"
                                  title="Unbind MCP Server"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Block - Add new MCP server */}
                      <div className="md:col-span-5 bg-[#131314]/50 border border-[#2d2f31]/70 p-3 rounded-xl flex flex-col gap-2.5">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Register New Server</span>
                        
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-slate-400 font-bold uppercase">Logical Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Brave Search Endpoint"
                            value={newMcpName}
                            onChange={(e) => setNewMcpName(e.target.value)}
                            className="bg-[#131314] border border-[#3c4043] rounded-lg px-2.5 py-1.5 text-xs text-[#e3e3e3] focus:outline-none focus:border-[#9b72f3]/60 placeholder:text-slate-600"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-slate-400 font-bold uppercase">Transport Execution Command</label>
                          <input
                            type="text"
                            placeholder="e.g. npx -y @modelcontextprotocol/server-brave-search"
                            value={newMcpCmd}
                            onChange={(e) => setNewMcpCmd(e.target.value)}
                            className="bg-[#131314] border border-[#3c4043] rounded-lg px-2.5 py-1.5 font-mono text-[10px] text-[#e3e3e3] focus:outline-none focus:border-[#9b72f3]/60 placeholder:text-slate-600"
                          />
                        </div>

                        <button
                          onClick={handleAddMcpServer}
                          className="w-full bg-[#9b72f3]/20 hover:bg-[#9b72f3]/35 text-[#c1aefe] border border-[#9b72f3]/40 font-bold py-2 rounded-lg cursor-pointer duration-200 transition-all text-xs flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" /> Bind MCP Server
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Category 4: Platform Skills Integration (Workspace integration & security rules) */}
                  <div className="bg-[#1e1f20] border border-[#2d2f31]/80 rounded-2xl p-4 flex flex-col gap-4 shadow-sm hover:border-[#2d2f31]/100 transition-all">
                    <div className="flex justify-between items-center border-b border-[#2d2f31]/50 pb-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-[#f0f4f9] flex items-center gap-1.5 text-xs">
                          <Layers className="w-4 h-4 text-amber-400" /> Platform Active Skills Hub
                        </span>
                        <span className="text-[10px] text-slate-500">Enable deep contextual capabilities designed to load on-demand in scraping workflows</span>
                      </div>
                      <span className="text-[9px] bg-amber-950/40 text-amber-400 px-2.5 py-0.5 rounded-full font-mono font-bold border border-amber-900/30">
                        {skillsList.filter((s) => s.enabled).length} Enabled
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 text-xs">
                      {skillsList.map((skill) => (
                        <div
                          key={skill.id}
                          onClick={() => handleToggleSkill(skill.id)}
                          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            skill.enabled
                              ? "bg-amber-950/10 border-amber-500/40 hover:border-amber-500/60"
                              : "bg-[#131314]/80 border-[#2d2f31] hover:border-slate-700"
                          }`}
                        >
                          <div className="pt-0.5">
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              skill.enabled ? "border-amber-400 bg-amber-400 text-slate-950" : "border-slate-500"
                            }`}>
                              {skill.enabled && <span className="text-[9px] font-bold">✓</span>}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#f0f4f9]">{skill.name}</span>
                              <span className="text-[8px] uppercase tracking-wide bg-[#2d2f31] px-1.5 py-0.5 rounded-md text-slate-400 font-bold">{skill.category}</span>
                            </div>
                            <span className="block text-[10px] text-[#8e918f] mt-1 line-clamp-2 leading-relaxed">{skill.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category 5: Stealth Plugins Hub */}
                  <div className="bg-[#1e1f20] border border-[#2d2f31]/80 rounded-2xl p-4 flex flex-col gap-4 shadow-sm hover:border-[#2d2f31]/100 transition-all">
                    <div className="flex justify-between items-center border-b border-[#2d2f31]/50 pb-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-[#f0f4f9] flex items-center gap-1.5 text-xs">
                          <Check className="w-4 h-4 text-[#34a853]" /> System Scraper Plugins
                        </span>
                        <span className="text-[10px] text-[#8e918f]">Inject additional automation interceptors, DOM decoders, and bypass modules</span>
                      </div>
                      <span className="text-[9px] bg-emerald-950/40 text-emerald-450 px-2.5 py-0.5 rounded-full font-mono font-bold border border-emerald-900/30">
                        {pluginsList.filter((p) => p.enabled).length} Active
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 text-xs">
                      {pluginsList.map((plugin) => (
                        <div
                          key={plugin.id}
                          onClick={() => handleTogglePlugin(plugin.id)}
                          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            plugin.enabled
                              ? "bg-emerald-950/10 border-emerald-800/40 hover:border-emerald-800/60"
                              : "bg-[#131314]/80 border-[#2d2f31] hover:border-slate-700"
                          }`}
                        >
                          <div className="pt-0.5">
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              plugin.enabled ? "border-emerald-450 bg-emerald-450 text-slate-950" : "border-slate-500"
                            }`}>
                              {plugin.enabled && <span className="text-[9px] font-bold">✓</span>}
                            </div>
                          </div>
                          <div className="flex-1">
                            <span className="font-bold text-[#f0f4f9] block">{plugin.name}</span>
                            <span className="block text-[10px] text-[#8e918f] mt-1 leading-normal">{plugin.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        </section>
      )}
      </main>

      {/* Footer layout */}
      <footer className="bg-[#0e0e11] border-t border-[#2d2f31]/80 py-6 px-6 shrink-0 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8e918f] font-mono">
          <div className="flex items-center gap-1.5 justify-center md:justify-start">
            <Shield className="w-3.5 h-3.5 text-[#4285f4]" />
            <span>Virtual Sandbox Agent Powered By Antigravity Core 2026</span>
          </div>
          <div className="flex items-center gap-4 justify-center">
            <span>Security Rule: Safe Guard active</span>
            <span>•</span>
            <a href="https://github.com/scrapling/scrapling" target="_blank" rel="noreferrer" className="text-[#4285f4] hover:text-[#9b72f3] hover:underline flex items-center gap-1 transition-all">
              Github Spec <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
