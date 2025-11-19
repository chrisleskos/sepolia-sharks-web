import { load } from "cheerio";

export async function handler(event) {
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
    const $ = load(html);

    const rows = $("table.team-result tbody tr");
    let earliestDate = null;
    let earliestRow = null;

    rows.each((_, row) => {
      const dateText = $(row).find("td.team-result__date").eq(1).text().trim();
      if (!dateText || dateText === "-") return;
      const [day, month, year] = dateText.split("/");
      const parsed = new Date(year, month - 1, day);
      if (!earliestDate || parsed < earliestDate) {
        earliestDate = parsed;
        earliestRow = $(row);
      }
    });

    if (!earliestRow) {
      return {
        statusCode: 404,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "No valid dates found" }),
      };
    }

    // Scrape the image URL
    const teamImageUrl = earliestRow
      .find("td.team-result__vs .team-meta__logo a img")
      .attr("src");

    // Fetch the image and convert to base64
    // const imgResp = await fetch(teamImageUrl).catch((err) => {
    //   console.log(err);
    // });

    // const buffer = await imgResp.arrayBuffer();
    // const base64Image = `data:${imgResp.headers.get(
    //   "content-type"
    // )};base64,${Buffer.from(buffer).toString("base64")}`;

    const nextMatchJson = {
      round: earliestRow.find("td.team-result__date").eq(0).text().trim(),
      date: earliestRow.find("td.team-result__date").eq(1).text().trim(),
      teamImage: teamImageUrl,
      teamName: earliestRow
        .find("td.team-result__vs .team-meta__name a")
        .text()
        .trim(),
      competition: earliestRow.find("td.team-result__points").text().trim(),
      place: earliestRow.find("td.team-result__assists").text().trim(),
    };

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(nextMatchJson),
    };
  } catch (err) {
    console.log(err.message);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message }),
    };
  }
}
