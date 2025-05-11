document.addEventListener("DOMContentLoaded", () => {
  const sliderEl = document.querySelector(".partners-slider");
  if (sliderEl) {
    const wrapper = sliderEl.querySelector(".swiper-wrapper");
    const slides = wrapper.querySelectorAll(".swiper-slide");

    if (slides.length < 12) {
      const copiesNeeded = Math.ceil(12 / slides.length);
      for (let i = 0; i < copiesNeeded; i++) {
        slides.forEach((slide) => wrapper.appendChild(slide.cloneNode(true)));
      }
    }
  }

  // Инициализация Swiper
  new Swiper(".partners-slider", {
    loop: true,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    speed: 10000,
    slidesPerView: "auto",
    spaceBetween: 40,

    simulateTouch: false,
    allowTouchMove: false,
    touchRatio: 0,
    grabCursor: false,
    mousewheel: { enabled: false },
    keyboard: { enabled: false },

    breakpoints: {
      320: { spaceBetween: 20 },
      768: { spaceBetween: 30 },
      1024: { spaceBetween: 40 },
    },
  });
});
