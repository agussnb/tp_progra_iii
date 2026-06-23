document.addEventListener('DOMContentLoaded', () => {
  
  
  const nombreInput = document.getElementById('nombreInput');
  const continuarBtn = document.getElementById('continuarBtn');
  const botonAdmin = document.getElementById('botonAdmin');
  const botonTema = document.getElementById('botonTema');
  
  
  if (nombreInput && continuarBtn) {
    
    nombreInput.addEventListener('input', (eventoInput) => {
      const tieneTexto = eventoInput.target.value.trim() !== '';
      continuarBtn.disabled = !tieneTexto;
    });
    
    continuarBtn.addEventListener('click', () => {
      const nombre = nombreInput.value.trim();
      if (nombre) {
        localStorage.setItem('nombreCliente', nombre);
        localStorage.removeItem('carrito');
        window.location.href = 'grilla-productos.html';
      }
    });
  } 

  if (nombreInput) {
    nombreInput.focus();
  }
  
  if (botonAdmin) {
  botonAdmin.addEventListener('click', () => {
    window.location.href = 'http://localhost:3000/';
  });
}
  
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