document.addEventListener("DOMContentLoaded", () => {
  const apiUrlServices = "http://localhost:3000/api/services";
  const apiUrlComponents = "http://localhost:3000/api/components";

  const servicesList = document.getElementById("services-list");
  const componentsList = document.getElementById("components-list");
  const searchBarServices = document.getElementById("search-bar-services");
  const searchResultsServices = document.getElementById("search-results-services");
  const searchBarComponents = document.getElementById("search-bar-components");
  const searchResultsComponents = document.getElementById("search-results-components");
  const serviceForm = document.getElementById("service-form");
  const componentForm = document.getElementById("component-form");

  // Cargar servicios
  async function loadServices() {
    try {
      const response = await fetch(apiUrlServices);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const services = await response.json();
      displayServices(services);
    } catch (error) {
      console.error("Error al cargar los servicios:", error);
      servicesList.innerHTML = "<li>Error al cargar los servicios.</li>";
    }
  }

  // Mostrar servicios
  function displayServices(services) {
    servicesList.innerHTML = "";
    services.forEach(service => {
      const li = document.createElement("li");
      li.classList.add("service-item");
      li.innerHTML = `
        <h3>${service.name}</h3>
        <p>${service.description}</p>
        ${service.image_url ? `<img src="${getImageUrl(service.image_url)}" alt="Imagen de ${service.name}">` : ""}
      `;
      servicesList.appendChild(li);
    });
  }

  // Obtener URL de imagen
  function getImageUrl(imageUrl) {
    return imageUrl.startsWith("http") ? imageUrl : "/uploads/" + imageUrl;
  }

  // Añadir servicio
  serviceForm.addEventListener("submit", async event => {
    event.preventDefault();
    const formData = new FormData(serviceForm);

    try {
      const response = await fetch(apiUrlServices, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error(`Error al añadir servicio: ${response.statusText}`);
      alert("Servicio añadido exitosamente.");
      loadServices();
      serviceForm.reset();
    } catch (error) {
      console.error("Error al añadir servicio:", error);
      alert("No se pudo añadir el servicio. Inténtalo más tarde.");
    }
  });

  // Filtrar servicios
  searchBarServices.addEventListener("input", () => 
    searchItems(apiUrlServices, searchBarServices.value, displaySearchResultsServices)
  );

  // Mostrar resultados de búsqueda de servicios
  function displaySearchResultsServices(services) {
    searchResultsServices.innerHTML = "";
    services.forEach(service => {
      const li = document.createElement("li");
      li.classList.add("search-item");
      li.innerHTML = `
        <h4>${service.name}</h4>
        <p>${service.description}</p>
        ${service.image_url ? `<img src="${getImageUrl(service.image_url)}" alt="Imagen de ${service.name}">` : ""}
      `;
      searchResultsServices.appendChild(li);
    });
  }

  // Cargar componentes
  async function loadComponents() {
    try {
      const response = await fetch(apiUrlComponents);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const components = await response.json();
      displayComponents(components);
    } catch (error) {
      console.error("Error al cargar los componentes:", error);
      componentsList.innerHTML = "<li>Error al cargar los componentes.</li>";
    }
  }

  // Mostrar componentes
  function displayComponents(components) {
    componentsList.innerHTML = "";
    components.forEach(component => {
      const li = document.createElement("li");
      li.classList.add("component-item");
      li.innerHTML = `
        <h3>${component.name}</h3>
        <p>${component.description}</p>
        ${component.image_url ? `<img src="${getImageUrl(component.image_url)}" alt="Imagen de ${component.name}">` : ""}
      `;
      componentsList.appendChild(li);
    });
  }

  // Añadir componente
 // Añadir componente (con JSON)
componentForm.addEventListener("submit", async event => {
  event.preventDefault();
  
  // Extraer los valores del formulario
  const formData = new FormData(componentForm);
  const componentData = {};
  
  formData.forEach((value, key) => {
    componentData[key] = value;
  });

  try {
    const response = await fetch(apiUrlComponents, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",  // Especifica que estamos enviando JSON
      },
      body: JSON.stringify(componentData),  // Enviar los datos como JSON
    });
    
    if (!response.ok) throw new Error(`Error al añadir componente: ${response.statusText}`);
    alert("Componente añadido exitosamente.");
    loadComponents();
    componentForm.reset();
  } catch (error) {
    console.error("Error al añadir componente:", error);
    alert("No se pudo añadir el componente. Inténtalo más tarde.");
  }
});


  // Filtrar componentes
  searchBarComponents.addEventListener("input", () => 
    searchItems(apiUrlComponents, searchBarComponents.value, displaySearchResultsComponents)
  );

  // Mostrar resultados de búsqueda de componentes
  function displaySearchResultsComponents(components) {
    searchResultsComponents.innerHTML = "";
    components.forEach(component => {
      const li = document.createElement("li");
      li.classList.add("search-item");
      li.innerHTML = `
        <h4>${component.name}</h4>
        <p>${component.description}</p>
        ${component.image_url ? `<img src="${getImageUrl(component.image_url)}" alt="Imagen de ${component.name}">` : ""}
      `;
      searchResultsComponents.appendChild(li);
    });
  }

  // Buscar elementos generales
  async function searchItems(url, query, displayFunction) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const items = await response.json();
      const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      displayFunction(filteredItems);
    } catch (error) {
      console.error("Error al buscar elementos:", error);
    }
  }

  // Inicializar servicios y componentes
  loadServices();
  loadComponents();
});
