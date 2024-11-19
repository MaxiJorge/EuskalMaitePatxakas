// Espera a que el DOM se cargue
document.addEventListener('DOMContentLoaded', function() {
    crearBD(); // Inicializa la base de datos
    configurarBotones(); // Configura los eventos de los botones
});

function crearBD() {
    // Abre o crea la base de datos "VitoMaite" en versión 1
    var abrir = indexedDB.open("VitoMaite", 1);

    abrir.onupgradeneeded = function(event) {
        const db = event.target.result;

        // Crea el object store para Usuarios con clave primaria "id" autoincrementable
        const user = db.createObjectStore("Usuarios", { keyPath: "id", autoIncrement: true });
        user.createIndex("correo", "correo", { unique: true });
        user.createIndex("nick", "nick", { unique: false });
        user.createIndex("contraseña", "contraseña", { unique: false });
        user.createIndex("edad", "edad", { unique: false });
        user.createIndex("esPremium", "esPremium", { unique: false });

        // Crea el object store para Citas
        const citas = db.createObjectStore("Citas", { keyPath: "id", autoIncrement: true });
        citas.createIndex("user1", "user1", { unique: false });
        citas.createIndex("user2", "user2", { unique: false });
        citas.createIndex("estado", "estado", { unique: false });

        // Crea el object store para Visitas
        const visitas = db.createObjectStore("Visitas", { keyPath: "id", autoIncrement: true });
        visitas.createIndex("visita", "visita", { unique: false });
        visitas.createIndex("visitado", "visitado", { unique: false });
        visitas.createIndex("fechaUltimaVisita", "fechaUltimaVisita", { unique: false });
        visitas.createIndex("horaUltimaVisita", "horaUltimaVisita", { unique: false });
    };

    abrir.onerror = function(event) {
        console.error("Error al abrir la base de datos:", event.target.errorCode);
    };

    abrir.onsuccess = function(event) {
        console.log("Base de datos creada y abierta con éxito");
    };
}

// Función para configurar los eventos de los botones
function configurarBotones() {
    // Selecciona los botones usando sus IDs
    const botonBuscar = document.getElementById('botonBuscar');
    const botonLogin = document.getElementById('botonLogin');
    const botonRegistro = document.getElementById('botonRegistro');

    // Asigna eventos de clic para redirigir a cada página
    botonBuscar.addEventListener('click', () => {
        window.location.href = 'buscarNoRegistrado.html';
    });

    botonLogin.addEventListener('click', () => {
        window.location.href = 'inicioSesion.html';
    });

    botonRegistro.addEventListener('click', () => {
        window.location.href = 'registrarse.html';
    });
}
