"use strict";

const loadingIndicator = document.getElementById("loading");
const baseURL = window.location.origin; // Gibt die Basis-URL zurück
document.getElementById("search-field").style.display = "none";


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
          displayPokemonDetails(data);     // Zeige die Hauptdetails des Pokémon an
          renderTypeButtons(data.types);   // Typen-Buttons anzeigen
          renderBarChart(data.stats, data.types); // Daten anzeigen

          // Rufe zusätzliche Details ab, nachdem die Hauptseite geladen ist
          fetchPokemonDetails(pokemonName);  // Pokémon-Details abrufen und anzeigen
        } else {
          console.error("Fehler beim Laden der Pokémon-Daten: Keine Daten erhalten");
        }
      })
      .catch(error => {
        console.error("Fehler beim Laden der Pokémon-Daten:", error);
      })
      .finally(() => {
        hideLoading(); // Ladeanzeige stoppen, unabhängig vom Ergebnis
      });
  } else {
    console.error("Fehler: Kein Pokémon-Name in der URL gefunden");
    hideLoading(); // Ladeanzeige stoppen
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


let chart; // Globale Variable außerhalb der Funktion

function renderBarChart(stats, types) {
  const ctx = document.getElementById("statsChart").getContext("2d");

  // Falls das Diagramm bereits existiert, zerstöre es
  if (chart) {
    chart.destroy();
  }

  // Verwende die Farbe des ersten Typs als borderColor
  const borderColor = getTypeColor(types[0].type.name);
  const backgroundColor = borderColor.replace("1)", "0.6)"); // Anpassung für den Hintergrund


  // Weisen Sie das neu erstellte Diagramm der globalen 'chart'-Variable zu
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: stats.map(stat => stat.stat.name.toUpperCase()), // Labels für die X-Achse
      datasets: [{
        label: "Stats",
        data: stats.map(stat => stat.base_stat), // Daten für das Diagramm
        backgroundColor: backgroundColor, // Hintergrundfarbe der Balken
        borderColor: borderColor, // Randfarbe der Balken
        borderWidth: 1, // Breite des Rands
        color: borderColor // Farbe der Balken (optional)
      }]
    },
    options: {
      responsive: true, // Das Diagramm reagiert auf Größenänderungen des Containers
      maintainAspectRatio: false, // Das Diagramm kann sein Seitenverhältnis ändern, um den Container besser auszufüllen
      scales: {
        y: {
          beginAtZero: true, // Y-Achse beginnt bei 0
          max: 200, // Maximale Höhe der Y-Achse (kann angepasst werden)
          ticks: {
            color: "white" // Farbe der Y-Achse-Ticks (Text)
          }
        },
        x: {
          ticks: {
            color: "white" // Farbe der X-Achse-Ticks (Text)
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: "white" // Farbe der Legende
          }
        },
        tooltip: {
          titleColor: "white", // Farbe der Tooltip-Titel
          bodyColor: "white",  // Farbe der Tooltip-Inhalte
          footerColor: "white" // Farbe der Tooltip-Footer
        }
      }
    }
  });

  // Fallback: Setze die Größe des Canvas-Elements nach dem Rendern zurück
  const canvas = document.getElementById("statsChart");
  canvas.style.width = "95%";
  //canvas.style.minwidth = "1459px";
  canvas.style.height = "350px";
  canvas.style.display = "flex";

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

    // Neue API-Anfrage für die Evolutionskette
    const evolutionChainResponse = await fetch(speciesData.evolution_chain.url);
    const evolutionChainData = await evolutionChainResponse.json();

    // Fähigkeiten und Habitat aus den Haupt- und Speziesdaten extrahieren
    const abilities = pokemonData.abilities.map(abilityInfo => abilityInfo.ability.name).join(", ");
    const habitat = speciesData.habitat ? speciesData.habitat.name : "Unknown";
    const genderRate = speciesData.gender_rate;
    const captureRate = speciesData.capture_rate;

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
      genderDistribution = `&#9792 ${femalePercentage}% &#9794 ${malePercentage}% `;
    }

    // Evolutionskette parsen
    const evolutions = parseEvolutionChain(evolutionChainData.chain);

    // Anzeige der abgerufenen Daten
    renderPokemonDetails({
      name: pokemonData.name,
      abilities,
      habitat,
      flavorText,
      genderDistribution,
      captureRate,
      types: pokemonData.types,
      stats: pokemonData.stats,
      evolutions
    });
  } catch (error) {
    console.error("Fehler beim Laden der Pokémon-Daten:", error);
  }
}

