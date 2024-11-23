document.addEventListener('DOMContentLoaded', function () {

});

// Botones
var botonCerrarSesion = document.getElementById('botonCerrarSesion');
var buscarBtn = document.getElementById("buscarBtn");

botonCerrarSesion.addEventListener('click', function () {

    cerrarSesion();
});

function cerrarSesion(){
        sessionStorage.clear();
        window.location.href = 'index.html';
    }

buscarBtn.addEventListener("click", function () {

    buscarUsuariosPorCriterios();

});

// Función para dar Like
// Función para dar Like
function darLike(emailEmisor, emailReceptor, nombreReceptor) {
    const request = indexedDB.open("vitomaite02", 1);

    request.onsuccess = function (evento) {
        const db = evento.target.result;
        const transaccion = db.transaction(["MeGusta"], "readwrite");
        const meGustaStore = transaccion.objectStore("MeGusta");

        // Verificar si ya existe un registro donde el receptor dio like al emisor
        var indexUser2 = meGustaStore.index("user2");
        var cursorRequest = indexUser2.openCursor(IDBKeyRange.only(emailEmisor));

        cursorRequest.onsuccess = function (event) {
            var cursor = event.target.result;

            if (cursor) {
                var registro = cursor.value;

                // Verificar si el receptor ya dio like al emisor
                if (registro.user1 === emailReceptor && registro.estado === "1") {
                    // Cambiar el estado a "2" para indicar un MATCH
                    registro.estado = "2";
                    var updateRequest = cursor.update(registro);

                    updateRequest.onsuccess = function () {
                        // Mostrar el nombre del receptor (la persona que dio el like)
                        alert(`¡MATCH! Vas a follar con ${nombreReceptor} `);
                    };

                    updateRequest.onerror = function (error) {
                        console.error("Error al actualizar el estado del like: ", error);
                    };
                } else {
                    cursor.continue();
                }
            } else {
                // Si no hay MATCH previo, agregar un nuevo like
                agregarNuevoLike(emailEmisor, emailReceptor, meGustaStore);
            }
        };

        function agregarNuevoLike(correoEmisor, correoReceptor, meGustaStore) {
            // Crear un nuevo registro de like
            var nuevoLike = {
                user1: correoEmisor,
                user2: correoReceptor,
                estado: "1" // Estado inicial
            };

            var addRequest = meGustaStore.add(nuevoLike);

            addRequest.onsuccess = function () {
                alert(`Has dado like al usuario: ${nombreReceptor}`);
            };

            addRequest.onerror = function (error) {
                console.error("Error al guardar el like: ", error);
            };
        }
    };
}

// Función para generar las opciones en un rango específico
function generarOpcionesEdad(selectId, minEdad, maxEdad) {
    var select = document.getElementById(selectId);

    // Limpia ociones por si se vuelve a seleccionar edadMin
    select.innerHTML = "";

    //Nada mas entras que no te salga seleccionado el 18
    var optionMin = document.createElement("option");
    optionMin.value = "";
    optionMin.textContent = "Edad mínima";
    optionMin.disabled = true;
    optionMin.selected = true;
    select.appendChild(optionMin);

    // Agrega rango
    for (let edad = minEdad; edad <= maxEdad; edad++) {
        var option = document.createElement("option");
        option.value = edad;
        option.textContent = edad;
        select.appendChild(option);
    }
}

// Actualiza opciones de edad max
function actualizarEdadMax() {
    var edadDesde = parseInt(document.getElementById("edadDesde").value, 10);
    var maxEdad = 99;
    var edadHastaSelect = document.getElementById("edadHasta");

    generarOpcionesEdad("edadHasta", edadDesde, maxEdad);

    // Si edad max es menor que edad min, lo actualiza
    var edadHasta = parseInt(edadHastaSelect.value, 10);
    if (edadHasta < edadDesde) {
        edadHastaSelect.value = edadDesde;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    var minEdad = 18;
    var maxEdad = 99;
    generarOpcionesEdad("edadDesde", minEdad, maxEdad);
    generarOpcionesEdad("edadHasta", minEdad, maxEdad);

    // Cambia edad max dependiendo de la edad min
    document.getElementById("edadDesde").addEventListener("change", actualizarEdadMax);
});

function buscarUsuariosPorCriterios() {
    // Obtener los valores seleccionados por el usuario
    var generoSeleccionado = document.getElementById("genero").value; // Género
    var edadMin = document.getElementById("edadDesde").value;  // Edad mínima
    var edadMax = document.getElementById("edadHasta").value;  // Edad máxima
    var ciudadSeleccionada = document.getElementById("ciudad").value; // Ciudad

    var tablaSolteros = document.getElementById("tablaSolteros");
    tablaSolteros.innerHTML = ""; //vaciar la tabla 

    // Validar que todos los criterios estén seleccionados
    if (!generoSeleccionado || !edadMin || !edadMax || !ciudadSeleccionada) {
        alert("Por favor, selecciona todos los criterios (género, edad y ciudad).");
        return;
    }

    // Llamar a la función para obtener los usuarios según los criterios seleccionados
    obtenerUsuariosPorCriterios(generoSeleccionado, edadMin, edadMax, ciudadSeleccionada);
}

