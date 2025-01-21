import { config } from './config.js';

const customFetch = async (method, url) => {
    const fetchResponse = fetch(
        url, {
            method: method,
            headers: {
                'X-Api-Key': config.API_KEY,
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
        
        // Asegurar que el selector tenga un valor válido
        const selectElement = document.getElementById('myselect');
        if (!selectElement.value) {
            selectElement.value = 'all'; // Forzar el valor por defecto si está vacío
        }
        
        if (cards.length === 0) {
            appElement.innerHTML = `
                <div class="no-results">
                    <p>No se encontraron cartas para esta categoría</p>
                </div>`;
        } else {
            const cardsHTML = cards.map(element => `
                <div class="card" data-card-id="${element.id}">
                    <div class="img ${element.rarity} card-clickable">
                        <img loading="lazy" class="img-item card-clickable" src="${element.images.small}" alt="${element.name}">
                    </div>
                    <span class="card-name card-clickable">${element.name}</span>
                    <div class="rarity ${element.rarity} card-clickable">
                        ${element.rarity}
                    </div>
                    <div class="card-text card-clickable">
                        <span>$<span class="price-tag">${element.cardmarket?.prices?.trendPrice || 0}</span></span>
                        <p class="card-title">${element.name}</p>
                    </div>
                    <button class="agregar-carrito add-to" id="${element.id}">
                        <span class="prueba" id="pokeball-${element.id}"></span>Adquirir
                    </button>
                </div>
            `).join('');
            
            appElement.innerHTML = cardsHTML;
            
            // Agregar event listeners para abrir el modal
            document.querySelectorAll('.card').forEach(card => {
                const cardId = card.dataset.cardId;
                
                // Agregar click a elementos clickeables dentro de la carta
                card.querySelectorAll('.card-clickable').forEach(element => {
                    element.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        await showCardDetail(cardId);
                    });
                });
                
                // Click en la carta misma
                card.addEventListener('click', async (e) => {
                    if (!e.target.classList.contains('agregar-carrito') && 
                        !e.target.classList.contains('prueba')) {
                        await showCardDetail(cardId);
                    }
                });
            });
        }
        
        // Actualizar paginación y filtros
        document.getElementById('myselect').value = filter || 'all'; // Asegurar que siempre haya un valor
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
        // En caso de error, asegurar que el selector tenga un valor
        document.getElementById('myselect').value = 'all';
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

const showCardDetail = async (cardId) => {
    try {
        showLoader();
        const card = await getPokemonCard(cardId);
        
        const modalElement = document.createElement('div');
        modalElement.className = 'card-modal-overlay';
        modalElement.innerHTML = createModalHTML(card);
        
        document.body.appendChild(modalElement);
        
        // Manejador del cierre
        const closeModal = (e) => {
            e.preventDefault(); // Prevenir comportamiento por defecto
            document.body.removeChild(modalElement);
        };
        
        // Event listeners
        modalElement.querySelector('.card-modal__close').addEventListener('click', closeModal);
        modalElement.addEventListener('click', (e) => {
            if (e.target === modalElement) {
                closeModal(e);
            }
        });
        
    } catch (error) {
        console.error('Error al cargar los detalles de la carta:', error);
    } finally {
        hideLoader();
    }
};

const createModalHTML = (card) => `
    <div class="card-modal-overlay">
        <div class="card-modal-content">
            <div class="card-detail">
                <div class="card-detail__image ${card.rarity?.includes('Holo') ? 'Holo' : ''}">
                    <img src="${card.images.large}" alt="${card.name}">
                </div>
                <div class="card-detail__info">
                    <h3 class="card-detail__title">${card.name}</h3>
                    <div class="card-detail__stats">
                        <div class="stat">
                            <span class="stat-label">Rareza:</span>
                            <span class="stat-value">${card.rarity || 'N/A'}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Set:</span>
                            <span class="stat-value">${card.set.name}</span>
                        </div>
                        ${card.hp ? `
                            <div class="stat">
                                <span class="stat-label">HP:</span>
                                <span class="stat-value">${card.hp}</span>
                            </div>
                        ` : ''}
                        ${card.types ? `
                            <div class="stat">
                                <span class="stat-label">Tipos:</span>
                                <span class="stat-value">${card.types.join(', ')}</span>
                            </div>
                        ` : ''}
                        <div class="stat">
                            <span class="stat-label">Precio:</span>
                            <span class="stat-value">$${card.cardmarket?.prices?.trendPrice || 0}</span>
                        </div>
                    </div>
                </div>
                <a class="card-modal__close">X</a>
            </div>
        </div>
    </div>
`;

const createBoosterHTML = (booster) => `
    <div class="card" data-id="${booster.id}">
        <img src="${booster.images}" alt="${booster.name}" class="card-img">
        <div class="card-body">
            <h5 class="card-title">${booster.name}</h5>
            <p class="price-tag">$${booster.price}</p>
            <button class="agregar-carrito" id="${booster.id}">
                <img src="../assets/img/pokeball_static.png" alt="" class="prueba" id="pokeball-${booster.id}">
                Adquirir
            </button>
        </div>
    </div>
`;

// Añadir el evento click para los boosters
document.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (card) {
        const boosterId = card.dataset.id;
        showBoosterDetail(boosterId);
    }
});

// Función para mostrar el detalle del booster
const showBoosterDetail = async (boosterId) => {
    try {
        showLoader();
        const booster = await getBoosterData(boosterId);
        
        const modalHTML = `
            <div class="card-modal-overlay">
                <div class="card-modal-content">
                    <div class="card-detail">
                        <div class="card-detail__image">
                            <img src="${booster.images}" alt="${booster.name}">
                        </div>
                        <div class="card-detail__info">
                            <h3 class="card-detail__title">${booster.name}</h3>
                            <div class="card-detail__stats">
                                <div class="stat">
                                    <span class="stat-label">Serie:</span>
                                    <span class="stat-value">${booster.series}</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-label">Cantidad de sobres:</span>
                                    <span class="stat-value">${booster.packCount}</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-label">Cartas por sobre:</span>
                                    <span class="stat-value">${booster.cardsPerPack}</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-label">Precio:</span>
                                    <span class="stat-value">$${booster.price}</span>
                                </div>
                            </div>
                        </div>
                        <a class="card-modal__close">X</a>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        // ... resto del código del modal
    } catch (error) {
        console.error('Error al cargar los detalles del booster:', error);
    } finally {
        hideLoader();
    }
};

export {
    main
};

