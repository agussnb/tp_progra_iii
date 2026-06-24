const productosMock = [
  { id: 1, name: "Spider-Man: Miles Morales", price: 8900, image: "https://placehold.co/280x250/red/white?text=Spider-Man", category: "marvel", active: true },
  { id: 2, name: "Avengers: Endgame", price: 12500, image: "https://placehold.co/280x250/red/white?text=Avengers", category: "marvel", active: true },
  { id: 3, name: "X-Men: Días del futuro pasado", price: 9800, image: "https://placehold.co/280x250/red/white?text=X-Men", category: "marvel", active: true },
  { id: 4, name: "Deadpool", price: 7500, image: "https://placehold.co/280x250/red/white?text=Deadpool", category: "marvel", active: true },
  { id: 5, name: "Captain America: Civil War", price: 11200, image: "https://placehold.co/280x250/red/white?text=Captain+America", category: "marvel", active: true },
  { id: 6, name: "Thor: Ragnarok", price: 10200, image: "https://placehold.co/280x250/red/white?text=Thor", category: "marvel", active: true },
  { id: 7, name: "Black Panther", price: 9500, image: "https://placehold.co/280x250/red/white?text=Black+Panther", category: "marvel", active: true },
  { id: 8, name: "Iron Man: Extremis", price: 8800, image: "https://placehold.co/280x250/red/white?text=Iron+Man", category: "marvel", active: true },
  
  { id: 9, name: "Batman: Año Uno", price: 8500, image: "https://placehold.co/280x250/blue/white?text=Batman", category: "dc", active: true },
  { id: 10, name: "Watchmen", price: 9500, image: "https://placehold.co/280x250/blue/white?text=Watchmen", category: "dc", active: true },
  { id: 11, name: "The Sandman", price: 12500, image: "https://placehold.co/280x250/blue/white?text=Sandman", category: "dc", active: true },
  { id: 12, name: "V de Vendetta", price: 7800, image: "https://placehold.co/280x250/blue/white?text=V+de+Vendetta", category: "dc", active: true },
  { id: 13, name: "Superman: Red Son", price: 9200, image: "https://placehold.co/280x250/blue/white?text=Superman", category: "dc", active: true },
  { id: 14, name: "Joker: Killer Smile", price: 6800, image: "https://placehold.co/280x250/blue/white?text=Joker", category: "dc", active: true },
  { id: 15, name: "Flash: Flashpoint", price: 8900, image: "https://placehold.co/280x250/blue/white?text=Flash", category: "dc", active: true },
  { id: 16, name: "Wonder Woman: The Hiketeia", price: 9300, image: "https://placehold.co/280x250/blue/white?text=Wonder+Woman", category: "dc", active: true }
];

let paginaActual = 1;
let categoriaActual = 'todos';
const productosPorPagina = 8; 
const BACKEND_URL = 'http://localhost:3000/api/productos';

async function obtenerProductos() {
  try {
    const response = await fetch(`${BACKEND_URL}?page=${paginaActual}`);
    
    if (!response.ok) {
      throw new Error('La respuesta del servidor no fue correcta');
    }
    
    const data = await response.json();
    
    let listaProductos = data.products || [];
    
    if (categoriaActual !== 'todos') {
      listaProductos = listaProductos.filter(p => 
        (p.category || p.categoria || '').toLowerCase() === categoriaActual.toLowerCase()
      );
    }

    return {
      productos: listaProductos,
      totalPaginas: data.totalPages || 1
    };

  } catch (error) {
    console.warn('No se pudo conectar al backend, usando datos mockeados:', error.message);
    
    let filtrados = productosMock.filter(p => p.active === true);
    
    if (categoriaActual !== 'todos') {
      filtrados = filtrados.filter(p => 
        (p.category || p.categoria || '').toLowerCase() === categoriaActual.toLowerCase()
      );
    }
    
    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    
    return {
      productos: filtrados.slice(inicio, fin),
      totalPaginas: Math.ceil(filtrados.length / productosPorPagina)
    };
  }
}

