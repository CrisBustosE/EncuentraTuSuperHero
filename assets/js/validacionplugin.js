$.fn.validacion = function (mensaje, validInput, cardStats) {
    var element = this;
    //Las alertas se pueden bloquear, por eso preferi dejar un mensaje con lo sucedido en caso de fallar la validacion
    //Ademas, ocultamos antes las cards y el grafico para no confundir al usuario al pensar que encontro al mismo heroe con el mismo id, si 
    //Pasa las verificaciones, la tarjeta se muestra cuando llama a la API
    mensaje.text("");
    cardStats.attr("hidden", true);
    if (!validInput.test(element.val()) && element.val() === "") {
        mensaje.text("No has ingresado un número para buscar.");
    } else if (!validInput.test(element.val())) {
        mensaje.text("Porfavor ingresa solo números.");
    } else if (element.val() < 1) {
        mensaje.text("Porfavor ingresa un número mayor a 0.");
    } else if (element.val() > 732) {
        mensaje.text("Número fuera de rango, nuestros registros almacenan hasta el SuperHero numero 732.");
    } else {
        return true;
    }
}


