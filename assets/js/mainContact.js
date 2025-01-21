import { nav } from './nav.js';
import { cartHTML, eventDeleteProduct, eventCartAlerts } from './functionsIndex.js';
import { open, close } from './cartModal.js';

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar navbar
    nav;

    // Inicializar modal del carrito
    open;
    close;

    // Definir URLs de las imágenes
    let urlPokeballGIF = `../assets/img/pokeball.gif`;
    let urlPokeballStatic = `../assets/img/pokeball_static.png`;

    // Inicializar carrito con la URL del GIF
    cartHTML(urlPokeballGIF);

    // Inicializar eventos del carrito con la URL de la imagen estática
    eventDeleteProduct();
    eventCartAlerts(urlPokeballStatic);

    // Inicializar ScrollReveal
    ScrollReveal().reveal('.reveal', { 
        delay: 200,
        distance: '50px',
        duration: 1000,
        origin: 'bottom',
        opacity: 0,
        reset: true,
        viewFactor: 0.2
    });
}); 