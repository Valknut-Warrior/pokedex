"use strict";

const loadingIndicator = document.getElementById("loading");
const pokemonContainer = document.getElementById("pokemon-container");
const pokeSearchInput = document.getElementById("poke-search-input");
let currentOffset = 0; // Startwert für Offset
let currentLimit = 0; // Startwert für Limit
let allPokemonData = []; // Array, um alle geladenen Pokemon-Daten zu speichern

document.addEventListener("DOMContentLoaded", function() {
  // Initiales Laden der Pokémon beim Seitenaufruf
  (async function() {
    await PokemonsAll(16, currentOffset);
  })();

  checkURL();

});

// Speichere 151 Pokemons in allPokemonData ab

for (let i = 1; i <= 151; i++) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
    .then((response) => response.json())
    .then((data) => {
      showLoading();
      allPokemonData.push(data);

      // Sortiert alle Pokemon über die ID
      allPokemonData.sort((a, b) => a.id - b.id);

      // Falls alle Daten abgerufen wurden, zeige sie an
      if (allPokemonData.length === 151) {
        renderPokemonCards(allPokemonData);
        hideLoading();
      }
    })
    .catch((error) => console.error("Fehler beim Abrufen der Pokémon-Daten:", error));
}

// Show Spinner
function showLoading() {
  loadingIndicator.classList.add("active");
}

// Hide Spinner
function hideLoading() {
  loadingIndicator.classList.remove("active");
}


