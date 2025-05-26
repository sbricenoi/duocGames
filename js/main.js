// Datos de categorías
const categorias = [
  {
    nombre: "Estrategia",
    imagen: "img/categoria1.jpg"
  },
  {
    nombre: "Familiares",
    imagen: "img/categoria2.jpg"
  },
  {
    nombre: "Fiesta",
    imagen: "img/categoria3.jpg"
  },
  {
    nombre: "Infantiles",
    imagen: "img/categoria4.jpg"
  }
];

// Datos de juegos por categoría
const juegos = {
  Estrategia: [
    {
      nombre: "Catan",
      imagen: "img/juego1.jpg",
      descripcion: "Un juego de estrategia y comercio en una isla en expansión.",
      precio: 25000,
      descuento: 10
    },
    {
      nombre: "Carcassonne",
      imagen: "img/juego2.jpg",
      descripcion: "Construye ciudades y caminos en este clásico de colocación de losetas.",
      precio: 20000,
      descuento: 0
    },
    {
      nombre: "Risk",
      imagen: "img/juego3.jpg",
      descripcion: "Conquista el mundo en este legendario juego de estrategia militar.",
      precio: 22000,
      descuento: 15
    }
  ],
  Familiares: [
    {
      nombre: "Dixit",
      imagen: "img/juego4.jpg",
      descripcion: "Un juego de imaginación y narración para toda la familia.",
      precio: 18000,
      descuento: 0
    },
    {
      nombre: "Ticket to Ride",
      imagen: "img/juego5.jpg",
      descripcion: "Construye rutas de tren y conecta ciudades en este divertido juego.",
      precio: 24000,
      descuento: 5
    },
    {
      nombre: "Uno",
      imagen: "img/juego6.jpg",
      descripcion: "El clásico juego de cartas para disfrutar en familia.",
      precio: 7000,
      descuento: 0
    }
  ],
  Fiesta: [
    {
      nombre: "Jungle Speed",
      imagen: "img/juego7.jpg",
      descripcion: "Velocidad y reflejos en un juego ideal para animar cualquier reunión.",
      precio: 12000,
      descuento: 20
    },
    {
      nombre: "Time's Up",
      imagen: "img/juego8.jpg",
      descripcion: "Risas aseguradas con este juego de adivinanzas y mímica.",
      precio: 15000,
      descuento: 0
    },
    {
      nombre: "Pictionary",
      imagen: "img/juego9.jpg",
      descripcion: "Dibuja y adivina en este clásico de las fiestas.",
      precio: 14000,
      descuento: 10
    }
  ],
  Infantiles: [
    {
      nombre: "Candy Land",
      imagen: "img/juego10.jpg",
      descripcion: "Un colorido juego de recorrido para los más pequeños.",
      precio: 10000,
      descuento: 0
    },
    {
      nombre: "Serpientes y Escaleras",
      imagen: "img/juego11.jpg",
      descripcion: "El clásico juego de suerte y diversión para niños.",
      precio: 8000,
      descuento: 5
    },
    {
      nombre: "Dobble Kids",
      imagen: "img/juego12.jpg",
      descripcion: "Agudeza visual y rapidez en un formato infantil.",
      precio: 9000,
      descuento: 0
    }
  ]
};

// --- INTEGRACIÓN CON API FREETOGAME ---
const API_BASE = 'https://www.freetogame.com/api';
let categoriasAPI = [];
let juegosAPI = [];
let juegosFiltrados = [];
let categoriaSeleccionada = null;
let juegosMostrados = 0;
const JUEGOS_POR_CARGA = 3;

// Mapa de asociación entre categorías locales y géneros de la API
const categoriaGeneroMap = {
  'Estrategia': ['Strategy', 'fantasy', 'mmorpg','battle-royale'],
  'Familiares': ['racing'],
  'Fiesta': ['sports'],
  'Infantiles': ['anime', 'social', 'sports']
};

const categoriasLocales = Object.keys(categoriaGeneroMap);

async function obtenerCategoriasAPI() {
  // Obtenemos todos los juegos y extraemos los géneros únicos (por si quieres verlos)
  const res = await fetch(`${API_BASE}/games`);
  const data = await res.json();
  const cats = [...new Set(data.map(j => j.genre))];
  categoriasAPI = cats.slice(0, 10); // máximo 10 categorías
  // Puedes ver los géneros únicos en consola:
  console.log('Géneros únicos de la API:', cats);
  juegosAPI = data; // Guardamos todos los juegos para filtrar localmente
  juegosFiltrados = data;
  juegosMostrados = 0;
}

