let neboInterval;
let neboAddStep = 0;

neboAdd = () => {
  var text = document.querySelector("svg.nebo-mask text");
  var image = document.querySelector(".sponsors-area .nebo-add");
  var finalSlide = document.querySelector(".nebo-add .nebo-final-slide");
  if (neboAddStep === 0) {
    finalSlide.style.display = "none";
    text.textContent = "coffee.";
    clearInterval(neboInterval);
    neboInterval = setInterval(neboAdd, 2000);
    image.style.backgroundImage = `url("../../img/slider/nebo-coffee.webp")`;
  } else if (neboAddStep === 1) {
    text.textContent = "food.";
    image.style.backgroundImage = `url("../../img/slider/nebo-food.webp")`;
  } else if (neboAddStep === 2) {
    text.textContent = "drinks.";
    image.style.backgroundImage = `url("../../img/slider/nebo-wine.webp")`;
  } else if (neboAddStep === 3) {
    finalSlide.style.display = "flex";
    neboAddStep = -1;
    clearInterval(neboInterval);
    neboInterval = setInterval(neboAdd, 9000);
  }

  neboAddStep++;
};

neboAdd();
