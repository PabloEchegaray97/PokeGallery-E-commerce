const productList = document.querySelector("#lista-productos");
const productList2 = document.querySelector("#app");
function loadEventListeners2() {
    productList.addEventListener("click", addProduct);
    productList2.addEventListener("click", addProduct);
    cart.addEventListener("click", deleteProduct);
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

    cartHTML();
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
