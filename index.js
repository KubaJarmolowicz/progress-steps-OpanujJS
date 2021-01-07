// Import stylesheets
import "./style.css";

//Pobranie referencji

const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");

const cartFill = document.querySelector("#cart-fill");
const dataFill = document.querySelector("#data-fill");
const deliveryFill = document.querySelector("#delivery-fill");
const confirmFill = document.querySelector("#confirm-fill");

const postCartBar = document.querySelector("#postcart-bar");
const postDataBar = document.querySelector("#postdata-bar");
const postDeliveryBar = document.querySelector("#postdelivery-bar");

// Stan aplikacji

const state = {
  currentPage: 0,
  minPage: 1,
  maxPage: 4
};

const animationSequence = [
  { circle: null, bar: null },
  { circle: cartFill, bar: postCartBar },
  { circle: dataFill, bar: postDataBar },
  { circle: deliveryFill, bar: postDeliveryBar },
  { circle: confirmFill, bar: null }
];

//Funkcje obsługujące animacje

function playAnimationForwards({ currentPage }, animationSequence) {
  const blockToAnimate = animationSequence[currentPage];

  const { bar, circle } = blockToAnimate;

  circle.classList.add("circle-animate-forwards");

  if (!bar)
    circle.addEventListener("animationend", () => {
      circle.style.transform = "translateX(0)";
      circle.classList.remove("circle-animate-forwards");
    });

  if (bar)
    circle.addEventListener(
      "animationend",
      () => {
        circle.style.transform = "translateX(0)";
        circle.classList.remove("circle-animate-forwards");
        bar.classList.add("bar-animate-forwards");
        bar.addEventListener(
          "animationend",
          () => {
            bar.style.transform = "scaleX(1)";
            bar.classList.remove("bar-animate-forwards");
          },
          {
            once: true
          }
        );
      },
      { once: true }
    );
}

function playAnimationReverse({ currentPage }, animationSequence) {
  const blockToAnimate = animationSequence[currentPage];

  const { bar, circle } = blockToAnimate;

  if (!bar) {
    circle.classList.add("circle-animate-reverse");
    circle.addEventListener(
      "animationend",
      () => {
        circle.style.transform = "translateX(-100%)";
        circle.classList.remove("circle-animate-reverse");
      },
      { once: true }
    );
  }

  if (bar) {
    bar.classList.add("bar-animate-reverse");

    bar.addEventListener(
      "animationend",
      () => {
        bar.style.transform = "scaleX(0)";
        bar.classList.remove("bar-animate-reverse");

        if (blockToAnimate.circle)
          circle.classList.add("circle-animate-reverse");
        circle.addEventListener(
          "animationend",
          () => {
            circle.style.transform = "translateX(-100%)";
            circle.classList.remove("circle-animate-reverse");
          },
          { once: true }
        );
      },
      { once: true }
    );
  }
}

// Funkcje zwracające boolean

function shouldActivate(button, state) {
  if (button.getAttribute("id") === "nextBtn") {
    return (
      state.currentPage !== state.maxPage &&
      button.classList.contains("inactive")
    );
  }

  if (button.getAttribute("id") === "prevBtn") {
    return (
      state.currentPage !== state.minPage &&
      button.classList.contains("inactive")
    );
  }
}

function shouldDeactivate(button, state) {
  if (button.getAttribute("id") === "nextBtn") {
    return (
      state.currentPage === state.maxPage &&
      button.classList.contains("hover:bg-green")
    );
  }

  if (button.getAttribute("id") === "prevBtn") {
    return (
      state.currentPage === state.minPage &&
      button.classList.contains("hover:bg-red")
    );
  }
}

// Funkcje obsługujące widok kółek i walców

function showNextPage() {
  state.currentPage++;

  if (state.currentPage >= 3)
    nextBtn.innerHTML = `<div class="button-holder">
    Zamów!
    </div>`;

  if (shouldActivate(prevBtn, state)) activatePrevBtn();

  playAnimationForwards(state, animationSequence);

  if (shouldDeactivate(nextBtn, state)) deactivateNextBtn();
}

function showPreviousPage() {
  playAnimationReverse(state, animationSequence);

  state.currentPage--;

  if (state.currentPage < 3)
    nextBtn.innerHTML = `<div class="button-holder">
    Dalej!
    </div>`;

  if (shouldActivate(nextBtn, state)) activateNextBtn();

  if (shouldDeactivate(prevBtn, state)) deactivatePrevBtn();
}

// Funkcje obsługujące widok przycisków

function activatePrevBtn() {
  prevBtn.addEventListener("click", showPreviousPage);

  prevBtn.classList.remove("inactive");
}

function activateNextBtn() {
  nextBtn.addEventListener("click", showNextPage);

  nextBtn.classList.remove("inactive");
}

function deactivatePrevBtn() {
  prevBtn.removeEventListener("click", showPreviousPage);

  prevBtn.classList.add("inactive");
}

function deactivateNextBtn() {
  nextBtn.removeEventListener("click", showNextPage);

  nextBtn.classList.add("inactive");
}

//Entry point

prevBtn.addEventListener("click", showPreviousPage);
nextBtn.addEventListener("click", showNextPage);

showNextPage();

deactivatePrevBtn();
