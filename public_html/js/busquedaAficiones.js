document.addEventListener('DOMContentLoaded', function () {
    var minEdad = 18;
    var maxEdad = 99;
    generarOpcionesEdad("edadDesde", minEdad, maxEdad);
    generarOpcionesEdad("edadHasta", minEdad, maxEdad);

    // Cambia edad max dependiendo de la edad min
    document.getElementById("edadDesde").addEventListener("change", actualizarEdadMax);
    cargarAficiones(); // Cargar las aficiones desde la base de datos
});

// Función para generar las opciones en un rango específico
function generarOpcionesEdad(selectId, minEdad, maxEdad) {
    var select = document.getElementById(selectId);
    select.innerHTML = "";

    var optionMin = document.createElement("option");
    optionMin.value = "";
    optionMin.textContent = selectId === "edadDesde" ? "Edad mínima" : "Edad máxima";
    optionMin.disabled = true;
    optionMin.selected = true;
    select.appendChild(optionMin);

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
    var edadHastaSelect = document.getElementById("edadHasta");

    generarOpcionesEdad("edadHasta", edadDesde, 99);

    var edadHasta = parseInt(edadHastaSelect.value, 10);
    if (edadHasta < edadDesde) {
        edadHastaSelect.value = edadDesde;
    }
}

function cargarAficiones() {
    // Abrimos la base de datos IndexedDB
    var request = indexedDB.open("vitomaite02", 1);

    request.onerror = function (event) {
        console.error("Error al abrir la base de datos: ", event.target.error);
        alert("Hubo un error al acceder a la base de datos.");
    };

    request.onsuccess = function (evento) {
        var db = evento.target.result;
        var transaccion = db.transaction(["Afición"], "readonly");
        var aficionesStore = transaccion.objectStore("Afición");

        var cursor = aficionesStore.openCursor();
        var aficiones = [];

        cursor.onsuccess = function (eventoCursor) {
            var resultado = eventoCursor.target.result;

            if (resultado) {
                aficiones.push(resultado.value.nombre); // Suponemos que cada registro tiene un campo 'nombre'
                resultado.continue();
            } else {
                // Una vez que se cargan todas las aficiones, generamos los checkboxes
                generarCheckboxesAficiones(aficiones);
            }
        };

        cursor.onerror = function (eventoError) {
            console.error("Error al obtener las aficiones: ", eventoError.target.error);
            alert("Hubo un error al obtener las aficiones.");
        };
    };
}


function generarCheckboxesAficiones(aficiones) {
    var checkboxContainer = document.getElementById("checkboxContainer");

    // Limpiar cualquier checkbox previo
    checkboxContainer.innerHTML = "";

    // Crear checkboxes de aficiones
    aficiones.forEach(function(aficion) {
        var label = document.createElement("label");
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = aficion.toLowerCase(); // Guardamos el valor en minúsculas
        checkbox.name = "aficiones";

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(aficion));
        checkboxContainer.appendChild(label);
    });
}

// Botones
var botonCerrarSesion = document.getElementById('botonCerrarSesion');
var buscarBtn = document.getElementById("buscarBtn");

var usuarioLogueado = JSON.parse(sessionStorage.getItem("usuarioLogueado"));

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

function buscarUsuariosPorCriterios() {
    var generoSeleccionado = document.getElementById("genero").value;
    var edadMin = document.getElementById("edadDesde").value;
    var edadMax = document.getElementById("edadHasta").value;
    var ciudadSeleccionada = document.getElementById("ciudad").value;

    // Obtener aficiones seleccionadas de los checkboxes
    var aficionesSeleccionadas = Array.from(document.querySelectorAll('input[name="aficiones"]:checked'))
                                        .map(checkbox => checkbox.value);

    var tablaSolteros = document.getElementById("tablaSolteros");
    tablaSolteros.innerHTML = "";

    if (!generoSeleccionado || !edadMin || !edadMax || !ciudadSeleccionada || aficionesSeleccionadas.length === 0) {
        alert("Por favor, selecciona todos los criterios (género, edad, ciudad y aficiones).");
        return;
    }

    obtenerUsuariosPorCriterios(generoSeleccionado, edadMin, edadMax, ciudadSeleccionada, aficionesSeleccionadas);
}

