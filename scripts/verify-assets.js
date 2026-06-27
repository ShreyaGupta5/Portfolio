const fs = require("fs");
const path = require("path");

const requiredFiles = [
  "frontend/index.html",
  "frontend/css/style.css",
  "frontend/js/script.js",
  "frontend/assets/Shreya-Resume.pdf",
  "frontend/assets/shreya-gupta-photo.webp",
  "frontend/assets/project-ai-agriculture.webp",
  "frontend/assets/project-weather-dashboard.webp",
  "frontend/assets/project-code-editor.webp",
  "frontend/assets/project-rf-drone.webp",
  "frontend/projects/ai-agriculture.html"
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(__dirname, "..", file)));

if (missing.length) {
  console.error(`Missing required deployment files:\n${missing.join("\n")}`);
  process.exit(1);
}

console.log("Build check passed. Static portfolio assets are ready.");
