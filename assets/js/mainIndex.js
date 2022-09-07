import {nav} from './nav.js';
import {cartHTML,eventDeleteProduct, eventCartAlerts} from './functions.js';
import {open, close} from './cartModal.js';
nav;
open;
close;
let urlPokeballGIF = `assets/img/pokeball.gif`;
cartHTML(urlPokeballGIF);

eventDeleteProduct();
eventCartAlerts();
