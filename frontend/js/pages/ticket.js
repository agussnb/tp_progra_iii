document.addEventListener('DOMContentLoaded', () => {

  
  const nombreCliente = localStorage.getItem('nombreCliente') || 'Cliente';
  const carrito = localStorage.getItem('carrito');
  const items = carrito ? JSON.parse(carrito) : [];
  const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  
  const fecha = new Date();
  const fechaStr = fecha.toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const horaStr = fecha.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit'
  });


  const container = document.getElementById('ticketContent');

  if (items.length === 0) {
    container.innerHTML = `
      <div class="ticket-vacio">
        <p>No hay productos en el carrito</p>
      </div>
    `;
    document.getElementById('descargarPDF').style.display = 'none';
    return;
  }

  container.innerHTML = `
  <div class="ticket-header">
    <h1>COMICMUNDO</h1>
    <p class="ticket-fecha">${fechaStr} - ${horaStr}</p>
    <p class="ticket-cliente"><strong>Cliente:</strong> ${nombreCliente}</p>
  </div>
  
  <div class="ticket-items">
    ${items.map((item, index) => `
      <div class="ticket-item">
        <span class="ticket-item-nombre">${index + 1}. ${item.nombre}</span>
        <span class="ticket-item-cantidad">${item.cantidad} x $${item.precio.toFixed(2)}</span>
        <span class="ticket-item-subtotal">$${(item.precio * item.cantidad).toFixed(2)}</span>
      </div>
    `).join('')}
  </div>
  
  <div class="ticket-total">
    <span><strong>TOTAL</strong></span>
    <span><strong>$${total.toFixed(2)}</strong></span>
  </div>
  
  <div class="ticket-footer">
    <p>contacto@comicmundo.com</p>
    <p>11-1234-5678</p>
    <p>UTN Sede Mitre, Buenos Aires, Argentina</p>
    <br>
    <p>¡Gracias por tu compra!</p>
  </div>
`;
  
  document.getElementById('descargarPDF').addEventListener('click', async () => {
    const datosTicket = {
      cliente: nombreCliente,
      items: items,
      total: total,
      fecha: fechaStr,
      hora: horaStr
    };

    try {
      const response = await fetch('http://localhost:3000/api/ticket/generar-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosTicket)
      });

      if (!response.ok) {
        throw new Error('Error al generar el PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-comicmundo-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      Swal.fire({
        icon: 'success',
        title: '¡PDF descargado!',
        text: 'El sistema se reiniciará automáticamente.',
        timer: 2000,
        showConfirmButton: false
      });

      setTimeout(() => {
        localStorage.removeItem('carrito');
        localStorage.removeItem('nombreCliente');
        window.location.href = 'index.html';
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo generar el PDF. Intentá de nuevo.'
      });
    }
  });

  
  document.getElementById('volverInicio').addEventListener('click', () => {
    Swal.fire({
      title: '¿Empezar nueva compra?',
      text: 'El sistema se reiniciará completamente.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, reiniciar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('carrito');
        localStorage.removeItem('nombreCliente');
        window.location.href = 'index.html';
      }
    });
  });
});