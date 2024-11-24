document.addEventListener('DOMContentLoaded', function() {
    const usuarioLogueado = JSON.parse(sessionStorage.getItem('usuarioLogueado'));

    // Verificar si el usuario está logueado

    document.querySelector('.perfil .foto-perfil').src = usuarioLogueado.foto 

    // Mostrar saludo personalizado
    const saludoDiv = document.getElementById('saludo');
    saludoDiv.textContent = `Hola, ${usuarioLogueado.nombre}`;


    // Manejar el cierre de sesión
    document.getElementById('cerrarSesion').addEventListener('click', function() {
        cerrarSesion();
    });
    
    function cerrarSesion(){
        sessionStorage.clear();
        window.location.href = 'index.html';
    }
    
    // Redirigir al buscarLogueado.html
    document.getElementById('Perfil').addEventListener('click', function() {
        window.location.href = 'editarPerfil.html';
    });
    
     // Redirigir al verAficiones.html
    document.getElementById('verAficiones').addEventListener('click', function() {
        window.location.href = 'verAficiones.html';
    });
    
     // Redirigir al buscarLogueado.html
    document.getElementById('editarAficiones').addEventListener('click', function() {
        window.location.href = 'editarAficiones.html';
    });
    
    // Mostrar/ocultar mis likes
    document.getElementById('misLikes').addEventListener('click', function() {
        toggleLikes();
    });
    
    
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
                            <td> <button > onclick="location.href='detalleVisita.html'"Detalles</button> </td>`;
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
