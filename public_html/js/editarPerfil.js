document.addEventListener('DOMContentLoaded', function() {
    const usuarioLogueado = JSON.parse(sessionStorage.getItem('usuarioLogueado'));
    
    // Rellenar los campos del formulario con la información actual del usuario
    document.getElementById('nombre').value = usuarioLogueado.nombre;
    document.getElementById('correo').value = usuarioLogueado.email; // Solo mostrar, no editable
    document.getElementById('edad').value = usuarioLogueado.edad;
    document.getElementById('genero').value = usuarioLogueado.genero;
    document.getElementById('ciudad').value = usuarioLogueado.ciudad;
    
    document.getElementById('guardarPerfilBtn').addEventListener('click', function (event) {
        event.preventDefault(); // Evitar recargar la página

        // Recopilar los datos del formulario
        const nombre = document.getElementById('nombre').value;
        const edad = document.getElementById('edad').value;
        const genero = document.getElementById('genero').value;
        const ciudad = document.getElementById('ciudad').value;

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
        const solicitud = indexedDB.open("vitomaitebd", 1);

        solicitud.onsuccess = function (evento) {
            const db = evento.target.result;

            const transaction = db.transaction(['Usuario'], 'readwrite');
            const usuariosStore = transaction.objectStore('Usuario');

            // Obtener el registro del usuario logueado para actualizar
            const solicitudUsuario = usuariosStore.get(usuarioLogueado.email);
            
            solicitudUsuario.onsuccess = function () {
                const usuario = solicitudUsuario.result;

                if (usuario) {
                    // Actualizar los datos
                    usuario.nombre = nombre;
                    usuario.edad = edad;
                    usuario.ciudad = ciudad;
                    usuario.genero = genero;

                    // Actualizar la foto si se seleccionó una nueva
                    const foto = document.getElementById('foto').files;
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
            const solicitudActualizacion = store.put(usuario);

            solicitudActualizacion.onsuccess = function () {
                alert("Perfil actualizado correctamente.").then(() => {
                    // Actualizar datos en sessionStorage
                    sessionStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
                    window.location.reload();
                });
            };

            solicitudActualizacion.onerror = function () {
                console.error("Error al actualizar el perfil.");
                alert("Error al actualizar el perfil. Inténtalo nuevamente.");
            };
        }
        
        // Manejar el cierre de sesión
    document.getElementById('cerrarSesion').addEventListener('click', function() {
        cerrarSesion();
    });
    
    function cerrarSesion(){
        sessionStorage.clear();
        window.location.href = 'index.html';
    }
    })
    })