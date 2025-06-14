const INSTALLATION_COST_PER_PANEL = 2000;

const PANELS_API_URL = "http://localhost:3000/panels";
const DELIVERY_API_URL = "http://localhost:3000/Country";

const panelTypeSelect = document.getElementById("panel-type");
const panelQuantityInput = document.getElementById("panel-quantity");
const addPanelButton = document.getElementById("add-panel");
const panelsList = document.getElementById("panels-list");
const totalPowerElement = document.getElementById("total-power");
const regionSelect = document.getElementById("region");
const calculateButton = document.getElementById("calculate-btn");
const panelsCostElement = document.getElementById("panels-cost");
const deliveryCostElement = document.getElementById("delivery-cost");
const installationCostElement = document.getElementById("installation-cost");
const totalCostElement = document.getElementById("total-cost");

// Данные калькулятора
let selectedPanels = [];
let panelsData = [];
let deliveryPrices = {};
let deliveryData = [];

async function loadData() {
  try {
    // Загрузка данных о панелях
    const panelsResponse = await fetch(PANELS_API_URL);
    panelsData = await panelsResponse.json();

    const deliveryResponse = await fetch(DELIVERY_API_URL);
    deliveryData = await deliveryResponse.json();

    deliveryPrices = {};
    if (deliveryData.length > 0 && deliveryData[0].Russia) {
      const regions = deliveryData[0].Russia;

      for (const regionKey in regions) {
        const region = regions[regionKey];
        if (region && region.title && region.shipping_price) {
          const price = parseInt(region.shipping_price.replace(/\D/g, ""));
          deliveryPrices[regionKey] = price;
        }
      }
    }

    initPanelSelect();
    initRegionSelect();
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    panelTypeSelect.innerHTML =
      '<option value="">Ошибка загрузки данных</option>';
    regionSelect.innerHTML = '<option value="">Ошибка загрузки данных</option>';
  }
}

// Инициализация выбора панелей
function initPanelSelect() {
  panelTypeSelect.innerHTML = '<option value="">Выберите тип панели</option>';

  panelsData.forEach((panel, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${panel.title} - ${panel.price}`;
    panelTypeSelect.appendChild(option);
  });
}

// Инициализация выбора региона
function initRegionSelect() {
  regionSelect.innerHTML = '<option value="">Выберите регион</option>';

  if (deliveryData && deliveryData.length > 0 && deliveryData[0].Russia) {
    const regions = deliveryData[0].Russia;

    for (const regionKey in regions) {
      const region = regions[regionKey];
      if (region && region.title) {
        const option = document.createElement("option");
        option.value = regionKey;
        option.textContent = region.title;
        regionSelect.appendChild(option);
      }
    }
  }
}

// Добавление панели в список
function addPanel() {
  const panelIndex = panelTypeSelect.value;
  const quantity = parseInt(panelQuantityInput.value);

  if (panelIndex === "" || isNaN(quantity) || quantity < 1) {
    alert("Пожалуйста, выберите тип панели и укажите корректное количество");
    return;
  }

  const panel = panelsData[panelIndex];
  const existingPanelIndex = selectedPanels.findIndex(
    (p) => p.index === panelIndex
  );

  if (existingPanelIndex >= 0) {
    selectedPanels[existingPanelIndex].quantity += quantity;
  } else {
    selectedPanels.push({
      index: panelIndex,
      title: panel.title,
      price: parseInt(panel.price.replace(/\D/g, "")),
      power: parseInt(panel.features.power.replace(/\D/g, "")),
      quantity: quantity,
    });
  }

  updatePanelsList();
  updateTotalPower();
}

// Обновление списка выбранных панелей
function updatePanelsList() {
  panelsList.innerHTML = "";

  selectedPanels.forEach((panel, index) => {
    const li = document.createElement("li");
    const containerBtnAndPrice = document.createElement('div');
    containerBtnAndPrice.classList.add("containerBtnAndPrice");

    const panelInfo = document.createElement("span");
    panelInfo.textContent = `${panel.title} (${panel.quantity} шт)`;

    const panelTotal = document.createElement("span");
    panelTotal.textContent = `${(
      panel.price * panel.quantity
    ).toLocaleString()} руб`;

    const removeButton = document.createElement("button");
    removeButton.innerHTML = `<svg class="remove-btn-svg" viewBox="0 0 25 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>cross</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"> <g id="Icon-Set-Filled" sketch:type="MSLayerGroup" transform="translate(-469.000000, -1041.000000)" fill="#000000"> <path d="M487.148,1053.48 L492.813,1047.82 C494.376,1046.26 494.376,1043.72 492.813,1042.16 C491.248,1040.59 488.712,1040.59 487.148,1042.16 L481.484,1047.82 L475.82,1042.16 C474.257,1040.59 471.721,1040.59 470.156,1042.16 C468.593,1043.72 468.593,1046.26 470.156,1047.82 L475.82,1053.48 L470.156,1059.15 C468.593,1060.71 468.593,1063.25 470.156,1064.81 C471.721,1066.38 474.257,1066.38 475.82,1064.81 L481.484,1059.15 L487.148,1064.81 C488.712,1066.38 491.248,1066.38 492.813,1064.81 C494.376,1063.25 494.376,1060.71 492.813,1059.15 L487.148,1053.48" id="cross" sketch:type="MSShapeGroup"> </path> </g> </g> </g></svg>`;
    removeButton.classList.add("remove-panel");
    removeButton.onclick = () => removePanel(index);

    li.appendChild(panelInfo);
    containerBtnAndPrice.appendChild(panelTotal);
    containerBtnAndPrice.appendChild(removeButton);
    li.appendChild(containerBtnAndPrice);
    panelsList.appendChild(li);
  });
}

// Удаление панели из списка
function removePanel(index) {
  selectedPanels.splice(index, 1);
  updatePanelsList();
  updateTotalPower();
}

// Обновление общей мощности
function updateTotalPower() {
  const totalPower = selectedPanels.reduce(
    (sum, panel) => sum + panel.power * panel.quantity,
    0
  );
  totalPowerElement.textContent = `Общая мощность: ${totalPower} Вт`;
}

// Расчет стоимости
function calculateCost() {
  if (selectedPanels.length === 0) {
    alert("Пожалуйста, добавьте хотя бы одну панель");
    return;
  }

  if (regionSelect.value === "") {
    alert("Пожалуйста, выберите регион доставки");
    return;
  }

  // Стоимость панелей
  const panelsCost = selectedPanels.reduce(
    (sum, panel) => sum + panel.price * panel.quantity,
    0
  );

  // Стоимость доставки
  const deliveryCost = deliveryPrices[regionSelect.value] || 0;

  // Стоимость установки (фиксированная за панель)
  const totalPanels = selectedPanels.reduce(
    (sum, panel) => sum + panel.quantity,
    0
  );
  const installationCost = totalPanels * INSTALLATION_COST_PER_PANEL;

  // Итоговая стоимость
  const totalCost = panelsCost + deliveryCost + installationCost;

  // Обновление UI
  panelsCostElement.textContent = `${panelsCost.toLocaleString()} руб`;
  deliveryCostElement.textContent = `${deliveryCost.toLocaleString()} руб`;
  installationCostElement.textContent = `${installationCost.toLocaleString()} руб`;
  totalCostElement.textContent = `${totalCost.toLocaleString()} руб`;
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
  loadData();

  addPanelButton.addEventListener("click", addPanel);
  calculateButton.addEventListener("click", calculateCost);
});
