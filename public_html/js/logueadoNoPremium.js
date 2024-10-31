document.addEventListener('DOMContentLoaded', function() {
    // Abre la conexión con IndexedDB
    const request = indexedDB.open("VitoMaite", 1);

    request.onsuccess = function(event) {
        const db = event.target.result;

        // Cargar datos desde IndexedDB cuando se hace clic en los botones
        document.getElementById('misVisitas').addEventListener('click', function() {
            cargarVisitas(db);
        });
        
        document.getElementById('misLikes').addEventListener('click', function() {
            cargarLikes(db);
        });

        // Cargar datos al iniciar
        cargarVisitas(db);
        cargarLikes(db);
    };

    request.onerror = function(event) {
        console.error("Error al abrir la base de datos:", event.target.errorCode);
    };

    // Función para cargar visitas desde IndexedDB
    function cargarVisitas(db) {
        const transaction = db.transaction("Visitas", "readonly");
        const objectStore = transaction.objectStore("Visitas");
        const visitasTableBody = document.querySelector('.tabla-seccion tbody');
        
        visitasTableBody.innerHTML = ''; // Limpiar tabla antes de cargar

        objectStore.openCursor().onsuccess = function(event) {
            const cursor = event.target.result;
            if (cursor) {
                const visita = cursor.value;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${visita.fechaUltimaVisita}</td>
                    <td>${visita.visita}</td>
                    <td>${visita.ciudad1 || 'Ciudad desconocida'}</td>
                    <td><button class="detalle-btn">Detalles</button></td>
                `;
                visitasTableBody.appendChild(row);
                cursor.continue();
            }

            // Agregar evento para todos los botones "Detalles"
            document.querySelectorAll('.detalle-btn').forEach(button => {
                button.addEventListener('click', function() {
                    window.location.href = 'hacersePremium.html';
                });
            });
        };
    }

    // Función para cargar likes desde IndexedDB
    function cargarLikes(db) {
        const transaction = db.transaction("Citas", "readonly");
        const objectStore = transaction.objectStore("Citas");
        const likesTableBody = document.querySelectorAll('.tabla-seccion')[1].querySelector('tbody');
        
        likesTableBody.innerHTML = ''; // Limpiar tabla antes de cargar

        objectStore.openCursor().onsuccess = function(event) {
            const cursor = event.target.result;
            if (cursor) {
                const cita = cursor.value;
                if (cita.estado === 1) { // Estado 1 indica que es un 'match' o 'like mutuo'
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${cita.fecha}</td>
                        <td>${cita.user1}</td>
                    `;
                    likesTableBody.appendChild(row);
                }
                cursor.continue();
            }
        };
    }

    // Event listener para el botón "Buscar"
    document.getElementById('buscar').addEventListener('click', function() {
        window.location.href = 'buscarNoPremium.html';
    });

    // Botón de cerrar sesión
    const cerrarSesion = document.getElementById('cerrarSesion');
    cerrarSesion.addEventListener('click', function() {
        alert('Sesión cerrada.');
        window.location.href = 'index.html';
    });
});
