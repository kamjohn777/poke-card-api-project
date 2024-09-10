document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=30';
    let data = [];
    let favorites = [];
    let sortAscending = true;

    // Fetch data from PokeAPI
    fetch(apiUrl)
        .then(response => response.json())
        .then(fetchedData => {
            const promises = fetchedData.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));
            return Promise.all(promises);
        })
        .then(pokemonData => {
            data = pokemonData;
            displayData();
        });

    // Display data in HTML
    function displayData() {
        const collection = document.getElementById('poke-collection');
        collection.innerHTML = '';
        data.forEach(pokemon => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${pokemon.name}</h3>
                <p>Type: ${pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <button onclick="addToFavorites('${pokemon.id}')">Add to Favorites</button>
            `;
            collection.appendChild(card);
        });
        updateTotalSum();
    }

    // Add item to favorites
    window.addToFavorites = function(id) {
        const pokemon = data.find(pokemon => pokemon.id === parseInt(id));
        if (pokemon) {
            data = data.filter(pokemon => pokemon.id !== parseInt(id));
            favorites.push(pokemon);
            displayData();
            displayFavorites();
        }
    };

    // Display favorites
    function displayFavorites() {
        const favoritesSection = document.getElementById('poke-favorites');
        favoritesSection.innerHTML = '';
        favorites.forEach(pokemon => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${pokemon.name}</h3>
                <p>Type: ${pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <button onclick="removeFromFavorites('${pokemon.id}')">Remove from Favorites</button>
            `;
            favoritesSection.appendChild(card);
        });
    }

    // Remove item from favorites
    window.removeFromFavorites = function(id) {
        const pokemon = favorites.find(pokemon => pokemon.id === parseInt(id));
        if (pokemon) {
            favorites = favorites.filter(pokemon => pokemon.id !== parseInt(id));
            data.push(pokemon);
            displayData();
            displayFavorites();
        }
    };

    // Sort items
    document.getElementById('sort-toggle').addEventListener('click', () => {
        sortAscending = !sortAscending;
        data.sort((a, b) => sortAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
        favorites.sort((a, b) => sortAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
        displayData();
        displayFavorites();
    });

    // Update total sum
    function updateTotalSum() {
        const totalSum = data.reduce((sum, pokemon) => sum + pokemon.base_experience, 0);
        document.getElementById('total-sum').innerText = `Total Base Experience: ${totalSum}`;
    }
});