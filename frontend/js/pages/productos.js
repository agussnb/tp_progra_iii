//array con productos (prueba)
const productos = [
  { id: 1, nombre: "Spider-Man: Miles Morales", precio: 8900, imagen: "https://placehold.co/280x250/red/white?text=Spider-Man", categoria: "marvel", activo: true },
  { id: 2, nombre: "Avengers: Endgame", precio: 12500, imagen: "https://placehold.co/280x250/red/white?text=Avengers", categoria: "marvel", activo: true },
  { id: 3, nombre: "X-Men: Días del futuro pasado", precio: 9800, imagen: "https://placehold.co/280x250/red/white?text=X-Men", categoria: "marvel", activo: true },
  { id: 4, nombre: "Deadpool", precio: 7500, imagen: "https://placehold.co/280x250/red/white?text=Deadpool", categoria: "marvel", activo: true },
  { id: 5, nombre: "Captain America: Civil War", precio: 11200, imagen: "https://placehold.co/280x250/red/white?text=Captain+America", categoria: "marvel", activo: true },
  { id: 6, nombre: "Thor: Ragnarok", precio: 10200, imagen: "https://placehold.co/280x250/red/white?text=Thor", categoria: "marvel", activo: true },
  { id: 7, nombre: "Black Panther", precio: 9500, imagen: "https://placehold.co/280x250/red/white?text=Black+Panther", categoria: "marvel", activo: true },
  { id: 8, nombre: "Iron Man: Extremis", precio: 8800, imagen: "https://placehold.co/280x250/red/white?text=Iron+Man", categoria: "marvel", activo: true },
  
  { id: 9, nombre: "Batman: Año Uno", precio: 8500, imagen: "https://placehold.co/280x250/blue/white?text=Batman", categoria: "dc", activo: true },
  { id: 10, nombre: "Watchmen", precio: 9500, imagen: "https://placehold.co/280x250/blue/white?text=Watchmen", categoria: "dc", activo: true },
  { id: 11, nombre: "The Sandman", precio: 12500, imagen: "https://placehold.co/280x250/blue/white?text=Sandman", categoria: "dc", activo: true },
  { id: 12, nombre: "V de Vendetta", precio: 7800, imagen: "https://placehold.co/280x250/blue/white?text=V+de+Vendetta", categoria: "dc", activo: true },
  { id: 13, nombre: "Superman: Red Son", precio: 9200, imagen: "https://placehold.co/280x250/blue/white?text=Superman", categoria: "dc", activo: true },
  { id: 14, nombre: "Joker: Killer Smile", precio: 6800, imagen: "https://placehold.co/280x250/blue/white?text=Joker", categoria: "dc", activo: true },
  { id: 15, nombre: "Flash: Flashpoint", precio: 8900, imagen: "https://placehold.co/280x250/blue/white?text=Flash", categoria: "dc", activo: true },
  { id: 16, nombre: "Wonder Woman: The Hiketeia", precio: 9300, imagen: "https://placehold.co/280x250/blue/white?text=Wonder+Woman", categoria: "dc", activo: true }
];

let paginaActual = 1;
let categoriaActual = 'todos';
const productosPorPagina = 8;

function obtenerProductos() {
  let filtrados = productos.filter(p => p.activo === true);
  
  if (categoriaActual !== 'todos') {
    filtrados = filtrados.filter(p => p.categoria === categoriaActual);
  }
  
  const inicio = (paginaActual - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  
  return {
    productos: filtrados.slice(inicio, fin),
    total: filtrados.length,
    totalPaginas: Math.ceil(filtrados.length / productosPorPagina)
  };
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
  if (cantidad <= 0) {
    alert(`Seleccioná una cantidad para "${producto.nombre}"`);
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
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
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
  
  alert(`Agregado "${producto.nombre}" x ${cantidad} cant. al carrito`);
  return true;
}

function renderizarProductos() {
  const { productos: productosPagina, totalPaginas } = obtenerProductos();
  const grid = document.getElementById('productosGrid');
  
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
  
  grid.innerHTML = productosPagina.map(producto => `
    <div class="producto-card" data-id="${producto.id}">
      <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen" onerror="this.src='https://placehold.co/280x250/gray/white?text=Error'">
      <div class="producto-info">
        <h3 class="producto-nombre">${producto.nombre}</h3>
        <p class="producto-precio">$${producto.precio.toLocaleString()}</p>
        <div class="producto-cantidad">
          <button class="cantidad-boton menos" data-id="${producto.id}">-</button>
          <span class="cantidad-valor" id="cant-${producto.id}">${cantidades[producto.id]}</span>
          <button class="cantidad-boton mas" data-id="${producto.id}">+</button>
        </div>
        <button class="btn-agregar-carrito" data-id="${producto.id}">🛒 Agregar al carrito</button>
      </div>
    </div>
  `).join('');
  
  document.getElementById('paginaInfo').textContent = `Página ${paginaActual} de ${totalPaginas}`;
  document.getElementById('botonAnterior').disabled = paginaActual === 1;
  document.getElementById('botonSiguiente').disabled = paginaActual === totalPaginas;
  
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
          alert(`Seleccioná una cantidad para "${producto.nombre}"`);
        }
      });
    }
  });
}

function paginaSiguiente() {
  const { totalPaginas } = obtenerProductos();
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
  categoriaActual = categoria;
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

