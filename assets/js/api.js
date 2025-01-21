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

const getAllPokemonCards = async (page, filter) => {
    try {
        let queryParams = `page=${page}&pageSize=12`; 
        
        if (filter && filter !== "all") {
            const filterMap = {
                "rare": "rarity:Rare",
                "uncommon": "rarity:Uncommon",
                "common": "rarity:Common"
            };
            
            if (filterMap[filter]) {
                queryParams += `&q=${encodeURIComponent(filterMap[filter])}`;
            }
        }

        const url = `https://api.pokemontcg.io/v2/cards?${queryParams}`;
        const response = await customFetch('GET', url);
        const jsonResponse = await response.json();
        
        return jsonResponse;
    } catch (error) {
        console.error('Error en getAllPokemonCards:', error);
        return { data: [], totalCount: 0 };
    }
}

const showLoader = () => {
    document.getElementById('loader').style.display = 'flex';
};

const hideLoader = () => {
    document.getElementById('loader').style.display = 'none';
};

let currentFilter = 'all';
let isLoading = false;

// Manejar el cambio de filtro
document.getElementById('myselect').addEventListener('change', async (e) => {
    if (isLoading) return;
    currentFilter = e.target.value;
    await handlePageChange(1); // Resetear a página 1 al cambiar filtro
});

// Función para manejar el cambio de página
const handlePageChange = async (newPage) => {
    if (isLoading) return;
    
    try {
        isLoading = true;
        await main(currentFilter, newPage);
    } finally {
        isLoading = false;
    }
};

const main = async (filter, page = 1) => {
    try {
        showLoader();
        const response = await getAllPokemonCards(page, filter);
        const cards = response.data || [];
        const totalPages = Math.ceil((response.totalCount || 0) / 12);
        
        const appElement = document.getElementById("app");
        
        if (cards.length === 0) {
            appElement.innerHTML = `
                <div class="no-results">
                    <p>No se encontraron cartas para esta categoría</p>
                </div>`;
        } else {
            const cardsHTML = cards.map(element => `
                <div class="card">
                    <div class="img ${element.rarity}">
                        <img loading="lazy" class="img-item" src="${element.images.small}" alt="${element.name}">
                    </div>
                    <span class="card-name">${element.name}</span>
                    <div class="rarity ${element.rarity}">
                        ${element.rarity}
                    </div>
                    <div class="card-text">
                        <span>$<span class="price-tag">${element.cardmarket?.prices?.trendPrice || 0}</span></span>
                        <p class="card-title">${element.name}</p>
                    </div>
                    <button class="agregar-carrito add-to" id="${element.id}">
                        <span class="prueba" id="pokeball-${element.id}"></span>Adquirir
                    </button>
                </div>
            `).join('');
            
            appElement.innerHTML = cardsHTML;
        }
        
        // Actualizar paginación y filtros
        document.getElementById('myselect').value = filter;
        document.getElementById("currentPage").textContent = page;
        document.getElementById("totalPages").textContent = totalPages;
        
        const previousButton = document.querySelector(".previous-page");
        const nextButton = document.querySelector(".next-page");
        
        previousButton.disabled = page <= 1;
        nextButton.disabled = page >= totalPages;
        
        // Restaurar el scroll
        if (page > 1) {
            document.getElementById('cards-section').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        restorePokeballs();
        
    } catch (error) {
        console.error("Error al cargar las cartas:", error);
    } finally {
        hideLoader();
    }
};

// Event listeners para los botones de paginación
document.querySelector('.next-page').addEventListener('click', async () => {
    const currentPage = parseInt(document.getElementById('currentPage').textContent);
    await handlePageChange(currentPage + 1);
});

document.querySelector('.previous-page').addEventListener('click', async () => {
    const currentPage = parseInt(document.getElementById('currentPage').textContent);
    await handlePageChange(currentPage - 1);
});

// Iniciar con la primera página
handlePageChange(1);

// Función para restaurar el estado de las pokebolas
function restorePokeballs() {
    const inCart = JSON.parse(localStorage.getItem("inCart") || "[]");
    inCart.forEach(item => {
        const pokeballElement = document.getElementById(item.pokeball);
        if (pokeballElement) {
            pokeballElement.classList.add("prueba2");
        }
    });
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

const myselect = document.querySelector("#myselect");
myselect.addEventListener("change", (e) => {
    e.preventDefault();
    valor = myselect.value;
    console.log(valor);
    main(valor);
});

export {
    main
};

