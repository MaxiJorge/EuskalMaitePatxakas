document.addEventListener('DOMContentLoaded', function () {
    const resultadosBody = document.getElementById('tablaResultados');
    const filtroGenero = document.getElementById('filtroGenero');
    const filtroEdad = document.getElementById('filtroEdad');
    const filtroCiudad = document.getElementById('filtroCiudad');
    const buscarButton = document.getElementById('buscar');

    // Función para obtener los usuarios desde sessionStorage
    function obtenerUsuariosDesdeSessionStorage() {
        const usuariosJSON = sessionStorage.getItem('usuarios'); // Recuperar los usuarios desde sessionStorage
        if (!usuariosJSON) {
            console.log("No hay usuarios en sessionStorage"); // Verifica si no hay usuarios
            return []; // Si no hay usuarios, retorna un array vacío
        }
        return JSON.parse(usuariosJSON); // Convertir a objeto si existen
    }

    // Función para renderizar la tabla con los usuarios filtrados
    function renderTabla(usuarios) {
        resultadosBody.innerHTML = ''; // Limpiar la tabla antes de actualizar

        if (usuarios.length === 0) {
            resultadosBody.innerHTML = '<tr><td colspan="5">No se encontraron usuarios.</td></tr>';
            return;
        }

        usuarios.forEach(usuario => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${usuario.nick}</td>
                <td>${usuario.edad}</td>
                <td>${usuario.ciudad}</td>
                <td><button class="detalle-btn">Detalles</button></td>
                <td><img src="img/heart.png" class="like-icon" alt="Like"></td>
            `;
            resultadosBody.appendChild(row);
        });

        // Añadir eventos a los botones y corazones en cada fila
        document.querySelectorAll('.detalle-btn').forEach(button => {
            button.addEventListener('click', function() {
                window.location.href = 'hacersePremium.html';
            });
        });

        document.querySelectorAll('.like-icon').forEach(icon => {
            icon.addEventListener('click', function() {
                alert(`Has dado like a ${this.closest('tr').querySelector('td').textContent}`);
            });
        });
    }

    // Función de búsqueda y filtrado
    function buscarUsuarios() {
        const generoSeleccionado = filtroGenero.value;
        const edadSeleccionada = filtroEdad.value;
        const ciudadSeleccionada = filtroCiudad.value;

        console.log('Filtro Genero:', generoSeleccionado);
        console.log('Filtro Edad:', edadSeleccionada);
        console.log('Filtro Ciudad:', ciudadSeleccionada);

        const usuarios = obtenerUsuariosDesdeSessionStorage(); // Obtener usuarios desde sessionStorage

        const resultadosFiltrados = usuarios.filter(usuario => {
            const cumpleGenero = !generoSeleccionado || usuario.genero === generoSeleccionado;
            const cumpleCiudad = !ciudadSeleccionada || usuario.ciudad === ciudadSeleccionada;

            let cumpleEdad = true;
            if (edadSeleccionada) {
                const [edadMin, edadMax] = edadSeleccionada === '46+' ? [46, Infinity] : edadSeleccionada.split('-').map(Number);
                cumpleEdad = usuario.edad >= edadMin && usuario.edad <= edadMax;
            }

            return cumpleGenero && cumpleCiudad && cumpleEdad;
        });

        console.log('Resultados filtrados:', resultadosFiltrados); // Muestra los usuarios filtrados

        renderTabla(resultadosFiltrados); // Actualizar la tabla con los resultados filtrados
    }

    // Evento al hacer clic en el botón Buscar
    buscarButton.addEventListener('click', function() {
        buscarUsuarios();
    });

    // Mostrar todos los datos al cargar la página
    renderTabla(obtenerUsuariosDesdeSessionStorage()); // Renderizar todos los usuarios inicialmente
});
