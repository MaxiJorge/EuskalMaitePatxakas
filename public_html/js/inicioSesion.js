document.addEventListener('DOMContentLoaded', function() {
    configurarFormulario();
    configurarBotonRegistro();
});

function configurarFormulario() {
    const formulario = document.getElementById('formulario-inicioSesion');
    
    formulario.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita el envío del formulario por defecto

        // Captura los valores ingresados por el usuario
        const email = document.getElementById('email2').value.trim();
        const password = document.getElementById('password2').value.trim();

        // Verificar que los campos no estén vacíos
        if (!email || !password) {
            alert("Por favor ingrese ambos campos: correo y contraseña.");
            return;
        }

        // Lógica de validación de la sesión
        validarUsuario(email, password);
    });
}

function configurarBotonRegistro() {
    const botonRegistro = document.getElementById('botonRegistro');

    botonRegistro.addEventListener('click', function(event) {
        event.preventDefault(); // Evita el comportamiento por defecto del enlace
        window.location.href = 'registrarse.html'; // Redirige a la página de registro
    });
}

// Función para validar el usuario en IndexedDB (ejemplo básico)
function validarUsuario(email, password) {
    const abrir = indexedDB.open("VitoMaite", 1);

    abrir.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(["Usuarios"], "readonly");
        const objectStore = transaction.objectStore("Usuarios");
        const index = objectStore.index("correo");
        
        // Busca el usuario por correo
        const request = index.get(email);

        request.onsuccess = function() {
            const usuario = request.result;

            if (usuario) {
                // Comparar la contraseña (recuerda que en un sistema real no deberías hacerlo en texto claro)
                if (usuario.contraseña === password) {
                    alert("Inicio de sesión exitoso");
                    // Redirige a la página de usuario o dashboard
                    window.location.href = "usuarioDashboard.html"; // Cambia esto por la ruta correcta
                } else {
                    alert("Correo o contraseña incorrectos");
                }
            } else {
                alert("El correo no está registrado.");
            }
        };

        request.onerror = function() {
            console.error("Error al buscar el usuario en la base de datos.");
        };
    };

    abrir.onerror = function() {
        console.error("Error al abrir la base de datos.");
    };
}
