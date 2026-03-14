const { parse } = require("csv-parse/sync");
module.exports= async function() {

  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS8y4tS2Cv4g2WRgNptqPVP-vPteuIL9cOqiViUnvwf6guJ8r_8qsYhaqE8xh-qSJGY88AjX3cTK32u/pub?output=csv";

  const response = await fetch(url);
  const csv = await response.text();

  const records = parse(csv, {
    columns: true,
    skip_empty_lines: true
  });

  // sort by date
  records.sort((a, b) => new Date(a.Finished) - new Date(b.Finished));

  // Build a Markdown table string for templates
  const header = "| Title | Author | Month Read | Notes |\n" +
    "| ----- | ------ | ---------- | ----- |\n";

  const rows = records
    .map((book) =>
      `| ${book.Title} | ${book.Author} | ${book.Finished} | ${book.Notes} |`
    )
    .join("\n");

  records.books_table = header + rows;

  console.log("Books loaded:", records.length);
  return records;
}
