const cart = document.querySelector("#carrito");
const emptyCartBtn = document.querySelector("#vaciar-carrito");
const confirmBuyBtn = document.querySelector("#confirmar-compra");


const productList = document.querySelector("#lista-productos");
const productList2 = document.querySelector("#app");
let cartTotal = 0;
const cartContainer = document.querySelector("#lista-carrito tbody");
let totalArticles = document.querySelector(".cart-total");

let urlPokeballGIF = `../assets/img/pokeball.gif`;

let cartStatus = document.querySelector("#estado-carrito");

let inCart = JSON.parse(localStorage.getItem("inCart")) ?? [];
function eventDeleteProduct() {
    cart.addEventListener("click", deleteProduct);
}
function eventAddProduct() {
    productList.addEventListener("click", addProduct);
    productList2.addEventListener("click", addProduct);
}

function eventCartAlerts() {
    
    

    emptyCartBtn.addEventListener("click", () => {

        if (inCart.length == 0) {
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
                console.log(pokeballID);
                const pokequery = document.getElementById(pokeballID) ?? "null";

                console.log(pokequery);
                if (pokequery != "null") {
                    document.getElementById(pokeballID).classList.remove("prueba2");
                }
                

            })


            inCart = [];
            localStorage.setItem("inCart", JSON.stringify(inCart));
            cleanHTML();
        }
    });

    confirmBuyBtn.addEventListener("click", () => {
        if (inCart.length == 0) {
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
                cancelButtonText: 'Seguir comprando',
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
function deleteProduct(e) {

    e.preventDefault();

    if (e.target.classList.contains("borrar-producto")) {
        const productID = e.target.getAttribute("id");
        const pokeballID = `pokeball-${productID}`
        const pokequery = document.getElementById(pokeballID) ?? "null";

        console.log(pokequery);
        if (pokequery != "null") {
            document.getElementById(pokeballID).classList.remove("prueba2");
        }
        console.log(productID);
        inCart = inCart.filter((product) => product.id !== productID);


        localStorage.setItem("inCart", JSON.stringify(inCart));
        console.log(inCart);
        cartHTML(urlPokeballGIF);
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
                color: "#000000",
                text: "A simple warning alert—check it out!",

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

    cartHTML(urlPokeballGIF);
}

function cartHTML(urlPokeball) {
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
        document.querySelector("#modal-gif").src = `${urlPokeball}`;
    }
}

function cleanHTML() {
    cartContainer.innerHTML = "";
    totalArticles.textContent = inCart.length;
    cartStatus.innerText = "¡El carrito esta vacío!";
    document.querySelector("#modal-gif").src = "../assets/img/pokeball_static.png";
    calculateTotal();
}

function calculateTotal() {
    cartTotal = 0;
    inCart.forEach((product) => {
        cartTotal = (product.price * product.amount) + cartTotal;
        console.log("total : " + cartTotal);
    })
    document.querySelector(".total-carrito").innerText = `$${cartTotal.toFixed(2)}`;
}
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
                <div class="card card-mod">
                        <div class="img">
                            <img class="img-item" src="${cardImg}" alt="">
                        </div>
                        <span class="card-name">${cardTitle}</span>
                        <div class="off30">${cardDesc}% OFF</div>
                        <div class="card-text">
                            <span>$<span class="price-tag">${cardPrice}</span></span>
                            <p class ="card-title">${cardTitle}</p>
                        </div>
                        <button class="agregar-carrito add-to" id="${cardId}"><span class="prueba" id="${idPokeball}"></span>Adquirir</button>
                    </div>`)} 
            else {
                document.getElementById(identificador).innerHTML += `
                <div class="card card-mod">
                        <div class="img">
                            <img class="img-item" src="${cardImg}" alt="">
                        </div>
                        <span class="card-name">${cardTitle}</span>
                        
                        <div class="card-text">
                            <span>$<span class="price-tag">${cardPrice}</span></span>
                            <p class ="card-title">${cardTitle}</p>
                        </div>
                        <button class="agregar-carrito add-to" id="${cardId}"><span class="prueba" id="${idPokeball}"></span>Adquirir</button>
                    </div>`;
            }
    });
  }

export {
    eventCartAlerts,
    cartHTML,
    generateCards,
    eventAddProduct,
    eventDeleteProduct
};