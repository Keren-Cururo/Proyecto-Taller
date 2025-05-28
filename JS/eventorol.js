const API_URL = "http://localhost:3000/roles";

const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const inputID = document.getElementById("rolID");
const inputRol = document.getElementById("rolName");
const inputDescripcion = document.getElementById("descripcionRol");

let selectedRolId = null;

// Obtener el próximo ID disponible
async function getNextRolID() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("No se pudieron obtener los roles.");
        const roles = await response.json();
        inputID.value = roles.length === 0 ? "1" : Math.max(...roles.map(r => r.id_rol)) + 1;
    } catch (error) {
        console.error("Error al obtener el próximo ID:", error);
        inputID.value = "Error";
    }
}

// Guardar o actualizar un rol
async function storeRol() {
    const rolName = inputRol.value.trim();
    const descripcionRol = inputDescripcion.value.trim();

    if (!rolName || !descripcionRol) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    try {
        const requestMethod = selectedRolId ? "PUT" : "POST";
        const url = selectedRolId ? `${API_URL}/${selectedRolId}` : API_URL;
        const bodyData = { id_rol: Number(inputID.value), nombre_rol: rolName, descripcion_rol: descripcionRol };

        const response = await fetch(url, {
            method: requestMethod,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyData),
        });

        if (!response.ok) throw new Error(await response.text());

        alert(selectedRolId ? "Rol actualizado correctamente." : "Rol guardado correctamente.");
        cancelEdit();
        allRoles();
    } catch (error) {
        console.error("Error:", error);
        alert("Error al guardar el rol: " + error.message);
    }
}

// Obtener todos los roles
async function allRoles() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("No se pudieron cargar los roles.");
        const roles = await response.json();

        const tableBody = document.querySelector("#table-roles tbody");
        tableBody.innerHTML = "";

        roles.forEach((rol) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${rol.id_rol}</td>
                <td>${rol.nombre_rol}</td>
                <td>${rol.descripcion_rol}</td>
                <td>
                    <button class="btn-edit" onclick="editRol(${rol.id_rol}, '${rol.nombre_rol}', '${rol.descripcion_rol}')">✏️</button>
                    <button class="btn-delete" onclick="destroyRol(${rol.id_rol})">🗑️</button>
                </td>`;
            tableBody.appendChild(row);
        });

        getNextRolID();
    } catch (error) {
        console.error("Error:", error);
        alert(error.message);
    }
}

// Editar rol
function editRol(id, nombre, descripcion) {
    inputID.value = id;
    inputRol.value = nombre;
    inputDescripcion.value = descripcion;
    selectedRolId = id;

    btnGuardar.textContent = "Actualizar Rol";
    btnCancelar.style.display = "inline-block";
}

// Cancelar edición
function cancelEdit() {
    inputID.value = "";
    inputRol.value = "";
    inputDescripcion.value = "";
    selectedRolId = null;

    btnGuardar.textContent = "Guardar Rol";
    btnCancelar.style.display = "none";
    getNextRolID();
}

// Eliminar rol
async function destroyRol(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar este rol?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error(await response.text());

        alert("Rol eliminado correctamente.");
        allRoles();
    } catch (error) {
        console.error("Error al eliminar el rol:", error);
        alert("Error al eliminar el rol: " + error.message);
    }
}

// Eventos del DOM
document.addEventListener("DOMContentLoaded", () => {
    if (btnGuardar) btnGuardar.addEventListener("click", (e) => { e.preventDefault(); storeRol(); });
    if (btnCancelar) btnCancelar.addEventListener("click", (e) => { e.preventDefault(); cancelEdit(); });
    if (document.getElementById("buscarElemento")) document.getElementById("buscarElemento").addEventListener("click", (e) => { e.preventDefault(); allRoles(); });
    if (document.getElementById("btn-mostrarElemento")) document.getElementById("btn-mostrarElemento").addEventListener("click", (e) => { e.preventDefault(); allRoles(); });

    btnCancelar.style.display = "none";
    allRoles();
});