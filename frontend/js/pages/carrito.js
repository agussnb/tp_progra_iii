function obtenerCarrito() {
  const carrito = localStorage.getItem('carrito');
  return carrito ? JSON.parse(carrito) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function actualizarContadorFlotante() {
  const carrito = obtenerCarrito();
  const cantidad = carrito.reduce((total, item) => total + item.cantidad, 0);
  const contadorFlotante = document.getElementById('carritoFlotanteCount');
  if (contadorFlotante) {
    contadorFlotante.textContent = cantidad;
  }
}

function mostrarEstadoCarrito() {
  const carrito = obtenerCarrito();
  const carritoVacioDiv = document.getElementById('carritoVacio');
  const carritoLlenoDiv = document.getElementById('carritoLleno');
  
  if (carrito.length === 0) {
    carritoVacioDiv.style.display = 'block';
    carritoLlenoDiv.style.display = 'none';
  } else {
    carritoVacioDiv.style.display = 'none';
    carritoLlenoDiv.style.display = 'block';
  }
}

function renderizarCarrito() {
  const carrito = obtenerCarrito();
  const container = document.getElementById('carritoItems');
  const totalSpan = document.getElementById('totalCarrito');
  
  if (carrito.length === 0) {
    mostrarEstadoCarrito();
    return;
  }
  
  let total = 0;
  
  container.innerHTML = carrito.map(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    
    let imagenUrl = item.imagen;
    if (imagenUrl && imagenUrl.startsWith('/uploads')) {
      imagenUrl = `http://localhost:3000${imagenUrl}`;
    }
    
    return `
      <div class="carrito-item" data-id="${item.id}">
        <img src="${imagenUrl}" alt="${item.nombre}" class="carrito-item-imagen" onerror="this.src='https://placehold.co/280x250/gray/white?text=Error'">
        <div class="carrito-item-info">
          <h3 class="carrito-item-nombre">${item.nombre}</h3>
          <p class="carrito-item-precio">$${item.precio.toLocaleString()} c/u</p>
        </div>
        <div class="carrito-item-cantidad">
          <button class="carrito-cantidad-btn menos" data-id="${item.id}">-</button>
          <span class="carrito-cantidad-valor" id="cant-${item.id}">${item.cantidad}</span>
          <button class="carrito-cantidad-btn mas" data-id="${item.id}">+</button>
        </div>
        <div class="carrito-item-subtotal">
          $${subtotal.toLocaleString()}
        </div>
        <button class="carrito-item-eliminar" data-id="${item.id}">ELIMINAR</button>
      </div>
    `;
  }).join('');
  
  totalSpan.textContent = `$${total.toLocaleString()}`;
  mostrarEstadoCarrito();
  
  carrito.forEach(item => {
    const btnMenos = document.querySelector(`.carrito-cantidad-btn.menos[data-id="${item.id}"]`);
    if (btnMenos) {
      btnMenos.addEventListener('click', () => modificarCantidad(item.id, -1));
    }
    
    const btnMas = document.querySelector(`.carrito-cantidad-btn.mas[data-id="${item.id}"]`);
    if (btnMas) {
      btnMas.addEventListener('click', () => modificarCantidad(item.id, 1));
    }
    
    const btnEliminar = document.querySelector(`.carrito-item-eliminar[data-id="${item.id}"]`);
    if (btnEliminar) {
      btnEliminar.addEventListener('click', () => eliminarItemCompleto(item.id));
    }
  });
}

function modificarCantidad(id, cambio) {
  const carrito = obtenerCarrito();
  const index = carrito.findIndex(item => item.id === id);
  
  if (index !== -1) {
    const nuevaCantidad = carrito[index].cantidad + cambio;
    
    if (nuevaCantidad <= 0) {
      carrito.splice(index, 1);
    } else {
      carrito[index].cantidad = nuevaCantidad;
    }
    
    guardarCarrito(carrito);
    renderizarCarrito();
    actualizarContadorFlotante();
  }
}

function eliminarItemCompleto(id) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "Se va a remover este producto del carrito.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      const carrito = obtenerCarrito();        
      const nuevoCarrito = carrito.filter(item => item.id !== id);
      guardarCarrito(nuevoCarrito);
      renderizarCarrito();
      actualizarContadorFlotante();
    }
  });
}

function vaciarCarrito() {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "Se van a remover todos los productos del carrito.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, vaciar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      guardarCarrito([]);
      renderizarCarrito();
      actualizarContadorFlotante();
      Swal.fire({
        title: '¡Vaciado!',
        text: 'Tu carrito está limpio de nuevo.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
}

async function finalizarCompra() {
  const carrito = obtenerCarrito();
  
  if (carrito.length === 0) {
    Swal.fire({
      icon: 'error',
      title: 'Carrito vacío',
      text: 'No tenés ningún producto seleccionado para procesar la compra.',
      confirmButtonColor: '#3085d6'
    });
    return;
  }

  const confirmacion = await Swal.fire({
    title: '¿Confirmar compra?',
    text: "Vas a registrar esta transacción en el sistema.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#28a745',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, confirmar compra',
    cancelButtonText: 'Revisar carrito'
  });

  if (!confirmacion.isConfirmed) return;

  Swal.fire({
    title: 'Procesando venta...',
    text: 'Asegurando stock y registrando logs.',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  try {
    const nombreCliente = localStorage.getItem('nombreCliente') || 'Cliente General';
    const payload = {
      clientName: nombreCliente,
      products: carrito.map(item => ({
        id: item.id,
        quantity: item.cantidad
      }))
    };

    const response = await fetch('http://localhost:3000/api/ventas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Error al procesar la venta');
    }

    await Swal.fire({
      icon: 'success',
      title: '¡Venta procesada con éxito!',
      timer: 1500,
      showConfirmButton: false
    });

    window.location.href = 'ticket.html';

  } catch (error) {
    console.error('Error al impactar la API de ventas:', error);

    Swal.fire({
      icon: 'error',
      title: 'No se pudo completar la venta',
      text: error.message,
      confirmButtonColor: '#d33'
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarCarrito();
  actualizarContadorFlotante();
  
  document.getElementById('vaciarCarritoBtn')?.addEventListener('click', vaciarCarrito);
  document.getElementById('finalizarCompraBtn')?.addEventListener('click', finalizarCompra);
  document.getElementById('seguirComprandoBtn')?.addEventListener('click', () => {
    window.location.href = 'grilla-productos.html';
  });
  document.getElementById('botonProductos')?.addEventListener('click', () => {
    window.location.href = 'grilla-productos.html';
  });

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