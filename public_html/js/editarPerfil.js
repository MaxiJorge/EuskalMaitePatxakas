document.addEventListener('DOMContentLoaded', function() {
    var usuarioLogueado = JSON.parse(sessionStorage.getItem('usuarioLogueado'));
    
    // Rellenar los campos del formulario con la información actual del usuario
    document.getElementById('nombre').value = usuarioLogueado.nombre;
    document.getElementById('correo').value = usuarioLogueado.correo; // Solo mostrar, no editable
    document.getElementById('edad').value = usuarioLogueado.edad;
    document.getElementById('genero').value = usuarioLogueado.genero;
    document.getElementById('ciudad').value = usuarioLogueado.ciudad;
    
    
        //******BOTONES********    
    var botonCerrarSesion = document.getElementById("botonCerrarSesion");
    var botonGuardarPerfil = document.getElementById("guardarPerfilBtn");

    botonCerrarSesion.addEventListener('click', function() {
        cerrarSesion();
    });
    
    function cerrarSesion(){
        sessionStorage.clear();
        window.location.href = 'index.html';
    }
    
    botonGuardarPerfil.addEventListener('click', function (event) {
        event.preventDefault(); // Evitar recargar la página

        // Recopilar los datos del formulario
        var nombre = document.getElementById('nombre').value;
        var edad = document.getElementById('edad').value;
        var genero = document.getElementById('genero').value;
        var ciudad = document.getElementById('ciudad').value;

        // Validaciones
        if (!nombre || !edad || !ciudad || !genero) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }

        if (edad < 18 || edad > 99) {
            alert("La edad debe estar entre 18 y 99 años.");
            return;
        }

        // Abrir la base de datos y actualizar el registro
        var solicitud = indexedDB.open("vitomaite02", 1);
        
        solicitud.onerror = function (event) {
            console.error("Error al abrir la base de datos: ", event.target.error);
            alert("Hubo un error al acceder a la base de datos.");
        };
        
        solicitud.onsuccess = function (evento) {
            var db = evento.target.result;
            
            // Verifica que el object store exista
            if (!db.objectStoreNames.contains('Usuario')) {
                console.error("El object store 'Usuario' no existe.");
                return;}
            
            var transaction = db.transaction(["Usuario"], "readwrite");
            var usuariosStore = transaction.objectStore("Usuario");
            
            // Obtener el registro del usuario logueado para actualizar
            var solicitudUsuario = usuariosStore.index("correo").get(usuarioLogueado.correo);
            
            solicitudUsuario.onsuccess = function () {
                var usuario = solicitudUsuario.result;

                if (usuario) {
                    // Actualizar los datos
                    usuario.nombre = nombre;
                    usuario.edad = edad;
                    usuario.ciudad = ciudad;
                    usuario.genero = genero;

                    // Actualizar la foto si se seleccionó una nueva
                    var foto = document.getElementById('foto').files;
                    if (foto.length > 0) {
                        convertirArchivoABase64(foto[0], function (base64) {
                            if (base64) {
                                usuario.foto = base64;
                                guardarUsuario(usuario, usuariosStore);
                            } else {
                                alert("Error al cargar la foto. Inténtalo nuevamente.");
                            }
                        });
                    } else {
                        guardarUsuario(usuario, usuariosStore);
                    }
                }
            };
        };
        
                // Función para guardar el usuario actualizado
        function guardarUsuario(usuario, store) {
            var solicitudActualizacion = store.put(usuario);

            solicitudActualizacion.onsuccess = function () {
                alert("Perfil actualizado correctamente.");
                    // Actualizar datos en sessionStorage
                    sessionStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
                    window.location.reload();
                
            };

            solicitudActualizacion.onerror = function () {
                console.error("Error al actualizar el perfil.");
                alert("Error al actualizar el perfil. Inténtalo nuevamente.");
            };
        }

    });
    });