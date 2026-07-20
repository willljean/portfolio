const scroller = document.querySelector("#portfolioScroll");
const navLinks = [...document.querySelectorAll(".main-nav .nav-link")];
const sections = [...document.querySelectorAll(".panel")];
const cursor = document.querySelector(".custom-cursor");
const projectCards = [...document.querySelectorAll("[data-project-card]")];
const projectPrevButton = document.querySelector(".project-control-prev");
const projectNextButton = document.querySelector(".project-control-next");
const supportsCustomCursor = () => window.innerWidth > 800;

let cursorX = 0;
let cursorY = 0;
let cursorDirection = null;
let activeProjectIndex = 0;

const setActiveLink = () => {
  const currentIndex = Math.round(scroller.scrollLeft / window.innerWidth);
  const currentSection = sections[currentIndex];

  if (!currentSection) return;

  navLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${currentSection.id}`
    );
  });

  document.body.classList.toggle("show-corner-logo", currentSection.id !== "home");
};

const moveToSection = (event) => {
  event.preventDefault();

  const targetId = event.currentTarget.getAttribute("href");
  const targetSection = document.querySelector(targetId);

  targetSection?.scrollIntoView({
    behavior: "smooth",
    inline: "start",
    block: "nearest",
  });
};

const scrollSideways = (event) => {
  const isVerticalScroll = Math.abs(event.deltaY) > Math.abs(event.deltaX);

  if (!isVerticalScroll) return;

  event.preventDefault();

  scroller.scrollBy({
    left: event.deltaY * 1.35,
    behavior: "smooth",
  });
};

const getCurrentIndex = () => Math.round(scroller.scrollLeft / window.innerWidth);

const moveByPanel = (direction) => {
  const nextIndex = Math.min(
    Math.max(getCurrentIndex() + direction, 0),
    sections.length - 1
  );

  sections[nextIndex]?.scrollIntoView({
    behavior: "smooth",
    inline: "start",
    block: "nearest",
  });
};

const updateCursorMode = () => {
  if (!cursor) return;
  if (!supportsCustomCursor()) {
    cursor.className = "custom-cursor";
    cursorDirection = null;
    return;
  }

  const edgeSize = Math.min(150, window.innerWidth * 0.18);
  const canGoLeft = getCurrentIndex() > 0;
  const canGoRight = getCurrentIndex() < sections.length - 1;

  cursorDirection = null;

  if (cursorX <= edgeSize && canGoLeft) {
    cursorDirection = "left";
  } else if (cursorX >= window.innerWidth - edgeSize && canGoRight) {
    cursorDirection = "right";
  }

  cursor.classList.toggle("is-edge", Boolean(cursorDirection));
  cursor.classList.toggle("is-left", cursorDirection === "left");
  cursor.classList.toggle("is-right", cursorDirection === "right");
};

const moveCustomCursor = (event) => {
  if (!supportsCustomCursor()) {
    hideCustomCursor();
    return;
  }

  cursorX = event.clientX;
  cursorY = event.clientY;

  cursor.style.left = `${cursorX}px`;
  cursor.style.top = `${cursorY}px`;
  cursor.classList.add("is-visible");

  updateCursorMode();
};

const hideCustomCursor = () => {
  cursor?.classList.remove("is-visible");
};

const clickCustomCursor = () => {
  if (!supportsCustomCursor()) return;

  cursor.classList.add("is-clicking");
  window.setTimeout(() => cursor.classList.remove("is-clicking"), 180);

  if (!cursorDirection) return;

  moveByPanel(cursorDirection === "left" ? -1 : 1);
};

const setActiveProject = (nextIndex) => {
  if (!projectCards.length) return;

  activeProjectIndex = (nextIndex + projectCards.length) % projectCards.length;
  const previousIndex = (activeProjectIndex - 1 + projectCards.length) % projectCards.length;
  const followingIndex = (activeProjectIndex + 1) % projectCards.length;

  projectCards.forEach((card, index) => {
    card.classList.toggle("is-active", index === activeProjectIndex);
    card.classList.toggle("is-prev", index === previousIndex);
    card.classList.toggle("is-next", index === followingIndex);
    card.classList.toggle(
      "is-hidden-card",
      index !== activeProjectIndex && index !== previousIndex && index !== followingIndex
    );
  });
};

const showPreviousProject = () => {
  setActiveProject(activeProjectIndex - 1);
};

const showNextProject = () => {
  setActiveProject(activeProjectIndex + 1);
};

navLinks.forEach((link) => link.addEventListener("click", moveToSection));
scroller.addEventListener("scroll", setActiveLink);
scroller.addEventListener("scroll", updateCursorMode);
scroller.addEventListener("wheel", scrollSideways, { passive: false });
window.addEventListener("resize", setActiveLink);
window.addEventListener("resize", updateCursorMode);

if (cursor) {
  cursor.style.display = "block";
  window.addEventListener("mousemove", moveCustomCursor);
  window.addEventListener("mouseleave", hideCustomCursor);
  window.addEventListener("click", clickCustomCursor);
}

projectPrevButton?.addEventListener("click", showPreviousProject);
projectNextButton?.addEventListener("click", showNextProject);
setActiveProject(activeProjectIndex);
setActiveLink();
