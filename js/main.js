const scroller = document.querySelector("#portfolioScroll");
const navLinks = [...document.querySelectorAll(".main-nav .nav-link")];
const sections = [...document.querySelectorAll(".panel")];

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

navLinks.forEach((link) => link.addEventListener("click", moveToSection));
scroller.addEventListener("scroll", setActiveLink);
scroller.addEventListener("wheel", scrollSideways, { passive: false });
window.addEventListener("resize", setActiveLink);

setActiveLink();
