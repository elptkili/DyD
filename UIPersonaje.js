// Funcionalidad para desplegables
document.querySelectorAll('.interactivo').forEach((item, index) => {
    console.log(item);  // Verifica que se seleccionan correctamente
    item.addEventListener('click', () => {
        const desplegable = document.querySelectorAll('.contenido-desplegable')[index];
        console.log(desplegable);  // Verifica que el desplegable es el correcto

        if (desplegable.style.maxHeight && desplegable.style.maxHeight !== "0px") {
            desplegable.style.maxHeight = "0px";  // Cierra el desplegable
        } else {
            desplegable.style.maxHeight = desplegable.scrollHeight + "px";  // Abre el desplegable
        }
    });
});

// Variables globales
const infoElement = document.querySelector('.informacion p');
let monedasDisponibles = infoElement ? parseInt(infoElement.innerText) : 0;

const mochilaElement = document.querySelectorAll('.contenido-desplegable')[2];
const mochila = mochilaElement ? mochilaElement : null;

// Función para actualizar las monedas en el DOM
function actualizarMonedas(nuevasMonedas) {
    monedasDisponibles = nuevasMonedas;
    if (infoElement) {
        infoElement.innerText = nuevasMonedas;
    }
    localStorage.setItem('monedas', nuevasMonedas); // Guardar en localStorage
}

// Función para mostrar el modal
function mostrarModal(titulo, imgSrc, precio, tipo) {
    const modal = document.getElementById("modalCompraVenta");
    const modalTitle = document.getElementById("modalTitle");
    const modalImg = document.getElementById("modalImg");
    const modalPrice = document.getElementById("modalPrice");
    const modalButton = document.getElementById("modalButton");

    modalTitle.innerText = titulo;
    modalImg.src = imgSrc;
    modalPrice.innerText = `Precio: ${precio} monedas`;
    modalButton.innerText = tipo === 'compra' ? 'Comprar' : 'Vender';

    modal.style.display = "block";

    // Añadir evento al botón del modal
    modalButton.onclick = function () {
        if (tipo === 'compra') {
            comprarProducto(titulo, imgSrc, precio);
        } else {
            venderProducto(titulo, precio);
        }
        modal.style.display = "none";
    };

    // Cerrar el modal al hacer clic en la 'x'
    document.querySelector(".close").onclick = function () {
        modal.style.display = "none";
    };
}

// Función para manejar la compra de un producto
function comprarProducto(nombre, imgSrc, precio) {
    if (monedasDisponibles >= precio) {
        // Reducir el precio a la mitad y redondear hacia arriba
        const precioReducido = Math.ceil((precio / 2) * 2) / 2;

        actualizarMonedas(monedasDisponibles - precio);
        agregarItemMochila(nombre, imgSrc, precioReducido); // Usa esta función
    } else {
        alert('No tienes suficientes monedas para comprar este producto.');
    }
}

// Función para manejar la venta de un producto
function venderProducto(nombre, precio) {
    actualizarMonedas(monedasDisponibles + precio);

    if (!mochila) return;

    // Eliminar el producto de la mochila en el DOM
    const items = mochila.querySelectorAll('.item');
    items.forEach(item => {
        if (item.querySelector('p').innerText === nombre) {
            mochila.removeChild(item);
        }
    });

    // Eliminar el producto de la mochila en localStorage
    let itemsMochila = JSON.parse(localStorage.getItem('mochila')) || [];
    itemsMochila = itemsMochila.filter(item => item.nombre !== nombre);
    localStorage.setItem('mochila', JSON.stringify(itemsMochila));
}

// Añadir eventos a los ítems de la tienda
const tiendaItems = document.querySelectorAll('.contenido-desplegable')[1];
if (tiendaItems) {
    tiendaItems.querySelectorAll('.item').forEach(item => {
        item.addEventListener('click', () => {
            const nombre = item.querySelector('p').innerText;
            const imgSrc = item.querySelector('.icono').src;
            const precio = parseInt(item.querySelector('.precio p').innerText);
            mostrarModal(nombre, imgSrc, precio, 'compra');
        });
    });
}

// Añadir eventos a los ítems de la mochila
if (mochila) {
    mochila.querySelectorAll('.item').forEach(item => {
        item.addEventListener('click', () => {
            const nombre = item.querySelector('p').innerText;
            const imgSrc = item.querySelector('.icono').src;
            const precio = parseInt(item.querySelector('.precio p').innerText) || 0; // Precio para vender
            mostrarModal(nombre, imgSrc, precio, 'venta');
        });
    });
}

function agregarItemMochila(nombre, imgSrc, precio) {
    if (!mochila) return;

    const nuevoItem = document.createElement('div');
    nuevoItem.classList.add('item');
    nuevoItem.innerHTML = `
        <p>${nombre}</p>
        <img class="icono" src="${imgSrc}" alt="">
        <div class="precio">
            <p>${precio}</p>
            <img class="coin" src="iconos/coin.png" alt="">
        </div>
    `;
    mochila.appendChild(nuevoItem);

    // Guardar en localStorage
    const itemsMochila = JSON.parse(localStorage.getItem('mochila')) || [];
    itemsMochila.push({ nombre, imgSrc, precio });
    localStorage.setItem('mochila', JSON.stringify(itemsMochila));

    // Hacer clic en el nuevo ítem para poder venderlo
    nuevoItem.addEventListener('click', () => {
        mostrarModal(nombre, imgSrc, precio, 'venta');
    });
}

// Cargar monedas desde localStorage
function cargarMonedas() {
    const monedasGuardadas = parseInt(localStorage.getItem('monedas'));
    if (!isNaN(monedasGuardadas)) {
        monedasDisponibles = monedasGuardadas;
        if (infoElement) {
            infoElement.innerText = monedasDisponibles;
        }
    }
}

// Cargar mochila desde localStorage
function cargarMochila() {
    const itemsMochila = JSON.parse(localStorage.getItem('mochila')) || [];
    itemsMochila.forEach(item => {
        agregarItemMochila(item.nombre, item.imgSrc, item.precio);
    });
}

// Llamar a las funciones al cargar la página
window.onload = function () {
    cargarMonedas();
    cargarMochila();
};