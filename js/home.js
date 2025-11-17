counter = 1;
totalImages = 4;
imagesPath = "img/header/";
let intervalId;

let globalNextMatchYear;
let globalNextMatchMonth;
let globalNextMatchDate;
let globalNextMatchHour;
let globalNextMatchMinute;
let globalCountdownIntervalId;

const seeFullMatchDetailsBtn = document.getElementsByClassName(
  "see-full-next-match-btn"
)[0];
const fullNextMatchContainer = document.getElementsByClassName(
  "full-next-match-container"
)[0];
const closeFullView = document.getElementsByClassName("close-full-view")[0];

seeFullMatchDetailsBtn.onclick = () => {
  fullNextMatchContainer.style.display = "flex";
  htmlTagJs.classList.add("unscrollable");
};

closeFullView.onclick = () => {
  fullNextMatchContainer.style.display = "none";
  htmlTagJs.classList.remove("unscrollable");
};

fetch("/.netlify/functions/schedule")
  .then((res) => {
    if (!res.ok) {
      // catches 4xx/5xx
      throw new Error(`HTTP ${res.status}`);
    }
    return res.json();
  })
  .then((data) => {
    console.log("Earliest game:", data);
    setNextGame(data);
  })
  .catch((err) => {
    setNoGame();
    console.error("Fetch error:", err);
  });

function setNextGame(json) {
  if (json.error) return setNoGame();
  let nextMatchCompetition = document.getElementsByClassName(
    "next-match-competition"
  )[0];
  let nextMatchOpposingTeamImg = document.querySelectorAll(
    ".next-match-opposing-team > img"
  )[0];
  let nextMatchOpposingTeamName = document.querySelectorAll(
    ".next-match-opposing-team > div"
  )[0];
  let nextMatchDate = document.getElementsByClassName("next-match-date")[0];

  // Full Next Match selectors
  let fullNextMatchCompetition = document.getElementsByClassName(
    "full-next-match-competition"
  )[0];
  let fullNextMatchRound = document.getElementsByClassName(
    "full-next-match-round"
  )[0];
  let fullNextMatchTeamName = document.getElementById(
    "full-view-opposing-team-name"
  );
  let fullNextMatchTeamImg = document.getElementById(
    "full-view-opposing-team-img"
  );
  let fullNextMatchDate = document.getElementsByClassName(
    "full-next-match-date"
  )[0];
  let fullNextMatchPlace = document.getElementsByClassName(
    "full-next-match-place"
  )[0];

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
  const monthNumber = splittedDate[1];
  const month = months[monthNumber - 1];
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

  // set global variables for countdown

  globalNextMatchYear = year;
  globalNextMatchMonth = monthNumber;
  globalNextMatchDate = day;
  globalNextMatchHour = time.substring(1, 3);
  globalNextMatchMinute = time.substring(4, time.length);

  globalCountdownIntervalId = setInterval(updateCountdown, 1000);

  // set next game
  nextMatchCompetition.innerHTML = json.competition;
  if (!json.competition.toUpperCase().includes("CUP")) {
    nextMatchCompetition.classList.add("league-match");
  }
  nextMatchOpposingTeamImg.src = json.teamImage;
  nextMatchOpposingTeamName.innerHTML = json.teamName;
  nextMatchDate.innerHTML = `${month} ${day}, ${dayOfWeek.substring(
    0,
    3
  )} <span class='neon-time'>${time}</span>`;

  // set Full next game
  fullNextMatchCompetition.innerHTML = `${json.competition}`;
  if (!json.competition.toUpperCase().includes("CUP")) {
    fullNextMatchCompetition.classList.add("league-match");
  }
  fullNextMatchRound.innerText = "Game " + json.round;
  fullNextMatchTeamImg.src = json.teamImage;
  fullNextMatchTeamName.innerText = json.teamName;
  fullNextMatchDate.innerHTML = `${month} ${day}, ${dayOfWeek} <span class='neon-time'>${time}</span>`;
  fullNextMatchPlace.innerHTML = `<img src="img/auxilary/navigate.png" /><div>${json.place}</div>`;
  fullNextMatchPlace.onclick = () => {
    window.open(`https://www.google.com/maps/search/${json.place}`, "_blank");
  };
}

function setNoGame() {
  let fullNextMatchDetailsWrap = document.getElementsByClassName(
    "full-next-match-details-wrap"
  )[0];

  let nextMatchTeams = document.getElementsByClassName("next-match-teams")[0];
  let nextMatchCompetition = document.getElementsByClassName(
    "next-match-competition"
  )[0];

  fullNextMatchDetailsWrap.innerHTML = `<div class="no-match">Δεν υπάρχουν πληροφορίες για το επόμενο παιχνίδι...</div>`;

  nextMatchTeams.innerHTML = `<div class="no-match">Δεν υπάρχουν πληροφορίες για το επόμενο παιχνίδι...</div>`;
  nextMatchCompetition.style.display = "none";
  clearInterval(globalCountdownIntervalId);
}

function updateCountdown() {
  // Countdown
  let nextMatchDaysCountdown = document.getElementById("days-counter");
  let nextMatchHoursCountdown = document.getElementById("hours-counter");
  let nextMatchMinutesCountdown = document.getElementById("minutes-counter");
  let nextMatchSecondsCountdown = document.getElementById("seconds-counter");

  const [daysDiff, hoursDiff, minDiff, secDiff] = getCountdown(
    globalNextMatchYear,
    globalNextMatchMonth,
    globalNextMatchDate,
    globalNextMatchHour,
    globalNextMatchMinute
  );

  nextMatchDaysCountdown.innerHTML = daysDiff;
  nextMatchHoursCountdown.innerHTML = hoursDiff;
  nextMatchMinutesCountdown.innerHTML = minDiff;
  nextMatchSecondsCountdown.innerHTML = secDiff;
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

function getCountdown(year, month, date, hour, minute) {
  let today = new Date();
  let gameDay = new Date(`${year}-${month}-${date}T${hour}:${minute}:00`);

  let dateDiff = Math.abs(today - gameDay) / 1000; // total seconds

  const daysDiff = Math.floor(dateDiff / (3600 * 24));
  dateDiff -= daysDiff * 3600 * 24;

  const hoursDiff = Math.floor(dateDiff / 3600);
  dateDiff -= hoursDiff * 3600;

  const minDiff = Math.floor(dateDiff / 60);
  const secDiff = Math.floor(dateDiff % 60);

  return [
    String(daysDiff).padStart(2, "0"),
    String(hoursDiff).padStart(2, "0"),
    String(minDiff).padStart(2, "0"),
    String(secDiff).padStart(2, "0"),
  ];
}
