"use strict";

const loadingIndicator = document.getElementById("loading");
const pokemonContainer = document.getElementById("pokemon-container");
let currentOffset = 0; // Startwert für Offset

document.addEventListener("DOMContentLoaded", function () {
  // Beispielaufruf der Funktionen
  (async function () {
    await PokemonsAll(16, currentOffset);
  })();
});

// Show Spinner
async function showLoading() {
  loadingIndicator.classList.add("active");
}

// Hide Spinner
async function hideLoading() {
  loadingIndicator.classList.remove("active");
}

// Hole alle Pokemons aus der API
async function PokemonsAll(limit = 16, offset = 0) {
  try {
    showLoading();

    let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    let responseAllPokemonAsJson = await response.json();

    let pokemonData = responseAllPokemonAsJson.results.map((pokemon) => ({
      name: pokemon.name,
      url: pokemon.url,
    }));

    // console.log("Alle Pokemon-Namen und URLs:", pokemonData);

    // Hier rufen wir getPokeDetails für jedes Pokémon auf
    let allPokemonDetails = await Promise.all(pokemonData.map((pokemon) => getPokeDetails(pokemon)));

    // Hier rufen wir renderPokemonCards mit allen Details auf
    renderPokemonCards(allPokemonDetails);

    // Verstecke den Ladeindikator erst hier, nachdem alle Daten geladen und die Karten gerendert wurden
    hideLoading();
  } catch (error) {
    hideLoading();
    console.error("Fehler beim Laden der Pokemon:", error);
  }
}

async function getPokeDetails(pokemon) {
  try {
    // Teste die Ausgabe von Pokemon Details
    // console.log("Pokemon Details:", pokemon.url);

    let response = await fetch(pokemon.url);
    let pokemonDetails = await response.json();

    // console.log("Fetched Pokemon Details:", pokemonDetails);

    // Rückgabe der Details zusammen mit dem ursprünglichen Namen
    return { ...pokemonDetails, name: pokemon.name };
  } catch (error) {
    console.error("Fehler beim Laden der Pokemon Details:", error);
  }
}

function renderPokemonCards(pokemonData) {
  if (!pokemonData || !Array.isArray(pokemonData)) {
    console.error("pokemonData ist ungültig:", pokemonData);
    return;
  }

  // pokemonContainer.innerHTML = ""; // Leere den Container

  for (let i = 0; i < pokemonData.length; i++) {
    // console.log("Pokemon Name:", pokemonData[i].name, "Details:", pokemonData[i]);

    let PokeName = pokemonData[i].name;
    PokeName = String(PokeName).charAt(0).toUpperCase() + PokeName.slice(1);
    PokeName = PokeName.replace("-f", "_F");
    PokeName = PokeName.replace("-m", "");
    PokeName = PokeName.replace("Mrime", "MrMime");

    let { id, height, weight, types, stats } = pokemonData[i];
    let type = types.map((t) => t.type.name).join(" / ");
    let hp = stats.find((stat) => stat.stat.name === "hp").base_stat;
    let idHTML = id.toString().padStart(3, "0");

    // Großschreibung der Anfangsbuchstaben der Typen
    let typeInfo = types.map((x) => x.type.name.charAt(0).toUpperCase() + x.type.name.slice(1)).join(" / ");

    // Erstellen Sie die CSS-Klasse für den Farbverlauf basierend auf den Typen
    let typeClasses = types.map((t) => t.type.name);
    let gradientClass = typeClasses.length > 1 ? `${typeClasses[0]}-${typeClasses[1]}-gradient` : `${typeClasses[0]}`;

    // Erstellen Sie die CSS-Klasse für den Rand basierend auf dem ersten Typ
    let typeClass = `${types[0].type.name}-border-card`;

    pokemonContainer.innerHTML += `    
        <div class="card has-text-weight-bold has-text-white pokemon ${typeClass}">
        <div class="card-header">
        <div class="id">#${idHTML}</div>
          </div>
          <div class="card-image">
            <div class="card-image-container ${gradientClass}">
            <img src="http://static.pokemonpets.com/images/monsters-images-300-300/${id}-${PokeName}.webp" alt="${PokeName}" />
            </div>
          </div>
          <div class="card-content has-text-centered">
            <div class="">
              <div class="title">${PokeName}</div>
              <div class="hp">HP ${hp}</div>
            </div>
            <div class="stats columns is-mobile">
          <div class="extra-info">
                <div> <small> Weight</small> <h5 class="weight"> ${weight / 10} Kg </h5></div>
                <div class="space"></div>
                <div> <small> Height</small> <h5 class="height"> ${height / 10} m</h5></div>      
            </div>
            <div class="type">${typeInfo}</div>
            </div>
          </div>
        </div>
      `;
  }
}

// Funktion zum Laden von mehr Pokémon
async function loadMorePokemons() {
  currentOffset += 16; // Erhöhe den Offset um 16 (oder eine andere gewünschte Anzahl)
  await PokemonsAll(16, currentOffset); // Lade weitere Pokémon
}
