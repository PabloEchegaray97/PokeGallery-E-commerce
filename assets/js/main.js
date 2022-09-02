import {main} from './api.js';
import {nav} from './nav.js';
import {loadEventListeners, cartHTML,generateCards} from './functions.js';
import {open, close} from './cartModal.js';
main();
nav;
open;
close;
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

const charizard = new Product(1,"Charizard","../assets/img/charizard.png", 1000, 0, 0,);
const squirtle = new Product(2,"Squirtle","../assets/img/squirtle.jpg", 1000, 0, 31,);
const pikachu = new Product(3,"Pikachu","../assets/img/pikachu.jpg", 2000, 0, 0,);

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






