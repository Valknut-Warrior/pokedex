"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const loadingIndicator = document.getElementById("loading");
  const pokemonContainer = document.getElementById("pokemon-container");

  // Show Spinner
  function showLoading() {
    loadingIndicator.style.display = "block";
  }

  // Hide Spinner
  function hideLoading() {
    loadingIndicator.style.display = "none";
  }

  // Hole alle Pokemons aus der API
  async function PokemonsAll() {
    try {
      showLoading();

      let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151&offset=0");
      let responseAllPokemonAsJson = await response.json();
      // hideLoading();

      let pokemonData = responseAllPokemonAsJson.results.map((pokemon) => ({
        name: pokemon.name,
        url: pokemon.url,
      }));

      // console.log("Alle Pokemon-Namen und URLs:", pokemonData);

      // Hier rufen wir getPokeDetails für jedes Pokémon auf
      let allPokemonDetails = await Promise.all(pokemonData.map((pokemon) => getPokeDetails(pokemon)));

      // Hier rufen wir renderPokemonCards mit allen Details auf
      renderPokemonCards(allPokemonDetails);

      hideLoading();
    } catch (error) {
      hideLoading();
      console.error("Fehler beim Laden der Pokemon:", error);
    }
  }

  async function getPokeDetails(pokemon) {
    try {
      showLoading();

      // Teste die Ausgabe von Pokemon Details
      // console.log("Pokemon Details:", pokemon.url);

      let response = await fetch(pokemon.url);
      let pokemonDetails = await response.json();

      hideLoading();

      // console.log("Fetched Pokemon Details:", pokemonDetails);

      // Rückgabe der Details zusammen mit dem ursprünglichen Namen
      return { ...pokemonDetails, name: pokemon.name };
    } catch (error) {
      hideLoading();
      console.error("Fehler beim Laden der Pokemon Details:", error);
    }
  }

  function renderPokemonCards(pokemonData) {
    if (!pokemonData || !Array.isArray(pokemonData)) {
      console.error("pokemonData ist ungültig:", pokemonData);
      return;
    }

    pokemonContainer.innerHTML = ""; // Leere den Container

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
      id = id.toString().padStart(3, "0");

      let cssTypes = type.split("/");

      // Hier müssen noch die Typen rausgezogen werden für die CSS Regeln
      if (type && cssTypes[0]) {
        console.log("ID", i, ":", "Type", cssTypes);
      }

      pokemonContainer.innerHTML += `    
        <div class="card has-text-weight-bold has-text-white pokemon">
        <div class="card-header">
        <div class="id">#${id}</div>
          </div>
          <div class="card-image">
            <div class="card-image-container">
            <img src="http://static.pokemonpets.com/images/monsters-images-300-300/${i + 1}-${PokeName}.webp" alt="${PokeName}" />
            </div>
            <div class="type"></div>
          </div>
          <div class="card-content has-text-centered">
            <div class="">
              <div class="title">${PokeName}</div>
              <div class="hp">hp ${hp}</div>
            </div>
            <div class="stats columns is-mobile">
              <div class="column has-text-centered">${type}<br><span class="tag">Type</span></div>
              <div class="column has-text-centered center-column">${weight / 10} Kg<br><span
                class="tag">Weight</span></div>
              <div class="column has-text-centered">${height / 10} m<br><span class="tag">Height</span></div>
            </div>
          </div>
        </div>
      `;
    }
  }

  // Beispielaufruf der Funktionen
  (async function () {
    await PokemonsAll();
  })();
});
