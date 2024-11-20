document.addEventListener('DOMContentLoaded', function () {
    const usuarioId = sessionStorage.getItem('usuarioId');
    if (!usuarioId) {
        alert("No se encontró información del usuario.");
        window.location.href = 'buscarLogueado.html';
        return;
    }

    const request = indexedDB.open("VitoMaite", 1);

    request.onsuccess = function (event) {
        const db = event.target.result;
        cargarUsuario(db, parseInt(usuarioId));
    };

    function cargarUsuario(db, usuarioId) {
        const transaction = db.transaction("Usuarios", "readonly");
        const objectStore = transaction.objectStore("Usuarios");

        const request = objectStore.get(usuarioId);
        request.onsuccess = function (event) {
            const usuario = event.target.result;
            if (usuario) {
                document.getElementById('nombre').textContent = usuario.nombre;
                document.getElementById('edad').textContent = usuario.edad;
                document.getElementById('genero').textContent = usuario.genero;
                document.getElementById('ciudad').textContent = usuario.ciudad;
                document.getElementById('intereses').textContent = usuario.intereses;
                document.getElementById('ocupacion').textContent = usuario.ocupacion;
                document.getElementById('correo').textContent = usuario.correo;

                mostrarMapa(usuario);
            } else {
                alert("No se encontraron detalles para el usuario.");
            }
        };

        request.onerror = function (event) {
            console.error("Error al recuperar el usuario:", event.target.errorCode);
        };
    }

    function mostrarMapa(usuario) {
        const mapa = new google.maps.Map(document.getElementById('mapa'), {
            center: { lat: 43.04, lng: -2.67 }, // Centro del País Vasco
            zoom: 8
        });

        // Coordenadas de las ciudades principales
        const ciudades = {
            Donosti: { lat: 43.3183, lng: -1.9812 },
            Bilbo: { lat: 43.2630, lng: -2.9349 },
            Vitoria: { lat: 42.8460, lng: -2.6716 }
        };

        // Agregar chinchetas en las ciudades principales
        for (const ciudad in ciudades) {
            new google.maps.Marker({
                position: ciudades[ciudad],
                map: mapa,
                title: ciudad
            });
        }

        // Chincheta del usuario
        const usuarioPos = ciudades[usuario.ciudad] || { lat: 43.04, lng: -2.67 };
        new google.maps.Marker({
            position: usuarioPos,
            map: mapa,
            title: usuario.nombre
        });
    }

    // Botón cerrar sesión
    document.getElementById('cerrarSesion').addEventListener('click', function () {
        alert('Sesión cerrada.');
        window.location.href = 'index.html';
    });

    // Botón atrás
    document.getElementById('atras').addEventListener('click', function () {
        window.location.href = 'buscarLogueado.html';
    });
});
