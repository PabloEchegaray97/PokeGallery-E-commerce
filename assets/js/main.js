const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const confimarCompraBtn = document.querySelector("#confirmar-compra");
const listaProductos = document.querySelector("#lista-productos");
let totalArticulos = document.querySelector(".cart-total");
let articulosCarrito = JSON.parse(localStorage.getItem("articulosCarrito")) ?? [];
let totalProducto;
let totalCarrito=0;
const nav = window.addEventListener("scroll", function() {
  const header = document.querySelector("header");
  header.classList.toggle("sticky", window.scrollY>0);
})


function generarCards(cards, identificador) {

  cards.forEach((producto) => {
      const {
          id: cardId,
          title: cardTitle,
          img: cardImg,
          price: cardPrice,
          descuento: cardDesc,
          pokeball: cardPoke,

      } = producto;
      

      const idPokeball = `pokeball-${cardId}` 
          if (producto.descuento > 0){ 
              (document.getElementById(identificador).innerHTML += `
              <div class="card">
                  <div class="img">
                  <img class="img-item" src="${cardImg}" alt="">
                  </div>
                  <div class="off30">${cardDesc}% OFF</div>
                  <div class="card-text">
                  <span>$<span class="price-tag">${producto.calcularDesc()}</span></span>
                  <p class ="card-title">${cardTitle}</p>
                  </div>
                  <button class="agregar-carrito add-to" id="${cardId}">Adquirir<span class="prueba" id="${idPokeball}"></span></button>
                  
              </div>`)} 
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
              <button class="agregar-carrito add-to" id="${cardId}">Adquirir<span class="prueba" id="${idPokeball}"></span></button>
              </div>`;
          }
  });
}

function cargarEventListeners() {
  listaProductos.addEventListener("click", agregarProducto);
  carrito.addEventListener("click", eliminarProducto);

  vaciarCarritoBtn.addEventListener("click", () => {
      
      if (articulosCarrito.length==0) {
          Swal.fire({
              title: 'El carrito esta vacio',
              text: 'Agrega algunos productos :)',
              icon: 'error',
              confirmButtonText: 'Genial'
          })
      } else {
          Swal.fire({
              title: 'Carrito vaciado con éxito',
              text: 'Agrega algunos productos :)',
              icon: 'success',
              confirmButtonText: 'Genial'
          })
          articulosCarrito.forEach((card) => {
            const pokeballID = `pokeball-${card.id}`
            console.log(pokeballID)
            document.getElementById(pokeballID).classList.remove("prueba2");

          })
          articulosCarrito = [];
          localStorage.setItem("articulosCarrito", JSON.stringify(articulosCarrito));
          limpiarHTML();
      }
  });
  confimarCompraBtn.addEventListener("click", () => {
      if (articulosCarrito.length==0) {
          Swal.fire({
              title: 'El carrito esta vacio',
              text: 'Agrega algunos productos :)',
              icon: 'error',
              confirmButtonText: 'Genial',
              confirmButtonColor: '#ea2b2b',
          })
      } else {

          Swal.fire({
              title: '¿Confirmar compra?',
              text: "Recuerda revisar bien tus datos",
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#ea2b2b',
              cancelButtonText:'Seguir comprando',
              confirmButtonText: 'Confirmar'
              }).then((result) => {
              if (result.isConfirmed) {
                  Swal.fire(
                  '¡Gracias por tu compra!'
                  )
                  articulosCarrito = [];
                  localStorage.setItem("articulosCarrito", JSON.stringify(articulosCarrito));
                  limpiarHTML();
              }
              })
      }
      
  });
}

function agregarProducto(e) {

  e.preventDefault();

  if (e.target.classList.contains("agregar-carrito")) {
      const productoSeleccionado = e.target.parentElement;
      console.log(productoSeleccionado);
      leerDatosProducto(productoSeleccionado);
      Toastify({
          text: "Producto agregado con éxito",
          className: "info",
          style: {
            background: "#ffffff",
            color:"#000000",
          }
        }).showToast();
        
        
  }
}

function eliminarProducto(e) {

  e.preventDefault();

  if (e.target.classList.contains("borrar-producto")) {
      const productoID = e.target.getAttribute("id");
      const pokeballID = `pokeball-${productoID}`
      console.log(productoID);
      articulosCarrito = articulosCarrito.filter((producto) => producto.id !== productoID);
      document.getElementById(pokeballID).classList.remove("prueba2");
      localStorage.setItem("articulosCarrito", JSON.stringify(articulosCarrito));
      console.log(articulosCarrito);
      carritoHTML();
      Toastify({
          text: "Producto eliminado con éxito",
          className: "info",
          style: {
            background: "#ffffff",
            color: "#000000",
          }
        }).showToast();
      
  }
}


function leerDatosProducto(producto) {

  const infoProducto = {
      imagen: producto.querySelector("img").src,
      titulo: producto.querySelector(".card-title").innerText,
      precio: producto.querySelector(".price-tag").innerText,
      id: producto.querySelector("button").getAttribute("id"),
      cantidad: 1,
      pokeball: producto.querySelector(".prueba").getAttribute("id"),
  };
  document.getElementById(infoProducto.pokeball).classList.add("prueba2");
  console.log(infoProducto);
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
      localStorage.setItem("articulosCarrito", JSON.stringify(articulosCarrito));

  } else {
      articulosCarrito = [...articulosCarrito, infoProducto];
      localStorage.setItem("articulosCarrito", JSON.stringify(articulosCarrito));
      

  }
  console.log(infoProducto.precio);
  
  carritoHTML();
}

function carritoHTML() {

  limpiarHTML();
  
  articulosCarrito.forEach((producto) => {
      const row = document.createElement("tr");
      row.innerHTML = `
      <td>
      <a href="" class="borrar-producto" id="${producto.id}">x</a>
      </td>
      <td>${producto.titulo}</td>
      <td>${producto.cantidad}</td>
      <td>${producto.precio}</td>
      `;

      contenedorCarrito.appendChild(row);
      
      totalArticulos.textContent = articulosCarrito.length;
  });
  console.log(totalCarrito)
  
}

function limpiarHTML() {
  contenedorCarrito.innerHTML = "";
  totalArticulos.textContent = articulosCarrito.length;
  calcularTotal();
}

carritoHTML();

class Producto {
  constructor(id,title,img,price,cantidad,descuento) {
    this.id = id;
    this.title = title;
    this.img = img;
    this.price = price;
    this.cantidad = cantidad;
    this.descuento = descuento;
  }
  calcularDesc() {
    let desc = (this.price - (this.price * this.descuento)/100);
    return desc;
  }
}

const charizard = new Producto(1,"Charizard","assets/img/charizard.jpg", 1000, 0, 0,);
const squirtle = new Producto(2,"Squirtle","assets/img/squirtle.jpg", 1000, 0, 31,);
const pikachu = new Producto(3,"Pikachu","assets/img/pikachu.jpg", 2000, 0, 0,);

const charizardMint = {
  ...charizard,
  id:4,
  title:"Charizard Mint",
  price:2500,
  mint:"MINT",
}

const productos = [charizard, squirtle, pikachu, charizardMint];
const [,b,,d] = productos;
let otrosProductos = [b,d]





console.log(b);
console.log(d);

console.log(productos[1].calcularDesc());
generarCards(productos, "lista-productos");
generarCards(otrosProductos, "otros-productos");

// const selector = document.querySelector('#pokeball');
// selector.addEventListener('click', () => {
//   selector.classList.add('prueba2')
// });
cargarEventListeners();

const btn = document.querySelector('.btn_animated')
btn.addEventListener('click', () => {
  btn.classList.remove('animate')
  setTimeout(() => btn.classList.add('animate'), 100)
})

const openModal = document.querySelector('.hero__cta');
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.modal__close');

openModal.addEventListener('click', (e)=>{
    e.preventDefault();
    modal.classList.add('modal--show');
});

closeModal.addEventListener('click', (e)=>{
    e.preventDefault();
    modal.classList.remove('modal--show');
});

function calcularTotal(){
  totalCarrito = 0;
articulosCarrito.forEach((producto)=>{
  totalCarrito =  (producto.precio* producto.cantidad) + totalCarrito;
  console.log("total : "+totalCarrito);
})
  document.querySelector(".total-carrito").innerText = totalCarrito;
}