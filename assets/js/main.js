let articulosCarrito = JSON.parse(localStorage.getItem("articulosCarrito")) ?? [];
const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const listaProductos = document.querySelector("#lista-productos");
let totalArticulos = document.querySelector(".cart-total");




//nav
window.addEventListener("scroll", function() {
  const header = document.querySelector("header");
  header.classList.toggle("sticky", window.scrollY>0);
})



carritoHTML();
console.log(typeof(articulosCarrito))

class Producto {
  constructor(id,title,img,price,cant,descuento) {
    this.id = id;
    this.title = title;
    this.img = img;
    this.price = price;
    this.cant = cant;
    this.descuento = descuento;
  }
  calcularDesc() {
    let desc = (this.price - (this.price * this.descuento)/100);
    return desc;
  }

}

const charizard = new Producto(1,"Charizard","assets/img/charizard.jpg", 1000, 0, 0);
const squirtle = new Producto(2,"Squirtle","assets/img/squirtle.jpg", 1000, 0, 31);
const pikachu = new Producto(3,"Pikachu","assets/img/pikachu.jpg", 2000, 0, 0);

const charizardMint = {
  ...charizard,
  id:4,
  title:"Charizard Mint",
  price:2500,
  mint:"MINT",
}
const productos = [charizard, squirtle, pikachu, charizardMint];
const seleccionProductos = [,,a,b] = productos;
const otrosProductos = [a,b];

console.log(productos[1].calcularDesc());

generarCards(productos, "lista-productos");
generarCards(otrosProductos, "otros-productos");

function generarCards (cards, identificador) {

  cards.forEach((producto) => {
    const {
      id: cardId,
      title: cardTitle,
      img: cardImg,
      price: cardPrice,
      descuento: cardDesc,
    
    } = producto;

    if( cards.length>3) {
      producto.descuento > 0 ? (document.getElementById(identificador).innerHTML += `
      <div class="card">
            <div class="img">
            <img class="img-item" src="${cardImg}" alt="">
            </div>
            <div class="off30">${cardDesc}% OFF</div>
            <div class="card-text">
            <span>$<span class="price-tag">${producto.calcularDesc()}</span></span>
            <p class ="card-title">${cardTitle}</p>
            </div>
            <button class="agregar-carrito add-to" id="${cardId}">Adquirir<img src="assets/img/pokeballopen.png" class="add-to-img" id="2" alt=""></button>
            
          </div>`)
          : document.getElementById(identificador).innerHTML += `
          <div class="card">
                <div class="img">
                <img class="img-item" src="${cardImg}" alt="">
                </div>
                <div class="mint">${(producto?.mint||"") }</div>
                <div class="card-text">
                <span>$<span class="price-tag">${cardPrice}</span></span>
                <p class ="card-title">${cardTitle}</p>
                </div>
                <button class="agregar-carrito add-to" id="${cardId}">Adquirir<img src="assets/img/pokeballopen.png" class="add-to-img" id="2" alt=""></button>
                
              </div>`;
    }
    else {
      document.getElementById(identificador).innerHTML += `
      <div class="card">
                <div class="img">
                <img class="img-item" src="${cardImg}" alt="">
                </div>
                <div class="mint">${(producto?.mint||"") }</div>
                <div class="card-text">
                <span>$<span class="price-tag">${cardPrice}</span></span>
                <p class ="card-title">${cardTitle}</p>
                </div>
                
              </div>`;
    }
  });
}






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
  console.log(infoProducto.precio);
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
