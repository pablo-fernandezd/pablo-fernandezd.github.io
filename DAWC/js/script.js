const form = document.getElementById('form');
const nombre = document.getElementById('nombre');
const apellido1 = document.getElementById("apellido1");
const apellido2 = document.getElementById("apellido2");
const email = document.getElementById('email');
const movil = document.getElementById("telefono movil");
const numExp = document.getElementById("Numero de expediente");
const fNacimiento = document.getElementById("birthdate");
menor = false;
control = true
letra1 = null;
letra2 = null;
var x = 0;
var edad = 0;
//Añadimos el atributo max al campo date, con el valor de hoy, de esta manera con la pantalla grafica no podrá seleccionar otras opciones,
//para controlar la parte de texto lo hare con el evento de onchange y la funcion validarFecha
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();
if (dd < 10) {
    dd = '0' + dd;
}
if (mm < 10) {
    mm = '0' + mm;
}
today = yyyy + '-' + mm + '-' + dd;
document.getElementById("birthdate").setAttribute("max", today);
//
const printError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    control = false;
    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success')
}
const printError2 = (element, message, element2) => {
    const inputControl = element.parentElement;
    const errorDisplay = element2;
    control = false;
    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success')
}
const printSuccess2 = (element, element2) => {
    const errorDisplay = element2;
    const inputControl = element.parentElement;
    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
}
const printSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

form.addEventListener('submit', e => {
    e.preventDefault();
    if (document.getElementById())
    if (control) {
        form.reset();
    }
});
document.getElementById("mostrar").addEventListener("click", e => {
    e.preventDefault();
    validateForm();
    crearRegistro();
    if (control) {
        switchFormTable();
    }
});
document.getElementById("cambiarform").addEventListener("click", switchFormTable);

const validateForm = () => {
    control = true;
    validarObligatorio(nombre);
    validarObligatorio(apellido1);
    validarObligatorio(movil);
    validarObligatorio(numExp);
    validarTexto15(trim(nombre));
    validarTexto15(trim(apellido1));
    validarTexto15(trim(apellido2));
    validarTelefono();
    validarExp();
    validarRadio();
    validarCheck();
    validarObligatorio(fNacimiento);
    if (menor) {
        tutorn = document.getElementById("tutorn");
        tutora1 = document.getElementById("tutora1");
        tutora2 = document.getElementById("tutora2");
        validarObligatorio(tutorn);
        validarTexto15(tutorn);
        validarObligatorio(tutora1);
        validarTexto15(tutora1);
        validarObligatorio(tutora2);
        validarTexto15(tutora2);
    }
    const emailValue = email.value.trim();

    if (emailValue === '') {
        printError(email, 'El email es obligatorio');
    } else if (!isValidEmail(emailValue)) {
        printError(email, 'El formato de email no es correcto');
    } else {
        printSuccess(email);

    }
};

function validarObligatorio(elemento) {
    elementoValor = elemento.value.trim();
    if (elementoValor === '') {
        printError(elemento, 'El ' + elemento.id + ' es obligatorio');
    } else {
        printSuccess(elemento);
    }
}

function validarTexto15(element) {
    texto = element.value;
    re = /^[a-zA-Z]{0,15}$/;
    if (!texto == "") {
        console.log("comprobando");
        if (re.test(texto)) {
            printSuccess(element);
        } else {
            printError(element, 'El ' + element.id + ' Puede tener como maximo 15 caracteres');
        }
    }
}

function validarRadio() {
    var div = document.getElementById('hijosopcion1');
    var div2 = document.getElementById("errorRadio")
    if (document.getElementById('hijosopcion1').checked) {
        printSuccess2(div, div2);
    } else if (document.getElementById('hijosopcion2').checked) {
        printSuccess2(div, div2);
    } else {
        printError2(div, 'Debe seleccionar una opcion', div2);
    }
}

function validarCheck() {
    var check = document.getElementById("avisoLegal");
    var div2 = document.getElementById("errorCheck");
    if (check.checked) {
        printSuccess2(check, div2);
    } else {
        printError2(check, "Debe aceptar los términos legales para continuar", div2)
    }
}

function añadirAficion() {
    imagen = document.getElementById("copiar").cloneNode(true);
    var texto;
    texto = document.getElementById("aficion").value;
    document.getElementById("aficion").value = null;
    if (validarAficion(texto) == true) {
        console.log(texto);
        nuevo = document.createElement("label");
        nuevo.innerText = texto;
        nuevo.classList = x;
        imagen.classList = x;
        div = document.getElementById("aficiones");
        div.appendChild(nuevo);
        div.appendChild(imagen);
        x++;
    } else {
        alert("Tiene que tener minimo 3 letras y no puede contener numeros");
    }
}

//Eventos de cuando el elemento del numero del expediente esta activo y cuando se des selecciona(focus / blur)
numExp.addEventListener('focus', ponerLetras, true);
numExp.addEventListener('blur', quitarLetras, true);

function ponerLetras() {
    letra1 = nombre.value.charAt(0);
    letra2 = apellido1.value.charAt(0);
    numExp.value = letra1 + letra2 + numExp.value;
}

//Eventos para abrir el modal en libreria de bootstrap
//Evento que al pulsar aceptar en el modal nos marque el check
document.getElementById("modalAceptar").addEventListener("click", function () {
    document.getElementById("avisoLegal").checked = true;
}, false);

function quitarLetras() {
    //Controlo que el valor de letra no se haya añadadido anteriormente, de haberse añadido habrá que borrarlas
    if (letra1 != '' && letra2 != '') {
        numExp.value = numExp.value.slice(2);
    }
}

//Validacion del numero de expediente
function validarExp() {
    re = /^[0-9]{5}$/;
    return re.test(numExp.value);
}

