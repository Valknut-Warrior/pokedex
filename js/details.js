"use strict";

document.addEventListener("DOMContentLoaded", function() {

  checkURL();

});


function checkURL() {

  const urlParams = new URLSearchParams(window.location.search);
  const pokemonName = urlParams.get("pokemon");

  if (pokemonName) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .then(response => response.json())
      .then(data => {
        // Zeige die Details des Pokémon auf der Seite an
        document.getElementById("pokemon-name").innerText = data.name;
        // und so weiter...
      })
      .catch(error => console.error("Fehler beim Laden der Pokémon-Daten:", error));
  }

}