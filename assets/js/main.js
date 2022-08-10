let articulosCarrito = JSON.parse(localStorage.getItem("articulosCarrito")) ?? [];
const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const listaProductos = document.querySelector("#lista-productos");
let totalArticulos = document.querySelector(".cart-total");
//nav
window.addEventListener("scroll", function() {
  var header = document.querySelector("header");
  header.classList.toggle("sticky", window.scrollY>0);
})

carritoHTML()

console.log(typeof(articulosCarrito))

const productos = [
  {
      id:1,
      title:"Titulo 1",
      img: "assets/img/charizard.jpg",
      price: 1000,
      cant:0,
      stock:10,
      off30:false,
  },
  {
      id:2,
      title:"Titulo 2",
      img: "assets/img/charizard.jpg",
      price: 1100,
      cant:0,
      stock:10,
      off30:true,

  },
  {
      id:3,
      title:"Titulo 3",
      img: "assets/img/charizard.jpg",
      price: 1200,
      cant:0,
      stock:10,
      off30:false,
  },
];

productos.forEach((producto) => {
  if (producto.off30) {
    document.getElementById("lista-productos").innerHTML += `
    <div class="card">
        <div class="img">
        <img class="img-item" src="${producto.img}" alt="">
        </div>
        <div class="card-text">
        <span class="price-tag"><span>$</span>${producto.price}</span>
        <p class ="card-title">${producto.title}</p>
        </div>
        <div class="off30"">30% OFF</div>
        <button class="agregar-carrito add-to" id="${producto.id}">Comprar</button>
        </div>`;
  }
  else {
    document.getElementById("lista-productos").innerHTML += `
    <div class="card">
        <div class="img">
        <img class="img-item" src="${producto.img}" alt="">
        </div>
        <div class="card-text">
        <span class="price-tag"><span>$</span>${producto.price}</span>
        <p class ="card-title">${producto.title}</p>
        </div>
        <button class="agregar-carrito add-to" id="${producto.id}">Comprar</button>
        </div>`;
  }
});


cargarEventListeners();

function cargarEventListeners() {
  listaProductos.addEventListener("click", agregarProducto);
  carrito.addEventListener("click", eliminarProducto);

  vaciarCarritoBtn.addEventListener("click", () => {
    articulosCarrito = [];
    localStorage.setItem("articulosCarrito",JSON.stringify(articulosCarrito));
    limpiarHTML();
  });

}
//FUNCIONES


function agregarProducto(e) {

  e.preventDefault();

  if (e.target.classList.contains("agregar-carrito")) {
    const productoSeleccionado = e.target.parentElement;
    leerDatosProducto(productoSeleccionado);
  }
}


function eliminarProducto(e) {

  e.preventDefault();

  if (e.target.classList.contains("borrar-producto")) {
    const productoID = e.target.getAttribute("id");

  
    articulosCarrito = articulosCarrito.filter((producto) => producto.id !== productoID);
    localStorage.setItem("articulosCarrito",JSON.stringify(articulosCarrito));
    console.log(articulosCarrito);
    carritoHTML();
  }
}


function leerDatosProducto(producto) {
  const infoProducto = {
    imagen: producto.querySelector("img").src,
    titulo: producto.querySelector(".card-title").innerText,
    precio: producto.querySelector(".price-tag").innerText,
    id: producto.querySelector("button").getAttribute("id"),
    cantidad: 1,
  };

  const existe = articulosCarrito.some((producto) => producto.id === infoProducto.id);
  if (existe) {
    const productos = articulosCarrito.map((producto) => {
      if (producto.id === infoProducto.id) {
        producto.cantidad++;
        return producto; 
      } else {
        return producto; 
      }
    });
    articulosCarrito = [...productos];
    localStorage.setItem("articulosCarrito",JSON.stringify(articulosCarrito));
  } else {

    articulosCarrito = [...articulosCarrito, infoProducto];
    localStorage.setItem("articulosCarrito",JSON.stringify(articulosCarrito));
    
  }
  carritoHTML();
}

function carritoHTML() {
  
  limpiarHTML();
  articulosCarrito.forEach((producto) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${producto.titulo}</td>
    <td>${producto.precio}</td>
    <td>${producto.cantidad}</td>
    <td>
    <a href="" class="borrar-producto" id="${producto.id}">x</a>
    </td>`;
    
    contenedorCarrito.appendChild(row);
    totalArticulos.textContent = articulosCarrito.length;
  });
}

function limpiarHTML() {
  contenedorCarrito.innerHTML = "";
  totalArticulos.textContent = articulosCarrito.length;
}