// Espera a que el DOM se cargue
document.addEventListener('DOMContentLoaded', function() {
    crearBD(); // Inicializa la base de datos
    configurarBotones(); // Configura los eventos de los botones
});

function crearBD() {
    // Abre o crea la base de datos "VitoMaite" en versión 1
    var abrir = indexedDB.open("vitomaite02", 1);
    
    abrir.onerror = function(event) {
        console.error("Error al abrir la base de datos:", event.target.errorCode);
    };
    
    abrir.onsuccess = function(event) {
        console.log("Base de datos creada y abierta con éxito");
    };

    abrir.onupgradeneeded = function(event) {
        
        var db = event.target.result;

        // Crea el object store para Usuarios con clave primaria "id" autoincrementable
        var user = db.createObjectStore("Usuario", { keyPath: "id", autoIncrement: true });
        
        user.createIndex("correo", "correo", { unique: true });
        user.createIndex("nombre", "nombre", { unique: false });
        user.createIndex("contrasena", "contrasena", { unique: false });
        //user.createIndex("edad", "edad", { unique: false });
        user.createIndex("genero", "genero", { unique: false});
        user.createIndex("ciudad", "ciudad", { unique: false});
        //user.createIndex("foto", "foto", { unique: false });

        //LOS PIBES
        user.add({
            correo: "david@adsi.com",
            nombre: "David",
            contrasena: "1234",
            edad: "20",
            genero: "H",
            ciudad: "Vitoria",
            foto: avatar01,
            lat: 42.84998,
            lon: -2.67268
        });

        user.add({
            correo: "miguel@adsi.com",
            nombre: "Miguel",
            contrasena: "1234",
            edad: "33",
            genero: "H",
            ciudad: "Bilbo",
            foto: "",
            lat: 43.26122,
            lon: -2.93055
        });

        user.add({
            correo: "najum@adsi.com",
            nombre: "Najum",
            contrasena: "1234",
            edad: "20",
            genero: "H",
            ciudad: "Vitoria",
            foto: "",
            lat: 42.85088,
            lon: -2.67078
        });

        user.add({
            correo: "jorge@adsi.com",
            nombre: "Jorge",
            contrasena: "1234",
            edad: "20",
            genero: "H",
            ciudad: "Vitoria",
            foto: "",
            lat: 42.864968, // Nueva latitud, a menos de 1 km de las coordenadas originales
            lon: -2.692234  // Nueva longitud, a menos de 1 km de las coordenadas originales
        });

        user.add({
            correo: "javi@adsi.com",
            nombre: "Javi",
            contrasena: "1234",
            edad: "26",
            genero: "H",
            ciudad: "Vitoria",
            foto: "",
            lat: 42.862689, // Nueva latitud, a menos de 1 km de las coordenadas originales
            lon: -2.690672  // Nueva longitud, a menos de 1 km de las coordenadas originales
        });

        user.add({
            correo: "marcos@adsi.com",
            nombre: "Marcos",
            contrasena: "1234",
            edad: "24",
            genero: "H",
            ciudad: "Bilbo",
            foto: "",
            lat: 43.26214,
            lon: -2.93320
        });

        user.add({
            correo: "pelayo@adsi.com",
            nombre: "Pelayo",
            contrasena: "1234",
            edad: "29",
            genero: "H",
            ciudad: "Vitoria",
            foto: "",
            lat: 42.873312,
            lon: -2.681758
        });

        user.add({
            correo: "daniel@adsi.com",
            nombre: "Daniel",
            contrasena: "1234",
            edad: "31",
            genero: "H",
            ciudad: "Bilbo",
            foto: "",
            lat: 43.26034,
            lon: -2.93611
        });

        user.add({
            correo: "maria@adsi.com",
            nombre: "Maria",
            contrasena: "1234",
            edad: "23",
            genero: "M",
            ciudad: "Bilbo",
            foto: "",
            lat: 43.26547,
            lon: -2.93428
        });

        user.add({
            correo: "andrea@adsi.com",
            nombre: "Andrea",
            contrasena: "1234",
            edad: "18",
            genero: "M",
            ciudad: "Donosti",
            foto: "",
            lat: 43.32019,
            lon: -1.97965
        });

        user.add({
            correo: "sandra@adsi.com",
            nombre: "Sandra",
            contrasena: "1234",
            edad: "45",
            genero: "M",
            ciudad: "Donosti",
            foto: "",
            lat: 43.31735,
            lon: -1.98012
        });

        user.add({
            correo: "lucia@adsi.com",
            nombre: "Lucia",
            contrasena: "1234",
            edad: "50",
            genero: "M",
            ciudad: "Bilbo",
            foto: "",
            lat: 43.26376,
            lon: -2.93282
        });

        user.add({
            correo: "carla@adsi.com",
            nombre: "Carla",
            contrasena: "1234",
            edad: "22",
            genero: "M",
            ciudad: "Bilbo",
            foto: "",
            lat: 43.26503,
            lon: -2.93110
        });

        user.add({
            correo: "laura@adsi.com",
            nombre: "Laura",
            contrasena: "1234",
            edad: "27",
            genero: "M",
            ciudad: "Vitoria",
            foto: "",
            lat: 42.84945,
            lon: -2.67456
        });

        user.add({
            correo: "beatriz@adsi.com",
            nombre: "Beatriz",
            contrasena: "1234",
            edad: "32",
            genero: "M",
            ciudad: "Donosti",
            foto: "",
            lat: 43.31911,
            lon: -1.98200
        });

        user.add({
            correo: "elena@adsi.com",
            nombre: "Elena",
            contrasena: "1234",
            edad: "29",
            genero: "M",
            ciudad: "Bilbo",
            foto: "",
            lat: 43.26165,
            lon: -2.93098
        });

        
        // Crea el object store para Citas
        var citas = db.createObjectStore("MeGusta", { keyPath: "id", autoIncrement: true });
        
        citas.createIndex("user1", "user1", { unique: false });
        citas.createIndex("user2", "user2", { unique: false });
        citas.createIndex("estado", "estado", { unique: false });
        
        citas.add({user1: "jorge@adsi.com", user2: "david@adsi.com", estado: "1"});
        citas.add({user1: "david@adsi.com", user2: "andrea@adsi.com", estado: "1"});
        citas.add({user1: "andrea@adsi.com", user2: "miguel@adsi.com", estado: "1"});
        citas.add({user1: "maria@adsi.com", user2: "lucia@adsi.com", estado: "1"});



        // Crea el object store para Aficiones
        var aficionesStore = db.createObjectStore("Afición", {keyPath: "id", autoIncrement: true});
        aficionesStore.add({nombre: "Fortnite"});
        aficionesStore.add({nombre: "Glow"});
        aficionesStore.add({nombre: "Viajar"});
        aficionesStore.add({nombre: "Cine"});
        aficionesStore.add({nombre: "Pesca"});
        aficionesStore.add({nombre: "Mus"});
        aficionesStore.add({nombre: "Gastronomía"});
        aficionesStore.add({nombre: "Música"});
        aficionesStore.add({nombre: "Fotografía"});
        aficionesStore.add({nombre: "Zeppeling"});
        
        aficionesStore.createIndex("nombre", "nombre", {unique: true});

        
        
        var aficionesUsuarioStore = db.createObjectStore("Usuario_Aficion", {keyPath: "id", autoIncrement: true});
        
        aficionesUsuarioStore.add({email: "david@adsi.com", aficion: 1});
        aficionesUsuarioStore.add({email: "david@adsi.com", aficion: 2});
        aficionesUsuarioStore.add({email: "david@adsi.com", aficion: 3});
        aficionesUsuarioStore.add({email: "david@adsi.com", aficion: 4});

        aficionesUsuarioStore.add({email: "miguel@adsi.com", aficion: 5});
        aficionesUsuarioStore.add({email: "miguel@adsi.com", aficion: 6});
        aficionesUsuarioStore.add({email: "miguel@adsi.com", aficion: 7});
        aficionesUsuarioStore.add({email: "miguel@adsi.com", aficion: 8});

        aficionesUsuarioStore.add({email: "najum@adsi.com", aficion: 9});
        aficionesUsuarioStore.add({email: "najum@adsi.com", aficion: 10});
        aficionesUsuarioStore.add({email: "najum@adsi.com", aficion: 1});
        aficionesUsuarioStore.add({email: "najum@adsi.com", aficion: 2});

        aficionesUsuarioStore.add({email: "jorge@adsi.com", aficion: 3});
        aficionesUsuarioStore.add({email: "jorge@adsi.com", aficion: 4});
        aficionesUsuarioStore.add({email: "jorge@adsi.com", aficion: 5});
        aficionesUsuarioStore.add({email: "jorge@adsi.com", aficion: 6});

        aficionesUsuarioStore.add({email: "marcos@adsi.com", aficion: 7});
        aficionesUsuarioStore.add({email: "marcos@adsi.com", aficion: 8});
        aficionesUsuarioStore.add({email: "marcos@adsi.com", aficion: 9});
        aficionesUsuarioStore.add({email: "marcos@adsi.com", aficion: 10});

        aficionesUsuarioStore.add({email: "javi@adsi.com", aficion: 1});
        aficionesUsuarioStore.add({email: "javi@adsi.com", aficion: 2});
        aficionesUsuarioStore.add({email: "javi@adsi.com", aficion: 3});
        aficionesUsuarioStore.add({email: "javi@adsi.com", aficion: 4});

        aficionesUsuarioStore.add({email: "jorge2@adsi.com", aficion: 5});
        aficionesUsuarioStore.add({email: "jorge2@adsi.com", aficion: 6});
        aficionesUsuarioStore.add({email: "jorge2@adsi.com", aficion: 7});
        aficionesUsuarioStore.add({email: "jorge2@adsi.com", aficion: 8});

        aficionesUsuarioStore.add({email: "daniel@adsi.com", aficion: 9});
        aficionesUsuarioStore.add({email: "daniel@adsi.com", aficion: 10});
        aficionesUsuarioStore.add({email: "daniel@adsi.com", aficion: 1});
        aficionesUsuarioStore.add({email: "daniel@adsi.com", aficion: 2});

        aficionesUsuarioStore.add({email: "maria@adsi.com", aficion: 3});
        aficionesUsuarioStore.add({email: "maria@adsi.com", aficion: 4});
        aficionesUsuarioStore.add({email: "maria@adsi.com", aficion: 5});
        aficionesUsuarioStore.add({email: "maria@adsi.com", aficion: 6});

        aficionesUsuarioStore.add({email: "andrea@adsi.com", aficion: 7});
        aficionesUsuarioStore.add({email: "andrea@adsi.com", aficion: 8});
        aficionesUsuarioStore.add({email: "andrea@adsi.com", aficion: 9});
        aficionesUsuarioStore.add({email: "andrea@adsi.com", aficion: 10});

        aficionesUsuarioStore.add({email: "sandra@adsi.com", aficion: 1});
        aficionesUsuarioStore.add({email: "sandra@adsi.com", aficion: 2});
        aficionesUsuarioStore.add({email: "sandra@adsi.com", aficion: 3});
        aficionesUsuarioStore.add({email: "sandra@adsi.com", aficion: 4});

        aficionesUsuarioStore.add({email: "lucia@adsi.com", aficion: 5});
        aficionesUsuarioStore.add({email: "lucia@adsi.com", aficion: 6});
        aficionesUsuarioStore.add({email: "lucia@adsi.com", aficion: 7});
        aficionesUsuarioStore.add({email: "lucia@adsi.com", aficion: 8});

        aficionesUsuarioStore.add({email: "carla@adsi.com", aficion: 9});
        aficionesUsuarioStore.add({email: "carla@adsi.com", aficion: 10});
        aficionesUsuarioStore.add({email: "carla@adsi.com", aficion: 1});
        aficionesUsuarioStore.add({email: "carla@adsi.com", aficion: 2});

        
        aficionesUsuarioStore.createIndex("email", "email", {unique: false});
    };
    
    
}

// Función para configurar los eventos de los botones
function configurarBotones() {
    // Selecciona los botones usando sus IDs
    const botonBuscar = document.getElementById('botonBuscar');
    const botonLogin = document.getElementById('botonLogin');
    
    // Asigna eventos de clic para redirigir a cada página
    botonBuscar.addEventListener('click', () => {
        window.location.href = 'buscarNoRegistrado.html';
    });

    botonLogin.addEventListener('click', () => {
        window.location.href = 'inicioSesion.html';
    });

    avatar01 = "data:image/png;base64,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";
    
}
