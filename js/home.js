counter = 1;
totalImages = 4;
imagesPath = "img/header/";
let intervalId;

function imageChange() {
  headerImage = document.getElementById("header-img");
  headerImage.src = imagesPath + "h" + (counter + 1) + ".jpg";

  counter = ++counter % totalImages;
}

window.addEventListener("load", checkOrientation);
window.addEventListener("resize", checkOrientation);

function checkOrientation() {
  if (window.matchMedia("(orientation: landscape)").matches) {
    clearInterval(intervalId);
    intervalId = setInterval(imageChange, 8000);
  } else {
    clearInterval(intervalId);
  }
}

fetch("/.netlify/functions/schedule")
  .then((res) => res.json())
  .then((data) => {
    console.log("Earliest game:", data);
    setNextGame(data);
  })
  .catch((err) => console.error("Fetch error:", err));

function setNextGame(json) {
  if (json.error) return setNoGame();
  let ctaNextMatch = document.getElementsByClassName(
    "cta-text cta-next-match-text"
  )[0];
  let nextMatchDetailsWrap = document.getElementsByClassName(
    "next-match-details-wrap"
  )[0];

  let nextMatchCompetition = document.getElementsByClassName(
    "next-match-competition"
  )[0];
  let nextMatchRound = document.getElementsByClassName("next-match-round")[0];
  let nextMatchTeam = document.getElementsByClassName(
    "next-match-team-name"
  )[0];
  let nextMatchDate = document.getElementsByClassName("next-match-date")[0];
  let nextMatchPlace = document.getElementsByClassName("next-match-place")[0];

  // Format Date
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const monthsGR = [
    "Ιαν",
    "Φεβ",
    "Μάρ",
    "Απρ",
    "Μάι",
    "Ιούν",
    "Ιούλ",
    "Αύγ",
    "Σεπ",
    "Οκτ",
    "Νοέ",
    "Δεκ",
  ];
  const splittedDate = json.date.split("/");
  const day = splittedDate[0];
  const month = months[splittedDate[1] - 1];
  const monthGR = monthsGR[splittedDate[1] - 1];
  const year = splittedDate[2].substring(0, 4);
  const time = splittedDate[2]
    .substring(4, splittedDate[2].length)
    .replace(":", ".");
  const dayOfWeek = zellerDayOfWeek(
    Number(splittedDate[2].substring(0, 4)),
    Number(splittedDate[1]),
    Number(splittedDate[0])
  );

  const dayOfWeekGR = zellerDayOfWeek(
    Number(splittedDate[2].substring(0, 4)),
    Number(splittedDate[1]),
    Number(splittedDate[0]),
    "GR"
  );

  // set cta date
  ctaNextMatch.innerHTML = `${dayOfWeekGR} ${day} ${monthGR} ${year}, <span >${time}</span>`;
  // set team image
  // nextMatchDetailsWrap.style.backgroundImage = `url(${json.teamImage})`;
  nextMatchCompetition.innerHTML = `<span>${json.competition}</span>`;
  nextMatchRound.innerText = "Game " + json.round;
  nextMatchTeam.innerText = json.teamName;
  nextMatchDate.innerHTML = `${month} ${day}, ${dayOfWeek} <span class='neon-time'>${time}</span>`;
  nextMatchPlace.innerHTML = `<img src="img/auxilary/navigate.png" /><div>${json.place}</div>`;
  nextMatchPlace.onclick = () => {
    window.open(`https://www.google.com/maps/search/${json.place}`, "_blank");
  };
}

function setNoGame() {
  let nextMatchDetailsWrap = document.getElementsByClassName(
    "next-match-details-wrap"
  )[0];

  let ctaNextMatch = document.getElementsByClassName(
    "cta-text cta-next-match-text"
  )[0];

  nextMatchDetailsWrap.innerHTML = `<div class="no-match">Δεν υπάρχουν πληροφορίες για το επόμενο παιχνίδι...</div>`;
  ctaNextMatch.innerHTML =
    "Δεν υπάρχουν πληροφορίες για το επόμενο παιχνίδι...";
}

function zellerDayOfWeek(year, month, day, lang = "EN") {
  // Adjust months so March = 3, ..., January = 13, February = 14 (of previous year)
  if (month < 3) {
    month += 12;
    year -= 1;
  }

  let K = year % 100; // Year of the century
  let J = Math.floor(year / 100); // Zero-based century

  let h =
    (day +
      Math.floor((13 * (month + 1)) / 5) +
      K +
      Math.floor(K / 4) +
      Math.floor(J / 4) +
      5 * J) %
    7;

  // Zeller's formula returns: 0=Saturday, 1=Sunday, ..., 6=Friday
  let days;
  if (lang === "GR") {
    days = [
      "Σάββατο",
      "Κυριακή",
      "Δευτέρα",
      "Τρίτη",
      "Τετάρτη",
      "Πέμπτη",
      "Παρασκευή",
    ];
  } else {
    days = [
      "Saturday",
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ];
  }

  return days[h];
}
