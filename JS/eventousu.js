const API_USUARIOS_URL = "http://localhost:3000/usuarios";

const generos = {
  "1": "Femenino",
  "2": "Masculino",
  "3": "Binario"
};

const localidades = {
  "1": "Merlo",
  "2": "Morón"
};

const roles = {
  "1": "Administrador"
};

const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const inputID = document.getElementById("usuarioID");
const inputNombre = document.getElementById("nombreUsuario");
const inputApellido = document.getElementById("apellidoUsuario");
const inputCorreo = document.getElementById("correoElectronico");
const inputTelefono = document.getElementById("telefono");
const inputFechaNacimiento = document.getElementById("fechaNacimiento");
const inputPassword = document.getElementById("password");
const inputGenero = document.getElementById("idgenero");
const inputRol = document.getElementById("idRol");
const inputLocalidad = document.getElementById("idLocalidad");
const inputImagen = document.getElementById("imagen");
const imagenPreview = document.getElementById("imagenPreview");

const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await storeUsuario();
});

let selectedUsuarioId = null;

async function getNextUsuarioID() {
  try {
    const response = await fetch(API_USUARIOS_URL);
    if (!response.ok) throw new Error("No se pudieron obtener los usuarios.");
    const usuarios = await response.json();
    inputID.value = usuarios.length === 0 ? "1" : Math.max(...usuarios.map(u => u.id_usuario)) + 1;
  } catch (error) {
    console.error("Error al obtener el próximo ID:", error);
    inputID.value = "Error";
  }
}

