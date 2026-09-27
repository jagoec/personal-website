const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#f5f1e8"/>
  <rect x="0" y="0" width="18" height="630" fill="#268bd2"/>
  <text x="110" y="290" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="92" font-weight="700" fill="#002b36">Christopher Jagoe</text>
  <text x="110" y="370" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="44" fill="#586e75">christopherjagoe.com</text>
  <text x="110" y="450" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="34" fill="#93a1a1">projects · reading</text>
</svg>`;

const outDir = path.join(__dirname, "..", "src", "img");
fs.mkdirSync(outDir, { recursive: true });

sharp(Buffer.from(svg))
  .png()
  .toFile(path.join(outDir, "og-default.png"))
  .then((info) => console.log("Wrote src/img/og-default.png", info.width + "x" + info.height))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
