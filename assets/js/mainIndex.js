import {nav} from './nav.js';
import {cartHTML,eventDeleteProduct, eventCartAlerts} from './functions.js';
import {open, close} from './cartModal.js';
nav;
open;
close;
let urlPokeballGIF = `assets/img/pokeball.gif`;
let urlPokeballStatic = `assets/img/pokeball_static.png`;
cartHTML(urlPokeballGIF);

eventDeleteProduct();
eventCartAlerts(urlPokeballStatic);
