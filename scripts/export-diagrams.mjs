import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const root = resolve(import.meta.dirname, "..");
const htmlPath = resolve(root, "quatta-architecture-visuals.html");
const outDir = resolve(root, "exports");

const slides = [
  ["high-level", "01-high-level-quatta-architecture.png"],
  ["connectors", "02-connector-layer-flow.png"],
  ["rag", "03-retrieval-rag-flow.png"],
  ["security-governance", "04-security-governance-flow.png"],
  ["deployment-ops", "05-deployment-operations-flow.png"],
  ["onboarding", "06-customer-onboarding-flow.png"],
  ["inventory", "07-inventory-agent-example-flow.png"],
  ["claims", "08-claims-agent-example-flow.png"]
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1600, height: 1200 },
  deviceScaleFactor: 2
});

await page.goto(pathToFileURL(htmlPath).href);
await page.waitForLoadState("networkidle");

for (const [id, filename] of slides) {
  const slide = page.locator(`#${id}`);
  await slide.screenshot({
    path: resolve(outDir, filename),
    animations: "disabled"
  });
}

await page.pdf({
  path: resolve(outDir, "quatta-core-architecture-visuals.pdf"),
  format: "A4",
  printBackground: true,
  landscape: true,
  margin: { top: "8mm", right: "8mm", bottom: "8mm", left: "8mm" }
});

await browser.close();

console.log(`Exported ${slides.length} PNG files and one PDF to ${outDir}`);
