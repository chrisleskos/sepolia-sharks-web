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

  // set team image
  nextMatchDetailsWrap.style.backgroundImage = "url(" + json.teamImage + ")";
  nextMatchCompetition.innerText = json.competition;
  nextMatchRound.innerText = "Game " + json.round;
  nextMatchTeam.innerText = json.teamName;
  nextMatchDate.innerText = json.date;
  nextMatchPlace.innerText = json.place;
}
