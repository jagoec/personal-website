const fs = require("fs");
const path = require("path");

module.exports = function() {
  const filePath = path.join(__dirname, "..", "quotes.md");
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  const quotes = [];
  for (const line of lines) {
    const match = line.match(/^\s*-\s+"(.+)"\s*(?:—\s*(.+))?$/);
    if (match) {
      quotes.push({ text: match[1], author: match[2] || "" });
    }
  }
  return quotes;
};
