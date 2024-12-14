document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "http://localhost:3000/api/services"; // URL del backend
  const servicesList = document.getElementById("services-list");
  const searchBar = document.getElementById("search-bar");
  const searchResults = document.getElementById("search-results");
  const serviceForm = document.getElementById("service-form");

  // 1. Cargar servicios desde el backend
  function loadServices() {
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error HTTP! status: ${response.status}`);
        }
        return response.json();
      })
      .then(services => {
        console.log("Servicios cargados:", services);
        displayServices(services);
      })
      .catch(error => {
        console.error("Error al cargar los servicios:", error);
        servicesList.innerHTML = "<li>Error al cargar los servicios.</li>";
      });
  }

  // 2. Mostrar servicios en el DOM
  function displayServices(services) {
    servicesList.innerHTML = ""; 
    services.forEach(service => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="service-item">
          <h3>${service.name}</h3>
          <p>${service.description}</p>
          ${
            service.image_url
              ? `<img src="${service.image_url}" alt="Imagen de ${service.name}">`
              : ""
          }
        </div>
      `;
      listElement.appendChild(li);
    });
  }

  // 3. Añadir un nuevo servicio con imagen
  serviceForm.addEventListener("submit", event => {
    event.preventDefault(); 
    const formData = new FormData(serviceForm); 

    fetch(apiUrl, {
      method: "POST",
      body: formData, 
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error al añadir servicio: ${response.statusText}`);
        }
        return response.json();
      })
      .then(service => {
        console.log("Servicio añadido:", service);
        loadServices(); 
        serviceForm.reset(); 
      })
      .catch(error => {
        console.error("Error al añadir servicio:", error);
        alert("No se pudo añadir el servicio. Inténtalo más tarde.");
      });
  });

  // 4. Filtrar servicios en tiempo real
  searchBar.addEventListener("input", () => {
    const query = searchBar.value.toLowerCase();

    fetch(apiUrl)
      .then(response => response.json())
      .then(services => {
        const filteredServices = services.filter(service =>
          service.name.toLowerCase().includes(query)
        );
        displaySearchResults(filteredServices);
      })
      .catch(error => {
        console.error("Error al buscar servicios:", error);
      });
  });

  // Mostrar resultados de búsqueda
  function displaySearchResults(services) {
    searchResults.innerHTML = ""; 
    services.forEach(service => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="search-item">
          <h4>${service.name}</h4>
          <p>${service.description}</p>
          ${
            service.image_url
              ? `<img src="${service.image_url}" alt="Imagen de ${service.name}">`
              : ""
          }
        </div>
      `;
      searchResults.appendChild(li);
    });
  }

  // Inicializar
  loadServices();
});
