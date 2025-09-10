import fetch from "node-fetch";
import * as cheerio from "cheerio";

export async function handler(event, context) {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "OK",
    };
  }

  try {
    const url = "https://www.basketaki.com/teams/sepolia-sharks/schedule";
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const rows = $("table.team-result tbody tr");

    let earliestDate = null;
    let earliestRow = null;

    rows.each((i, row) => {
      // Use the SECOND date cell
      const dateText = $(row).find("td.team-result__date").eq(1).text().trim();
      if (dateText === "-") return;
      if (dateText) {
        // Assuming date format is DD/MM/YYYY
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
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "No valid dates found" }),
      };
    }

    const nextMatchJson = {
      round: earliestRow.find("td.team-result__date").eq(0).text().trim(),
      date: earliestRow.find("td.team-result__date").eq(1).text().trim(),
      teamImage: earliestRow
        .find("td.team-result__vs .team-meta__logo a img")
        .eq(0)
        .attr("src"),
      teamName: earliestRow
        .find("td.team-result__vs .team-meta__name a")
        .eq(0)
        .text()
        .trim(),
      competition: earliestRow
        .find("td.team-result__points")
        .eq(0)
        .text()
        .trim(),
      place: earliestRow.find("td.team-result__assists").eq(0).text().trim(),
    };

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(nextMatchJson),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message }),
    };
  }
}
