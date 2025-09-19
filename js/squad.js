import { playersJson } from "./players.js";

let toggleButton = document.getElementById("kitToggle");
let toggleButtonImg = document.querySelectorAll(".kit-toggle > img")[0];
let toggleStatus = "home";

let playerSortSelect = document.getElementById("player-sort-select");
let playersContainer = document.getElementById("players");
let customAndroidSelectBtn = document.getElementById("smartphone-sort-select");

fillPlayerGrid();

const allPlayers = document.querySelectorAll(".player");

allPlayers.forEach((player) => {
  player.onclick = (event) => {
    player.classList.toggle("details");
  };
});

toggleButton.onclick = () => {
  if (toggleStatus === "home") {
    toggleButtonImg.src = "img/tools/toggle-right.png";
    toggleStatus = "away";
  } else {
    toggleButtonImg.src = "img/tools/toggle-left.png";
    toggleStatus = "home";
  }

  allPlayers.forEach((player) => {
    player.classList.toggle("away");
  });
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
  let lightning_position = positions[p];
  lightning.style.setProperty("--lightning-position", lightning_position);
}, 7000);

function sortPlayers(sortBy) {
  let sortedPlayersList = [];
  let tempPlayersSet = new Set(allPlayers);

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
        let playerPosition = $(player)
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
  let androidSelectedContent =
    customAndroidSelectBtn.getElementsByTagName("selectedcontent")[0];

  androidSelectedContent.innerText =
    playerSortSelect.value[0].toUpperCase() +
    playerSortSelect.value.substring(1);
}

function fillPlayerGrid() {
  playersJson.playerDetails.forEach((pl) => {
    playersContainer.insertAdjacentHTML(
      "beforeend",
      `
    <div class="player" id="pl${pl.number}">
      <div class="player-details">
        <div>
          <img src="../img/players/${
            pl.images.length > 0 ? pl.images[0] : "no-pic.png"
          }" />
        </div>
        <div class="details-content">
          <table>
            <tr>
              <td class="name">
                ${pl.fullName[0]}. ${" "} ${pl.fullName.split(" ")[1]}
                <span>#${pl.number}</span>
              </td>
            </tr>
            <tr>
              <td>Ύψος:</td>
              <td>${pl.height}cm</td>
            </tr>
            <tr>
              <td>Βάρος:</td>
              <td>${pl.weight}kg</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="player-view"></div>
      <div class="shirt-neck"></div>
      <div class="left-block"></div>
      <div class="right-block"></div>
      <div class="left-arm"></div>
      <div class="right-arm"></div>
      <img src="img/sponsors/ab.png" alt="" class="ab-player-logo" />
      <div class="player-position">${pl.position}</div>
      <div class="player-name">${pl.shirtName}</div>
      <div class="player-number">${pl.number}</div>
    </div>`
    );
  });
}
