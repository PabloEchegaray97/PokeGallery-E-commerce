import {main} from './api.js';
import {nav} from './nav.js';
import {eventCartAlerts, cartHTML,generateCards,eventAddProduct,eventDeleteProduct} from './functions.js';
import {open, close} from './cartModal.js';
main();
nav;
open;
close;
let urlPokeballGIF = `../assets/img/pokeball.gif`;
let urlPokeballStatic = `../assets/img/pokeball_static.png`;
cartHTML(urlPokeballGIF);

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

const tcgFusion = new Product(1,"Booster Pack: Fusion Strike x4","../assets/img/cardsjson/1.jpg", 1000, 0, 0,);
const tcgVividVolt = new Product(2,"Booster Pack: Vivid Voltage x4","../assets/img/cardsjson/2.jpg", 1000, 0, 31,);
const tcgCR = new Product(3,"Booster Pack: Chilling REIGN x5","../assets/img/cardsjson/3.jpg", 2000, 0, 0,);
const tcgAR = new Product(4,"Booster Pack: Astral Radiance x5","../assets/img/cardsjson/5.jpg", 2000, 0, 0,);
const tcgboxBS = new Product(5, "TCG: Brilliant Stars","../assets/img/cardsjson/6.jpg", 2000, 0, 0,)
const tcgboxLO = new Product(6, "TCG: Lost Origin","../assets/img/cardsjson/8.jpg", 2000, 0, 0,)
const tcgboxFS = new Product(7, "TCG: Fusion Strike","../assets/img/cardsjson/9.jpg", 2000, 0, 0,)
const tcgboxST = new Product(8, "TCG: Silver Tempest","../assets/img/cardsjson/10.jpg", 2000, 0, 0,)

const charizard1 = new Product(101, "Charizard","../assets/img/ftpokemon/charizard1.png", 2000, 0, 0)
const charizardMint = {
  ...tcgFusion,
  id:4,
  title:"Charizard Mint",
  price:2500,
  mint:"MINT",
}

const products = [tcgFusion, tcgVividVolt, tcgCR, tcgAR, tcgboxBS, tcgboxLO, tcgboxFS, tcgboxST];

const products2 = [charizard1];

console.log(products[1].calculateDesc());
generateCards(products, "lista-productos");




eventCartAlerts(urlPokeballStatic);
eventAddProduct();
eventDeleteProduct();

let currentPage = 1;
let currentFilter = "all";

// Manejadores de paginación
nextPage.addEventListener("click", async () => {
    currentPage++;
    await main(currentFilter, currentPage);
    document.getElementById("currentPage").textContent = currentPage;
});

previousPage.addEventListener("click", async () => {
    if (currentPage > 1) {
        currentPage--;
        await main(currentFilter, currentPage);
        document.getElementById("currentPage").textContent = currentPage;
    }
});

myselect.addEventListener("change", async (e) => {
    e.preventDefault();
    currentFilter = myselect.value;
    currentPage = 1; // Reset a primera página al cambiar filtro
    document.getElementById("currentPage").textContent = currentPage;
    await main(currentFilter, currentPage);
});

// Inicialización
main(currentFilter, currentPage);

class ProductManager {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Seleccionar todos los contenedores de productos (tanto los del JSON como los estáticos)
        const productContainers = document.querySelectorAll('.card, .product-card');
        
        productContainers.forEach(card => {
            card.addEventListener('click', (e) => {
                // No mostrar modal si se hace click en el botón de adquirir
                if (e.target.classList.contains('agregar-carrito') || 
                    e.target.closest('.agregar-carrito')) {
                    return;
                }

                // Obtener datos del producto desde el HTML
                const productData = {
                    name: card.querySelector('.card-title').textContent,
                    image: card.querySelector('img').src,
                    price: card.querySelector('.price-tag').textContent,
                    series: "Sword & Shield",
                    packCount: card.querySelector('.card-title').textContent.includes('x4') ? 4 : 5,
                    cardsPerPack: 10,
                    description: "Expande tu colección con esta increíble expansión de Pokémon TCG."
                };

                this.showProductDetail(productData);
            });
        });
    }

    showProductDetail(product) {
        const modalHTML = `
            <div class="card-modal-overlay">
                <div class="card-modal-content">
                    <div class="card-detail">
                        <div class="card-detail__image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="card-detail__info">
                            <h3 class="card-detail__title">${product.name}</h3>
                            <div class="card-detail__stats">
                                <div class="stat">
                                    <span class="stat-label">Serie:</span>
                                    <span class="stat-value">${product.series}</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-label">Sobres:</span>
                                    <span class="stat-value">${product.packCount}</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-label">Cartas por sobre:</span>
                                    <span class="stat-value">${product.cardsPerPack}</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-label">Precio:</span>
                                    <span class="stat-value">${product.price}</span>
                                </div>
                            </div>
                            <p class="card-detail__description">${product.description}</p>
                        </div>
                        <a class="card-modal__close">X</a>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Manejar el cierre del modal
        const modalOverlay = document.querySelector('.card-modal-overlay');
        const closeModal = () => modalOverlay.remove();

        modalOverlay.querySelector('.card-modal__close').addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ProductManager();
});

