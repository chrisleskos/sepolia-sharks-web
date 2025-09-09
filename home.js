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

fetch("https://sepoliasharks.netlify.app/.netlify/functions/schedule")
  .then((res) => res.json())
  .then((data) => {
    console.log("Earliest game date:", data.earliestDate);
    // e.g. show it in the DOM
    // document.getElementById("nextGame").textContent = data.earliestDate;
  })
  .catch((err) => console.error(err));
