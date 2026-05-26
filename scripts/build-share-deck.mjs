import { resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pptxgenModule = require("../node_modules/pptxgenjs/dist/pptxgen.cjs.js");

const root = resolve(import.meta.dirname, "..");
const exportDir = resolve(root, "exports");

const slides = [
  ["01-high-level-quatta-architecture.png", "High-Level Quatta Architecture"],
  ["02-connector-layer-flow.png", "Connector Layer Flow"],
  ["03-retrieval-rag-flow.png", "Retrieval + RAG Flow"],
  ["04-security-governance-flow.png", "Security, Governance and Audit Flow"],
  ["05-deployment-operations-flow.png", "Deployment and Operations Flow"],
  ["06-customer-onboarding-flow.png", "Customer Onboarding and Implementation Lifecycle"],
  ["07-inventory-agent-example-flow.png", "Example: Inventory Agent Flow"],
  ["08-claims-agent-example-flow.png", "Example: Claims Agent Flow"]
];

const pptx = new pptxgenModule();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Quatta";
pptx.company = "Quatta";
pptx.subject = "Core AI architecture for Quatta";
pptx.title = "Quatta Core AI Architecture Visuals";
pptx.lang = "en-US";
pptx.theme = {
  headFontFace: "Aptos Display",
  bodyFontFace: "Aptos"
};

for (const [file, title] of slides) {
  const slide = pptx.addSlide();
  slide.background = { color: "FFFFFF" };
  slide.addImage({
    path: resolve(exportDir, file),
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5
  });
  slide.addNotes(`Quatta architecture diagram: ${title}`);
}

await pptx.writeFile({ fileName: resolve(exportDir, "quatta-core-architecture-visuals.pptx") });
console.log("Created exports/quatta-core-architecture-visuals.pptx");