// Ya no usamos obtenerJuegosAPI por categoría, solo traemos todos y filtramos localmente

function renderFiltrosAPI() {
  const contFiltros = document.getElementById('filtros');
  if (!contFiltros) return;
  contFiltros.innerHTML = '';
  const btnTodos = document.createElement('button');
  btnTodos.textContent = 'Todos';
  btnTodos.className = 'boton';
  btnTodos.onclick = () => {
    categoriaSeleccionada = null;
    juegosFiltrados = juegosAPI;
    juegosMostrados = 0;
    renderJuegosAPI();
  };
  contFiltros.appendChild(btnTodos);
  categoriasLocales.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.className = 'boton';
    btn.onclick = () => {
      categoriaSeleccionada = cat;
      // Filtrar juegos cuyo género esté en el array asociado a la categoría
      juegosFiltrados = juegosAPI.filter(j => categoriaGeneroMap[cat].some(g => j.genre && j.genre.toLowerCase().includes(g.toLowerCase())));
      juegosMostrados = 0;
      renderJuegosAPI();
    };
    contFiltros.appendChild(btn);
  });
}

function renderJuegosAPI() {
  const contJuegos = document.getElementById('juegos');
  if (!contJuegos) return;
  contJuegos.innerHTML = '';
  const juegosAMostrar = juegosFiltrados.slice(0, juegosMostrados + JUEGOS_POR_CARGA);
  juegosAMostrar.forEach(juego => {
    contJuegos.innerHTML += `
      <article class=\"juego\">
        <img src=\"${juego.thumbnail}\" alt=\"${juego.title}\">
        <h3>${juego.title}</h3>
        <p>${juego.short_description}</p>
        <p class=\"precio\">Género: ${juego.genre}</p>
      </article>
    `;
  });
  juegosMostrados = juegosAMostrar.length;
  // Botón cargar más siempre en una línea aparte
  const existingLoadMore = document.getElementById('loadmore-container');
  if (existingLoadMore) existingLoadMore.remove();
  const loadMoreContainer = document.createElement('div');
  loadMoreContainer.className = 'loadmore-container';
  loadMoreContainer.id = 'loadmore-container';
  if (juegosMostrados < juegosFiltrados.length) {
    const btnLoad = document.createElement('button');
    btnLoad.textContent = 'Cargar más';
    btnLoad.className = 'boton';
    btnLoad.onclick = () => {
      renderJuegosAPI();
    };
    loadMoreContainer.appendChild(btnLoad);
  }
  contJuegos.after(loadMoreContainer);
  if (juegosFiltrados.length === 0) {
    contJuegos.innerHTML = '<p>No hay juegos para mostrar en esta categoría.</p>';
  }
}

// Inicialización API
async function iniciarAPI() {
  await obtenerCategoriasAPI();
  renderFiltrosAPI();
  renderJuegosAPI();
}

// --- FIN INTEGRACIÓN API ---

// Mantengo la lógica local para fallback o pruebas
// Renderizado dinámico en index.html
function renderFiltros() {
  const contFiltros = document.getElementById('filtros');
  if (!contFiltros) return;
  contFiltros.innerHTML = '';
  const btnTodos = document.createElement('button');
  btnTodos.textContent = 'Todos';
  btnTodos.className = 'boton';
  btnTodos.onclick = () => renderJuegos();
  contFiltros.appendChild(btnTodos);
  categorias.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat.nombre;
    btn.className = 'boton';
    btn.onclick = () => renderJuegos(cat.nombre);
    contFiltros.appendChild(btn);
  });
}

function renderJuegos(categoria) {
  const contJuegos = document.getElementById('juegos');
  if (!contJuegos) return;
  contJuegos.innerHTML = '';
  let juegosMostrar = [];
  if (!categoria) {
    // Mostrar todos los juegos de todas las categorías
    Object.values(juegos).forEach(arr => juegosMostrar.push(...arr));
  } else {
    juegosMostrar = juegos[categoria] || [];
  }
  if (juegosMostrar.length === 0) {
    contJuegos.innerHTML = '<p>No hay juegos para mostrar.</p>';
    return;
  }
  juegosMostrar.forEach(juego => {
    contJuegos.innerHTML += `
      <article class="juego">
        <img src="${juego.imagen}" alt="${juego.nombre}">
        <h3>${juego.nombre}</h3>
        <p>${juego.descripcion}</p>
        <p class="precio">$${juego.precio.toLocaleString()}${juego.descuento ? ` <span class="descuento">${juego.descuento}% OFF</span>` : ''}</p>
      </article>
    `;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  iniciarAPI();
}); 