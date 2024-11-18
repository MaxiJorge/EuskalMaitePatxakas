document.addEventListener('DOMContentLoaded', function() {
    configurarFormulario();
});

function configurarFormulario() {
    const formulario = document.getElementById('botonBuscar');
    formulario.addEventListener('click', function(event) {
        event.preventDefault(); // Evita el comportamiento por defecto del botón

        // Captura los valores de los campos de búsqueda
        const genero = document.getElementById('generoInput').value;
        const edadMin = parseInt(document.getElementById('edadMin').value);
        const edadMax = parseInt(document.getElementById('edadMax').value);
        const ciudad = document.getElementById('ciudadInput').value;

        // Realizar la búsqueda en IndexedDB
        realizarBusqueda(genero, edadMin, edadMax, ciudad);
    });
}

function realizarBusqueda(genero, edadMin, edadMax, ciudad) {
    const abrir = indexedDB.open("VitoMaite", 1);

    abrir.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(["Usuarios"], "readonly");
        const objectStore = transaction.objectStore("Usuarios");

        // Realizar la búsqueda usando índices
        const request = objectStore.getAll(); // Obtener todos los usuarios

        request.onsuccess = function() {
            const usuarios = request.result;
            const resultados = usuarios.filter(usuario => {
                // Filtrar según las condiciones de búsqueda
                return (usuario.género === genero || genero === "") &&
                    (usuario.edad >= edadMin && usuario.edad <= edadMax) &&
                    (usuario.ciudad === ciudad || ciudad === "");
            });

            mostrarResultados(resultados);
        };

        request.onerror = function() {
            console.error("Error al obtener los usuarios.");
        };
    };

    abrir.onerror = function() {
        console.error("Error al abrir la base de datos.");
    };
}

function mostrarResultados(usuarios) {
    const tablaResultados = document.getElementById('tablaResultados');
    const resultadosDiv = document.getElementById('resultados');
    tablaResultados.innerHTML = ""; // Limpiar los resultados previos

    if (usuarios.length === 0) {
        tablaResultados.innerHTML = "<tr><td colspan='3'>No se encontraron usuarios.</td></tr>";
    } else {
        usuarios.forEach(usuario => {
            // Crear una nueva fila para cada usuario
            const fila = document.createElement("tr");

            const nickTd = document.createElement("td");
            nickTd.textContent = usuario.nick;
            fila.appendChild(nickTd);

            const edadTd = document.createElement("td");
            edadTd.textContent = usuario.edad;
            fila.appendChild(edadTd);

            const accionesTd = document.createElement("td");
            const botonVerMas = document.createElement("button");
            botonVerMas.textContent = "Ver más detalles";
            botonVerMas.onclick = function() {
                // Redirige a la página de detalles del usuario (aquí puedes pasar el ID del usuario en la URL)
                window.location.href = `index.html?userId=${usuario.id}`;
            };
            accionesTd.appendChild(botonVerMas);
            fila.appendChild(accionesTd);

            tablaResultados.appendChild(fila);
        });
    }

    // Mostrar los resultados
    resultadosDiv.style.display = "block";
}
