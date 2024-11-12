// Espera a que el DOM se cargue
document.addEventListener('DOMContentLoaded', function() {
    crearBD(); // Inicializa la base de datos
    configurarBotones(); // Configura los eventos de los botones
});

function crearBD() {
    // Abre o crea la base de datos "VitoMaite" en versión 1
    var abrir = indexedDB.open("VitoMaite", 1);
    
    abrir.onerror = function(event) {
        console.error("Error al abrir la base de datos:", event.target.errorCode);
    };
    
    abrir.onsuccess = function(event) {
        console.log("Base de datos creada y abierta con éxito");
    };

    abrir.onupgradeneeded = function(event) {
        
        var db = event.target.result;

        // Crea el object store para Usuarios con clave primaria "id" autoincrementable
        var user = db.createObjectStore("Usuarios", { keyPath: "id", autoIncrement: true });
        
        user.createIndex("correo", "correo", { unique: true });
        //user.createIndex("nick", "nick", { unique: false });
        // user.createIndex("contrasena", "contrasena", { unique: false });
        user.createIndex("edad", "edad", { unique: false });
        user.createIndex("genero", "genero", { unique: false});
        user.createIndex("ciudad", "ciudad", { unique: false});
        //user.createIndex("esPremium", "esPremium", { unique: false });
        //user.createIndex("foto", "foto", { unique: false });

        user.add(
            {nombre: "Jorge",
                correo: "jorge@adsi.com",
                contrasena: "1234",
                foto: "",
                edad: "20",
                genero: "H",
                esPremium: "1",
                ciudad: "Vitoria"});
        
        user.add(
            {nombre: "David",
                correo: "david@adsi.com",
                contrasena: "1234",
                foto: "",
                edad: "20",
                genero: "H",
                esPremium: "1",
                ciudad: "Vitoria"});
        
        user.add(
            {nombre: "Najum",
                correo: "najum@adsi.com",
                contrasena: "1234",
                foto: "",
                edad: "20",
                genero: "H",
                esPremium: "0",
                ciudad: "Vitoria"});
            
        user.add(
            {nombre: "Maria",
                correo: "maria@adsi.com",
                contrasena: "1234",
                foto: "",
                edad: "23",
                genero: "M",
                esPremium: "1",
                ciudad: "Bilbo"});
        
        user.add(
            {nombre: "Andrea",
                correo: "andrea@adsi.com",
                contrasena: "1234",
                foto: "",
                edad: "18",
                genero: "M",
                esPremium: "0",
                ciudad: "Donosti"});
        
        user.add(
            {nombre: "Sandra",
                correo: "sandra@adsi.com",
                contrasena: "1234",
                foto: "",
                edad: "45",
                genero: "M",
                esPremium: "0",
                ciudad: "Donosti"});
        
        user.add(
            {nombre: "Miguel",
                correo: "miguel@adsi.com",
                contrasena: "1234",
                foto: "",
                edad: "33",
                genero: "H",
                esPremium: "0",
                ciudad: "Bilbo"});
        
        user.add(
            {nombre: "Lucia",
                correo: "lucia@adsi.com",
                contrasena: "1234",
                foto: "",
                edad: "50",
                genero: "H",
                esPremium: "1",
                ciudad: "Bilbo"});

        // Crea el object store para Citas
        var citas = db.createObjectStore("Citas", { keyPath: "id", autoIncrement: true });
        
        citas.createIndex("user1", "user1", { unique: false });
        citas.createIndex("user2", "user2", { unique: false });
        citas.createIndex("estado", "estado", { unique: false });
        
        citas.add({user1: "jorge@adsi.com", user2: "david@adsi.com", estado: "1"});
        citas.add({user1: "david@adsi.com", user2: "andrea@adsi.com", estado: "1"});
        citas.add({user1: "andrea@adsi.com", user2: "miguel@adsi.com", estado: "1"});
        citas.add({user1: "maria@adsi.com", user2: "lucia@adsi.com", estado: "1"});



        // Crea el object store para Visitas
        var visitas = db.createObjectStore("Visitas", { keyPath: "id", autoIncrement: true});
        
        visitas.createIndex("visita", "visita", { unique: false });
        visitas.createIndex("visitado", "visitado", { unique: false });
        visitas.createIndex("fechaUltimaVisita", "fechaUltimaVisita", { unique: false });
        
        visitas.add({visita: "jorge@adsi", visitado: "david@adsi.com",fechaUltimaVisita: "03-11-2024T15:49"});
        visitas.add({visita: "jorge@adsi", visitado: "najum.com",fechaUltimaVisita: "03-11-2024T15:47"});
        visitas.add({visita: "jorge@adsi", visitado: "maria@adsi.com",fechaUltimaVisita: "03-11-2024T16:00"});
        visitas.add({visita: "jorge@adsi", visitado: "lucia@adsi.com",fechaUltimaVisita: "05-11-2024T08:47"});

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
