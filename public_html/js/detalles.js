// Función para obtener el id del usuario desde la URL
function obtenerIdDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id'); 
}

// Saca los detalles de IndexedDB
    function obtenerDetallesUsuario(id) {
    const request = indexedDB.open('vitomaite02', 1); // Abrir la base de datos

    request.onsuccess = function(event) {
        var db = event.target.result;
        var transaction = db.transaction('Usuario', 'readonly');
        var store = transaction.objectStore('Usuario');
        var userRequest = store.get(id); // Obtener el usuario por su id

        userRequest.onsuccess = function() {
            const usuario = userRequest.result;

            if (usuario) {
 
                actualizarDetallesUsuario(usuario);
            } else {
                console.error("Usuario no encontrado");
            }
        };

        userRequest.onerror = function() {
            console.error("Error al obtener el usuario desde IndexedDB");
        };
    };

    request.onerror = function() {
        console.error("Error al abrir la base de datos IndexedDB");
    };
}

// Función para actualizar los detalles del usuario en el HTML
function actualizarDetallesUsuario(usuario) {
    var detallesDiv = document.getElementById('detallesUsuario');
    
    //Foto por defecto si no tienen ninguna añadida en IndexedDB
    var fotoUsuario;
    if (usuario.genero === 'H') {
        fotoUsuario = 'img/avatar001.png';
    } else if (usuario.genero === 'M') {
        fotoUsuario = 'img/avatar002.png'; 
    } 

    // Llenar detallesUsuario en HTML
    detallesDiv.innerHTML = `<div>
        <img src="${usuario.foto || fotoUsuario}" alt="Foto de ${usuario.nombre}" id="usuarioFoto" />
                            </div>
        <h2 id="usuarioNombre">${usuario.nombre}</h2>
        <p id="usuarioEdad">Edad: ${usuario.edad}</p>
        <p id="usuarioGenero">Género: ${usuario.genero === 'H' ? 'Masculino' : 'Femenino'}</p>
        <p id="usuarioCiudad">Ciudad: ${usuario.ciudad}</p>`;
}


document.getElementById('btnAtras').addEventListener('click', function(event) {
    event.preventDefault();  
    window.history.back();   
});

// Obtener el id del usuario desde la URL
const usuarioId = obtenerIdDesdeURL();

// Verificar si tenemos un id válido
if (usuarioId) {
    // Obtener los detalles del usuario desde IndexedDB
    obtenerDetallesUsuario(parseInt(usuarioId));
} else {
    console.error("No se encontró el id del usuario");
}