class Producto {
    constructor(id, imgUrl, titulo, precio) {
        this.id = id
        this.imgUrl = imgUrl
        this.titulo = titulo
        this.precio = precio
    }
}

let baseDatos = [];
baseDatos.push(new Producto(1, "./img/airport.jpg", "Aeropuerto - Chicureo", 30000))
baseDatos.push(new Producto(2, "./img/tour_santiago.jpg", "City Tour Santiago", 40000))
baseDatos.push(new Producto(3, "./img/lan-chile.jpg", "Chicureo - Aeropuerto", 30000))
baseDatos.push(new Producto(4, "./img/valpo.jpg", "Tour Valparaiso", 40000))
baseDatos.push(new Producto(5, "./img/vina-del-mar2.jpg", "Tour Viña del Mar", 40000))
baseDatos.push(new Producto(6, "./img/hotel.jpg", "Aeropuerto - Hotel", 50000))
baseDatos.push(new Producto(7, "./img/valle-nevado.jpg", "Aeropuerto - Valle Nevado", 50000))
baseDatos.push(new Producto(8, "./img/valpo.jpg", "Aeropuerto - Valparaíso", 50000))
baseDatos.push(new Producto(9, "./img/vina-del-mar.jpg", "Aeropuerto - Viña del Mar", 40000))
baseDatos.push(new Producto(10, "./img/beach.jpg", "Tour Isla Negra", 40000))

// RECUPERAR DATOS DEL LOCAL STORAGE AL CARRITO DE COMPRA
let carrito = JSON.parse(localStorage.getItem("Carro")) || {}; // REDUCCION DE UNA CONDICIONAL 

//DOM
const btnCarro = document.querySelector('#carroCompra');
const card = document.querySelector('#tarjeta');
const formCompra = document.querySelector('#form-compra');
const templateCard = document.querySelector('#template-card').content;
const templateCarrito = document.getElementById('template-carrito').content;
const templateCarritoFooter = document.getElementById('template-carrito-footer').content;
const templateCompra = document.getElementById('terminar-compra').content;
const items = document.getElementById('items-carro');
const footerItem = document.getElementById('footer');
const footerModal = document.getElementById('carrito-vacio');

// CONTADOR CANTIDAD DE PRODUCTOS EN BTN CARRO
let contador = 0;
Object.values(carrito).forEach(function (contar) {
    contador += contar.cantidad;
});

/*if (contador === 0) {
    btnCarro.querySelector('span').textContent = "";
} else {
    btnCarro.querySelector('span').textContent = contador;
}*/
contador === 0 ? btnCarro.querySelector('span').textContent = "" : btnCarro.querySelector('span').textContent = contador // OPERADOR TERNARIO


// INICIALIZAMOS CON UN ARRAY VACIO
let productos = [];

//FUNCION QUE GENERA LA VISTA DE LOS PRODUCTOS
function render(baseDatos) {
    card.innerHTML = ""
    baseDatos.forEach((baseDatos) => {
        templateCard.querySelector('img').setAttribute("src", baseDatos.imgUrl);
        templateCard.querySelector('.card-title').textContent = baseDatos.titulo;
        templateCard.querySelector('.card-text').textContent = baseDatos.precio;
        templateCard.querySelector('.btn-warning').dataset.id = baseDatos.id;
        const clone = templateCard.cloneNode(true);
        card.appendChild(clone);        
    });   
};

// función que tras 2 segundo retorna un array de objetos
const pedirProductos = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(baseDatos);
        }, 2000)
    })
}

// asincrónicamente pedimos los datos y generamos la vista
pedirProductos()
    .then((res) => {
        productos = res
        render(productos)
    })


//render(baseDatos);


//FILTROS ARRAY
const btnFiltro1 = document.querySelector('#option1')
btnFiltro1.addEventListener('click', () => {
    render(baseDatos);
});

const btnFiltro2 = document.querySelector('#option2')
btnFiltro2.addEventListener('click', () => {
    const resultado1 = baseDatos.filter((el) => el.titulo.includes('Aeropuerto'));
    render(resultado1);
});

const btnFiltro3 = document.querySelector('#option3')
btnFiltro3.addEventListener('click', () => {
    const resultado2 = baseDatos.filter((el) => el.titulo.includes('Tour'));
    render(resultado2);
});

//PRESIONAR BTN CARRO DE COMPRA EN MENU
btnCarro.addEventListener('click', () => {
    renderCarrito();
    renderFooter();
});

//PRESIONAR BTN COMPRAR EN DIV DE LAS CARD
card.addEventListener('click', e => {
    addCarrito(e);
});

//BOTON MAS Y MENOS
items.addEventListener('click', e => {
    btnCantidad(e);
})

// BTN TERMINAR COMPRA EN CARRITO DE COMPRA 
const btnTerminar = document.querySelector('#Terminar-Compra')
btnTerminar.addEventListener('click', () => {
    TerminarCompra();
})

