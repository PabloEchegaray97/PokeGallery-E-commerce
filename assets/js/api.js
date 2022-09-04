const apiKey = '0a62f8bc-55ae-4e7f-86fe-49da8aaf6ca9'

const customFetch = async (method, url) => {
    const fetchResponse = fetch(
        url, {
            method: method,
            headers: {
                'X-Api-Key': apiKey,
                'Content-Type': 'application/json'
            },

        }
    );
    return fetchResponse;
}

const getPokemonCard = async (id) => {
    const url = `https://api.pokemontcg.io/v2/cards/${id}`
    const response = await customFetch('GET', url);
    const card = await response.json();
    return card.data;
}

const getAllPokemonCards = async (page) => {
    const url = `https://api.pokemontcg.io/v2/cards?page=${page}&pageSize=40`;
    const response = await customFetch('GET', url);
    const jsonResponse = await response.json();
    const cards = jsonResponse.data;
    return cards;
}

const main = async (valor) => {
    const id = 'base1-4';
    const card = await getPokemonCard(id);
    const cards = await getAllPokemonCards(acc2);
    let acc = ``;
    cards.forEach(element => {
        
        const idPokeball = `pokeball-${element.id}`;
        console.log(element.rarity);
        let plantilla = `<div class="card">
                        <div class="img ${element.rarity}">
                            <img class="img-item" src="${element.images.small}" alt="">
                        </div>
                        <span class="card-name">${element.name}</span>
                        <div class="rarity ${element.rarity}">
                            ${element.rarity}
                        </div>
                        <div class="card-text">
                            <span>$<span class="price-tag">${element.cardmarket.prices.trendPrice}</span></span>
                            <p class ="card-title">${element.name}</p>
                        </div>
                        <button class="agregar-carrito add-to" id="${element.id}"><span class="prueba" id="${idPokeball}"></span>Adquirir</button>
                    </div>`
        console.log(element);
    if (valor=="holo") {
        if (element.rarity == "Rare Holo" || element.rarity == "Rare Holo GX" || element.rarity == "Rare Holo EX") {
            acc += plantilla;
        }
    } else if (valor=="uncommon") {
        if (element.rarity == "Uncommon") {
            acc += plantilla;
        }
    } else if (valor=="rare") { 
        if (element.rarity == "Rare") {
            acc += plantilla;
        }
    } else if (valor=="common") { 
        if (element.rarity == "Common") {
            acc += plantilla;
        }
    } else {
        acc +=plantilla;
    }
    });

    document.getElementById("app").innerHTML = acc;
}

let valor="all";
let nextPage = document.querySelector(".next-page");
let previousPage = document.querySelector(".previous-page");
let acc2 = 1;
nextPage.addEventListener("click", (e) => {
    acc2++;
    main(valor)

})
let catchCards = document.querySelectorAll(".card");
previousPage.addEventListener("click", (e) => {
    if (acc2 > 1) {
        acc2--;
        main(valor)
        catchCards.style.animation = "deploy2 1s 1";
    }
});

const myselected = document.querySelector("#myselect");
myselected.addEventListener("change", (e) => {
    e.preventDefault();
    valor = myselected.value;
    console.log(valor);
    main(valor);
});

export {
    main
};