// Hole alle Pokemons aus der API für All Generationen
async function PokemonsAllGeneration(limit = 16, offset = 0) {
  try {
    showLoading();

    let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    let responseAllPokemonAsJson = await response.json();

    let pokemonData = responseAllPokemonAsJson.results.map((pokemon) => ({
      name: pokemon.name, url: pokemon.url
    }));

    // Speichern Sie die geladenen Pokemon-Daten
    allPokemonData = allPokemonData.concat(pokemonData);

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


// Hole alle Pokemons aus der API
async function PokemonsAll(limit = 16, offset = 0) {
  try {
    showLoading();

    let pokemonData = allPokemonData.results.map((pokemon) => ({
      name: pokemon.name, url: pokemon.url
    }));

    // Speichern Sie die geladenen Pokemon-Daten
    allPokemonData = allPokemonData.concat(pokemonData);

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
    let response = await fetch(pokemon.url);
    let pokemonDetails = await response.json();

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


  console.log("Rendering Pokémon Karten für:", pokemonData);
  pokemonContainer.innerHTML = ""; // Leere den Container

  for (let i = 0; i < pokemonData.length; i++) {
    let { id, name, height, weight, types = [], stats = [] } = pokemonData[i];

    if (id === undefined || name === undefined || height === undefined || weight === undefined) {
      console.error(`Pokémon-Daten ungültig oder unvollständig für Eintrag:`, pokemonData[i]);
      continue; // Überspringe dieses Pokémon und fahre mit dem nächsten fort
    }

    // Erstelle eine Variable PokeName, die den Namen mit dem ersten Buchstaben großgeschrieben enthält
    let PokeName = String(name).charAt(0).toUpperCase() + name.slice(1);

    // Erstelle ein Objekt, das alle Ersetzungen enthält
    const replacements = {
      "-f": "_F",
      "-m": "",
      "Mrime": "MrMime",
      "Deoxys-normal": "Deoxys",
      "Wormadam-plant": "Wormadam",
      "Mime-jr": "MimeJr",
      "Porygon-z": "PorygonZ",
      "Giratina-altered": "Giratina",
      "Basculin-red-striped": "Basculin",
      "Darmanitan-standard": "Darmanitan",
      "Pumpkaboo-average": "Pumpkaboo",
      "Tornadus-incarnate": "Tornadus",
      "Thundurus-incarnate": "Thundurus",
      "Landorus-incarnate": "Landorus",
      "Keldeo-ordinary": "Keldeo",
      "Meloetta-aria": "Meloetta",
      "Meowsticale": "Meowstic",
      "Aegislash-shield": "Aegislash",
      "Gourgeist-average": "Gourgeist",
      "Zygarde-50": "Zygarde",
      "Oricorio-baile": "Oricorio",
      "Wishiwashi-solo": "Wishiwashi",
      "Lycanrocidday": "Lycanroc",
      "Minior-redeteor": "Minior",
      "Mimikyu-disguised": "Mimikyu",
      "Tapu_Fini": "Tapu-Fini",
      "Toxtricity-amped": "Toxtricity-Lowkey",
      "Mr-rime": "MrRime",
      "Eiscue-ice": "Eiscue",
      "Indeedeeale": "Indeedee",
      "Morpeko_Full-belly": "Morpeko",
      "Urshifu-single-strike": "Urshifu",
      "Basculegionale": "Basculegion",
      "Enamorus-incarnate": "Enamorus"
    };

    // Iteriere über die Einträge im replacements-Objekt
    for (let [key, value] of Object.entries(replacements)) {
      // Ersetze alle Vorkommen des Schlüssels (key) in PokeName durch den Wert (value)
      PokeName = PokeName.replace(key, value);
    }

    let type = types.map((t) => t.type.name).join(" / ");
    let hp = stats.find((stat) => stat.stat.name === "hp")?.base_stat || "N/A";
    let idHTML = id.toString().padStart(3, "0");

    // Großschreibung der Anfangsbuchstaben der Typen
    let typeInfo = types.map((x) => x.type.name.charAt(0).toUpperCase() + x.type.name.slice(1)).join(" / ");

    // Erstellen Sie die CSS-Klasse für den Farbverlauf basierend auf den Typen
    let typeClasses = types.map((t) => t.type.name);
    let gradientClass = typeClasses.length > 1 ? `${typeClasses[0]}-${typeClasses[1]}-gradient` : `${typeClasses[0]}`;

    // Erstellen Sie die CSS-Klasse für den Rand basierend auf dem ersten Typ
    let typeClass = `${types[0]?.type?.name || "default"}-border-card`;

    // Erstellen Sie die CSS-Klasse für den Rand basierend auf dem ersten Typ
    let typeClassButton = `${types[0]?.type?.name || "default"}-background-button`;

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
              <div><small>Weight</small><h5 class="weight">${weight / 10} Kg</h5></div>
              <div class="space"></div>
              <div><small>Height</small><h5 class="height">${height / 10} m</h5></div>      
            </div>
            <div class="type>${typeInfo}"</div>
            <div class="card-button ${typeClassButton}" onclick="redirectToPokemonPage(${PokeName})">
              <button class="button-none">Info</button>
            </div>
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


// Lade eine andere generation
async function loadAnotherGeneration(limit = 0, offset = 0) {
  await PokemonsAllGeneration(limit, offset); // Lade weitere Pokémon
}

// Suchfunktion
function filterAndShowPokemons(filterName) {
  const filteredPokemon = allPokemonData.filter((pokemon) => pokemon.name.toLowerCase().includes(filterName));
  renderPokemonCards(filteredPokemon);
}

// Event Listener für das Suchfeld
pokeSearchInput.addEventListener("input", (event) => {
  const filterName = event.target.value.trim().toLowerCase();
  console.log("Suchbegriff:", filterName);
  console.log("Aktueller Datenbestand:", allPokemonData);

  if (filterName.length >= 3) {
    // Filtere und zeige die Pokémon nur, wenn der Suchbegriff mindestens 3 Zeichen lang ist
    filterAndShowPokemons(filterName);
  } else {
    // Zeige alle Pokémon, wenn weniger als 3 Zeichen im Suchfeld sind
    pokemonContainer.innerHTML = ""; // Leere den Container
    renderPokemonCards(allPokemonData); // Zeige alle Pokémon
  }
});


// Popup Öffnen
function showPopupOpen() {
  document.getElementById("popup").style.display = "block";
}

// Popup schließen
function showPopupClosed() {
  document.getElementById("popup").style.display = "none";
}

// Weiterleitung auf die details Seite
function redirectToPokemonPage(pokemonName) {
  const urlFriendlyName = pokemonName.toLowerCase();
  window.location.href = `http://localhost:5173/details.html?pokemon=${urlFriendlyName}`;
}
