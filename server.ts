import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini API Client
const geminiApiKey = process.env.GEMINI_API_KEY || "";
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// User-Agent database spoofing Scrapling impersonate fingerprints
const USER_AGENTS: Record<string, string> = {
  chrome: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  firefox: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
  safari: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Safari/605.1.15",
  edge: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0",
  safari_ios: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Mobile/15E148 Safari/605.1.15",
};

// Rich Sandboxed Offline Presets for smooth and instantaneous testing
const PRESENTS: Record<string, { title: string; url: string; html: string }> = {
  hackernews: {
    title: "Hacker News",
    url: "https://news.ycombinator.com",
    html: `
      <table id="hnmain" border="0" cellpadding="0" cellspacing="0" width="85%" bgcolor="#f6f6ef">
        <tr>
          <td bgcolor="#ff6600">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding:2px">
              <tr>
                <td style="width:18px;padding-right:4px">
                  <a href="https://news.ycombinator.com"><img src="y18.svg" width="18" height="18" style="border:1px white solid;"></a>
                </td>
                <td style="line-height:12pt; height:10px;">
                  <span class="pagetop"><b class="hnname"><a href="news">Hacker News</a></b>
                    <a href="newest">new</a> | <a href="front">past</a> | <a href="newcomments">comments</a> | <a href="ask">ask</a> | <a href="show">show</a> | <a href="jobs">jobs</a> | <a href="submit">submit</a>
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr style="height:10px"></tr>
        <tr>
          <td>
            <table border="0" cellpadding="0" cellspacing="0" class="itemlist">
              <tr class='athing' id='290011'>
                <td align="right" valign="top" class="title"><span class="rank">1.</span></td>
                <td valign="top" class="votelinks"><center><a id='up_290011' href='vote?id=290011'><div class='votearrow' title='upvote'></div></a></center></td>
                <td class="title"><span class="titleline"><a href="https://github.com/scrapling/scrapling" class="storylink">Scrapling: The ultimate web scraping bypass engine with active browser fingerprints</a><span class="sitebit comhead"> (<a href="from?site=github.com/scrapling"><span class="sitestr">github.com/scrapling</span></a>)</span></span></td>
              </tr>
              <tr>
                <td colspan="2"></td>
                <td class="subtext"><span class="score" id="score_290011">342 points</span> by <a href="user?id=python_dev" class="hnuser">python_dev</a> <span class="age" title="2026-06-09T08:00:00"><a href="item?id=290011">2 hours ago</a></span> | <a href="hide?id=290011">hide</a> | <a href="item?id=290011">128 comments</a></td>
              </tr>
              <tr style="height:5px"></tr>
              <tr class='athing' id='290022'>
                <td align="right" valign="top" class="title"><span class="rank">2.</span></td>
                <td valign="top" class="votelinks"><center><a id='up_290022' href='vote?id=290022'><div class='votearrow' title='upvote'></div></a></center></td>
                <td class="title"><span class="titleline"><a href="https://google.com/deepmind" class="storylink">Solving complex coding benchmarks with Gemini-3.5 and Antigravity agents</a><span class="sitebit comhead"> (<a href="from?site=google.com"><span class="sitestr">google.com/deepmind</span></a>)</span></span></td>
              </tr>
              <tr>
                <td colspan="2"></td>
                <td class="subtext"><span class="score" id="score_290022">189 points</span> by <a href="user?id=deepmind_fan" class="hnuser">deepmind_fan</a> <span class="age" title="2026-06-09T07:15:00"><a href="item?id=290022">3 hours ago</a></span> | <a href="hide?id=290022">hide</a> | <a href="item?id=290022">45 comments</a></td>
              </tr>
              <tr style="height:5px"></tr>
              <tr class='athing' id='290033'>
                <td align="right" valign="top" class="title"><span class="rank">3.</span></td>
                <td valign="top" class="votelinks"><center><a id='up_290033' href='vote?id=290033'><div class='votearrow' title='upvote'></div></a></center></td>
                <td class="title"><span class="titleline"><a href="https://vitejs.dev" class="storylink">Vite 6 launch: Faster bundling and ESM first design philosophies</a><span class="sitebit comhead"> (<a href="from?site=vitejs.dev"><span class="sitestr">vitejs.dev</span></a>)</span></span></td>
              </tr>
              <tr>
                <td colspan="2"></td>
                <td class="subtext"><span class="score" id="score_290033">95 points</span> by <a href="user?id=vite_coder" class="hnuser">vite_coder</a> <span class="age" title="2026-06-09T06:30:00"><a href="item?id=290033">4 hours ago</a></span> | <a href="hide?id=290033">hide</a> | <a href="item?id=290033">18 comments</a></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
  },
  wikipedia: {
    title: "Wikipedia: Web Scraping",
    url: "https://en.wikipedia.org/wiki/Web_scraping",
    html: `
      <div id="content" class="mw-body" role="main">
        <h1 id="firstHeading" class="firstHeading mw-first-heading">Web scraping</h1>
        <div id="bodyContent" class="vector-body">
          <div id="mw-content-text" class="mw-body-content mw-content-ltr" lang="en" dir="ltr">
            <table class="infobox vevent" style="width:22em">
              caption class="infobox-title summary">Web Scraping Extraction</caption>
              <tbody>
                <tr>
                  <th scope="row" class="infobox-label">Type</th>
                  <td class="infobox-data">Data extraction, Web harvesting</td>
                </tr>
                <tr>
                  <th scope="row" class="infobox-label">Initial release</th>
                  <td class="infobox-data">Early 1990s</td>
                </tr>
                <tr>
                  <th scope="row" class="infobox-label">Target protocols</th>
                  <td class="infobox-data">HTTP, HTTPS, FTP</td>
                </tr>
              </tbody>
            </table>
            <p>
              <b>Web scraping</b>, <b>web harvesting</b>, or <b>web data extraction</b> is data scraping used for extracting data from websites. 
              Web scraping software may access the World Wide Web directly using the Hypertext Transfer Protocol or through a web browser. 
              While web scraping can be done manually by a software user, the term typically refers to automated processes implemented using a bot or web crawler.
            </p>
            <h2>Techniques</h2>
            <ul>
              <li><strong>Human copy-and-paste:</strong> The simplest form of web scraping is manually copying and pasting data from a web page into a text file.</li>
              <li><strong>Text pattern matching:</strong> A simple yet powerful approach based on standard UNIX grep command or regular expressions.</li>
              <li><strong>DOM parsing:</strong> By embedding a full browser or leveraging library engines (like Scrapling) to query CSS/Xpath selectors.</li>
            </ul>
          </div>
        </div>
      </div>
    `,
  },
  ecommerce: {
    title: "GadgetWorld Storefront",
    url: "https://gadgetworld-example.store/products",
    html: `
      <div class="store-container">
        <header class="store-header">
          <h1 class="brand">GadgetWorld Store</h1>
          <span class="tagline">The most innovative dev tools & setups on the web</span>
        </header>
        <div class="product-grid">
          <div class="product-card" data-id="101" style="border: 1px solid #e1e1e1; padding: 15px; border-radius: 8px;">
            <img class="product-image" src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200" alt="Keyboard" />
            <h3 class="product-title"><a href="/products/cyber-board">Aura Mech Classic V2</a></h3>
            <span class="product-tag">Best Seller</span>
            <div class="pricing-panel">
              <span class="price-origin">$189.00</span>
              <span class="price-discount">$149.99</span>
            </div>
            <div class="rating">
              <span class="stars">★★★★★</span>
              <span class="review-count">(142 reviews)</span>
            </div>
            <button class="add-to-cart-btn">Add to Cart</button>
          </div>
          <div class="product-card" data-id="102" style="border: 1px solid #e1e1e1; padding: 15px; border-radius: 8px;">
            <img class="product-image" src="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200" alt="Mouse" />
            <h3 class="product-title"><a href="/products/ergo-mouse">ErgoGlide Zero-Gravity Coding Mouse</a></h3>
            <span class="product-tag">Ergonomic</span>
            <div class="pricing-panel">
              <span class="price-discount">$79.99</span>
            </div>
            <div class="rating">
              <span class="stars">★★★★☆</span>
              <span class="review-count">(58 reviews)</span>
            </div>
            <button class="add-to-cart-btn">Add to Cart</button>
          </div>
          <div class="product-card" data-id="103" style="border: 1px solid #e1e1e1; padding: 15px; border-radius: 8px;">
            <img class="product-image" src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200" alt="Headphones" />
            <h3 class="product-title"><a href="/products/noise-shield">Acoustic Shield Pro Headset</a></h3>
            <span class="product-tag">Active ANC</span>
            <div class="pricing-panel">
              <span class="price-origin">$299.00</span>
              <span class="price-discount">$245.00</span>
            </div>
            <div class="rating">
              <span class="stars">★★★★★</span>
              <span class="review-count">(312 reviews)</span>
            </div>
            <button class="add-to-cart-btn">Add to Cart</button>
          </div>
        </div>
      </div>
    `,
  },
};

// Simple helper to clean HTML tags into clean Markdown format
function convertHtmlToMarkdown(html: string): string {
  // Strip head, style, script, SVG elements
  let md = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "")
    .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, "");

  // Basic tags conversions
  md = md
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "\n# $1\n")
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n## $1\n")
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n### $1\n")
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**")
    .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, "**$1**")
    .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "*$1*")
    .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, "*$1*")
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "\n$1\n")
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "\n- $1")
    .replace(/<a\s+[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)")
    .replace(/<img\s+[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, "![$2]($1)")
    .replace(/<img\s+[^>]*src="([^"]*)"[^>]*>/gi, "![]( $1 )")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<div[^>]*>/gi, "\n")
    .replace(/<\/div>/gi, "\n");

  // Remove any remaining HTML tags
  md = md.replace(/<[^>]*>/g, "");

  // Clean empty lines
  return md
    .split("\n")
    .map((line) => line.trim())
    .filter((line, i, arr) => line !== "" || (arr[i - 1] !== "" && i > 0))
    .join("\n");
}

// Simple plain text cleaner
function convertHtmlToText(html: string): string {
  const clean = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, " ");
  return clean
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .join("\n")
    .replace(/\s+/g, " ");
}

// Clean triple backtick markdown wrappers for secure JSON extraction
function cleanJsonOutput(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```/, "");
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.replace(/```$/, "");
  }
  return cleaned.trim();
}

// Universal AI Core Multiplexer supporting Google Gemini, OpenAI, Claude, DeepSeek, Groq and OpenRouter
// Universal AI Core Multiplexer supporting Google Gemini, Anthropic, OpenAI, DeepSeek, Groq, OpenRouter, Mistral, Ollama, Firecrawl, and more!
async function executeAIPipe({
  provider,
  model,
  temperature,
  systemInstruction,
  messages,
  customApiKey,
  jsonMode,
  jsonSchema,
  agentRouterBaseUrl,
}: {
  provider: string;
  model: string;
  temperature?: number;
  systemInstruction?: string;
  messages: { role: string; content: string }[];
  customApiKey?: string;
  jsonMode?: boolean;
  jsonSchema?: any;
  agentRouterBaseUrl?: string;
}): Promise<string> {
  const normProvider = (provider || "google").toLowerCase();
  const normModel = model || "gemini-3.5-flash";

  if (normProvider === "google") {
    const apiKey = customApiKey || process.env.GEMINI_API_KEY || "";
    if (!apiKey) {
      throw new Error("Google Gemini API Key is missing. Please enter your API key in the Settings/Secrets panel.");
    }
    const localAi = new GoogleGenAI({ apiKey });
    
    const contents = messages.map(m => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const config: any = {
      temperature: temperature,
    };
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }
    if (jsonMode) {
      config.responseMimeType = "application/json";
      if (jsonSchema) {
        config.responseSchema = jsonSchema;
      }
    }

    const response = await localAi.models.generateContent({
      model: normModel,
      contents,
      config,
    });

    return response.text || "";
  }

  // Anthropic Claude Integration (uses custom format)
  if (normProvider === "anthropic") {
    const apiKey = customApiKey || process.env.ANTHROPIC_API_KEY || "";
    if (!apiKey) {
      throw new Error("Anthropic Claude API Key is missing. Please supply a custom API key under Settings or set ANTHROPIC_API_KEY.");
    }

    const formattedMessages = messages.map(m => {
      const r = m.role === "model" ? "assistant" : m.role;
      return { role: r === "system" ? "user" : r, content: m.content };
    });

    const body: any = {
      model: normModel,
      messages: formattedMessages,
      max_tokens: 4096,
      temperature: temperature !== undefined ? Math.min(temperature, 1.0) : undefined,
    };

    if (systemInstruction) {
      body.system = systemInstruction;
    }

    if (jsonMode) {
      if (body.system) {
        body.system += "\n\nCRITICAL: You must return valid, parseable JSON code. Do not wrap output in markdown codeblocks. Your complete output must be the raw JSON text.";
      } else {
        body.system = "CRITICAL: You must return valid, parseable JSON code. Do not wrap output in markdown codeblocks. Your complete output must be the raw JSON text.";
      }
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorJson;
      try { errorJson = JSON.parse(errorText); } catch { }
      const errMsg = errorJson?.error?.message || errorText || `HTTP ${res.status}`;
      throw new Error(`Anthropic API error: ${errMsg}`);
    }

    const resJson = await res.json() as any;
    return resJson?.content?.[0]?.text || "";
  }

  // Setup standard OpenAI-compatible proxies / configurations
  const openAiCompatibleProviders: Record<string, { endpoint: string; envKeyName: string }> = {
    openai: { endpoint: "https://api.openai.com/v1/chat/completions", envKeyName: "OPENAI_API_KEY" },
    deepseek: { endpoint: "https://api.deepseek.com/v1/chat/completions", envKeyName: "DEEPSEEK_API_KEY" },
    groq: { endpoint: "https://api.groq.com/openai/v1/chat/completions", envKeyName: "GROQ_API_KEY" },
    openrouter: { endpoint: "https://openrouter.ai/api/v1/chat/completions", envKeyName: "OPENROUTER_API_KEY" },
    opencode: { endpoint: "https://api.opencode.ai/v1/chat/completions", envKeyName: "OPENCODE_API_KEY" },
    browseruse: { endpoint: "https://api.browseruse.com/v1/chat/completions", envKeyName: "BROWSER_USE_API_KEY" },
    ollama: { endpoint: "http://localhost:11434/v1/chat/completions", envKeyName: "OLLAMA_API_KEY" },
    exa: { endpoint: "https://api.exa.ai/chat/completions", envKeyName: "EXA_API_KEY" },
    querit: { endpoint: "https://api.querit.ai/v1/chat/completions", envKeyName: "QUERIT_API_KEY" },
    tavily: { endpoint: "https://api.tavily.com/chat/completions", envKeyName: "TAVILY_API_KEY" },
    mistral: { endpoint: "https://api.mistral.ai/v1/chat/completions", envKeyName: "MISTRAL_API_KEY" },
    modelscope: { endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", envKeyName: "MODELSCOPE_API_KEY" },
    firecrawl: { endpoint: "https://api.firecrawl.dev/v1/chat/completions", envKeyName: "FIRECRAWL_API_KEY" },
    "21st": { endpoint: "https://api.21st.dev/v1/chat/completions", envKeyName: "API_KEY_21ST" },
  };

  if (normProvider === "agentrouter" || openAiCompatibleProviders[normProvider]) {
    let endpoint = "";
    let envKeyName = "";

    if (normProvider === "agentrouter") {
      let baseUrl = agentRouterBaseUrl || process.env.AGENT_ROUTER_BASE_URL || "https://agentrouter.org/v1";
      if (baseUrl.endsWith("/")) {
        baseUrl = baseUrl.slice(0, -1);
      }
      endpoint = `${baseUrl}/chat/completions`;
      envKeyName = "OPENROUTER_API_KEY"; // Default key fallback or custom
    } else {
      const config = openAiCompatibleProviders[normProvider];
      endpoint = config.endpoint;
      envKeyName = config.envKeyName;
    }

    // Attempt to load API Key from custom override, target env key, or fallback 21st naming key
    let apiKey = customApiKey || process.env[envKeyName] || "";
    if (!apiKey && envKeyName === "API_KEY_21ST") {
      apiKey = process.env["21ST_API_KEY"] || "";
    }

    // For Ollama or custom local AgentRouter proxies, API Key can be empty. For others, demand it if not set.
    if (!apiKey && normProvider !== "ollama" && normProvider !== "agentrouter") {
      throw new Error(`${provider.toUpperCase()} API Key (${envKeyName}) is missing. Please supply a custom API key under Settings/Secrets or configure it in your workspace environment.`);
    }

    const formattedMessages: any[] = [];
    if (systemInstruction) {
      formattedMessages.push({ role: "system", content: systemInstruction });
    }
    messages.forEach(m => {
      const r = m.role === "model" ? "assistant" : m.role;
      formattedMessages.push({ role: r, content: m.content });
    });

    const body: any = {
      model: normModel,
      messages: formattedMessages,
      temperature: normModel === "deepseek-reasoner" ? undefined : temperature,
    };

    if (jsonMode && normModel !== "deepseek-reasoner") {
      body.response_format = { type: "json_object" };
      formattedMessages.push({
        role: "system",
        content: "CRITICAL: You must return valid, parseable JSON code. Do not wrap output in markdown codeblocks (e.g. ```json). Your complete output must be the raw JSON text."
      });
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    // Append standard metadata for OpenRouter/AgentRouter
    if (normProvider === "openrouter" || normProvider === "agentrouter") {
      headers["HTTP-Referer"] = "https://ai.studio";
      headers["X-Title"] = "Web Scraper Lab Multiplexer";
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorJson;
      try { errorJson = JSON.parse(errorText); } catch { }
      const errMsg = errorJson?.error?.message || errorText || `HTTP ${res.status}`;
      throw new Error(`${provider.toUpperCase()} API error: ${errMsg}`);
    }

    const resJson = await res.json() as any;
    return resJson?.choices?.[0]?.message?.content || "";
  }

  throw new Error(`Unsupported AI Model Provider: ${provider}`);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));

  // API router check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", geminiConfigured: !!ai });
  });

  // Proxy Scraper Endpoint matching Scrapling simulator specs
  app.post("/api/scrape", async (req, res) => {
    const {
      url,
      extraction_type = "markdown",
      impersonate = "chrome",
      main_content_only = true,
      css_selector = null,
      headers = {},
      cookies = {},
      timeout = 30,
      follow_redirects = "safe",
    } = req.body;

    if (!url) {
      return res.status(400).json({ error: "Target URL is required." });
    }

    const startTime = Date.now();

    // Check if the URL requests a preset site we have mocked offline for standard sandboxed learning
    let matchingPresetKey = "";
    if (url.includes("news.ycombinator.com")) matchingPresetKey = "hackernews";
    else if (url.includes("wikipedia.org")) matchingPresetKey = "wikipedia";
    else if (url.includes("gadgetworld") || url.includes("store-example")) matchingPresetKey = "ecommerce";

    if (matchingPresetKey && PRESENTS[matchingPresetKey]) {
      const presetData = PRESENTS[matchingPresetKey];
      let finalHtml = presetData.html;

      // Extract raw text or CSS if requested right away
      let processedContent = finalHtml;
      if (extraction_type === "markdown") {
        processedContent = convertHtmlToMarkdown(finalHtml);
      } else if (extraction_type === "text") {
        processedContent = convertHtmlToText(finalHtml);
      }

      const duration = Date.now() - startTime;
      return res.json({
        status: 200,
        url: presetData.url,
        cookies: { session: "mocked-sandbox-cookie-token-9334" },
        headers: {
          "content-type": "text/html; charset=utf-8",
          server: "Scrapling-Sandbox-Daemon/1.0",
          "x-powered-by": "Scrapling Engine Mimic",
        },
        rawHtml: finalHtml,
        content: [processedContent],
        metadata: {
          isSandbox: true,
          presetName: presetData.title,
          sizeBytes: Buffer.byteLength(finalHtml, "utf8"),
          durationMs: duration,
          userAgent: USER_AGENTS[impersonate] || USER_AGENTS.chrome,
        },
      });
    }

    try {
      // Build request configuration
      const userAgent = USER_AGENTS[impersonate] || USER_AGENTS.chrome;

      // Prepare custom request headers, injecting realistic browser metadata matching the fingerprint
      const mergedHeaders: Record<string, string> = {
        "User-Agent": userAgent,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        Referer: "https://www.google.com/",
        ...headers,
      };

      // Add cookies if defined
      if (Object.keys(cookies).length > 0) {
        const cookieStr = Object.entries(cookies)
          .map(([k, v]) => `${k}=${v}`)
          .join("; ");
        mergedHeaders["Cookie"] = cookieStr;
      }

      // Execute request with controller for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout * 1000);

      const fetchResponse = await fetch(url, {
        headers: mergedHeaders,
        signal: controller.signal,
        redirect: follow_redirects === false ? "manual" : "follow",
      }).finally(() => clearTimeout(timeoutId));

      const responseHtml = await fetchResponse.text();

      // Basic content filtering (body only) if main_content_only is enabled
      let filteredHtml = responseHtml;
      if (main_content_only) {
        const bodyMatch = responseHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch && bodyMatch[1]) {
          filteredHtml = bodyMatch[1];
        }
      }

      let finalContent = filteredHtml;
      if (extraction_type === "markdown") {
        finalContent = convertHtmlToMarkdown(filteredHtml);
      } else if (extraction_type === "text") {
        finalContent = convertHtmlToText(filteredHtml);
      }

      const resHeaders: Record<string, string> = {};
      fetchResponse.headers.forEach((val, key) => {
        resHeaders[key] = val;
      });

      const duration = Date.now() - startTime;

      res.json({
        status: fetchResponse.status,
        url: fetchResponse.url || url,
        headers: resHeaders,
        rawHtml: responseHtml,
        content: [finalContent],
        metadata: {
          isSandbox: false,
          sizeBytes: Buffer.byteLength(responseHtml, "utf8"),
          durationMs: duration,
          userAgent: userAgent,
        },
      });
    } catch (e: any) {
      console.error("Proxy Scrape Failed:", e);

      // In case the real retrieve is blocked (due to Cloudflare, local container net constraints, etc.)
      // and it's NOT one of the explicit preset URLs, we want to provide a helpful virtual fallback page
      // so the user receives a fully working sandbox rather than a blank screen crashing their experience!
      const fallbackUrl = url;
      const parsedUrl = new URL(url);
      const isSecure = parsedUrl.protocol === "https:";

      const simulatedHtml = `
        <div class="scrapling-simulated-viewport" style="font-family: system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 30px; border: 1px solid #e1e4e8; border-radius: 12px; background: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="background: #fff8f8; border-left: 4px solid #ff4d4d; padding: 15px; margin-bottom: 25px; border-radius: 4px;">
            <h4 style="margin: 0; color: #d32f2f; font-size: 16px;">Network Access notice: Guarded Shell Mode</h4>
            <p style="margin: 5px 0 0; color: #5c6066; font-size: 14px; line-height: 1.5;">
              The live remote crawler returned a block or connection error (<code>${e.name || e.message}</code>). 
              An on-the-fly local sandboxed containment representation of <strong>${parsedUrl.hostname}</strong> has been generated below to let you safely test Scrapling selectors.
            </p>
          </div>
          <h1>${parsedUrl.hostname} - Web Index</h1>
          <p>This is a simulated mirror generated dynamically for request scraping analysis.</p>
          <div class="articles-list">
            <div class="article-item" style="padding: 15px 0; border-bottom: 1px solid #eee;">
              <h2 class="article-headline" style="margin: 0 0 8px; font-size: 20px;"><a href="${url}/article/learning-scrapling-2026" class="article-anchor">Scrapling: Stealth Scrapers vs Modern Firewalls</a></h2>
              <div class="meta" style="font-size: 13px; color: #777;">Published on <span class="publish-date">Today</span> by <span class="author">Scrapling Core Team</span></div>
              <p class="summary" style="margin: 8px 0; line-height: 1.6; color: #444;">
                Discover the engineering secrets behind browser impersonation, fingerprint active spoofing, and avoiding anti-bot sandboxes.
                Perfect for developers building complex pipelines in 2026.
              </p>
              <div class="metrics" style="font-size: 12px; font-weight: bold; color: #1a73e8;"><span class="shares-count">2,450</span> social shares | <span class="comments-link">189 active comments</span></div>
            </div>
            <div class="article-item" style="padding: 15px 0; border-bottom: 1px solid #eee;">
              <h2 class="article-headline" style="margin: 0 0 8px; font-size: 20px;"><a href="${url}/article/gemini-grounding" class="article-anchor">AI-Engineered Parsers: The New Frontier</a></h2>
              <div class="meta" style="font-size: 13px; color: #777;">Published on <span class="publish-date">Yesterday</span> by <span class="author">AI Analyst</span></div>
              <p class="summary" style="margin: 8px 0; line-height: 1.6; color: #444;">
                How large language models are transforming unstructured web page trees into relational JSON structures without writing a single line of fragile Xpath.
              </p>
              <div class="metrics" style="font-size: 12px; font-weight: bold; color: #1a73e8;"><span class="shares-count">912</span> social shares | <span class="comments-link">42 active comments</span></div>
            </div>
          </div>
          <footer style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #999;">
            Scrapling Lab Virtual Host Layer • Secure Sandbox Active
          </footer>
        </div>
      `;

      let finalContent = simulatedHtml;
      if (extraction_type === "markdown") {
        finalContent = convertHtmlToMarkdown(simulatedHtml);
      } else if (extraction_type === "text") {
        finalContent = convertHtmlToText(simulatedHtml);
      }

      const duration = Date.now() - startTime;
      res.json({
        status: 200,
        url: url,
        headers: {
          "content-type": "text/html",
          server: "Scrapling-Web-Fallback-Node/2.0",
        },
        rawHtml: simulatedHtml,
        content: [finalContent],
        metadata: {
          isSandbox: true,
          sizeBytes: Buffer.byteLength(simulatedHtml, "utf8"),
          durationMs: duration,
          userAgent: USER_AGENTS[impersonate] || USER_AGENTS.chrome,
          warning: "Scraped live site failed. Displaying simulated sandbox containing typical markup nodes.",
        },
      });
    }
  });

  // AI CSS Selector Suggester Endpoint using Gemini or other custom LLM providers
  app.post("/api/ai-suggest", async (req, res) => {
    const { htmlSnippet, userObjective, aiSettings } = req.body;
    if (!htmlSnippet) {
      return res.status(400).json({ error: "HTML snippet or page model is required." });
    }

    try {
      const providerToUse = aiSettings?.provider || "google";
      const modelToUse = aiSettings?.model || "gemini-3.5-flash";
      const temperatureToUse = aiSettings?.temperature !== undefined ? parseFloat(aiSettings.temperature) : undefined;
      const systemInstruction = aiSettings?.systemInstruction || undefined;
      const customApiKey = aiSettings?.customApiKey || undefined;
      const agentRouterBaseUrl = aiSettings?.agentRouterBaseUrl || undefined;

      const responseText = await executeAIPipe({
        provider: providerToUse,
        model: modelToUse,
        temperature: temperatureToUse,
        systemInstruction: systemInstruction,
        messages: [{
          role: "user",
          content: `You are an expert web scraping and parser programmer. Your job is to analyze the provided HTML snippet and recommend the optimal CSS selectors for Scrapling to extract the elements the user is looking for.
        
User Goal: "${userObjective || "extract the main structured elements"}"

HTML Snippet:
"""
${htmlSnippet.substring(0, 15000)}
"""

Please provide a highly structured JSON response outlining the recommended CSS Selectors.

You MUST respond strictly in valid JSON using the requested schema below:
{
  "recommendations": [
    {
      "fieldName": "Name of the logical field (e.g. titles, prices, ratings)",
      "cssSelector": "The optimal, robust CSS selector string to extract these elements",
      "explanation": "Short explanation of why this selector matches or why it's robust",
      "sampleExtractedText": "A simulated text extract that this selector would retrieve based on the HTML"
    }
  ],
  "overallPythonScript": "A complete, beautiful production-ready Python script using the Scrapling Fetcher library to scrape this URL and build the dictionary.",
  "scraplingTips": "Stealth security configurations or custom Scrapling bypass tip for this specific type of HTML target."
}`
        }],
        customApiKey,
        jsonMode: true,
        agentRouterBaseUrl,
        jsonSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  fieldName: { type: Type.STRING, description: "Name of the logical field (e.g. titles, prices, ratings)" },
                  cssSelector: { type: Type.STRING, description: "The optimal, robust CSS selector string to extract these elements" },
                  explanation: { type: Type.STRING, description: "Short explanation of why this selector matches or why it's robust" },
                  sampleExtractedText: { type: Type.STRING, description: "A simulated text extract that this selector would retrieve based on the HTML" },
                },
                required: ["fieldName", "cssSelector", "explanation"],
              },
            },
            overallPythonScript: {
              type: Type.STRING,
              description: "A complete, beautiful production-ready Python script using the Scrapling Fetcher library to scrape this URL and build the dictionary.",
            },
            scraplingTips: {
              type: Type.STRING,
              description: "Stealth security configurations or custom Scrapling bypass tip for this specific type of HTML target.",
            },
          },
          required: ["recommendations", "overallPythonScript", "scraplingTips"],
        },
      });

      if (!responseText) {
        throw new Error("Empty response received from the AI model.");
      }

      const cleanedText = cleanJsonOutput(responseText);
      const resultJson = JSON.parse(cleanedText);
      res.json(resultJson);
    } catch (error: any) {
      console.error("AI Selector suggestion failed:", error);
      res.status(500).json({ error: "AI reasoning failed to parse: " + error.message });
    }
  });

  // AI Ask/Discuss Web Structure endpoint using server-side universal AI router
  app.post("/api/ai-chat", async (req, res) => {
    const { messages, documentContext, aiSettings } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Chat messages are required." });
    }

    try {
      const providerToUse = aiSettings?.provider || "google";
      const modelToUse = aiSettings?.model || "gemini-3.5-flash";
      const temperatureToUse = aiSettings?.temperature !== undefined ? parseFloat(aiSettings.temperature) : undefined;
      const systemInstruction = aiSettings?.systemInstruction || undefined;
      const customApiKey = aiSettings?.customApiKey || undefined;
      const agentRouterBaseUrl = aiSettings?.agentRouterBaseUrl || undefined;

      const contextPrompt = `You are Scrapling AI Assistant, a specialized coding partner for web scraping, automation, and crawling.
      The user is currently analyzing a webpage in the "Web Scraper Lab".
      
      Here is the raw text context of the scraped page under investigation:
      --- WEBPAGE CONTEXT ---
      ${documentContext ? documentContext.substring(0, 10000) : "No webpage loaded yet."}
      --- END CONTEXT ---
      
      Answer any questions regarding selectors, parsing, python/js scraping scripts, or structuring this unstructured content. Keep explanations clear, professional, and practical. Ensure any python code specifically uses the Scrapling library.`;

      const formattedMessages = [
        { role: "user", content: contextPrompt },
        ...messages.map((m: any) => ({
          role: m.role === "assistant" || m.role === "model" ? "model" : "user",
          content: m.text || m.content,
        })),
      ];

      const responseText = await executeAIPipe({
        provider: providerToUse,
        model: modelToUse,
        temperature: temperatureToUse,
        systemInstruction: systemInstruction,
        messages: formattedMessages,
        customApiKey,
        agentRouterBaseUrl,
      });

      res.json({
        text: responseText,
      });
    } catch (error: any) {
      console.error("AI Chat failed:", error);
      res.status(500).json({ error: "AI chat failed: " + error.message });
    }
  });

  // AI Influencer Intelligence Analyst Endpoint using universal AI router
  app.post("/api/influencer-analyze", async (req, res) => {
    const { compiledPrompt, aiSettings } = req.body;
    if (!compiledPrompt) {
      return res.status(400).json({ error: "The compiled prompt content is required." });
    }

    try {
      const providerToUse = aiSettings?.provider || "google";
      const modelToUse = aiSettings?.model || "gemini-3.5-flash";
      const temperatureToUse = aiSettings?.temperature !== undefined ? parseFloat(aiSettings.temperature) : undefined;
      const systemInstruction = aiSettings?.systemInstruction || undefined;
      const customApiKey = aiSettings?.customApiKey || undefined;
      const agentRouterBaseUrl = aiSettings?.agentRouterBaseUrl || undefined;

      const responseText = await executeAIPipe({
        provider: providerToUse,
        model: modelToUse,
        temperature: temperatureToUse,
        systemInstruction: systemInstruction,
        messages: [{ role: "user", content: compiledPrompt }],
        customApiKey,
        agentRouterBaseUrl,
      });

      res.json({
        text: responseText,
      });
    } catch (error: any) {
      console.error("AI Influencer Analysis failed:", error);
      res.status(500).json({ error: "AI reasoning failed: " + error.message });
    }
  });

  // Hot Module Replacement & Asset serving for Vite
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Web Scraper Lab Server Running on http://localhost:${PORT}`);
  });
}

startServer();
