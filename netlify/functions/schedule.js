import fetch from "node-fetch";
import * as cheerio from "cheerio";

export async function handler(event, context) {
  try {
    const url = "https://www.basketaki.com/teams/sepolia-sharks/schedule";
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Select all rows of the schedule table
    const rows = $("table.team-result tbody tr");

    let earliestDate = null;
    let earliestRow = null;

    rows.each((i, row) => {
      // Grab the SECOND date cell
      const dateText = $(row).find("td.team-result__date").eq(1).text().trim();

      if (dateText) {
        // Assuming format "DD/MM/YYYY"
        const [day, month, year] = dateText.split("/");
        const parsed = new Date(year, month - 1, day);

        if (!earliestDate || parsed < earliestDate) {
          earliestDate = parsed;
          earliestRow = $(row);
        }
      }
    });

    if (!earliestRow) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No valid dates found" }),
      };
    }

    // Return the second date cell text from the earliest row
    const earliestDateText = earliestRow
      .find("td.team-result__date")
      .eq(1)
      .text()
      .trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ earliestDate: earliestDateText }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
