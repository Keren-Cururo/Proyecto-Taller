const carruseles = document.querySelectorAll('.carrusel');

const imagenesPorCarrusel = [
  ['/images/p1.jpg', '/images/auto8.jpg', '/images/carr.jpg'], // Carrusel 1
  ['/images/autov.jpg', 'uploads/imagen5.jpg', 'uploads/imagen6.jpg'], // Carrusel 2
  ['uploads/imagen7.jpg', 'uploads/imagen8.jpg', 'uploads/imagen9.jpg'], // Carrusel 3
  ['uploads/imagen10.jpg', 'uploads/imagen11.jpg', 'uploads/imagen12.jpg'], // Carrusel 4
  ['uploads/imagen13.jpg', 'uploads/imagen14.jpg', 'uploads/imagen15.jpg'], // Carrusel 5
  ['uploads/imagen16.jpg', 'uploads/imagen17.jpg', 'uploads/imagen18.jpg']  // Carrusel 6
];

carruseles.forEach((carrusel, index) => {
  const imagenes = imagenesPorCarrusel[index]; // Obtiene las imágenes del carrusel actual
  let indiceActual = 0;

  const imgElement = carrusel.querySelector('img');
  const btnIzquierda = carrusel.querySelector('.btn-izquierda');
  const btnDerecha = carrusel.querySelector('.btn-derecha');

  // Muestra la primera imagen al cargar la página
  imgElement.src = imagenes[indiceActual];

  // Evento para la flecha izquierda
  btnIzquierda.addEventListener('click', () => {
    indiceActual = (indiceActual - 1 + imagenes.length) % imagenes.length;
    imgElement.src = imagenes[indiceActual];
  });

  // Evento para la flecha derecha
  btnDerecha.addEventListener('click', () => {
    indiceActual = (indiceActual + 1) % imagenes.length;
    imgElement.src = imagenes[indiceActual];
  });
});

document.querySelectorAll('.imagen-contenedor img').forEach((imagen) => {
    imagen.addEventListener('click', () => {
      const imagenSrc = imagen.src; // Obtener la ruta de la imagen
      const modal = document.createElement('div'); // Crear el modal
  
      // Estilo del modal para mostrar la imagen ampliada
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.background = 'rgba(0, 0, 0, 0.8)';
      modal.style.display = 'flex';
      modal.style.justifyContent = 'center';
      modal.style.alignItems = 'center';
      modal.style.zIndex = '1000';
  
      // Imagen ampliada con estilos para quitar bordes y radius
      const imagenAmpliada = document.createElement('img');
      imagenAmpliada.src = imagenSrc;
      imagenAmpliada.style.maxWidth = '90%';
      imagenAmpliada.style.maxHeight = '90%';
      imagenAmpliada.style.border = 'none'; // Sin borde blanco
      imagenAmpliada.style.borderRadius = '0'; // Sin bordes redondeados
      imagenAmpliada.style.boxShadow = 'none'; // Sin sombra
  
      modal.appendChild(imagenAmpliada);
      document.body.appendChild(modal);
  
      // Cerrar el modal al hacer clic fuera de la imagen ampliada
      modal.addEventListener('click', () => {
        document.body.removeChild(modal);
      });
    });
  });