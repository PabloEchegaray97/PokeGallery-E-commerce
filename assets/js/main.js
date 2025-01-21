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