function actualizarContadorCarrito() {
  const carrito = localStorage.getItem('carrito');
  let cantidad = 0;
  
  if (carrito) {
    const items = JSON.parse(carrito);
    cantidad = items.reduce((total, item) => total + item.cantidad, 0);
  }
  
  const contadorFlotante = document.getElementById('carritoFlotanteCount');
  if (contadorFlotante) {
    contadorFlotante.textContent = cantidad;
  }
}

function agregarAlCarrito(producto, cantidad) {
  const nombreProd = producto.name || producto.nombre;
  const precioProd = producto.price || producto.precio;
  const imagenProd = producto.image || producto.imagen;

  if (cantidad <= 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Cantidad inválida',
      text: `Por favor, seleccioná una cantidad mayor a 0 para "${nombreProd}"`,
      confirmButtonColor: '#3085d6'
    });
    return false;
  }
  
  let carrito = localStorage.getItem('carrito');
  carrito = carrito ? JSON.parse(carrito) : [];
  
  const existeIndex = carrito.findIndex(item => item.id === producto.id);

  if (existeIndex !== -1) {
    carrito[existeIndex].cantidad += cantidad;
  } else {
    carrito.push({
      id: producto.id,
      nombre: nombreProd,
      precio: precioProd,
      imagen: imagenProd,
      cantidad: cantidad
    });
  }
  
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarContadorCarrito();
  
  const carritoFlotante = document.getElementById('carritoFlotante');
  if (carritoFlotante) {
    carritoFlotante.style.animation = 'none';
    setTimeout(() => {
      carritoFlotante.style.animation = 'pulse 0.4s ease-in-out';
    }, 10);
  }
  
  Swal.fire({
    icon: 'success',
    title: '¡Agregado al carrito!',
    text: `"${nombreProd}" x ${cantidad} unidad(es)`,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true
  });

  return true;
}

async function renderizarProductos() {
  const { productos: productosPagina, totalPaginas } = await obtenerProductos();
  const grid = document.getElementById('productosGrid');
  
  if (!grid) return;

  if (productosPagina.length === 0) {
    grid.innerHTML = '<div class="no-productos">No hay productos en esta categoría</div>';
    document.getElementById('botonAnterior').disabled = true;
    document.getElementById('botonSiguiente').disabled = true;
    document.getElementById('paginaInfo').textContent = 'Página 1 de 1';
    return;
  }
  
  const cantidades = {};
  productosPagina.forEach(producto => {
    cantidades[producto.id] = 0;
  });
  
  grid.innerHTML = productosPagina.map(producto => {
    const id = producto.id;
    const nombre = producto.name || producto.nombre;
    const precio = producto.price || producto.precio;
    let imagen = producto.image || producto.imagen;

    if (imagen && imagen.startsWith('/uploads')) {
      imagen = `http://localhost:3000${imagen}`;
    }

    return `
      <div class="producto-card" data-id="${id}">
        <img src="${imagen}" alt="${nombre}" class="producto-imagen" onerror="this.src='https://placehold.co/280x250/gray/white?text=Error'">
        <div class="producto-info">
          <h3 class="producto-nombre">${nombre}</h3>
          <p class="producto-precio">$${precio.toLocaleString()}</p>
          <div class="producto-cantidad">
            <button class="cantidad-boton menos" data-id="${id}">-</button>
            <span class="cantidad-valor" id="cant-${id}">${cantidades[id]}</span>
            <button class="cantidad-boton mas" data-id="${id}">+</button>
          </div>
          <button class="btn-agregar-carrito" data-id="${id}">🛒 Agregar al carrito</button>
        </div>
      </div>
    `;
  }).join('');
  
  document.getElementById('paginaInfo').textContent = `Página ${paginaActual} de ${totalPaginas}`;
  document.getElementById('botonAnterior').disabled = paginaActual === 1;
  document.getElementById('botonSiguiente').disabled = paginaActual >= totalPaginas;
  
  productosPagina.forEach(producto => {
    const cantidadSpan = document.getElementById(`cant-${producto.id}`);
    let cantidad = 0;
    
    const botonMenos = document.querySelector(`.cantidad-boton.menos[data-id="${producto.id}"]`);
    if (botonMenos) {
      botonMenos.addEventListener('click', () => {
        if (cantidad > 0) {
          cantidad--;
          cantidadSpan.textContent = cantidad;
        }
      });
    }
    
    const botonMas = document.querySelector(`.cantidad-boton.mas[data-id="${producto.id}"]`);
    if (botonMas) {
      botonMas.addEventListener('click', () => {
        cantidad++;
        cantidadSpan.textContent = cantidad;
      });
    }
    
    const btnAgregar = document.querySelector(`.btn-agregar-carrito[data-id="${producto.id}"]`);
    if (btnAgregar) {
      btnAgregar.addEventListener('click', () => {
        if (cantidad > 0) {
          agregarAlCarrito(producto, cantidad);
          cantidad = 0;
          cantidadSpan.textContent = 0;
        } else {
          Swal.fire({
            icon: 'warning',
            title: '¡Atención!',
            text: `Seleccioná una cantidad para "${producto.name || producto.nombre}" antes de agregar.`,
            confirmButtonColor: '#3085d6'
          });
        }
      });
    }
  });
}

