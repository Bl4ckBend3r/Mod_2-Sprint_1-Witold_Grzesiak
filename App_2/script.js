const container = document.getElementById("character-container");
const searchInput = document.querySelector(".search-input");
const statusRadios = document.querySelectorAll('input[name="status"]');
const noResults = document.getElementById("no-results");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const form = document.getElementById("character-form");

let currentPage = 1;
let currentSearch = "";
let currentStatus = "Alive";
const limit = 5;

const API_URL = "http://localhost:3000/characters";

const fetchCharacters = async () => {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const filtered = data.filter((char) =>
      char.name.toLowerCase().includes(currentSearch.toLowerCase()) &&
      char.status.toLowerCase() === currentStatus.toLowerCase()
    );

    const totalCount = filtered.length;
    const paginated = filtered.slice((currentPage - 1) * limit, currentPage * limit);

    displayCharacters(paginated);
    noResults.style.display = paginated.length ? "none" : "block";

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage >= Math.ceil(totalCount / limit);
  } catch (err) {
    console.error("Błąd:", err);
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
      <button onclick="deleteCharacter(${char.id})">Usuń postać</button>
    `;
    container.appendChild(card);
  });
};

const deleteCharacter = async (id) => {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  fetchCharacters();
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

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  const res = await fetch(API_URL);
  const existing = await res.json();
  const maxId = Math.max(...existing.map((char) => char.id), 0);

  const newCharacter = {
    id: maxId + 1,
    name: formData.get("name"),
    status: formData.get("status"),
    species: formData.get("species"),
    image: "https://rickandmortyapi.com/api/character/avatar/3.jpeg"
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCharacter)
  });

  form.reset();
  fetchCharacters();
});

fetchCharacters();
