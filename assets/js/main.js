import funciones from './funciones.js';
import {nav} from './nav.js';

const {cargarEventListeners, generarCards, carritoHTML} = funciones;

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

console.log(productos[1].calcularDesc());
generarCards(productos, "lista-productos");
cargarEventListeners();
