const htmlTagJs = document.getElementsByTagName("html")[0];
const navMenuBtn = document.getElementsByClassName("nav-menu-btn")[0];
const navCloseMenuBtn =
  document.getElementsByClassName("nav-close-menu-btn")[0];

navMenuBtn.onclick = () => {
  document.getElementsByClassName("nav-menu-wrap")[0].classList.add("show");
  htmlTagJs.classList.add("unscrollable");
};

navCloseMenuBtn.onclick = () => {
  document.getElementsByClassName("nav-menu-wrap")[0].classList.remove("show");
  htmlTagJs.classList.remove("unscrollable");
};
