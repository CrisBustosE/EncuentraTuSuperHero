$(document).ready(function () {
    const api = "https://superheroapi.com/api.php/2434431213368205/";
    //Regexp para aceptar solo numeros
    const validInput = new RegExp(/^-?[0-9]+$/m);
    let mensaje = $("#mensaje");
    const input = $("#input");
    const boton = $("#buscador");
    const cardStats = $("#cardStats");

    boton.click(function (e) {
        e.preventDefault();
        //Implementamos validacion en forma de plugin
        if (input.validacion(mensaje, validInput, cardStats)) {
            callApi();
        }
    });

    function callApi() {
        // Stats
        const stats = [];
        //Mostramos card y grafico
        cardStats.attr("hidden", false)
        $.ajax({
            type: "GET",
            url: api + input.val(),
            dataType: "JSON",
            success: function (hero) {
                $("#heroImage").attr("src", `${hero.image.url}`);
                $("#heroName").text(`Nombre: ${hero.name}`);
                $("#heroConnections").text(`${hero.connections["group-affiliation"]}`);
                $("#heroComic").text(`${hero.biography.publisher}`);
                $("#heroOccupation").text(`${hero.work.occupation}`);
                $("#heroFirstAppearance").text(`${hero.biography["first-appearance"]}`);
                $("#heroHeight").text(`${hero.appearance.height.slice(",").join(" - ")}`);
                $("#heroWeight").text(`${hero.appearance.weight.slice(",").join(" - ")}`);
                $("#heroAlias").text(`${hero.biography.aliases}`);

                for (const key in hero.powerstats) {
                    stats.push({
                        label: `${capitalizeFirstLetter(key)}`,
                        y: `${hero.powerstats[key]}`
                    });
                }
                renderChart(stats, hero.name);
            }
        });
    }


    //Funcion renderizado de grafico
    function renderChart(stats,heroName) {
        //Cambiamos los stats con value null por 0 para evitar problemas con el grafico 
        for (const elemento of stats) {
            if (elemento.y === "null"){
                elemento.y = 0;
            }
        }
        //Hacemos reduce a los zeros para saber si existe algun stat distinto de 0
        let zero = stats.reduce(function (acumulador, elemento) {
            return acumulador && elemento.y == 0;
        }, true);

        //Si todos los elementos son 0, mostramos un texto en vez del grafico para evitar bugs.
        if (zero === true) {
            $("#chartContainer").css("text-align", "center");
            $("#chartContainer").css("vertical-align", "middle");
            $("#chartContainer").css("padding-top", "2rem");
            $("#chartContainer").css("color", "white");
            $("#chartContainer").css("font-size", "2rem");
            $("#chartContainer").text("El SuperHero no tiene estadísticas registradas.");
        } else { //Si tenemos almenos un valor distinto de 0, muestra el grafico con ese stat y el resto en 0
            $("#chartContainer").css("padding-top", "0");
            var chart = new CanvasJS.Chart("chartContainer", {
                theme: "light2", // "light1", "light2", "dark1", "dark2"
                animationEnabled: true,
                title: {
                    text: `Estadísticas de Poder para ${heroName}`
                },
                data: [{
                    type: "pie",
                    startAngle: 25,
                    toolTipContent: "<b>{label}</b>: {y}",
                    showInLegend: "true",
                    legendText: "{label}",
                    indexLabelFontSize: 16,
                    indexLabel: "{label} ({y})",
                    dataPoints: stats
                }]
            });
            chart.render();

        }


    }

     //Para que se vea mas bonito, le damos mayusculas a la primera letra de cada label
     function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

});