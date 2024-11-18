// Función para validar el formulario antes de enviarlo
function validarFormulario(event) {
    const edad = document.getElementById('edad');
    const altura = document.getElementById('altura');

    // Validación de edad
    if (edad.value < 18 || edad.value > 100) {
        alert("La edad debe estar entre 18 y 100 años.");
        edad.focus();
        event.preventDefault(); // Evita que el formulario se envíe
        return false;
    }

    // Validación de altura
    if (altura.value < 50 || altura.value > 250) {
        alert("La altura debe estar entre 50 y 250 cm.");
        altura.focus();
        event.preventDefault(); // Evita que el formulario se envíe
        return false;
    }

    return true; // Si pasa todas las validaciones, se envía el formulario
}

// Función para mostrar la vista previa de la imagen seleccionada
function mostrarVistaPrevia() {
    const archivo = document.getElementById('foto').files[0];
    const vistaPrevia = document.getElementById('vistaPrevia');
    const vistaPreviaContainer = document.getElementById('vistaPreviaContainer');

    // Verifica si se ha seleccionado un archivo
    if (archivo) {
        const lector = new FileReader();

        // Define lo que debe hacer una vez que el archivo se haya cargado
        lector.onload = function (e) {
            // Asigna el resultado del FileReader (la imagen cargada) a la vista previa
            vistaPrevia.src = e.target.result;
            vistaPreviaContainer.style.display = 'block'; // Muestra el contenedor de vista previa
        };

        lector.readAsDataURL(archivo); // Lee el archivo como una URL de datos (base64)
    } else {
        vistaPreviaContainer.style.display = 'none'; // Oculta la vista previa si no se selecciona archivo
    }
}
