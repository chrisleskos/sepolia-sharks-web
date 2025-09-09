import fetch from "node-fetch";
import * as cheerio from "cheerio";

export async function handler(event, context) {
  try {
    const url = "https://www.basketaki.com/teams/sepolia-sharks/schedule";
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const rows = $("table.team-result tbody tr");

    let earliestDate = null;
    let earliestRow = null;

    rows.each((i, row) => {
      const dateText = $(row).find("td.team-result__date").eq(1).text().trim();

      if (dateText) {
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
        headers: {
          "Access-Control-Allow-Origin": "*", // 👈 important
        },
        body: JSON.stringify({ error: "No valid dates found" }),
      };
    }

    const earliestDateText = earliestRow
      .find("td.team-result__date")
      .eq(1)
      .text()
      .trim();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // 👈 allow frontend to call
      },
      body: JSON.stringify({ earliestDate: earliestDateText }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // 👈 don’t forget error case
      },
      body: JSON.stringify({ error: err.message }),
    };
  }
}
