const container = document.getElementById("character-container");
const searchInput = document.querySelector(".search-input");
const statusRadios = document.querySelectorAll('input[name="status"]');
const noResults = document.getElementById("no-results");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

let currentPage = 1;
let currentSearch = "";
let currentStatus = "alive";

const fetchCharacters = async () => {
  const url = `https://rickandmortyapi.com/api/character/?page=${currentPage}&name=${currentSearch}&status=${currentStatus}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Brak wyników");
    const data = await res.json();

    displayCharacters(data.results);
    noResults.style.display = "none";

    // Disable/enable buttons
    prevBtn.disabled = !data.info.prev;
    nextBtn.disabled = !data.info.next;
  } catch (err) {
    container.innerHTML = "";
    noResults.style.display = "block";
    prevBtn.disabled = true;
    nextBtn.disabled = true;
  }
};

const displayCharacters = (characters) => {
  container.innerHTML = "";

  characters.forEach((char) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${char.image}" alt="${char.name}" />
      <h3>${char.name}</h3>
      <p>Status: ${char.status}</p>
      <p>Gatunek: ${char.species}</p>
    `;
    container.appendChild(card);
  });
};

searchInput.addEventListener("input", (e) => {
  currentSearch = e.target.value;
  currentPage = 1;
  fetchCharacters();
});

statusRadios.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    currentStatus = e.target.value;
    currentPage = 1;
    fetchCharacters();
  });
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchCharacters();
  }
});

nextBtn.addEventListener("click", () => {
  currentPage++;
  fetchCharacters();
});

fetchCharacters(); 
