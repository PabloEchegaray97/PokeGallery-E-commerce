const cart = document.querySelector("#carrito");
const cartContainer = document.querySelector("#lista-carrito tbody");
const emptyCartBtn = document.querySelector("#vaciar-carrito");
const confirmBuyBtn = document.querySelector("#confirmar-compra");
const productList = document.querySelector("#lista-productos");
const productList2 = document.querySelector("#app");
let totalArticles = document.querySelector(".cart-total");
let inCart = JSON.parse(localStorage.getItem("inCart")) ?? [];

let cartTotal=0;

let cartStatus = document.querySelector("#estado-carrito");



const apiKey = '0a62f8bc-55ae-4e7f-86fe-49da8aaf6ca9'

const customFetch = async (method, url) => { 
  const fetchResponse = fetch(
    url,
    {
      method: method, 
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json' 
      },
      
    }
  );
  return fetchResponse ;
}

const getPokemonCard = async (id) => {
  const url = `https://api.pokemontcg.io/v2/cards/${id}`
  const response = await customFetch('GET', url);
  
  const card = await response.json(); 
  return card.data;
}

const getAllPokemonCards = async (page) => {
  const url = `https://api.pokemontcg.io/v2/cards?page=${page}&pageSize=21`;
  const response = await customFetch('GET', url);
  const jsonResponse  = await response.json();
  const cards = jsonResponse.data;
  return cards;
}


const main = async () => {
  const id = 'base1-4';
  const card = await getPokemonCard(id);
  const cards = await getAllPokemonCards(acc2);
  let acc = ``;
  cards.forEach(element => {
    const idPokeball = `pokeball-${element.id}`;
    console.log(element.rarity);
    console.log(element);
    acc += `
              <div class="card">
                  <div class="img ${element.rarity}">
                  <img class="img-item" src="${element.images.small}" alt="">
                  </div>
                  <span class="card-name">${element.name}</span>
                  <div class="rarity ${element.rarity}">
                  ${element.rarity}
                  </div>
                  <div class="card-text">
                  <span>$<span class="price-tag">${element.cardmarket.prices.trendPrice}</span></span>
                  <p class ="card-title">${element.name}</p>
                  </div>
                  <button class="agregar-carrito add-to" id="${element.id}"><span class="prueba" id="${idPokeball}"></span>Adquirir</button>
                  
              </div>
  `;
});

document.getElementById("app").innerHTML = acc;
}

main();


const nav = window.addEventListener("scroll", function() {
  const header = document.querySelector("header");
  header.classList.toggle("sticky", window.scrollY>0);
})


function generateCards(cards, identificador) {

  cards.forEach((product) => {
      const {
          id: cardId,
          title: cardTitle,
          img: cardImg,
          price: cardPrice,
          descuento: cardDesc,
          

      } = product;
      

      const idPokeball = `pokeball-${cardId}` 
          if (product.descuento > 0){ 
              (document.getElementById(identificador).innerHTML += `
              <div class="card">
                  <div class="img">
                  <img class="img-item" src="${cardImg}" alt="">
                  </div>
                  <div class="off30">${cardDesc}% OFF</div>
                  <div class="card-text">
                  <span>$<span class="price-tag">${product.calculateDesc()}</span></span>
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
                  <div class="mint">${(product?.mint||"") }</div>
                  <div class="card-text">
                  <span>$<span class="price-tag">${cardPrice}</span></span>
                  <p class ="card-title">${cardTitle}</p>
              </div>
              <button class="agregar-carrito add-to" id="${cardId}">Adquirir<span class="prueba" id="${idPokeball}"></span></button>
              </div>`;
          }
  });
}

function loadEventListeners() {
  productList.addEventListener("click", addProduct);
  productList2.addEventListener("click", addProduct);
  cart.addEventListener("click", deleteProduct);
  

  emptyCartBtn.addEventListener("click", () => {
      
      if (inCart.length==0) {
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
          console.log("else")

          inCart.forEach((card) => {
            const pokeballID = `pokeball-${card.id}`
            console.log(pokeballID)
            document.getElementById(pokeballID).classList.remove("prueba2");

          })


          inCart = [];
          localStorage.setItem("inCart", JSON.stringify(inCart));
          cleanHTML();
      }
  });
  
  confirmBuyBtn.addEventListener("click", () => {
      if (inCart.length==0) {
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
                  inCart = [];
                  localStorage.setItem("inCart", JSON.stringify(inCart));
                  cleanHTML();
              }
              })
      }
      
  });
}

function addProduct(e) {

  e.preventDefault();

  if (e.target.classList.contains("agregar-carrito")) {
      const selectedProduct = e.target.parentElement;
      console.log(selectedProduct);
      readProductData(selectedProduct);
      Toastify({
          text: "Producto agregado con éxito",
          className: "info",
          gravity: "bottom",
          position: "right",
          style: {
            background: "#ffffff",
            color:"#000000",
            text: "A simple warning alert—check it out!",
            
          }
        }).showToast();
        
        
  }
}

