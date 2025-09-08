toggleButton = document.getElementById("kitToggle");
toggleButtonImg = document.querySelectorAll(".kit-toggle > img")[0];
players = document.querySelectorAll(".player");
toggleStatus = "home";

toggleButton.onclick = () => {
  if (toggleStatus === "home") {
    toggleButtonImg.src = "img/tools/toggle-right.png";
    toggleStatus = "away";
    players.forEach((player) => {
      player.classList.add("away");
    });
  } else {
    toggleButtonImg.src = "img/tools/toggle-left.png";
    toggleStatus = "home";
    players.forEach((player) => {
      player.classList.remove("away");
    });
  }
};