async function paginaSiguiente() {
  const { totalPaginas } = await obtenerProductos();
  if (paginaActual < totalPaginas) {
    paginaActual++;
    renderizarProductos();
  }
}

function paginaAnterior() {
  if (paginaActual > 1) {
    paginaActual--;
    renderizarProductos();
  }
}

function cambiarCategoria(categoria) {
  categoriaActual = categoria.toLowerCase();
  paginaActual = 1;
  renderizarProductos();
  
  document.querySelectorAll('.filtro-boton').forEach(boton => {
    if (boton.dataset.categoria === categoria) {
      boton.classList.add('active');
    } else {
      boton.classList.remove('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarProductos();
  actualizarContadorCarrito();
  
  document.querySelectorAll('.filtro-boton').forEach(boton => {
    boton.addEventListener('click', () => {
      cambiarCategoria(boton.dataset.categoria);
    });
  });
  
  document.getElementById('botonSiguiente')?.addEventListener('click', paginaSiguiente);
  document.getElementById('botonAnterior')?.addEventListener('click', paginaAnterior);
  
  document.getElementById('botonProductos')?.addEventListener('click', () => {
    window.location.href = 'grilla-productos.html';
  });
  
  document.getElementById('botonCarrito')?.addEventListener('click', () => {
    window.location.href = 'carrito.html';
  });
  
  const carritoFlotante = document.getElementById('carritoFlotante');
  if (carritoFlotante) {
    carritoFlotante.addEventListener('click', () => {
      window.location.href = 'carrito.html';
    });
  }

  const botonTema = document.getElementById('botonTema');
  function aplicarTema(tema) {
    if (tema === 'dark') {
      document.body.classList.add('modo-oscuro');
      if (botonTema) botonTema.textContent = '☀️ Modo claro';
    } else {
      document.body.classList.remove('modo-oscuro');
      if (botonTema) botonTema.textContent = '🌙 Modo oscuro';
    }
  }

  document.getElementById('botonInicio')?.addEventListener('click', () => {
  window.location.href = 'index.html';
  });
  
  function cargarTema() {
    const temaGuardado = localStorage.getItem('tema');
    aplicarTema(temaGuardado || 'light');
  }
  
  if (botonTema) {
    botonTema.addEventListener('click', () => {
      const esOscuro = document.body.classList.contains('modo-oscuro');
      const nuevoTema = esOscuro ? 'light' : 'dark';
      localStorage.setItem('tema', nuevoTema);
      aplicarTema(nuevoTema);
    });
  }
  
  cargarTema();
});