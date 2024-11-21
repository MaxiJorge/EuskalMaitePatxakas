document.addEventListener('DOMContentLoaded', function() {
    const resultadosBody = document.getElementById('tablaResultados');
    const filtroGenero = document.getElementById('filtroGenero');
    const filtroEdad = document.getElementById('filtroEdad');
    const filtroCiudad = document.getElementById('filtroCiudad');
    const buscarButton = document.getElementById('buscar');

    // Datos de ejemplo
    const usuariosEjemplo = [
        { nick: "Carlos", genero: "hombre", edad: 29, ciudad: "Vitoria" },
        { nick: "Ana", genero: "mujer", edad: 32, ciudad: "Bilbo" },
        { nick: "Mikel", genero: "hombre", edad: 24, ciudad: "Donosti" },
        { nick: "Laura", genero: "mujer", edad: 27, ciudad: "Vitoria" }
    ];

    // Función para renderizar filas de la tabla
    function renderTabla(usuarios) {
        resultadosBody.innerHTML = ''; // Limpiar la tabla antes de actualizar
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

        const resultadosFiltrados = usuariosEjemplo.filter(usuario => {
            const cumpleGenero = !generoSeleccionado || usuario.genero === generoSeleccionado;
            const cumpleCiudad = !ciudadSeleccionada || usuario.ciudad === ciudadSeleccionada;

            let cumpleEdad = true;
            if (edadSeleccionada) {
                const [edadMin, edadMax] = edadSeleccionada === '46+' ? [46, Infinity] : edadSeleccionada.split('-').map(Number);
                cumpleEdad = usuario.edad >= edadMin && usuario.edad <= edadMax;
            }

            return cumpleGenero && cumpleCiudad && cumpleEdad;
        });

        renderTabla(resultadosFiltrados); // Actualizar la tabla con los resultados filtrados
    }

    // Evento al hacer clic en el botón Buscar
    buscarButton.addEventListener('click', buscarUsuarios);

    // Mostrar todos los datos al cargar la página
    renderTabla(usuariosEjemplo);
    
    const cerrarSesion = document.getElementById('cerrarSesion');
        cerrarSesion.addEventListener('click', function() {
            alert('Sesión cerrada.');
            window.location.href = 'index.html';
        });
        
    
});
