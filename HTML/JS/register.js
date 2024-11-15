document.addEventListener('DOMContentLoaded', function() {
    // Obtener y llenar géneros en el select
    fetch('/generos')
        .then(response => response.json())
        .then(data => {
            const generoSelect = document.getElementById('idGenero');
            data.forEach(genero => {
                const option = document.createElement('option');
                option.value = genero.id;
                option.textContent = genero.nombre;
                generoSelect.appendChild(option);
            });
        });

    // Obtener y llenar roles en el select
    fetch('/roles')
        .then(response => response.json())
        .then(data => {
            const rolSelect = document.getElementById('idRol');
            data.forEach(rol => {
                const option = document.createElement('option');
                option.value = rol.id;
                option.textContent = rol.nombre;
                rolSelect.appendChild(option);
            });
        });

    // Manejar el envío del formulario
    document.getElementById('registerForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);

        fetch('/usuarios/register', {  // Cambia esta ruta si es necesario
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                alert('Usuario registrado con éxito!');
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