function obtenerUsuariosPorCriterios(generoSeleccionado, edadMin, edadMax, ciudadSeleccionada) {
    var request = indexedDB.open("vitomaite02", 1); // Abrir la base de datos

    request.onerror = function (event) {
        console.error("Error al abrir la base de datos: ", event.target.error);
        alert("Hubo un error al acceder a la base de datos.");
    };

    request.onsuccess = function (evento) {
        var db = evento.target.result;
        var transaccion = db.transaction(["Usuario"], "readonly"); // Acceder a la objectStore "Usuario"
        var usuariosStore = transaccion.objectStore("Usuario");

        // Verificar si hay usuarios en la base de datos
        var totalUsuarios = usuariosStore.count();

        totalUsuarios.onsuccess = function () {
            if (totalUsuarios.result === 0) {
                alert("No hay usuarios registrados en la base de datos.");
            } else {
                // Iniciar la búsqueda de usuarios
                var cursor = usuariosStore.openCursor();
                var encontrados = 0;
                //var usuariosEncontrados = [];

                cursor.onsuccess = function (eventoCursor) {
                    var resultado = eventoCursor.target.result;

                    if (resultado) {
                        var usuario = resultado.value;

                        // Verificar los criterios de búsqueda
                        var edadUsuario = usuario.edad;

                        if (edadUsuario >= edadMin && edadUsuario <= edadMax &&
                                ((generoSeleccionado === "hombre" && usuario.genero === "H") ||
                                        (generoSeleccionado === "mujer" && usuario.genero === "M")) &&
                                usuario.ciudad.toLowerCase() === ciudadSeleccionada.toLowerCase()) {

                            agregarUsuarioALaInterfaz(usuario);
                            encontrados++;
                            //usuariosEncontrados.push(usuario);
                            //console.log(usuariosEncontrados) ;
                        }

                        // Pasar a la siguiente fila
                        resultado.continue();
                    } else {
                        // Fin del cursor
                        if (encontrados === 0) {
                            tablaSolteros.innerHTML = "";
                            alert("No se encontraron usuarios que cumplan con los criterios.");
                        }
                    }
                };
            }
        };
    };
}

function agregarUsuarioALaInterfaz(usuario) {
    var contenedorUsuarios = document.getElementById("tablaSolteros"); // Cambié contenedorUsuarios por tablaSolteros

    // Verificar si ya existe la tabla
    var tablaUsuarios = document.querySelector(".tabla-usuarios");

    if (!tablaUsuarios) {
        // Crear la tabla solo si no existe
        tablaUsuarios = document.createElement("table");
        tablaUsuarios.className = "tabla-usuarios";

        // Crear la fila de la cabecera
        var filaCabecera = document.createElement("tr");

        var fotoCabecera = document.createElement("th");
        fotoCabecera.textContent = "Foto";

        var nombreCabecera = document.createElement("th");
        nombreCabecera.textContent = "Nombre";

        var edadCabecera = document.createElement("th");
        edadCabecera.textContent = "Edad";

        var detallesCabecera = document.createElement("th");
        detallesCabecera.textContent = "Mas información";
        
        var likeCabecera = document.createElement("th");
        likeCabecera.textContent = "Me Gusta";
        // Agregar celdas de la cabecera
        filaCabecera.appendChild(fotoCabecera);
        filaCabecera.appendChild(nombreCabecera);
        filaCabecera.appendChild(edadCabecera);
        filaCabecera.appendChild(detallesCabecera);
        filaCabecera.appendChild(likeCabecera);
        // Agregar la fila de la cabecera a la tabla
        tablaUsuarios.appendChild(filaCabecera);

        // Agregar la tabla al contenedor
        contenedorUsuarios.appendChild(tablaUsuarios);
    }

    // Crear la fila del usuario
    var filaUsuario = document.createElement("tr");

    // Crear celdas para mostrar la información del usuario
    var nombreCelda = document.createElement("td");
    nombreCelda.textContent = usuario.nombre;

    var edadCelda = document.createElement("td");
    edadCelda.textContent = usuario.edad;

    var fotoCelda = document.createElement("td");
    var fotoUsuario = document.createElement("img");
    fotoUsuario.src = usuario.foto;
    fotoUsuario.alt = "Foto de usuario";
    fotoCelda.appendChild(fotoUsuario);
    
    var detallesCelda = document.createElement("td");
    var botonDetalles = document.createElement("button");
    botonDetalles.textContent = "Detalles";
    botonDetalles.className = "btn-detalles";
    
    botonDetalles.addEventListener('click', function () {
        //Guarda el usuario del que vamos a coger los detalle en localStorage
        window.location.href = `detalles.html?id=${usuario.id}`;
        
    });
     // Agregar el botón a la celda
    detallesCelda.appendChild(botonDetalles);
    
    const likeCelda = document.createElement("td");
    const imagenLike = document.createElement("img");
    imagenLike.src = "img/like.png";
    imagenLike.alt = "Dar like";
    imagenLike.style.width = "30px";
    imagenLike.style.cursor = "pointer";

    imagenLike.addEventListener("click", function () {
        var usuarioLogueado = JSON.parse(sessionStorage.getItem("usuarioLogueado"));
        if (usuarioLogueado) {
            darLike(usuarioLogueado.correo, usuario.correo, usuario.nombre);
        } else {
            alert("Debes estar logueado para dar like.");
        }
    });

    likeCelda.appendChild(imagenLike);
      
    // Agregar celdas a la fila del usuario
    filaUsuario.appendChild(fotoCelda);
    filaUsuario.appendChild(nombreCelda);
    filaUsuario.appendChild(edadCelda);
    filaUsuario.appendChild(detallesCelda);
    filaUsuario.appendChild(likeCelda);
    // Agregar la fila del usuario a la tabla
    tablaUsuarios.appendChild(filaUsuario);
}

