"use strict";

const loadingIndicator = document.getElementById("loading");

document.addEventListener("DOMContentLoaded", function() {

  showLoading();
  checkURL();
});

function checkURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const pokemonName = urlParams.get("pokemon");

  if (pokemonName) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .then(response => response.json())
      .then(data => {
        if (data) {
          displayPokemonDetails(data);     // Aufruf der Funktion zur Anzeige der Details
          renderTypeButtons(data.types); // Typen-Buttons anzeigen
          renderBarChart(data.stats, data.types); // Daten anzeigen
          fetchPokemonDetails(pokemonName);  // Pokémon-Details abrufen und anzeigen


          setTimeout(() => {
            hideLoading(); // Ladeanzeige stoppen
          }, "500");


        } else {
          console.error("Fehler beim Laden der Pokémon-Daten: Keine Daten erhalten");

          setTimeout(() => {
            hideLoading(); // Ladeanzeige stoppen
          }, "500");

        }
      })
      .catch(error => {
        console.error("Fehler beim Laden der Pokémon-Daten:", error);

        setTimeout(() => {
          hideLoading(); // Ladeanzeige stoppen
        }, "500");

      });
  } else {
    console.error("Fehler: Kein Pokémon-Name in der URL gefunden");

    setTimeout(() => {
      hideLoading(); // Ladeanzeige stoppen
    }, "500");

  }

}


function renderTypeButtons(types) {
  const typesContainer = document.getElementById("types-container");
  typesContainer.innerHTML = ""; // Leere den Container, falls bereits Inhalt vorhanden ist

  types.forEach((type) => {
    const typeName = type.type.name;
    const typeClass = `${typeName}-background-button`; // CSS-Klasse basierend auf dem Typen

    const buttonHTML = `
      <button class="button ${typeClass}">
        ${typeName.charAt(0).toUpperCase() + typeName.slice(1)} 
      </button>
    `;

    typesContainer.innerHTML += buttonHTML;
  });
}

// Show Spinner
function showLoading() {
  loadingIndicator.classList.add("active");
}

// Hide Spinner
function hideLoading() {
  loadingIndicator.classList.remove("active");
}

function displayPokemonDetails(data) {

  // Erstelle eine Variable PokeName, die den Namen mit dem ersten Buchstaben großgeschrieben enthält
  let PokeName = String(data.name).charAt(0).toUpperCase() + data.name.slice(1);

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


  document.querySelector(".container-attributes .info-container:nth-child(1) p").innerText = `${data.height / 10} m`;
  document.querySelector(".container-attributes .info-container:nth-child(2) p").innerText = `${data.weight / 10} Kg`;

  document.getElementById("pokemon-details-card").innerHTML = `
       <h2 class="details-name" id="details-name">${data.species.name}</h2>
        <p class="details-id"># ${data.id.toString().padStart(3, "0")}</p>

        <figure class="container-card-img">
          <img class="animation-up-down" alt="${data.species.name}" title="${data.species.name}"
               src="http://static.pokemonpets.com/images/monsters-images-300-300/${data.id.toString()}-${PokeName}.webp">
        </figure>

        <div id="types-container"></div>`;

  // Und so weiter für andere Details.
}


function getTypeColor(type) {
  const typeColors = {
    normal: "rgba(168, 168, 120, 1)",
    fire: "rgba(240, 128, 48, 1)",
    water: "rgba(104, 144, 240, 1)",
    electric: "rgba(248, 208, 48, 1)",
    grass: "rgba(120, 200, 80, 1)",
    ice: "rgba(152, 216, 216, 1)",
    fighting: "rgba(192, 48, 40, 1)",
    poison: "rgba(160, 64, 160, 1)",
    ground: "rgba(224, 192, 104, 1)",
    flying: "rgba(168, 144, 240, 1)",
    psychic: "rgba(248, 88, 136, 1)",
    bug: "rgba(168, 184, 32, 1)",
    rock: "rgba(184, 160, 56, 1)",
    ghost: "rgba(112, 88, 152, 1)",
    dragon: "rgba(112, 56, 248, 1)",
    dark: "rgba(112, 88, 72, 1)",
    steel: "rgba(184, 184, 208, 1)",
    fairy: "rgba(240, 182, 188, 1)"
  };

  return typeColors[type] || "rgba(128, 128, 128, 1)"; // Default fallback color
}

function renderBarChart(stats, types) {
  const ctx = document.getElementById("statsChart").getContext("2d");

  // Verwende die Farbe des ersten Typs als borderColor
  const borderColor = getTypeColor(types[0].type.name);
  const backgroundColor = borderColor.replace("1)", "0.6)"); // Anpassung für den Hintergrund

  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: stats.map(stat => stat.stat.name.toUpperCase()),
      datasets: [{
        label: "Base Stats",
        data: stats.map(stat => stat.base_stat),
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 150 // Oder passe dies an die erwarteten Werte an
        }
      }
    }
  });

  console.log("Chart erstellt:", chart); // Debugging: Überprüfen, ob der Graph erstellt wird
}

async function fetchPokemonDetails(pokemonName) {
  try {
    // Hauptdaten des Pokémon abrufen
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const pokemonData = await response.json();

    // Speziesdaten abrufen (für Flavor-Text, Geschlecht und Lebensraum)
    const speciesResponse = await fetch(pokemonData.species.url);
    const speciesData = await speciesResponse.json();

    // Fähigkeiten und Habitat aus den Haupt- und Speziesdaten extrahieren
    const abilities = pokemonData.abilities.map(abilityInfo => abilityInfo.ability.name).join(", ");
    const habitat = speciesData.habitat ? speciesData.habitat.name : "Unknown";
    const genderRate = speciesData.gender_rate;

    // Flavor-Text extrahieren (auf Deutsch oder Englisch, falls nicht verfügbar)
    const flavorTextEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === "de") ||
      speciesData.flavor_text_entries.find(entry => entry.language.name === "en");
    const flavorText = flavorTextEntry ? flavorTextEntry.flavor_text : "No description available.";

    // Geschlechterverteilung berechnen (Männlich/Weiblich)
    let genderDistribution;
    if (genderRate === -1) {
      genderDistribution = "Genderless";
    } else {
      const femalePercentage = (genderRate / 8) * 100;
      const malePercentage = 100 - femalePercentage;
      genderDistribution = `Male: ${malePercentage}%, Female: ${femalePercentage}%`;
    }

    // Anzeige der abgerufenen Daten
    renderPokemonDetails({
      name: pokemonData.name,
      abilities,
      habitat,
      flavorText,
      genderDistribution,
      types: pokemonData.types,
      stats: pokemonData.stats
    });
  } catch (error) {
    console.error("Fehler beim Laden der Pokémon-Daten:", error);
  }
}

function renderPokemonDetails(details) {
  // Füge die Informationen in die entsprechenden HTML-Elemente ein

  document.getElementById("pokemon-name").innerText = details.name;
  document.getElementById("abilities").innerText = details.abilities;
  document.getElementById("habitat").innerText = details.habitat;
  document.getElementById("flavor-text").innerText = details.flavorText;
  document.getElementById("gender-distribution").innerText = details.genderDistribution;


  // Typen-Buttons und Diagramme rendern
  renderTypeButtons(details.types);
  renderBarChart(details.stats, details.types);
  hideLoading();
}