const API_SERVICIOS_URL = "http://localhost:3000/servicios";

const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const inputID = document.getElementById("serviceID");
const inputNombre = document.getElementById("serviceName");
const inputDescripcion = document.getElementById("serviceDescription");
const inputImagen = document.getElementById("imagen");
const imagenPreview = document.getElementById("imagenPreview");
const form = document.getElementById("formulario-servicios");

let selectedServicioId = null;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await storeServicio();
});

async function getNextServicioID() {
  try {
    const response = await fetch(API_SERVICIOS_URL);
    if (!response.ok) throw new Error("No se pudieron obtener los servicios.");
    const servicios = await response.json();
    inputID.value = servicios.length === 0 ? "1" : Math.max(...servicios.map(s => s.id_servicio)) + 1;
  } catch (error) {
    console.error("Error al obtener el próximo ID:", error);
    inputID.value = "Error";
  }
}

async function storeServicio() {
  const nombre = inputNombre.value.trim();
  const descripcion = inputDescripcion.value.trim();
  const imagen = inputImagen.files[0];

  if (!nombre || !descripcion) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  try {
    const requestMethod = selectedServicioId ? "PUT" : "POST";
    const url = selectedServicioId
      ? `${API_SERVICIOS_URL}/${selectedServicioId}`
      : `${API_SERVICIOS_URL}`;

    const bodyData = new FormData();
    bodyData.append("nombre_servicio", nombre);
    bodyData.append("descripcion", descripcion);
    if (imagen) bodyData.append("imagen", imagen);

    const response = await fetch(url, {
      method: requestMethod,
      body: bodyData,
    });

    if (!response.ok) throw new Error(await response.text());

    alert(selectedServicioId ? "Servicio actualizado correctamente." : "Servicio creado correctamente.");
    cancelEdit();
    allServicios();
  } catch (error) {
    console.error("Error:", error);
    alert("Error al guardar el servicio: " + error.message);
  }
}

function cancelEdit() {
  selectedServicioId = null;
  form.reset();
  btnCancelar.style.display = "none";
  btnGuardar.innerText = "Guardar Servicio";
  imagenPreview.src = "";
  getNextServicioID();
}

inputImagen.addEventListener("change", () => {
  const file = inputImagen.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      imagenPreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

async function allServicios() {
  try {
    const response = await fetch(API_SERVICIOS_URL);
    if (!response.ok) throw new Error("No se pudieron cargar los servicios.");

    const servicios = await response.json();
    const tableBody = document.querySelector("#table-servicios tbody");
    tableBody.innerHTML = "";

    servicios.forEach(servicio => {
      const row = document.createElement("tr");
row.innerHTML = `
  <td>${servicio.id_servicio}</td>
  <td>${servicio.nombre_servicio}</td>
  <td>${servicio.descripcion}</td>
  <td>${servicio.imagen ? `<img src="/uploads/${servicio.imagen}" width="50" onerror="this.onerror=null;this.src='path/to/default-image.jpg';">` : 'Sin Imagen'}</td>
  <td>${servicio.fecha_alta || '-'}</td>
  <td>
    <button class="btn-edit" onclick="editServicio(${servicio.id_servicio}, '${servicio.nombre_servicio}', '${servicio.descripcion}', '${servicio.imagen}')">✏️</button>
    <button class="btn-delete" onclick="destroyServicio(${servicio.id_servicio})">🗑️</button>
  </td>
`;


      tableBody.appendChild(row);
    });

    getNextServicioID();
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }
}

function editServicio(id, nombre, descripcion, imagenURL) {
  selectedServicioId = id;

  inputID.value = id;
  inputNombre.value = nombre;
  inputDescripcion.value = descripcion;
  imagenPreview.src = imagenURL && imagenURL !== "null" ? `/uploads/${imagenURL}` : "path/to/default-image.jpg";

  btnCancelar.style.display = "inline-block";
}

async function destroyServicio(id) {
  if (!confirm("¿Estás seguro de que deseas eliminar este servicio?")) return;

  try {
    const response = await fetch(`${API_SERVICIOS_URL}/${id}`, {
      method: "DELETE"
    });
    if (!response.ok) throw new Error(await response.text());
    alert("Servicio eliminado correctamente.");
    allServicios();
  } catch (error) {
    console.error("Error al eliminar el servicio:", error);
    alert("Error al eliminar el servicio: " + error.message);
  }
}

async function showServicio() {
  const servicioId = document.getElementById("input-busqueda").value.trim();
  if (!servicioId) {
    alert("Por favor, ingresa un ID.");
    return;
  }

  try {
    const response = await fetch(`${API_SERVICIOS_URL}/${servicioId}`);
    if (!response.ok) throw new Error("Servicio no encontrado.");

    const servicio = await response.json();
    const tableBody = document.querySelector("#table-servicios tbody");
    tableBody.innerHTML = "";

    const row = document.createElement("tr");
    row.innerHTML = `
  <td>${servicio.id_servicio}</td>
  <td>${servicio.nombre_servicio}</td>
  <td>${servicio.descripcion}</td>
  <td>${servicio.imagen ? `<img src="/uploads/${servicio.imagen}" width="50">` : "Sin Imagen"}</td>
  <td>${servicio.fecha_alta || '-'}</td>
  <td>
    <button class="btn-edit" onclick="editServicio(${servicio.id_servicio}, '${servicio.nombre_servicio}', '${servicio.descripcion}', '${servicio.imagen}')">✏️</button>
    <button class="btn-delete" onclick="destroyServicio(${servicio.id_servicio})">🗑️</button>
  </td>
`;


    tableBody.appendChild(row);
  } catch (error) {
    console.error("Error:", error);
    alert("Error al buscar el servicio: " + error.message);
  }

  document.getElementById("input-busqueda").value = "";
}

document.addEventListener("DOMContentLoaded", () => {
  if (btnGuardar) btnGuardar.addEventListener("click", e => { e.preventDefault(); storeServicio(); });
  if (btnCancelar) btnCancelar.addEventListener("click", e => { e.preventDefault(); cancelEdit(); });

  const btnMostrar = document.getElementById("btn-mostrarTodos");
  const btnBuscar = document.getElementById("buscarServicio");

  if (btnMostrar) btnMostrar.addEventListener("click", (e) => { e.preventDefault(); allServicios(); });
  if (btnBuscar) btnBuscar.addEventListener("click", (e) => { e.preventDefault(); showServicio(); });

  btnCancelar.style.display = "none";
  allServicios();
});
