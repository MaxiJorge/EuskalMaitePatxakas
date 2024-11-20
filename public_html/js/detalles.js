document.addEventListener('DOMContentLoaded', function () {
    // Recuperar los datos del usuario desde localStorage
    var usuarioDetalles = localStorage.getItem('usuarioDetalles');

    if (!usuarioDetalles) {
        alert('No se encontraron detalles del usuario.');
        return;
    }
     const btnAtras = document.getElementById('btnAtras');
    btnAtras.addEventListener('click', function (event) {
        event.preventDefault(); // Evita el comportamiento por defecto del enlace
        //Borra el usuario del que estabas viendo 
        localStorage.clear();

        // Redirige a buscarLogueado.html
        window.location.href = 'buscarLogueado.html';
    });
    
    // Parsear los datos del usuario
    var usuario = JSON.parse(usuarioDetalles);

    // Seleccionar el contenedor de detalles
    var detallesUsuario = document.getElementById('detallesUsuario');

    //Llena el html
    var contenidoHTML = `<div class="detalle">
            <img src="${usuario.foto || 'img/default-avatar.png'}" alt="Foto del usuario" class="detalle-foto">
            <h2>${usuario.nombre}</h2>
            <p><strong>Edad:</strong> ${usuario.edad}</p>
            <p><strong>Género:</strong> ${usuario.genero === 'H' ? 'Hombre' : 'Mujer'}</p>
            <p><strong>Ciudad:</strong> ${usuario.ciudad}</p>
        </div>`;

    // Insertar el contenido HTML en el contenedor
    document.getElementById("detallesUsuario").innerHTML = contenidoHTML;

    // Insertar el contenido en el contenedor
    detallesUsuario.innerHTML = contenidoHTML;
});
