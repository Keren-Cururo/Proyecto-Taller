// ==========================
// 🔹 1. Constantes y Variables Globales
// ==========================
const API_GENEROS_URL = "http://localhost:3000/generos"; // URL del backend API para géneros

const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const inputID = document.getElementById("generoID");
const inputGenero = document.getElementById("generoName");

let selectedGeneroId = null; 

// ==========================
// 🔹 2. Funciones Principales
// ==========================

// 🔍 Obtener el próximo ID disponible
async function getNextGeneroID() {
  try {
    const response = await fetch(API_GENEROS_URL);
    if (!response.ok) throw new Error("No se pudieron obtener los géneros.");

    const generos = await response.json();
    inputID.value = generos.length === 0 ? "1" : Math.max(...generos.map(g => g.id_genero)) + 1;
  } catch (error) {
    console.error("Error al obtener el próximo ID:", error);
    inputID.value = "Error";
  }
}

// 💼 Guardar o actualizar un género
async function storeGenero() {
  const generoName = inputGenero.value.trim();
  if (!generoName) {
    alert("El nombre del género es obligatorio.");
    return;
  }

  try {
    const requestMethod = selectedGeneroId ? "PUT" : "POST";
    const url = selectedGeneroId ? `${API_GENEROS_URL}/${selectedGeneroId}` : API_GENEROS_URL;
    const bodyData = { id_genero: Number(inputID.value), nombre_genero: generoName };

    const response = await fetch(url, {
      method: requestMethod,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) throw new Error(await response.text());

    alert(selectedGeneroId ? "Género actualizado correctamente." : "Género guardado correctamente.");
    cancelEdit();
    allGeneros();
  } catch (error) {
    console.error("Error:", error);
    alert("Error al guardar el género: " + error.message);
  }
}

// 🌐 Obtener todos los géneros
async function allGeneros() {
  try {
    const response = await fetch(API_GENEROS_URL);
    if (!response.ok) throw new Error("No se pudieron cargar los géneros.");

    const generos = await response.json();
    const tableBody = document.querySelector("#table-generos tbody");
    tableBody.innerHTML = "";

    generos.forEach((genero) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${genero.id_genero}</td>
        <td>${genero.nombre_genero}</td>
        <td>
          <button class="btn-edit" onclick="editGenero(${genero.id_genero}, '${genero.nombre_genero}')" title="Editar Género">
            ✏️
          </button>
          <button class="btn-delete" onclick="destroyGenero(${genero.id_genero})" title="Eliminar Género">
            🗑️
          </button>
        </td>`;
      tableBody.appendChild(row);
    });

    getNextGeneroID();
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }
}


// ✏️ Editar género
function editGenero(id, nombre) {
  inputID.value = id;
  inputGenero.value = nombre;
  selectedGeneroId = id;

  btnGuardar.textContent = "Actualizar Género";
  btnCancelar.style.display = "inline-block";
}

// ❌ Cancelar edición
function cancelEdit() {
  inputID.value = "";
  inputGenero.value = "";
  selectedGeneroId = null;

  btnGuardar.textContent = "Guardar Género";
  btnCancelar.style.display = "none";
  getNextGeneroID();
}

// 📊 Buscar género por ID
async function showGenero() {
  const generoId = document.getElementById("input-busqueda").value.trim();
  if (!generoId) {
    alert("Por favor, ingresa un ID.");
    return;
  }

  try {
    const response = await fetch(`${API_GENEROS_URL}/${generoId}`);
    if (!response.ok) {
      if (response.status === 404) {
        alert("ERROR: El género buscado no existe.");
        return;
      } else {
        throw new Error(await response.text());
      }
    }

    const genero = await response.json();
    const tableBody = document.querySelector("#table-generos tbody");
    tableBody.innerHTML = "";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${genero.id_genero}</td>
      <td>${genero.nombre_genero}</td>
      <td>
        <button class="btn-edit" onclick="editGenero(${genero.id_genero}, '${genero.nombre_genero}')" title="Editar Género">
          ✏️
        </button>
        <button class="btn-delete" onclick="destroyGenero(${genero.id_genero})" title="Eliminar Género">
          🗑️
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  } catch (error) {
    console.error("Error:", error);
    alert("Error al buscar el género: " + error.message);
  }

  document.getElementById("input-busqueda").value = "";
}

// 🗑️ Eliminar género
async function destroyGenero(id) {
  if (!confirm("¿Estás seguro de que deseas eliminar este género?")) return;

  try {
    const response = await fetch(`${API_GENEROS_URL}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error(await response.text());

    alert("Género eliminado correctamente.");
    allGeneros();
  } catch (error) {
    console.error("Error al eliminar el género:", error);
    alert("Error al eliminar el género: " + error.message);
  }
}

// ==========================
// 🔹 3. Eventos del DOM
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  if (btnGuardar) btnGuardar.addEventListener("click", (e) => { e.preventDefault(); storeGenero(); });
  if (btnCancelar) btnCancelar.addEventListener("click", (e) => { e.preventDefault(); cancelEdit(); });
  if (document.getElementById("btn-mostrarElemento")) document.getElementById("btn-mostrarElemento").addEventListener("click", (e) => { e.preventDefault(); allGeneros(); });
  if (document.getElementById("buscarElemento")) document.getElementById("buscarElemento").addEventListener("click", (e) => { e.preventDefault(); showGenero(); });

  btnCancelar.style.display = "none";
  allGeneros();
});
