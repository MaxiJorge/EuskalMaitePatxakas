document.addEventListener('DOMContentLoaded', function () {
    const usuarioLogueado = JSON.parse(sessionStorage.getItem('usuarioLogueado'));
    const dbRequest = indexedDB.open("vitomaite02", 1);

    dbRequest.onerror = function (event) {
        console.error("Error al abrir la base de datos:", event.target.errorCode);
    };

    dbRequest.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(["Usuario_Aficion", "Afición"], "readonly");
        const usuarioAficionStore = transaction.objectStore("Usuario_Aficion");
        const aficionStore = transaction.objectStore("Afición");

        // Obtener las aficiones seleccionadas por el usuario
        const aficionesSeleccionadas = [];
        const requestSeleccionadas = usuarioAficionStore.index("email").openCursor(IDBKeyRange.only(usuarioLogueado.correo));

        requestSeleccionadas.onsuccess = function (event) {
            const cursor = event.target.result;
            if (cursor) {
                const aficionId = cursor.value.aficion;
                const requestAficion = aficionStore.get(aficionId);
                requestAficion.onsuccess = function () {
                    aficionesSeleccionadas.push(requestAficion.result.nombre);
                };
                cursor.continue();
            } else {
                // Ahora cargamos las aficiones no seleccionadas
                cargarAficionesNoSeleccionadas(aficionesSeleccionadas, db);
            }
        };
    };

    function cargarAficionesNoSeleccionadas(aficionesSeleccionadas, db) {
        const aficionesNoSeleccionadasList = document.getElementById("no-seleccionadas-list");
        const aficionesSeleccionadasList = document.getElementById("seleccionadas-list");

        const aficionStore = db.transaction("Afición", "readonly").objectStore("Afición");

        const requestAficiones = aficionStore.openCursor();

        requestAficiones.onsuccess = function (event) {
            const cursor = event.target.result;
            if (cursor) {
                const aficion = cursor.value;
                if (!aficionesSeleccionadas.includes(aficion.nombre)) {
                    const li = document.createElement("li");
                    li.textContent = aficion.nombre;
                    li.onclick = function () {
                        agregarAficion(aficion.id, aficion.nombre);
                    };
                    aficionesNoSeleccionadasList.appendChild(li);
                } else {
                    const li = document.createElement("li");
                    li.textContent = aficion.nombre;
                    li.onclick = function () {
                        eliminarAficion(aficion.id, aficion.nombre);
                    };
                    aficionesSeleccionadasList.appendChild(li);
                }
                cursor.continue();
            }
        };
    }

    function agregarAficion(aficionId, aficionNombre) {
        const aficionesSeleccionadasList = document.getElementById("seleccionadas-list");
        const aficionesNoSeleccionadasList = document.getElementById("no-seleccionadas-list");

        const li = document.createElement("li");
        li.textContent = aficionNombre;
        li.onclick = function () {
            eliminarAficion(aficionId, aficionNombre);
        };
        aficionesSeleccionadasList.appendChild(li);

        const items = aficionesNoSeleccionadasList.getElementsByTagName("li");
        for (let item of items) {
            if (item.textContent === aficionNombre) {
                aficionesNoSeleccionadasList.removeChild(item);
                break;
            }
        }
    }

    function eliminarAficion(aficionId, aficionNombre) {
        const aficionesSeleccionadasList = document.getElementById("seleccionadas-list");
        const aficionesNoSeleccionadasList = document.getElementById("no-seleccionadas-list");

        const li = document.createElement("li");
        li.textContent = aficionNombre;
        li.onclick = function () {
            agregarAficion(aficionId, aficionNombre);
        };
        aficionesNoSeleccionadasList.appendChild(li);

        const items = aficionesSeleccionadasList.getElementsByTagName("li");
        for (let item of items) {
            if (item.textContent === aficionNombre) {
                aficionesSeleccionadasList.removeChild(item);
                break;
            }
        }
    }

    // Guardar cambios y redirigir
    document.getElementById("guardar-cambios").addEventListener("click", function () {
        const aficionesSeleccionadasList = document.getElementById("seleccionadas-list");
        const aficionesSeleccionadas = [];

        for (let li of aficionesSeleccionadasList.getElementsByTagName("li")) {
            aficionesSeleccionadas.push(li.textContent);
        }

        const dbRequest = indexedDB.open("vitomaite02", 1);
        dbRequest.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction(["Usuario_Aficion"], "readwrite");
            const store = transaction.objectStore("Usuario_Aficion");

            // Primero, eliminamos todas las aficiones del usuario actual
            const index = store.index("email");
            const request = index.openCursor(IDBKeyRange.only(usuarioLogueado.correo));

            request.onsuccess = function (event) {
                const cursor = event.target.result;
                if (cursor) {
                    store.delete(cursor.primaryKey);
                    cursor.continue();
                } else {
                    // Luego, agregamos las nuevas aficiones seleccionadas
                    agregarNuevasAficiones(db, aficionesSeleccionadas);
                }
            };
        };
    });

    function agregarNuevasAficiones(db, aficionesSeleccionadas) {
        const transaction = db.transaction(["Afición", "Usuario_Aficion"], "readwrite");
        const aficionStore = transaction.objectStore("Afición");
        const usuarioAficionStore = transaction.objectStore("Usuario_Aficion");

        aficionesSeleccionadas.forEach(aficion => {
            const requestAficion = aficionStore.index("nombre").get(aficion);
            requestAficion.onsuccess = function () {
                if (requestAficion.result) {
                    usuarioAficionStore.add({ email: usuarioLogueado.correo, aficion: requestAficion.result.id });
                }
            };
        });

        // Redirigir al usuario a logueado.html después de guardar
        transaction.oncomplete = function () {
            window.location.href = 'logueado.html';
        };
    }
});
