document.addEventListener('DOMContentLoaded', function() {
  const servicesList = document.getElementById('services-list');
  const componentsList = document.getElementById('components-list');
  const serviceForm = document.getElementById('service-form');
  const componentForm = document.getElementById('component-form');
  const searchService = document.getElementById('search-service');
  const searchComponent = document.getElementById('search-component');
  const searchServiceResults = document.getElementById('search-service-results');
  const searchComponentResults = document.getElementById('search-component-results');

  let services = JSON.parse(localStorage.getItem('services')) || [];
  let components = JSON.parse(localStorage.getItem('components')) || [];

  function renderList(items, listElement) {
    listElement.innerHTML = '';
    items.forEach((item, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <img src="${item.image}" alt="${item.name}" style="max-width: 200px;">
        <button onclick="editItem('${item.type}', ${index})">Editar</button>
        <button onclick="deleteItem('${item.type}', ${index})">Eliminar</button>
      `;
      listElement.appendChild(li);
    });
  }

  function renderServices() {
    renderList(services, servicesList);
  }

  function renderComponents() {
    renderList(components, componentsList);
  }

  function handleFormSubmit(e, type) {
    e.preventDefault();
    const form = e.target;
    const nameInput = form.querySelector(`#${type}-name`);
    const descriptionInput = form.querySelector(`#${type}-description`);
    const imageInput = form.querySelector(`#${type}-image`);

    const reader = new FileReader();
    reader.onload = function(event) {
      const newItem = {
        type: type,
        name: nameInput.value,
        description: descriptionInput.value,
        image: event.target.result
      };

      if (form.dataset.editing) {
        const index = parseInt(form.dataset.editing);
        if (type === 'service') {
          services[index] = newItem;
        } else {
          components[index] = newItem;
        }
        delete form.dataset.editing;
      } else {
        if (type === 'service') {
          services.push(newItem);
        } else {
          components.push(newItem);
        }
      }

      localStorage.setItem('services', JSON.stringify(services));
      localStorage.setItem('components', JSON.stringify(components));

      renderServices();
      renderComponents();
      form.reset();
    };

    reader.readAsDataURL(imageInput.files[0]);
  }

  serviceForm.addEventListener('submit', (e) => handleFormSubmit(e, 'service'));
  componentForm.addEventListener('submit', (e) => handleFormSubmit(e, 'component'));

  function search(items, query) {
    return items.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) || 
      item.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  searchService.addEventListener('input', function() {
    const results = search(services, this.value);
    renderList(results, searchServiceResults);
  });

  searchComponent.addEventListener('input', function() {
    const results = search(components, this.value);
    renderList(results, searchComponentResults);
  });

  window.editItem = function(type, index) {
    const item = type === 'service' ? services[index] : components[index];
    const form = type === 'service' ? serviceForm : componentForm;
    form.querySelector(`#${type}-name`).value = item.name;
    form.querySelector(`#${type}-description`).value = item.description;
    form.dataset.editing = index;
  };

  window.deleteItem = function(type, index) {
    if (confirm('¿Estás seguro de que quieres eliminar este item?')) {
      if (type === 'service') {
        services.splice(index, 1);
      } else {
        components.splice(index, 1);
      }
      localStorage.setItem('services', JSON.stringify(services));
      localStorage.setItem('components', JSON.stringify(components));
      renderServices();
      renderComponents();
    }
  };

  // Manejo de pestañas
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      button.classList.add('active');
      document.getElementById(`${tabId}-tab`).classList.add('active');
    });
  });

  renderServices();
  renderComponents();
});

