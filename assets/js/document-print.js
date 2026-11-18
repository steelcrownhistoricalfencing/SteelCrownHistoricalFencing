/* Event delegation also handles Material's instant navigation. */
document.addEventListener("click", (event) => {
  if (event.target instanceof Element && event.target.closest("[data-sc-print]")) {
    window.print();
  }
});