// Funktion zum Parsen der Evolutionskette
function parseEvolutionChain(chain) {
  const evolutions = [];
  let currentStage = chain;

  do {
    evolutions.push({
      name: currentStage.species.name,
      url: currentStage.species.url
    });
    currentStage = currentStage.evolves_to[0];
  } while (currentStage && currentStage.hasOwnProperty("evolves_to"));

  return evolutions;
}


function renderPokemonDetails(details) {

  document.getElementById("abilities").innerHTML = `<h4>Abilities</h4>
            <p>${details.abilities}</p>`;


  document.getElementById("habitat").innerHTML = ` <h4>Habitat</h4>
            <p>${details.habitat}</p>`;

  document.getElementById("flavor-text").innerText = details.flavorText;
  document.getElementById("gender-distribution").innerHTML = `<h4>Gender</h4>
            <p>${details.genderDistribution}</p>`;

  document.getElementById("capture-rate").innerHTML = `<h4>Capture rate</h4>
            <p>${details.captureRate}%</p>`;


  renderTypeButtons(details.types);
  renderBarChart(details.stats, details.types);
  renderEvolutionChain(details.evolutions);
  hideLoading();
}

// Funktion zum Rendern der Evolutionskette
function renderEvolutionChain(evolutions) {
  const container = document.querySelector(".container-evolution");
  container.innerHTML = ""; // Vorhandene Inhalte löschen

  // Erstelle einen Container für die gesamte Evolutionskette
  const evolutionWrapper = document.createElement("div");
  evolutionWrapper.classList.add("evolution-wrapper");

  // Erstelle und füge die Überschrift hinzu (außerhalb der Schleife)
  const headlineTagElement = document.createElement("h2");
  headlineTagElement.innerText = "Evolution";
  headlineTagElement.classList.add("headline-evolution");
  container.appendChild(headlineTagElement); // Füge die Überschrift dem Container hinzu

  evolutions.forEach((evolution, index) => {
    // Erstelle ein Container-Element für das Pokémon
    const evolutionElement = document.createElement("div");
    evolutionElement.classList.add("evolution-item");

    // Erstelle den Namen des Pokémon
    let pokemonName = evolution.name.charAt(0).toUpperCase() + evolution.name.slice(1);

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
      // Ersetze alle Vorkommen des Schlüssels (key) in pokemonName durch den Wert (value)
      pokemonName = pokemonName.replace(key, value);
    }

    // Füge den Text mit dem Pokémon-Namen hinzu
    const nameElement = document.createElement("p");
    nameElement.innerText = evolution.name.charAt(0).toUpperCase() + evolution.name.slice(1);
    evolutionElement.appendChild(nameElement);

    // Extrahiere die ID des Pokémon aus der URL
    const pokeID = evolution.url.split("/")[evolution.url.split("/").length - 2];

    // Füge den Text mit der Pokémon-ID hinzu, formatiert mit führender Null
    const idElement = document.createElement("p");
    idElement.innerText = `#${pokeID.padStart(3, "0")}`; // ID mit führender Null
    idElement.classList.add("pokemon-id");
    evolutionElement.appendChild(idElement);

    // Erstelle einen <a>-Tag um das Bild verlinkbar zu machen
    const linkElement = document.createElement("a");
    linkElement.href = `${baseURL}/details.html?pokemon=/${evolution.name}`; // Link zur Pokémon-Seite
    linkElement.target = "_blank"; // Öffnet den Link in einem neuen Tab

    // Füge das Bild des Pokémon hinzu
    const imgElement = document.createElement("img");
    imgElement.src = `http://static.pokemonpets.com/images/monsters-images-300-300/${pokeID}-${pokemonName}.webp`;
    imgElement.alt = evolution.name.charAt(0).toUpperCase() + evolution.name.slice(1);
    imgElement.classList.add("evolution-image");

    // Füge das Bild dem Evolutionselement hinzu
    linkElement.appendChild(imgElement);

    // Füge den Link (mit dem Bild) dem Evolutionselement hinzu
    evolutionElement.appendChild(linkElement);


    // Füge das Evolutionselement dem Wrapper hinzu
    evolutionWrapper.appendChild(evolutionElement);

    // Falls dies nicht das letzte Element ist, füge einen Pfeil hinzu
    if (index < evolutions.length - 1) {
      const arrowElement = document.createElement("span");
      arrowElement.classList.add("evolution-arrow");
      arrowElement.innerHTML = "<img src='right-arrow-next-svgrepo-com.svg' alt='Arrow'>"; // Verwende einen Textpfeil
      evolutionWrapper.appendChild(arrowElement);
    }
  });

  // Füge den Wrapper dem Container hinzu
  container.appendChild(evolutionWrapper);
}
