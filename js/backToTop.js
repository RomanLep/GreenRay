const backToTop = document.querySelector(".back-to-top");

const scrollUp = () => {
  backToTop.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};
scrollUp();