//Funcion que se ejecuta al pulsar el icono de la aficion agregada para ser eliminada
function borrarAficion(id) {
    id = id[0];
    console.log(id);
    console.log(this);
    var array = document.getElementsByClassName(id);
    console.log(array);
    for (i = 1; i >= 0; i--) {
        array[i].remove();
    }
}

//Se valida al añadir una nueva, para evitar que se añadan erroneas, mejor controlarlo al crearlo que al enviarlo
function validarAficion(texto2) {
    var re = /^[a-zA-Z (^/d/W)]{3,20}$/;
    return re.test(texto2);
}

//Listener para cuando al fecha cambie se ejecute el validador
document.getElementById("birthdate").addEventListener("change", validarFecha);

//Funcion para calcular la edad y ejecutar la funcion para los campos de los menores de edad
function calcularEdad() {
    fecha = fNacimiento.value;
    var hoy = new Date();
    var cumpleanos = new Date(fecha);
    edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }
    document.getElementById("age").value = edad;
    if (edad < 18) {
        if (menor == false) {
            esMenor();
            menor = true;
        }
    } else {
        if (menor == true) {
            esMayor();
            menor = false;
        }
    }
}

//Funcion que valida la fecha, desde un minimo (la persona mas longeva viva tiene 119) y un maximo que sería el dia en el que se entre a la web.
function validarFecha() {
    elemento = document.getElementById("birthdate");
    fecha = elemento.value;
    if (fecha < today && fecha > "1900-01-01") {
        printSuccess(elemento);
        calcularEdad();
    } else {
        printError(elemento, "La fecha introducida no es valida");
    }
}

//validacion de telefono, validando solo españoles en las distintas formas
function validarTelefono() {
    numeroTel = movil.value;
    const re = /^(\+34|0034|34)?[ -]*(6|7)[ -]*([0-9][ -]*){8}/;
    //tambien habria podido usar la expresion regular para XXX-XXX-XXX => \d{3}-\d{3}-\d{3}
    if (re.test(String(numeroTel).toLowerCase())) {
        printSuccess(movil);
    } else {
        printError(movil, "El numero introducido no es valida");
    }
}

//Funcion que agrega el contenido que debe rellenar el padre/madre/tutor y cambiar el label del numero de telefono
function esMenor() {
    document.getElementById("movilLabel").innerText = "Telefono movil Padre/Madre/Turor*";
    document.getElementById("tutores").innerHTML = "<div class='input-control'><label htmlFor='tutorn'>Nombre pade/madre/tutor*</label><input id='tutorn' name='tutorn' type='text'> <div class='error'></div></div> <div class='input-control'> <label htmlFor='tutora1'>Apellido1 pade/madre/tutor*</label> <input id='tutora1' name='tutora1' type='text'> <div class='error'></div> </div> <div class='input-control'> <label htmlFor='tutora2'>Apellido2 pade/madre/tutor*</label> <input id='tutora2' name='tutora2' type='text'> <div class='error'></div> </div>"
}

//Funcion para cuando cambian la edad y antes era menor de edad pero ahora menor
function esMayor() {
    document.getElementById("movilLabel").innerText = "Telefono movil*";
    document.getElementById("tutores").innerHTML = "";
}

//Clase fila
class registro {
    constructor(a, b, c, d, e, f, g, h) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
        this.g = g;
        this.h = h;
    }
}

registro1 = new registro("Pablo", "Fernandez", "Dominguez", "Tezanos", "Raquel", "SI", false);
registro2 = new registro("Pablo", "Fernandez", "Dominguez", "Tezanos", "Raquel", "SI", false);
sal = [registro1, registro2];
//GRID
const columnDefs = [
    {field: "a", headerName: "Nombre"},
    {field: "b", headerName: "Apellido1"},
    {field: "c", headerName: "Apellido2"},
    {field: "d", headerName: "Correo electronico"},
    {field: "e", headerName: "Fecha de nacimiento"},
    {field: "f", headerName: "Telefono"},
    {field: "g", headerName: "Tiene hijo(s)"},
    {field: "h", headerName: "Mayor de edad"}
];

// specify the data
const rowData = [
    registro1
];

// let the grid know which columns and what data to use
const gridOptions = {
    columnDefs: columnDefs,
    rowData: sal,
    defaultColDef: {
        sortable: true,
        filter: true
    }
    ,
    pagination: true
};

function switchFormTable() {
    if (document.getElementById("grid").style.display == 'none') {
        document.getElementById("grid").style.display = 'block';
        document.getElementById("formulario").style.display = 'none';
    } else {
        document.getElementById("grid").style.display = 'none';
        document.getElementById("formulario").style.display = 'block';
    }

}

// lookup the container we want the Grid to use
const eGridDiv = document.querySelector('#myGrid');

//Funcion para crear un nuevo objeto si la validacion es favorable
function crearRegistro() {
    if (control == true) {
        sal.push(recogerValores());
    }
    crearGrid();
}

//recoge los valores y los devuelve en un objeto del registro
function recogerValores() {
    a = nombre.value;
    b = apellido1.value;
    c = apellido2.value;
    d = email.value;
    e = document.getElementById("birthdate").value;
    f = movil.value;
    if (document.getElementById('hijosopcion1').checked) {
        g = "SI";
    } else {
        g = "NO";
    }
    if (!menor) {
        h = "SI";
    } else {
        h = "NO";
    }
    return (new registro(a, b, c, d, e, f, g, h));

}

//Funcion para crear la tabla con los registros actuales
function crearGrid() {
    document.getElementById("myGrid").innerHTML = "";
    new agGrid.Grid(eGridDiv, gridOptions);
}
