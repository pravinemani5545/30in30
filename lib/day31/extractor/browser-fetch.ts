import type { FetchResult } from "./fetch";

export async function browserFetchPage(url: string): Promise<FetchResult> {
  let browser = null;

  try {
    const chromium = await import("@sparticuz/chromium");
    const puppeteer = await import("puppeteer-core");

    browser = await puppeteer.default.launch({
      args: [
        ...chromium.default.args,
        "--disable-blink-features=AutomationControlled",
      ],
      defaultViewport: { width: 1280, height: 800 },
      executablePath: await chromium.default.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    // Hide webdriver detection
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => false });
    });

    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    );

    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
    });

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30_000,
    });

    // Wait for JS price rendering
    await new Promise((r) => setTimeout(r, 2000));

    const html = await page.content();
    return { html };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Browser fetch failed";
    return { html: "", error: message };
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}