async function storeUsuario() {
  const nombreUsuario = inputNombre.value.trim();
  const apellidoUsuario = inputApellido.value.trim();
  const correoElectronico = inputCorreo.value.trim();
  const telefono = inputTelefono.value.trim();
  const fechaNacimiento = inputFechaNacimiento.value;
  const password = inputPassword.value.trim();
  const idgenero = inputGenero.value;
  const idRol = inputRol.value;
  const idLocalidad = inputLocalidad.value;
  const imagen = inputImagen.files[0];

  if (!nombreUsuario || !apellidoUsuario || !correoElectronico || !telefono || !fechaNacimiento || !password || !idgenero || !idRol || !idLocalidad) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  try {
    const requestMethod = selectedUsuarioId ? "PUT" : "POST";
    const url = selectedUsuarioId
      ? `${API_USUARIOS_URL}/${selectedUsuarioId}`
      : `${API_USUARIOS_URL}/register`;

    const bodyData = new FormData();
    bodyData.append("nombre_usuario", nombreUsuario);
    bodyData.append("apellido_usuario", apellidoUsuario);
    bodyData.append("correo_electronico", correoElectronico);
    bodyData.append("telefono", telefono);
    bodyData.append("fecha_nacimiento", fechaNacimiento);
    bodyData.append("password", password);
    bodyData.append("id_genero", idgenero);
    bodyData.append("id_rol", idRol);
    bodyData.append("id_localidad", idLocalidad);
    if (imagen) bodyData.append("imagen", imagen);

    const response = await fetch(url, {
      method: requestMethod,
      body: bodyData,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Error desconocido.");
    }

    alert(selectedUsuarioId ? "Usuario actualizado correctamente." : "Usuario creado correctamente.");
    cancelEdit();
    allUsuarios();
  } catch (error) {
    console.error("Error:", error);
    alert("Error al guardar el usuario: " + error.message);
  }
}

function cancelEdit() {
  selectedUsuarioId = null;
  document.getElementById("registerForm").reset();
  imagenPreview.src = "";
  btnCancelar.style.display = "none";
  btnGuardar.innerText = "Guardar Usuario";
  getNextUsuarioID();
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

async function allUsuarios() {
  try {
    const response = await fetch(API_USUARIOS_URL);
    if (!response.ok) throw new Error("No se pudieron cargar los usuarios.");

    const usuarios = await response.json();
    const tableBody = document.querySelector("#table-usuarios tbody");
    tableBody.innerHTML = "";

    usuarios.forEach(usuario => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${usuario.id_usuario}</td>
        <td>${usuario.nombre_usuario}</td>
        <td>${usuario.apellido_usuario}</td>
        <td>${usuario.correo_electronico}</td>
        <td>${usuario.telefono}</td>
        <td>${new Date(usuario.fecha_nacimiento).toLocaleDateString("es-ES")}</td>
        <td>${generos[usuario.id_genero] || "Desconocido"}</td>
        <td>${roles[usuario.id_rol] || "Desconocido"}</td>
        <td>${localidades[usuario.id_localidad] || "Desconocida"}</td>
        <td>${usuario.imagen ? `<img src="/uploads/${usuario.imagen}" width="50">` : "Sin Imagen"}</td>
        <td><input type="password" value="${usuario.password || '******'}" readonly style="border:none; background:transparent;"></td>
        <td>
          <button class="btn-edit" onclick="editUsuario(${usuario.id_usuario}, '${usuario.nombre_usuario}', '${usuario.apellido_usuario}', '${usuario.correo_electronico}', '${usuario.telefono}', '${usuario.fecha_nacimiento}', '${usuario.id_genero}', '${usuario.id_rol}', '${usuario.id_localidad}', '${usuario.imagen}')">✏️</button>
          <button class="btn-delete" onclick="destroyUsuario(${usuario.id_usuario})">🗑️</button>
        </td>`;
      tableBody.appendChild(row);
    });

    getNextUsuarioID();
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }
}

function editUsuario(id, nombre, apellido, correo, telefono, fechaNacimiento, genero, rol, localidad, imagenURL) {
  selectedUsuarioId = id;

  inputID.value = id;
  inputNombre.value = nombre;
  inputApellido.value = apellido;
  inputCorreo.value = correo;
  inputTelefono.value = telefono;
  inputFechaNacimiento.value = new Date(fechaNacimiento).toISOString().split("T")[0];
  inputPassword.value = "";
  inputGenero.value = genero;
  inputRol.value = rol;
  inputLocalidad.value = localidad;
  imagenPreview.src = imagenURL && imagenURL !== "null" ? `/uploads/${imagenURL}` : "path/to/default-image.jpg";

  btnCancelar.style.display = "inline-block";
}

async function showUsuario() {
  const usuarioId = document.getElementById("input-busqueda").value.trim();
  if (!usuarioId) return alert("Por favor, ingresa un ID.");

  try {
    const response = await fetch(`${API_USUARIOS_URL}/${usuarioId}`);
    if (!response.ok) {
      if (response.status === 404) return alert("ERROR: El usuario buscado no existe.");
      throw new Error(await response.text());
    }

    const usuario = await response.json();
    const tableBody = document.querySelector("#table-usuarios tbody");
    tableBody.innerHTML = "";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${usuario.id_usuario}</td>
      <td>${usuario.nombre_usuario}</td>
      <td>${usuario.apellido_usuario}</td>
      <td>${usuario.correo_electronico}</td>
      <td>${usuario.telefono}</td>
      <td>${new Date(usuario.fecha_nacimiento).toLocaleDateString("es-ES")}</td>
      <td>${generos[usuario.id_genero] || "Desconocido"}</td>
      <td>${roles[usuario.id_rol] || "Desconocido"}</td>
      <td>${localidades[usuario.id_localidad] || "Desconocida"}</td>
      <td>${usuario.imagen ? `<img src="/uploads/${usuario.imagen}" width="50">` : "Sin Imagen"}</td>
      <td><input type="password" value="${usuario.password || '******'}" readonly style="border:none; background:transparent;"></td>
      <td>
        <button class="btn-edit" onclick="editUsuario(${usuario.id_usuario}, '${usuario.nombre_usuario}', '${usuario.apellido_usuario}', '${usuario.correo_electronico}', '${usuario.telefono}', '${usuario.fecha_nacimiento}', '${usuario.id_genero}', '${usuario.id_rol}', '${usuario.id_localidad}', '${usuario.imagen}')">✏️</button>
        <button class="btn-delete" onclick="destroyUsuario(${usuario.id_usuario})">🗑️</button>
      </td>`;
    tableBody.appendChild(row);
  } catch (error) {
    console.error("Error:", error);
    alert("Error al buscar el usuario: " + error.message);
  }

  document.getElementById("input-busqueda").value = "";
}

async function destroyUsuario(id) {
  if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;

  try {
    const response = await fetch(`${API_USUARIOS_URL}/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) throw new Error(await response.text());

    alert("Usuario eliminado correctamente.");
    allUsuarios();
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    alert("Error al eliminar el usuario: " + error.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  btnGuardar?.addEventListener("click", e => {
    e.preventDefault();
    storeUsuario();
  });

  btnCancelar?.addEventListener("click", e => {
    e.preventDefault();
    cancelEdit();
  });

  document.getElementById("btn-mostrarElemento")?.addEventListener("click", (e) => {
    e.preventDefault();
    allUsuarios();
  });

  document.getElementById("buscarElemento")?.addEventListener("click", (e) => {
    e.preventDefault();
    showUsuario();
  });

  btnCancelar.style.display = "none";
  allUsuarios();

  inputNombre.addEventListener("input", () => {
    inputNombre.value = inputNombre.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
  });

  inputApellido.addEventListener("input", () => {
    inputApellido.value = inputApellido.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
  });

  inputTelefono.addEventListener("input", () => {
    inputTelefono.value = inputTelefono.value.replace(/[^0-9]/g, "");
  });
});
