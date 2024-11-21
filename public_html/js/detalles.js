document.addEventListener('DOMContentLoaded', function() {
    const request = indexedDB.open("VitoMaite", 1);

    request.onsuccess = function(event) {
        const db = event.target.result;
        
        cargarUsuario(db);
    };

    request.onerror = function(event) {
        console.error("Error al abrir la base de datos:", event.target.errorCode);
    };

    function cargarUsuario(db) {
        const transaction = db.transaction("Usuarios", "readonly");
        const objectStore = transaction.objectStore("Usuarios");

        // Aquí asumimos que estamos buscando un usuario con un ID específico
        const usuarioId = 1; // Cambia esto según el usuario que quieras cargar
        const request = objectStore.get(usuarioId); 

        request.onsuccess = function(event) {
            const usuarioDetalle = event.target.result;

            if (usuarioDetalle) {
                // Cargar los datos en la tabla
                document.getElementById('nombre').textContent = usuarioDetalle.nombre;
                document.getElementById('edad').textContent = usuarioDetalle.edad;
                document.getElementById('genero').textContent = usuarioDetalle.genero;
                document.getElementById('ciudad').textContent = usuarioDetalle.ciudad;
                document.getElementById('intereses').textContent = usuarioDetalle.intereses;
                document.getElementById('ocupacion').textContent = usuarioDetalle.ocupacion;
                document.getElementById('correo').textContent = usuarioDetalle.correo;
                document.getElementById('telefono').textContent = usuarioDetalle.telefono;
            } else {
                console.log("No se encontró el usuario con ID:", usuarioId);
            }
        };

        request.onerror = function(event) {
            console.error("Error al recuperar los datos del usuario:", event.target.errorCode);
        };
    }

    // Botón de cerrar sesión
    const cerrarSesionButton = document.getElementById('cerrarSesion');
    cerrarSesionButton.addEventListener('click', function() {
        alert('Sesión cerrada.');
        window.location.href = 'index.html';
    });
    
    document.getElementById('atras').addEventListener('click', function() {
        window.location.href = 'buscarPremium.html';
    });
});
