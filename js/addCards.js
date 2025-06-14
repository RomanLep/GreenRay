const API_URL = "http://localhost:3000/panels";

const cardsList = document.querySelector(".products-grid");

const card = {
  title: "Солнечная батарея SilaSolar 30Вт",
  price: "2 720 руб",
  img: "../img/products/Mono_solar_panel_30W.png",
  features: {
    power: "30 Ватт",
    voltage: "12 В",
    operating_current: "1.61 А",
    technology: "Монокристалл",
    dimension: "541 х 439 х 25",
    weight: "2,8 кг",
  },
};

const renderingCard = (card) => {
  cardsList.insertAdjacentHTML(
    "beforeend",
    `
    <li class="product-card">
        <div class="product-image-container">
          <img
            src="${card.img}"
            alt="${card.title}"
            class="product-image"
          />
        </div>

        <div class="product-info">
          <h3 class="product-title">${card.title}</h3>

          <ul class="product-specs">
            <li class="spec-item">
              <span class="spec-name">Мощность:</span>
              <span class="spec-value">${card.features.power}</span>
            </li>
            <li class="spec-item">
              <span class="spec-name">Напряжение:</span>
              <span class="spec-value">${card.features.voltage}</span>
            </li>
            <li class="spec-item">
              <span class="spec-name">Рабочий ток:</span>
              <span class="spec-value">${card.features.operating_current}</span>
            </li>
            <li class="spec-item">
              <span class="spec-name">Технология:</span>
              <span class="spec-value">${card.features.technology}</span>
            </li>
            <li class="spec-item">
              <span class="spec-name">Габариты:</span>
              <span class="spec-value">${card.features.dimension}</span>
            </li>
            <li class="spec-item">
              <span class="spec-name">Вес:</span>
              <span class="spec-value">${card.features.weight}</span>
            </li>
          </ul>

          <div class="product-price">${card.price}</div>

          <button class="buy-button" onclick="window.location = './delivery.html'">Купить</button>
        </div>
      </li>
        `
  );
};

const getCardData = async (url) => {
  const response = await fetch(url);
  const cardData = await response.json();

  return cardData;
};

const start = async (url) => {
  const cards = await getCardData(url);

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    renderingCard(card);
  }
};

start(API_URL);
