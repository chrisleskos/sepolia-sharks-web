/*
 * THIS SCRIPT NEEDS TO BE RAN LOCALLY
 * WHEN OPPOSING TEAMS LOGOS UPDATE IS NEEDED
 */

import fetch from "node-fetch";
import { load } from "cheerio";
import fs from "fs";
import path from "path";

async function run() {
  const url = "https://www.basketaki.com/teams/sepolia-sharks/standings";
  const response = await fetch(url);
  const html = await response.text();
  const $ = load(html);

  const logos = $("figure.team-meta__logo > img");
  const logosJson = {};

  for (const el of logos.toArray()) {
    const absoluteUrl = $(el).attr("src");
    if (!absoluteUrl) continue;

    console.log("Downloading:", absoluteUrl);

    let imgResp;

    try {
      imgResp = await fetch(absoluteUrl);
    } catch (err) {
      console.log("Fetch failed:", err);
      continue;
    }

    const buffer = Buffer.from(await imgResp.arrayBuffer());

    const base64Image = `data:${imgResp.headers.get(
      "content-type"
    )};base64,${buffer.toString("base64")}`;

    const fileName = absoluteUrl.split("/").pop();

    logosJson[fileName] = base64Image;
  }

  const outputJs =
    `// AUTO-GENERATED — DO NOT EDIT\n` +
    `const logos = ${JSON.stringify(logosJson, null, 2)};`;

  fs.writeFileSync(
    path.join("..", "js", "assets", "team-logos.js"),
    outputJs,
    "utf8"
  );

  console.log("Created → /js/assets/team-logos.js");
}

run();
