//llamamos a la función calcular mi fecha, para que nada mas cargar, ya este controlado este campo del formulario
calcularMinFecha();
var form = document.getElementById("form")
var noches = 0;
var personas = 0;
var posts = 0;
var fechaLLegada = 0;

/*
Funció asincrona en la cual obtenemos una unica vez los alojamientos, los cuales unicamente filtraremos y así no habrá
que solicitarles de nuevo a no ser que recarguemos la página.
 */
async function obtenerAlojamientos() {
    url = `/js/json/alojamientos.json`;
    const response = await fetch(url);
    posts = await response.json();
}

//Función para añadir el atributo min en el campo de tipo fecha, haciendo que la primera noche a poder seleccionar sea mañana
function calcularMinFecha() {
    var today = new Date();
    var dd = today.getDate() + 1;
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById("fecha").setAttribute("min", today);
}

//petición asincrona del primer json, el cual necesitamos para poder mostrar el select
peticionSelect = fetch('/js/json/tipos.json').then((resp) => resp.json())
    .then(function (data) {
        tipos = data;
        pintarSelect(tipos);
        /*
        una vez enviado correctamente llamamos al metodo asincrono visto anteriormente, para evitar una suturación del servidor primero
        realizo la consulta para el select, la cuál hace falta primero y una vez esta acabe se realiza la siguiente
         */
        obtenerAlojamientos();
    })
    .catch(function (error) {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });

//función para añadir las opciones dentro del select
function pintarSelect(jsonTipos) {
    var select = document.getElementById("tipoAlogamieno");
    for (elementos in jsonTipos) {
        var option = createNode("option");
        /*
        Al value de la opción le setteo el primer char del string id, ya que en el json incluye una , la cual nos dará problemas
        para realizar la busqueda
        */
        option.value = jsonTipos[elementos].id[0];
        option.innerText = jsonTipos[elementos].tipo;
        append(select, option);
    }
}

/*
Evento a la espera de que se realice un submit del buscador, asegurando así las validaciones del html y
controlando aquí las realizadas desde js, en caso de ser estas validaciones favorables settear las variables globales
con los valroes de la nueva busqueda y llamando al metodo listarAlojamientos enviando el id del tipo.
 */
form.addEventListener('submit', e => {
    e.preventDefault();
    //Controlamos que el select enviado no sea el por defecto (opción 0)
    if (document.getElementById("tipoAlogamieno").value == 0) {
        alert("El tipo de alogamiento no puede ser la opción por defecto");
    } else {
        noches = document.getElementById("noches").value;
        personas = document.getElementById("pers").value;
        fechaLLegada = document.getElementById("fecha").value;
        listarAlojamientos(document.getElementById("tipoAlogamieno").value);
    }
});

/*
Mediante la función filter de js, creo una nueva array donde el tipo debe ser igual al argumento enviado en la llamada
 */
function listarAlojamientos(tipo) {
    if (posts != 0) {
        var alojamientosMostrar = posts.filter(function (element) {
            return element.tipo == tipo;
        });
        mostrarTabla(alojamientosMostrar, ["nombre", "lugar", "precioNoche"], "Info", "Resultados de la busqueda", null);
    } else {
        //no debiera salir nunca este mensaje, pero de realizar todo antes de que la asincronia termine puede que no tengamos el objeto que necesitamos y salte
        console.log("Intentelo más tarde, la consulta aún no ha sido procesada")
    }

}

//Crear cabecera para cualquier tabla pasando los elementos
function crearCabecera(tabla, elementos) {
    fila = createNode("tr");
    for (elem in elementos) {
        celda = createNode("th");
        celda.innerHTML = elementos[elem];
        append(fila, celda);
    }
    append(tabla, fila);
}

//Moda, controlando los eventos de mostrar y ocultar para evitar los eventos propios de bootstrap, haciendo que se reserve tambien desde este
function mostrarModal(id) {
    //Como ya tenemos recogidos los usuarios en la variable usuarios, simplemente deberemos filtrar el que queremos y setear en el modal los valores
    var usuarioMostrar = posts.filter(function (element) {
        return element.id == id;
    });
    //Como solo puede haber un usuario con el mismo id, nos devolvera un array con un solo objeto, por lo que le igualaré asi mismo en posicion 0 del array
    usuarioMostrar = usuarioMostrar[0];
    //Setearemos todos los campos del modal con los resultados de este:
    document.getElementById("tituloModal").innerHTML = usuarioMostrar.nombre;
    document.getElementById("idUs").innerHTML = usuarioMostrar.id;
    document.getElementById("nombre").innerHTML = usuarioMostrar.nombre;
    document.getElementById("lugar").innerHTML = usuarioMostrar.lugar;
    document.getElementById("descripcion").innerHTML = usuarioMostrar.descripcion;
    document.getElementById("precioNoche").innerHTML = usuarioMostrar.precioNoche;
    document.getElementById("precioTotal").innerHTML = usuarioMostrar.precioNoche*personas*noches;
    document.getElementById("foto").src = usuarioMostrar.foto;
    document.getElementById("wifi").innerHTML = usuarioMostrar.servicios.wifi;
    document.getElementById("tv").innerHTML = usuarioMostrar.servicios.tv;
    document.getElementById("microondas").innerHTML = usuarioMostrar.servicios.microondas;
    document.getElementById("piscina").innerHTML = usuarioMostrar.servicios.piscina;
    document.getElementById("Reservar2").name = usuarioMostrar.id;
    document.getElementById("Reservar2").addEventListener("click", function () {
        realizarReserva(this.name);
        $('#usuario').modal('hide');
    });
    //por medio de jquery hago visible el modal de bootstrap después de haber seteado los valores
    $('#usuario').modal('show');

}



