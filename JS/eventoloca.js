// ==========================
// 🔹 1. Constantes y Variables Globales
// ==========================
const API_URL = "http://localhost:3000/localidades"; // URL del backend API

const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const inputID = document.getElementById("localidadID");
const inputLocalidad = document.getElementById("localidadName");

let selectedLocalidadId = null; 

// ==========================
// 🔹 2. Funciones Principales
// ==========================

// 🔍 Obtener el próximo ID disponible
async function getNextLocalidadID() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("No se pudieron obtener las localidades.");

    const localidades = await response.json();
    inputID.value = localidades.length === 0 ? "1" : Math.max(...localidades.map(l => l.id_localidad)) + 1;
  } catch (error) {
    console.error("Error al obtener el próximo ID:", error);
    inputID.value = "Error";
  }
}

// 💼 Guardar o actualizar una localidad
async function storeLocalidad() {
  const localidadName = inputLocalidad.value.trim();
  if (!localidadName) {
    alert("El nombre de la localidad es obligatorio.");
    return;
  }

  try {
    const requestMethod = selectedLocalidadId ? "PUT" : "POST";
    const url = selectedLocalidadId ? `${API_URL}/${selectedLocalidadId}` : API_URL;
    const bodyData = { id_localidad: Number(inputID.value), nombre_localidad: localidadName };

    const response = await fetch(url, {
      method: requestMethod,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) throw new Error(await response.text());

    alert(selectedLocalidadId ? "Localidad actualizada correctamente." : "Localidad guardada correctamente.");
    cancelEdit();
    allLocalidades();
  } catch (error) {
    console.error("Error:", error);
    alert("Error al guardar la localidad: " + error.message);
  }
}

// 🌐 Obtener todas las localidades
async function allLocalidades() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("No se pudieron cargar las localidades.");

    const localidades = await response.json();
    const tableBody = document.querySelector("#table-usuarios tbody");
    tableBody.innerHTML = "";

    localidades.forEach((localidad) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${localidad.id_localidad}</td>
        <td>${localidad.nombre_localidad}</td>
        <td>
          <button class="btn-edit" onclick="editLocalidad(${localidad.id_localidad}, '${localidad.nombre_localidad}')" title="Editar Localidad">
            ✏️
          </button>
          <button class="btn-delete" onclick="destroyLocalidad(${localidad.id_localidad})" title="Eliminar Localidad">
            🗑️
          </button>
        </td>`;
      tableBody.appendChild(row);
    });

    getNextLocalidadID();
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }
}


// ✏️ Editar localidad
function editLocalidad(id, nombre) {
  inputID.value = id;
  inputLocalidad.value = nombre;
  selectedLocalidadId = id;

  btnGuardar.textContent = "Actualizar Localidad";
  btnCancelar.style.display = "inline-block";
}

// ❌ Cancelar edición
function cancelEdit() {
  inputID.value = "";
  inputLocalidad.value = "";
  selectedLocalidadId = null;

  btnGuardar.textContent = "Guardar Localidad";
  btnCancelar.style.display = "none";
  getNextLocalidadID();
}

// 📊 Buscar localidad por ID
async function allLocalidades() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("No se pudieron cargar las localidades.");

    const localidades = await response.json();
    const tableBody = document.querySelector("#table-usuarios tbody");
    tableBody.innerHTML = "";

    localidades.forEach((localidad) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${localidad.id_localidad}</td>
        <td>${localidad.nombre_localidad}</td>
        <td>
          <button class="btn-edit" onclick="editLocalidad(${localidad.id_localidad}, '${localidad.nombre_localidad}')" title="Editar Localidad">
            ✏️
          </button>
          <button class="btn-delete" onclick="destroyLocalidad(${localidad.id_localidad})" title="Eliminar Localidad">
            🗑️
          </button>
        </td>`;
      tableBody.appendChild(row);
    });

    getNextLocalidadID();
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }
}

// 🗑️ Eliminar localidad
async function destroyLocalidad(id) {
  if (!confirm("¿Estás seguro de que deseas eliminar esta localidad?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error(await response.text());

    alert("Localidad eliminada correctamente.");
    allLocalidades();
  } catch (error) {
    console.error("Error al eliminar la localidad:", error);
    alert("Error al eliminar la localidad: " + error.message);
  }
}


// ==========================
// 🔹 3. Eventos del DOM
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  if (btnGuardar) btnGuardar.addEventListener("click", (e) => { e.preventDefault(); storeLocalidad(); });
  if (btnCancelar) btnCancelar.addEventListener("click", (e) => { e.preventDefault(); cancelEdit(); });
  if (document.getElementById("btn-mostrarElemento")) document.getElementById("btn-mostrarElemento").addEventListener("click", (e) => { e.preventDefault(); allLocalidades(); });
  if (document.getElementById("buscarElemento")) document.getElementById("buscarElemento").addEventListener("click", (e) => { e.preventDefault(); showLocalidad(); });

  btnCancelar.style.display = "none";
  allLocalidades();
});
