document.addEventListener('DOMContentLoaded', function() {
    // Escucha el evento de envío del formulario de inicio de sesión
    document.getElementById('formulario-inicioSesion').addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que se envíe el formulario por defecto
        iniciarSesion();
    });

    // Configura el botón de registro para redirigir al formulario de registro
    document.getElementById('botonRegistro').addEventListener('click', function() {
        window.location.href = 'registro.html'; // Cambia esto por la URL del formulario de registro si lo tienes
    });
});

function iniciarSesion() {
    // Recupera el valor de los campos del formulario
    const email = document.getElementById('email2').value;
    const password = document.getElementById('password2').value;

    // Abre la base de datos
    var abrir = indexedDB.open("vitomaite02", 1);

    abrir.onerror = function(event) {
        console.error("Error al abrir la base de datos:", event.target.errorCode);
    };

    abrir.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(["Usuario"], "readonly");
        const userStore = transaction.objectStore("Usuario");

        // Intenta obtener el usuario por el índice "correo"
        const index = userStore.index("correo");
        const request = index.get(email);

        request.onsuccess = function(event) {
            const user = event.target.result;

            // Si el usuario existe y la contraseña coincide
            if (user && user.contrasena === password) {
                console.log("Inicio de sesión exitoso:", user);
                
                // Guarda información del usuario en localStorage
                localStorage.setItem('usuarioLogueado', JSON.stringify(user));
                
                // Redirige al usuario a la página logueado.html
                window.location.href = 'logueado.html';
            } else {
                // Si no coincide la contraseña o el usuario no existe
                alert('Correo electrónico o contraseña incorrectos');
            }
        };

        request.onerror = function(event) {
            console.error("Error al buscar el usuario:", event.target.error);
        };
    };
}
