
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

const categoriasLocales = [
  {
    nombre: "Estrategia",
    imagen: "https://cdn.ligadegamers.com/imagenes/age-of-empires-ii-definitive-edition-0-cke.jpg"
  },
  {
    nombre: "Familiares",
    imagen: "https://img.europapress.es/fotoweb/fotonoticia_20160309110619_1200_v2.jpg"
  },
  {
    nombre: "Fiesta",
    imagen: "https://cuponassets.cuponatic-latam.com/backendPe/uploads/imagenes_descuentos/111056/9ef6bbbdcd12ea3b22c5a9d3c85f40a21db87756.XL2.jpg"
  },
  {
    nombre: "Infantiles",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuWWW0Di8W-V-WBnwEQyV2NaOT7xuZNP2D8A&s"
  }
];

async function obtenerCategoriasAPI() {
  // Obtenemos todos los juegos y extraemos los géneros únicos (por si quieres verlos)
  const res = await fetch(`${API_BASE}/games`);
  const data = await res.json();
  const cats = [...new Set(data.map(j => j.genre))];
  categoriasAPI = cats.slice(0, 10); // máximo 10 categorías
  juegosAPI = data; // Guardamos todos los juegos para filtrar localmente
  juegosFiltrados = data;
  juegosMostrados = 0;
}


function mostrarImagenCategoria(nombreCategoria) {
  const contImg = document.getElementById('categoria-imagen');
  if (!contImg) return;
  if (!nombreCategoria) {
    contImg.innerHTML = '';
    return;
  }
  const cat = categoriasLocales.find(c => c.nombre === nombreCategoria);
  if (cat && cat.imagen) {
    contImg.innerHTML = `
      <img src="${cat.imagen}" alt="${cat.nombre}">
      <span class="titulo-categoria">${cat.nombre}</span>
    `;
  } else {
    contImg.innerHTML = '';
  }
}

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
    mostrarImagenCategoria(null);
    renderJuegosAPI();
  };
  contFiltros.appendChild(btnTodos);
  categoriasLocales.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat.nombre;
    btn.className = 'boton';
    btn.onclick = () => {
      categoriaSeleccionada = cat.nombre;
      // Filtrar juegos cuyo género esté en el array asociado a la categoría
      juegosFiltrados = juegosAPI.filter(j => categoriaGeneroMap[cat.nombre].some(g => j.genre && j.genre.toLowerCase().includes(g.toLowerCase())));
      juegosMostrados = 0;
      mostrarImagenCategoria(cat.nombre);
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
  mostrarImagenCategoria(null);
  renderJuegosAPI();
}

// --- FIN INTEGRACIÓN API ---

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