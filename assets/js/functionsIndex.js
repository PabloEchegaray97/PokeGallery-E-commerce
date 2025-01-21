const cart = document.querySelector("#carrito");
const emptyCartBtn = document.querySelector("#vaciar-carrito");
const confirmBuyBtn = document.querySelector("#confirmar-compra");
let cartTotal = 0;
const cartContainer = document.querySelector("#lista-carrito tbody");
let totalArticles = document.querySelector(".cart-total");

let cartStatus = document.querySelector("#estado-carrito");

let inCart = JSON.parse(localStorage.getItem("inCart")) ?? [];
function eventDeleteProduct() {
    cart.addEventListener("click", deleteProduct);
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
        const isSubfolder = window.location.pathname.includes('/pages/');
        const imgPath = isSubfolder ? '../assets/img/pokeball.gif' : 'assets/img/pokeball.gif';
        document.querySelector("#modal-gif").src = imgPath;
    }
}

function cleanHTML() {
    cartContainer.innerHTML = "";
    totalArticles.textContent = inCart.length;
    cartStatus.innerText = "¡El carrito esta vacío!";
    const isSubfolder = window.location.pathname.includes('/pages/');
    const imgPath = isSubfolder ? '../assets/img/pokeball_static.png' : 'assets/img/pokeball_static.png';
    document.querySelector("#modal-gif").src = imgPath;
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

export {
    eventCartAlerts,
    cartHTML,
    eventDeleteProduct
};