/*
Mediante esta funcion, ejecutada al pulsar sobre el boton mas información, mostraremos la información completa, descomentando la
llamada a mostrar modal y comentando el mostrar tabla,se ejecutará mediante un modal
*/
async function getInfo(id) {
    var alojamiento = posts.filter(function (element) {
        return element.id == id;
    });
    mostrarTabla(alojamiento, ["id", "nombre", "lugar", "descripcion", "precioNoche", "Precio Total", "foto", "servicios",], "Volver", "Información Completa", "borrar");
    mostrarModal(id);

}

//Función encargada de realizar la reserva mediante el id y las variables globales para calcular el precio
async function realizarReserva(id) {
    var reservado = posts.filter(function (element) {
        return element.id == id;
    });
    let body = {
        nombre: reservado[0].nombre,
        lugar: reservado[0].lugar,
        fechaLLegada: fechaLLegada,
        precioTotal: (reservado[0].precioNoche * personas * noches)
    }
    let response = await fetch("http://miserver.es/reservas/", {
        method: "POST",
        body: body
    }).then(function () {
        alert("Reservado correctamente")
    }).catch(function (error) {
        alert("no pudo realizarse la reserva correctamente")
    })
}

/*
Función principal, la cual sirve para mostrar una tabla con un objeto, un array de las cabeceras, botones si esque tuviese
 (estos hay que controlarlos añadiendo nuevas lineas, o creando otro metodo el cual compruebe el valor de esta variable)
 un caption, que sería el titulo de la tabla y una fase, para controlar si hay tablas por debajo o no y poder borrarlas al crear nuevas
 */
function mostrarTabla(array, elementos, boton, caption, fase) {
    tabla2 = createNode("table");
    tabla2.id = "tabla2";
    capt = createNode("caption");
    capt.innerHTML = caption;
    append(tabla2, capt);
    crearCabecera(tabla2, elementos);
    for (objetos in array) {
        fila = createNode("tr");
        for (celdas in elementos) {
            if (elementos[celdas] == "servicios") {
                celda = createNode("td");
                celda.innerHTML = `<ul><li>Wifi: ${array[objetos][elementos[celdas]].wifi}</li><li>Televisión: ${array[objetos][elementos[celdas]].tv}</li><li>Microondas: ${array[objetos][elementos[celdas]].microondas}</li><li>Piscina: ${array[objetos][elementos[celdas]].piscina}</li></ul>`
                append(fila, celda);
            } else if (elementos[celdas] == "foto") {
                celda = createNode("td");
                celda.innerHTML = `<img src="${array[objetos][elementos[celdas]]}"></img>`;
                append(fila, celda);
            } else if (elementos[celdas] == "Precio Total") {
                celda = createNode("td");
                celda.innerHTML = `${array[objetos][elementos[celdas - 1]] * noches * personas}`;
                append(fila, celda);
            } else {
                celda = createNode("td");
                celda.innerHTML = array[objetos][elementos[celdas]];
                append(fila, celda);
            }
        }
        //Si le enviamos como boton el string info crea este botón y su funcionalidad
        if (boton == "Info") {
            botonCeld = createNode("td");
            botonInfo = createNode("button");
            botonInfo.name = array[objetos]["id"];
            botonInfo.innerText = "Más información";
            botonInfo.addEventListener("click", function () {
                getInfo(this.name);
            });
            append(botonCeld, botonInfo);
            append(fila, botonCeld);
            //Si le enviamos como boton el string Volver, crea el boton para volver, reservar y su funcionalidad
        } else if (boton == "Volver") {
            botonCeld = createNode("td");
            botonVolver = createNode("button");
            botonVolver.name = array[objetos]["id"];
            botonVolver.innerText = "Volver";
            botonVolver.addEventListener("click", function () {
                document.getElementById("tabla3").remove();
                document.getElementById("div1").classList.toggle("hidden");
            });
            botonReservar = createNode("button");
            botonReservar.name = array[objetos]["id"];
            botonReservar.innerText = "Reservar";
            botonReservar.addEventListener("click", function () {
                realizarReserva(this.name);
            });

            append(botonCeld, botonVolver);
            append(botonCeld, botonReservar);
            append(fila, botonCeld);
        }
        append(tabla2, fila);
    }
    append(document.body, tabla2);
    //Si existe la 3a tabla (creada con botones dentro de la tabla 2 como el caso de comentarios o fotos) será eliminada al pulsar otro boton
    if (document.getElementById("tabla3") != null) {
        document.getElementById("tabla3").remove();
    }
    if (document.getElementById("tabla2") != null) {
        // si existe la tabla 2 en el dom
        /*Si se ha enviado una fase a la funcion, significa que hay que crear una tabla 3, de ser así, la tabla2 no debe ser eliminada y para que no
        Exista conflicto cambiaré el id correspondiente de la nueva tabla, y además con este id poder borrarla posteriormente.
        */
        if (fase != null) {
            document.getElementById("div1").classList.toggle("hidden");
            tabla2.id = "tabla3";
            append(document.body, tabla2);
        } else {
            document.getElementById("tabla2").remove();
            append(document.getElementById("div1"), tabla2);
        }
    }

//Métodos para facilitar la creación y append de elementos con el DOM
}
function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}
