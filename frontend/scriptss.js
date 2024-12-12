document.addEventListener("DOMContentLoaded", () => {
  const apiBaseUrl = "http://localhost:3000/api"; // Base URL for the backend
  const servicesList = document.getElementById("services-list");
  const productsList = document.getElementById("products-list");
  const searchServiceBar = document.getElementById("search-service");
  const searchProductBar = document.getElementById("search-product");
  const searchServiceResults = document.getElementById("search-service-results");
  const searchProductResults = document.getElementById("search-product-results");
  const serviceForm = document.getElementById("add-service-form");
  const productForm = document.getElementById("add-product-form");

  // Manejo de pestañas
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      button.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Función para cargar datos
  async function loadData(endpoint, containerId) {
    try {
      const response = await fetch(`${apiBaseUrl}/${endpoint}`);
      if (!response.ok) {
        throw new Error(`Error HTTP! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(`${endpoint} cargados:`, data);
      displayItems(data, containerId);
    } catch (error) {
      console.error(`Error al cargar ${endpoint}:`, error);
      document.getElementById(containerId).innerHTML = `<li>Error al cargar ${endpoint}.</li>`;
    }
  }

  // Función para mostrar items en el DOM
  function displayItems(items, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    items.forEach(item => {
      const card = document.createElement("li");
      card.className = "card";
      li.innerHTML = `
        <img src="${item.image_url}" alt="${item.name}" class="card-image">
        <div class="card-content">
          <h3 class="card-title">${item.name}</h3>
          <p class="card-description">${item.description}</p>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Función para añadir un nuevo item
  async function addItem(endpoint, form) {
    const formData = new FormData(form);
    try {
      const response = await fetch(`${apiBaseUrl}/${endpoint}`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Error al añadir ${endpoint}: ${response.statusText}`);
      }
      const item = await response.json();
      console.log(`${endpoint} añadido:`, item);
      loadData(endpoint, `${endpoint}-list`);
      form.reset();
    } catch (error) {
      console.error(`Error al añadir ${endpoint}:`, error);
      alert(`No se pudo añadir el ${endpoint}. Inténtalo más tarde.`);
    }
  }

  // Función para buscar items
  async function searchItems(endpoint, query, resultsContainerId) {
    try {
      const response = await fetch(`${apiBaseUrl}/${endpoint}/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`Error al buscar ${endpoint}: ${response.statusText}`);
      }
      const items = await response.json();
      displayItems(items, resultsContainerId);
    } catch (error) {
      console.error(`Error al buscar ${endpoint}:`, error);
    }
  }

  // Event listeners para formularios
  if (serviceForm) {
    serviceForm.addEventListener("submit", event => {
      event.preventDefault();
      addItem("services", serviceForm);
    });
  }

  if (productForm) {
    productForm.addEventListener("submit", event => {
      event.preventDefault();
      addItem("products", productForm);
    });
  }

  // Event listeners para búsqueda
  if (searchServiceBar) {
    searchServiceBar.addEventListener("input", () => {
      const query = searchServiceBar.value.toLowerCase();
      searchItems("services", query, "search-service-results");
    });
  }

  if (searchProductBar) {
    searchProductBar.addEventListener("input", () => {
      const query = searchProductBar.value.toLowerCase();
      searchItems("products", query, "search-product-results");
    });
  }

  // Inicializar
  loadData("services", "services-list");
  loadData("products", "products-list");
});

