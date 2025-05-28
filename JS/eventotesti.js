// ==========================
// 🔹 1. Constantes y Variables Globales
// ==========================
const API_TESTIMONIOS_URL = "http://localhost:3000/testimonios";

const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const inputID = document.getElementById("testimonioID");
const inputNombre = document.getElementById("nombreCliente");
const inputComentario = document.getElementById("comentario");
const inputFecha = document.getElementById("fechaEnvio");

let selectedTestimonioId = null;

// ==========================
// 🔹 2. Funciones Principales
// ==========================

async function getNextTestimonioID() {
  try {
    const response = await fetch(API_TESTIMONIOS_URL);
    if (!response.ok) throw new Error("No se pudieron obtener los testimonios.");
    const testimonios = await response.json();
    inputID.value = testimonios.length === 0 ? "1" : Math.max(...testimonios.map(t => t.id_testimonio)) + 1;
  } catch (error) {
    console.error("Error al obtener el próximo ID:", error);
    inputID.value = "Error";
  }
}

async function storeTestimonio() {
  const nombre_cliente = inputNombre.value.trim();
  const comentario = inputComentario.value.trim();
  const fecha_envio = inputFecha.value;

  if (!nombre_cliente || !comentario || !fecha_envio) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  try {
    const method = selectedTestimonioId ? "PUT" : "POST";
    const url = selectedTestimonioId ? `${API_TESTIMONIOS_URL}/${selectedTestimonioId}` : API_TESTIMONIOS_URL;
    const bodyData = { nombre_cliente, comentario, fecha_envio };

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) throw new Error(await response.text());

    alert(selectedTestimonioId ? "Testimonio actualizado correctamente." : "Testimonio guardado correctamente.");
    cancelEdit();
    allTestimonios();
  } catch (error) {
    console.error("Error:", error);
    alert("Error al guardar el testimonio: " + error.message);
  }
}

async function allTestimonios() {
  try {
    const response = await fetch(API_TESTIMONIOS_URL);
    if (!response.ok) throw new Error("No se pudieron cargar los testimonios.");
    const testimonios = await response.json();
    const tableBody = document.querySelector("#table-testimonios tbody");
    tableBody.innerHTML = "";

    testimonios.forEach((testimonio) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${testimonio.id_testimonio}</td>
        <td>${testimonio.nombre_cliente}</td>
        <td>${testimonio.comentario}</td>
        <td>${testimonio.fecha_envio}</td>
        <td>
          <button class="btn-edit" onclick="editTestimonio(${testimonio.id_testimonio}, '${testimonio.nombre_cliente}', '${testimonio.comentario}', '${testimonio.fecha_envio}')" title="Editar Testimonio">
            ✏️
          </button>
          <button class="btn-delete" onclick="destroyTestimonio(${testimonio.id_testimonio})" title="Eliminar Testimonio">
            🗑️
          </button>
        </td>`;
      tableBody.appendChild(row);
    });

    getNextTestimonioID();
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }
}


function editTestimonio(id, nombre, comentario, fecha) {
  inputID.value = id;
  inputNombre.value = nombre;
  inputComentario.value = comentario;
  inputFecha.value = fecha;
  selectedTestimonioId = id;

  btnGuardar.textContent = "Actualizar Testimonio";
  btnCancelar.style.display = "inline-block";
}

function cancelEdit() {
  inputID.value = "";
  inputNombre.value = "";
  inputComentario.value = "";
  inputFecha.value = "";
  selectedTestimonioId = null;

  btnGuardar.textContent = "Guardar Testimonio";
  btnCancelar.style.display = "none";
  getNextTestimonioID();
}

async function showTestimonio() {
  const id = document.getElementById("input-busqueda").value.trim();
  if (!id) {
    alert("Por favor, ingresa un ID.");
    return;
  }

  try {
    const response = await fetch(`${API_TESTIMONIOS_URL}/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        alert("ERROR: El testimonio no existe.");
        return;
      } else {
        throw new Error(await response.text());
      }
    }

    const testimonio = await response.json();
    const tableBody = document.querySelector("#table-testimonios tbody");
    tableBody.innerHTML = "";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${testimonio.id_testimonio}</td>
      <td>${testimonio.nombre_cliente}</td>
      <td>${testimonio.comentario}</td>
      <td>${testimonio.fecha_envio}</td>
      <td>
        <button class="btn-edit" onclick="editTestimonio(${testimonio.id_testimonio}, '${testimonio.nombre_cliente}', '${testimonio.comentario}', '${testimonio.fecha_envio}')" title="Editar Testimonio">
          ✏️
        </button>
        <button class="btn-delete" onclick="destroyTestimonio(${testimonio.id_testimonio})" title="Eliminar Testimonio">
          🗑️
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  } catch (error) {
    console.error("Error al buscar:", error);
    alert("Error al buscar el testimonio: " + error.message);
  }

  document.getElementById("input-busqueda").value = "";
}


async function destroyTestimonio(id) {
  if (!confirm("¿Estás seguro de que deseas eliminar este testimonio?")) return;

  try {
    const response = await fetch(`${API_TESTIMONIOS_URL}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error(await response.text());

    alert("Testimonio eliminado correctamente.");
    allTestimonios();
  } catch (error) {
    console.error("Error al eliminar el testimonio:", error);
    alert("Error al eliminar el testimonio: " + error.message);
  }
}

// ==========================
// 🔹 3. Eventos del DOM
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  if (btnGuardar) btnGuardar.addEventListener("click", (e) => { e.preventDefault(); storeTestimonio(); });
  if (btnCancelar) btnCancelar.addEventListener("click", (e) => { e.preventDefault(); cancelEdit(); });
  if (document.getElementById("btn-mostrarElemento")) document.getElementById("btn-mostrarElemento").addEventListener("click", (e) => { e.preventDefault(); allTestimonios(); });
  if (document.getElementById("buscarElemento")) document.getElementById("buscarElemento").addEventListener("click", (e) => { e.preventDefault(); showTestimonio(); });

  btnCancelar.style.display = "none";
  allTestimonios();
});
