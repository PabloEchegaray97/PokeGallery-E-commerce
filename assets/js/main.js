let articulosCarrito = JSON.parse(localStorage.getItem("articulosCarrito")) ?? [];
const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const listaProductos = document.querySelector("#lista-productos");

carritoHTML()

console.log(typeof(articulosCarrito))

const productos = [
  {
      id:1,
      title:"Titulo 1",
      img: "assets/descarga.png",
      price: 1000,
      cant:0,
      stock:10
  },
  {
      id:2,
      title:"Titulo 2",
      img: "assets/descarga.png",
      price: 1100,
      cant:0,
      stock:10

  },
  {
      id:3,
      title:"Titulo 3",
      img: "assets/descarga.png",
      price: 1200,
      cant:0,
      stock:10
  },
];
//generar cards carrito
productos.forEach((producto) => {
  document.getElementById("lista-productos").innerHTML += `
  <div class="card">
      <div>
      <img class="img" src="${producto.img}" alt="">
      </div>
      <span class="price-tag"><span>$</span>${producto.price}</span>
      <span class="free-shipping">Envio gratis</span>
      <p class ="card-title">${producto.title}</p>
      <div class="off30"">30% OFF</div>
      <a href="#" class="btn agregar-carrito" id="${producto.id}">Comprar</a>
      </div>`;
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

// eventos mouse para c/ boton agregar al carrito
function agregarProducto(e) {
  e.preventDefault();

  if (e.target.classList.contains("agregar-carrito")) {
    const productoSeleccionado = e.target.parentElement;
    leerDatosProducto(productoSeleccionado);
  }
}
//elminar producto del carrito

function eliminarProducto(e) {
  e.preventDefault();
  // console.log(e.target.classList);
  if (e.target.classList.contains("borrar-producto")) {
    const productoID = e.target.getAttribute("id");

    //Eliminar del arreglo de articulosCarrito por el id
    articulosCarrito = articulosCarrito.filter((producto) => producto.id !== productoID);
    localStorage.setItem("articulosCarrito",JSON.stringify(articulosCarrito));
    console.log(articulosCarrito)
    carritoHTML();
  }
}

// Extraer de HTML el producto
function leerDatosProducto(producto) {
  const infoProducto = {
    imagen: producto.querySelector("img").src,
    titulo: producto.querySelector(".card-title").innerText,
    precio: producto.querySelector(".price-tag").innerText,
    id: producto.querySelector("a").getAttribute("id"),
    cantidad: 1,
  };

  //Revisa si un elemento ya existe en el carrito

  const existe = articulosCarrito.some((producto) => producto.id === infoProducto.id);
  if (existe) {
    //Actualizamos la cantidad
    const productos = articulosCarrito.map((producto) => {
      if (producto.id === infoProducto.id) {
        producto.cantidad++;
        return producto; // retorna objeto actualizado
      } else {
        return producto; // retorna los objetos que no son duplicados
      }
    });
    articulosCarrito = [...productos];
    localStorage.setItem("articulosCarrito",JSON.stringify(articulosCarrito));
  } else {
    //Agregar elementos al arreglo del carrito
    articulosCarrito = [...articulosCarrito, infoProducto];
    localStorage.setItem("articulosCarrito",JSON.stringify(articulosCarrito));
    
  }
  carritoHTML();
}

//Muestra el Carrito en el HTML

function carritoHTML() {
  
  limpiarHTML();
  
  //Recorre el carrito y genera el HTML
  articulosCarrito.forEach((producto) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${producto.titulo}</td>
    <td>${producto.precio}</td>
    <td>${producto.cantidad}</td>
    <td>
    <a href="" class="borrar-producto" id="${producto.id}">x</a>
    </td>`;
    //Agrega el HTML del carrito en el tbody
    contenedorCarrito.appendChild(row);
  });
}

function limpiarHTML() {
  contenedorCarrito.innerHTML = "";
}
