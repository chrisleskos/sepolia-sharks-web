const allPlayers = document.querySelectorAll(".player");

toggleButton = document.getElementById("kitToggle");
toggleButtonImg = document.querySelectorAll(".kit-toggle > img")[0];
players = document.querySelectorAll(".player");
toggleStatus = "home";

playerSortSelect = document.getElementById("player-sort-select");
playersContainer = document.getElementById("players");
customAndroidSelectBtn = document.getElementById("smartphone-sort-select");

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

playerSortSelect.addEventListener("change", (event) => {
  setAndroidSelectBtnText();
  sortPlayers(event.target.value);
});

let zahariasWrap = document.getElementById("zaharias");

setTimeout(() => {
  zahariasWrap.style.display = "block";

  // then hide after 7s
  setTimeout(() => {
    zahariasWrap.style.display = "none";
  }, 7000);
}, 2000);

// change lighting position
// get main and change the variable since psudo element can't be targeted
let lightning = document.getElementsByTagName("main")[0];
let positions = ["-50%", "0%", "-10%", "-100%", "40%", "70%"];
let p = -1;
setInterval(() => {
  p = ++p % positions.length;
  console.log(p);
  let lightning_position = positions[p];
  lightning.style.setProperty("--lightning-position", lightning_position);
}, 7000);

function toggleZaharias() {
  if (zahariasWrap.style.display === "none") {
    zahariasWrap.style.display = "block";
  } else {
    zahariasWrap.style.display = "none";
  }
}

function sortPlayers(sortBy) {
  sortedPlayersList = [];
  tempPlayersSet = new Set(allPlayers);

  if (sortBy === "number") {
    sortedPlayersList = tempPlayersSet;
  } else if (sortBy === "position") {
    const positions = [
      "PG",
      "PG/SG",
      "SG",
      "SG/SF",
      "SF",
      "SF/PF",
      "PF",
      "PF/C",
      "C",
    ];
    positions.forEach((pos) => {
      tempPlayersSet.forEach((player) => {
        playerPosition = $(player)
          .find("div.player-position")
          .eq(0)
          .text()
          .trim();

        if (playerPosition.replace(/\s+/g, "") === pos) {
          sortedPlayersList.push(player);
          tempPlayersSet.delete(player);
        }
      });
    });
  }
  sortedPlayersList.forEach((player) => {
    playersContainer.appendChild(player);
  });
}

function setAndroidSelectBtnText() {
  androidSelectedContent =
    customAndroidSelectBtn.getElementsByTagName("selectedcontent")[0];

  androidSelectedContent.innerText =
    playerSortSelect.value[0].toUpperCase() +
    playerSortSelect.value.substring(1);
}
