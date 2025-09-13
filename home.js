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

  nextMatchDetailsWrap = document.getElementsByClassName(
    "next-match-details-wrap"
  )[0];

  nextMatchCompetition = document.getElementsByClassName(
    "next-match-competition"
  )[0];
  nextMatchRound = document.getElementsByClassName("next-match-round")[0];
  nextMatchTeam = document.getElementsByClassName("next-match-team-name")[0];
  nextMatchDate = document.getElementsByClassName("next-match-date")[0];
  nextMatchPlace = document.getElementsByClassName("next-match-place")[0];

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
  const splittedDate = json.date.split("/");
  const day = splittedDate[0];
  const month = months[splittedDate[1] - 1];
  const year = splittedDate[2].substring(0, 4);
  const time = splittedDate[2]
    .substring(4, splittedDate[2].length)
    .replace(":", ".");

  // set team image
  // nextMatchDetailsWrap.style.backgroundImage = `url(${json.teamImage})`;
  nextMatchCompetition.innerHTML = `<span>${json.competition}</span>`;
  nextMatchRound.innerText = "Game " + json.round;
  nextMatchTeam.innerText = json.teamName;
  nextMatchDate.innerHTML = `${month} ${day}, ${year} <span class='neon-time'>${time}</span>`;
  nextMatchPlace.innerHTML = `<img src="img/auxilary/navigate.png" /><div>${json.place}</div>`;
  nextMatchPlace.onclick = () => {
    window.open(`https://www.google.com/maps/search/${json.place}`, "_blank");
  };
}

function setNoGame() {
  nextMatchDetailsWrap = document.getElementsByClassName(
    "next-match-details-wrap"
  )[0];

  nextMatchDetailsWrap.innerHTML = `<div class="no-match">Δεν υπάρχουν πληροφορίες για το επόμενο παιχνίδι...</div>`;
}
