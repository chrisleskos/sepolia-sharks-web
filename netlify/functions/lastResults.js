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
    const url = "https://www.basketaki.com/teams/sepolia-sharks/results";
    const response = await fetch(url);
    const html = await response.text();
    const $ = load(html);

    const rows = $("table.team-result tbody tr");
    const firstFive = rows.slice(0, 5);

    let resultsResponse = [];

    firstFive.each((_, result) => {
      const resultJson = {
        date: $(result).find("td.team-result__date").eq(0).text().trim(),
        teamImage: $(result)
          .find("td.team-result__vs .team-meta__logo a img")
          .attr("src"),
        teamName: $(result)
          .find("td.team-result__vs .team-meta__name a")
          .text()
          .trim(),
        outcome: $(result).find("td.team-result__score").eq(0).text().trim(),
        score: $(result)
          .find("td.team-result__score")
          .eq(1)
          .text()
          .replace(/\s+/g, "")
          .split("-"),
        competition: $(result).find("td.team-result__points").text().trim(),
      };

      resultsResponse.push(resultJson);
    });

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ results: resultsResponse }),
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