function deleteProduct(e) {

  e.preventDefault();

  if (e.target.classList.contains("borrar-producto")) {
      const productID = e.target.getAttribute("id");
      const pokeballID = `pokeball-${productID}`
      const pokequery = document.getElementById(pokeballID) ?? "null";

      console.log(pokequery);
      if (pokequery!="null") {
        document.getElementById(pokeballID).classList.remove("prueba2");
      }
      console.log(productID);
      inCart = inCart.filter((product) => product.id !== productID);
      
      
      localStorage.setItem("inCart", JSON.stringify(inCart));
      console.log(inCart);
      cartHTML();
      Toastify({
          text: "Producto eliminado con éxito",
          className: "info",
          gravity: "bottom",
          position: "right",
          style: {
            background: "#ffffff",
            color: "#000000",
          }
        }).showToast();
      
  }
}


function readProductData(product) {

  const productInfo = {
      imagen: product.querySelector("img").src,
      title: product.querySelector(".card-title").innerText,
      price: product.querySelector(".price-tag").innerText,
      id: product.querySelector("button").getAttribute("id"),
      amount: 1,
      pokeball: product.querySelector(".prueba").getAttribute("id"),
      rarity: product.querySelector(".price-tag").innerText,
  };
  document.getElementById(productInfo.pokeball).classList.add("prueba2");
  console.log(productInfo);
  const exist = inCart.some((product) => product.id === productInfo.id);
  if (exist) {
      const products = inCart.map((product) => {
          if (product.id === productInfo.id) {
              product.amount++;
              return product;
          } else {
              
              return product;
              
          }
      });
  

      inCart = [...products];
      localStorage.setItem("inCart", JSON.stringify(inCart));

  } else {
      inCart = [...inCart, productInfo];
      localStorage.setItem("inCart", JSON.stringify(inCart));
      

  }

  console.log(productInfo.price);
  
  cartHTML();
}

function cartHTML() {
  cleanHTML();
  
  inCart.forEach((product) => {
      const row = document.createElement("tr");
      row.innerHTML = `
      <td>
      <a href="" class="borrar-producto" id="${product.id}">x</a>
      </td>
      <td>${product.title}</td>
      <td>${product.amount}</td>
      <td>$${product.price}</td>
      `;

      cartContainer.appendChild(row);
      
      totalArticles.textContent = inCart.length;
  });
  console.log(cartTotal)
  if (inCart.length > 0) {
    cartStatus.innerText = "¡Ya casi los tienes!";
  document.querySelector("#modal-gif").src = "assets/img/pokeball.gif";
  }
}

function cleanHTML() {
  cartContainer.innerHTML = "";
  totalArticles.textContent = inCart.length;
  cartStatus.innerText = "¡El carrito esta vacío!";
  document.querySelector("#modal-gif").src = "assets/img/pokeball_static.png";
  calculateTotal();
}

cartHTML();

class Product {
  constructor(id,title,img,price,amount,descuento) {
    this.id = id;
    this.title = title;
    this.img = img;
    this.price = price;
    this.amount = amount;
    this.descuento = descuento;
  }
  calculateDesc() {
    let desc = (this.price - (this.price * this.descuento)/100);
    return desc;
  }
}

const charizard = new Product(1,"Charizard","assets/img/charizard.png", 1000, 0, 0,);
const squirtle = new Product(2,"Squirtle","assets/img/squirtle.jpg", 1000, 0, 31,);
const pikachu = new Product(3,"Pikachu","assets/img/pikachu.jpg", 2000, 0, 0,);

const charizardMint = {
  ...charizard,
  id:4,
  title:"Charizard Mint",
  price:2500,
  mint:"MINT",
}

const products = [charizard, squirtle, pikachu, charizardMint];

console.log(products[1].calculateDesc());
generateCards(products, "lista-productos");

loadEventListeners();


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

function calculateTotal(){
  cartTotal = 0;
inCart.forEach((product)=>{
  cartTotal =  (product.price* product.amount) + cartTotal;
  console.log("total : "+cartTotal);
})
  document.querySelector(".total-carrito").innerText = `$${cartTotal.toFixed(2)}`;
}

let nextPage = document.querySelector(".next-page");
let previousPage = document.querySelector(".previous-page");
let acc2 = 1;
nextPage.addEventListener("click", (e)=>{
  acc2++;
  main()
 
})
let catchCards = document.querySelectorAll(".card");
previousPage.addEventListener("click", (e)=>{
  if (acc2 > 1) {
    acc2--;
    main()
    catchCards.style.animation = "deploy2 1s 1";
  }
});