async function obtenerUsuariosPorCriterios(generoSeleccionado, edadMin, edadMax, ciudadSeleccionada, aficionesSeleccionadas) {
    var request = indexedDB.open("vitomaite02", 1);

    request.onerror = function (event) {
        console.error("Error al abrir la base de datos:", event.target.errorCode);
        alert("Hubo un error al acceder a la base de datos.");
    };

    request.onsuccess = async function (evento) {
        var db = evento.target.result;
        var transaccion = db.transaction(["Usuario", "Afición", "Usuario_Aficion"], "readonly");
        var usuariosStore = transaccion.objectStore("Usuario");

        var totalUsuarios = usuariosStore.count();
        totalUsuarios.onsuccess = async function () {
            if (totalUsuarios.result === 0) {
                alert("No hay usuarios registrados en la base de datos.");
            } else {
                var cursor = usuariosStore.openCursor();
                var encontrados = 0;
                var usuariosFiltrados = [];  // Array para almacenar usuarios que cumplen con los primeros criterios

                cursor.onsuccess = async function (eventoCursor) {
                    var resultado = eventoCursor.target.result;
                    if (resultado) {
                        var usuario = resultado.value;
                        var edadUsuario = usuario.edad;

                        // Validar los primeros criterios: género, edad, y ciudad
                        if (usuario.correo !== usuarioLogueado.correo &&
                            edadUsuario >= edadMin && edadUsuario <= edadMax &&
                            ((generoSeleccionado === "hombre" && usuario.genero === "H") ||
                                (generoSeleccionado === "mujer" && usuario.genero === "M")) &&
                            usuario.ciudad.toLowerCase() === ciudadSeleccionada.toLowerCase()) {
                            // Si pasa los primeros criterios, lo guardamos en el array
                            usuariosFiltrados.push(usuario);
                        }

                        // Continuar con el siguiente usuario
                        resultado.continue();
                    } else {
                        // Una vez terminada la búsqueda, ahora filtramos por aficiones
                        if (usuariosFiltrados.length === 0) {
                            alert("No se encontraron usuarios que cumplan con los criterios.");
                        } else {
                            // Ahora procesamos las aficiones de los usuarios filtrados
                            // Dentro de la función obtenerUsuariosPorCriterios, después de filtrar los usuarios
                            for (const usuario of usuariosFiltrados) {
                                try {
                                    const aficionesUsuario = await obtenerAficionesDeUsuario(db, usuario.correo);
                                    // Verificar si al menos una afición seleccionada coincide con alguna afición del usuario
                                    var tieneAficion = aficionesSeleccionadas.some(aficion => aficionesUsuario.includes(aficion));

                                    if (tieneAficion) {
                                        // Ahora pasa las aficiones del usuario a la interfaz
                                        agregarUsuarioALaInterfaz(usuario, aficionesUsuario);
                                        encontrados++;
                                    }
                                } catch (error) {
                                    console.error("Error al obtener las aficiones del usuario:", error);
                                }
                            }


                            if (encontrados === 0) {
                                alert("No se encontraron usuarios que coincidan con las aficiones seleccionadas.");
                            }
                        }
                    }
                };
            }
        };
    };
}

function obtenerAficionesDeUsuario(db, correoUsuario) {
    return new Promise((resolve, reject) => {
        var transaccion = db.transaction(["Usuario_Aficion", "Afición"], "readonly");
        var aficionesUsuarioStore = transaccion.objectStore("Usuario_Aficion");
        var aficionesStore = transaccion.objectStore("Afición");

        var aficionesUsuarioRequest = aficionesUsuarioStore.index("email").getAll(correoUsuario);

        aficionesUsuarioRequest.onsuccess = function() {
            var aficionesIds = aficionesUsuarioRequest.result;
            var aficionesUsuario = [];
            
            var count = 0;
            aficionesIds.forEach(function(aficionRelacion) {
                var aficionId = aficionRelacion.aficion;

                var aficionRequest = aficionesStore.get(aficionId);
                aficionRequest.onsuccess = function() {
                    if (aficionRequest.result) {
                        aficionesUsuario.push(aficionRequest.result.nombre.toLowerCase());
                    }
                    count++;
                    // Si todas las aficiones han sido procesadas, resolvemos la promesa
                    if (count === aficionesIds.length) {
                        resolve(aficionesUsuario);
                    }
                };

                aficionRequest.onerror = function() {
                    reject("Error al obtener el nombre de la afición con id: " + aficionId);
                };
            });
        };

        aficionesUsuarioRequest.onerror = function() {
            reject("Error al obtener las aficiones del usuario.");
        };

        transaccion.onerror = function() {
            reject("Error en la transacción.");
        };
    });
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

// Función para dar Like
function darLike(emailEmisor, emailReceptor, nombreReceptor) {
    const request = indexedDB.open("vitomaite02", 1);

    request.onsuccess = function (evento) {
        const db = evento.target.result;
        const transaccion = db.transaction(["MeGusta"], "readwrite");
        const meGustaStore = transaccion.objectStore("MeGusta");

        // Comprobar si ya hay un registro entre los dos usuarios con estado "2" (MATCH)
        var indexUser1 = meGustaStore.index("user1");
        var cursorRequest = indexUser1.openCursor(IDBKeyRange.only(emailEmisor));

        cursorRequest.onsuccess = function (event) {
            var cursor = event.target.result;

            if (cursor) {
                var registro = cursor.value;

                // Comprobar si existe un MATCH entre los usuarios
                if (registro.user2 === emailReceptor && registro.estado === "2") {
                    alert(`¡Ya tienes un MATCH con ${nombreReceptor}!`);
                    return; // Salir sin hacer nada más
                }

                cursor.continue();
            } else {
                // Si no hay MATCH previo, seguimos con el flujo normal
                verificarLikePrevio(emailEmisor, emailReceptor, nombreReceptor, meGustaStore);
            }
        };
    };
}

function verificarLikePrevio(emailEmisor, emailReceptor, nombreReceptor, meGustaStore) {
    // Comprobar si ya existe un like dado por el emisor al receptor
    var indexUser1 = meGustaStore.index("user1");
    var cursorRequest = indexUser1.openCursor(IDBKeyRange.only(emailEmisor));

    cursorRequest.onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
            var registro = cursor.value;

            if (registro.user2 === emailReceptor) {
                alert(`Ya has dado like a ${nombreReceptor}.`);
                return; // Salir sin hacer nada más
            }

            cursor.continue();
        } else {
            // Si no hay registro previo, damos un nuevo like
            agregarNuevoLike(emailEmisor, emailReceptor, nombreReceptor, meGustaStore);
        }
    };
}

function agregarNuevoLike(emailEmisor, emailReceptor, nombreReceptor, meGustaStore) {
    // Crear un nuevo registro de like
    var nuevoLike = {
        user1: emailEmisor,
        user2: emailReceptor,
        estado: "1" // Estado inicial
    };

    var addRequest = meGustaStore.add(nuevoLike);

    addRequest.onsuccess = function () {
        alert(`Has dado like a ${nombreReceptor}.`);
    };

    addRequest.onerror = function (error) {
        console.error("Error al guardar el like: ", error);
    };
}