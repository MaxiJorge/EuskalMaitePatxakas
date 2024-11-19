document.addEventListener('DOMContentLoaded', function() {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));

    // Verificar si el usuario está logueado
    if (!usuarioLogueado) {
        window.location.href = 'inicioSesion.html';
        return;
    }

    // Mostrar información del usuario en la página
    document.querySelector('.perfil .foto-perfil').src = usuarioLogueado.foto || 'img/default-profile.png';

    // Mostrar saludo personalizado
    const saludoDiv = document.getElementById('saludo');
    saludoDiv.textContent = `Hola, ${usuarioLogueado.nombre}`;

    // Manejar el cierre de sesión
    document.getElementById('cerrarSesion').addEventListener('click', function() {
        cerrarSesion();
    });

    // Redirigir al buscarLogueado.html
    document.getElementById('buscar').addEventListener('click', function() {
        window.location.href = 'buscarLogueado.html';
    });

    // Mostrar/ocultar mis visitas
    document.getElementById('misVisitas').addEventListener('click', function() {
        toggleVisitas();
    });

    // Mostrar/ocultar mis likes
    document.getElementById('misLikes').addEventListener('click', function() {
        toggleLikes();
    });

    // Función para cerrar sesión
    function cerrarSesion() {
        // Eliminar el usuario del localStorage
        localStorage.removeItem('usuarioLogueado');

        // Redirigir al inicio de sesión
        window.location.href = 'inicioSesion.html';
    }

    // Función para mostrar u ocultar las visitas
    function toggleVisitas() {
        const tablaVisitasSeccion = document.getElementById('tablaVisitasSeccion');
        
        // Si la tabla está visible, la ocultamos, si no está visible, la mostramos
        if (tablaVisitasSeccion.style.display === 'block') {
            tablaVisitasSeccion.style.display = 'none';
        } else {
            // Mostrar tabla y llenar con datos
            mostrarMisVisitas();
            tablaVisitasSeccion.style.display = 'block';
        }
    }

    // Función para mostrar u ocultar los likes
    function toggleLikes() {
        const tablaLikesSeccion = document.getElementById('tablaLikesSeccion');
        
        // Si la tabla está visible, la ocultamos, si no está visible, la mostramos
        if (tablaLikesSeccion.style.display === 'block') {
            tablaLikesSeccion.style.display = 'none';
        } else {
            // Mostrar tabla y llenar con datos
            mostrarMisLikes();
            tablaLikesSeccion.style.display = 'block';
        }
    }

    // Función para mostrar las visitas del perfil
    function mostrarMisVisitas() {
        const abrir = indexedDB.open("vitomaite02", 1);

        abrir.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(["MeGusta"], "readonly");
            const meGustaStore = transaction.objectStore("MeGusta");

            // Obtener todas las relaciones de "Me Gusta"
            const request = meGustaStore.getAll();

            request.onsuccess = function(event) {
                const relaciones = event.target.result;
                const tablaVisitas = document.getElementById('tabla-visitas');
                tablaVisitas.innerHTML = ''; // Limpiar tabla

                // Filtrar las visitas relacionadas con el usuario logueado
                relaciones.forEach(relacion => {
                    if (relacion.user2 === usuarioLogueado.correo) {
                        const fila = document.createElement('tr');
                        fila.innerHTML = `
                            <td>${relacion.fecha || 'Fecha desconocida'}</td>
                            <td>${relacion.user1}</td>
                            <td><button onclick="location.href='detalleVisita.html'">Detalles</button></td>
                        `;
                        tablaVisitas.appendChild(fila);
                    }
                });
            };
        };
    }

    // Función para mostrar los likes que recibió el usuario
    function mostrarMisLikes() {
        const abrir = indexedDB.open("vitomaite02", 1);

        abrir.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(["MeGusta"], "readonly");
            const meGustaStore = transaction.objectStore("MeGusta");

            // Obtener todos los registros de likes
            const request = meGustaStore.getAll();

            request.onsuccess = function(event) {
                const likes = event.target.result;
                const tablaLikes = document.getElementById('tabla-likes');
                tablaLikes.innerHTML = ''; // Limpiar tabla

                // Filtrar los likes que el usuario ha recibido
                likes.forEach(like => {
                    if (like.user2 === usuarioLogueado.correo) {
                        const fila = document.createElement('tr');
                        fila.innerHTML = `
                            <td>${like.fecha || 'Fecha desconocida'}</td>
                            <td>${like.user1}</td>
                        `;
                        tablaLikes.appendChild(fila);
                    }
                });
            };
        };
    }
});