// ID DEL BTN COMPRAR DE LAS CARD
const addCarrito = e => {
    /*if (e.target.classList.contains('btn-warning')) {
        setCarrito(e.target.parentElement);        
    };*/
    e.target.classList.contains('btn-warning') && setCarrito(e.target.parentElement); // REDUCCION DE UNA CONDICIONAL   
};

// CREACION DE LOS ITEM DEL CARRITO
const setCarrito = item => {
    const productoCarro = {
        id: item.querySelector('.btn-warning').dataset.id,
        titulo: item.querySelector('.card-title').textContent,
        precio: item.querySelector('.card-text').textContent,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(productoCarro.id)) { // SI EXISTE EL PRODUCTO EN EL CARRITO SE SUMA 1
        productoCarro.cantidad = carrito[productoCarro.id].cantidad + 1
    }
    carrito[productoCarro.id] = { ...productoCarro }; // SPREAD DE ARRAY   
    renderCarrito();
}

// VISUALIZAR ELEMENTOS EN EL CARRITO 
const renderCarrito = () => {
    items.innerHTML = ''

    Object.values(carrito).forEach(productoCarro => {
        templateCarrito.querySelector('th').textContent = productoCarro.id
        templateCarrito.querySelectorAll('td')[0].textContent = productoCarro.titulo
        templateCarrito.querySelectorAll('td')[1].textContent = productoCarro.cantidad
        templateCarrito.querySelector('.btn-secondary').dataset.id = productoCarro.id
        templateCarrito.querySelector('.btn-warning').dataset.id = productoCarro.id
        templateCarrito.querySelector('span').textContent = productoCarro.precio * productoCarro.cantidad

        const clone = templateCarrito.cloneNode(true)
        items.appendChild(clone)        
    })
    renderFooter();
    guardaLocal();
}

// VISUALIZAR TOTALES DEL CARRITO DE COMPRA
const renderFooter = () => {
    footerItem.innerHTML = "";

    if (Object.keys(carrito).length === 0) {
        footerItem.innerHTML = `<th class="text-center display-4" scope="row" colspan="5">Carrito vacío</th>`
        btnCarro.querySelector('span').textContent = "";
        return
    }

    // sumar cantidad y sumar totales
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)

    btnCarro.querySelector('span').textContent = nCantidad

    templateCarritoFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateCarritoFooter.querySelector('span').textContent = nPrecio

    const clone = templateCarritoFooter.cloneNode(true)
    
    footerItem.appendChild(clone)

    //BTN VACIAR CARRITO
    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        carrito = {};
        renderCarrito();
        guardaLocal();
        btnCarro.querySelector('span').textContent = "";
        formCompra.innerHTML = '';
    })

};

//AUMENTAR Y DESMINUIR CANTIDAD
const btnCantidad = e => {
    if (e.target.classList.contains('btn-warning')) {
        const productoCarro = carrito[e.target.dataset.id]
        productoCarro.cantidad = carrito[e.target.dataset.id].cantidad + 1
        carrito[e.target.dataset.id] = { ...productoCarro } // SPREAD DE ARRAY        
        renderCarrito()
    }

    if (e.target.classList.contains('btn-secondary')) {
        const productoCarro = carrito[e.target.dataset.id]
        productoCarro.cantidad = carrito[e.target.dataset.id].cantidad - 1

        /*if (productoCarro.cantidad === 0) {
            delete carrito[e.target.dataset.id]            
        }*/
        productoCarro.cantidad === 0 && delete carrito[e.target.dataset.id], formCompra.innerHTML = ''; // REDUCCION DE UNA CONDICIONAL

        renderCarrito()

    }
}

//FORMULARIO FINALIZAR COMPRA
function TerminarCompra() {
    formCompra.innerHTML = '';
    if (Object.keys(carrito).length != 0) {
        const clone = templateCompra.cloneNode(true);        
        formCompra.appendChild(clone);        
    }
};

// Bootstrap, deshabilitar el envío de formularios si hay campos no válidos
(function () {
    'use strict';
    window.addEventListener('load', function () {
        // Obtener todos los formularios a los que queremos aplicar estilos de validación de Bootstrap personalizados
        const forms = document.getElementsByClassName('needs-validation');

        // Bucle sobre ellos y evitar el envio
        const validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');

                if (form.checkValidity() === true) {
                    // USO DE LA LIBRERIA SWEETALERT2
                    Swal.fire({
                    title: 'El pago fue procesado',
                    text: 'El comprobante de pago sera enviado al mail ingresado',
                    icon: 'success',
                    confirmButtonText: 'Cerrar'
                    })  

                    carrito = {};
                    renderCarrito();
                    guardaLocal();
                    btnCarro.querySelector('span').textContent = "";
                    formCompra.innerHTML = '';
                }
            }, false);
        });
    }, false);
})();

// JSON Local Storage
function guardaLocal() {
    localStorage.setItem("Carro", JSON.stringify(carrito))
}






