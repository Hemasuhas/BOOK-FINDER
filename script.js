const API_BASE = 'https://openlibrary.org/search.json';
const COVERS_BASE = 'https://covers.openlibrary.org/b/id/';

const form = document.getElementById('search-form');
const queryInput = document.getElementById('query');
const resultsEl = document.getElementById('results');
const statusEl = document.getElementById('status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = queryInput.value.trim();
  if (!query) return;
  searchBooks(query);
});

async function searchBooks(query) {
  resultsEl.innerHTML = '';
  statusEl.textContent = 'Searching...';

  try {
    const response = await fetch(`${API_BASE}?title=${encodeURIComponent(query)}&limit=20`);
    const data = await response.json();

    if (data.docs.length === 0) {
      statusEl.textContent = 'No results found.';
      return;
    }

    statusEl.textContent = `Found ${data.numFound} results`;

    data.docs.forEach((book) => {
      const card = document.createElement('div');
      card.classList.add('card');

      const coverDiv = document.createElement('div');
      coverDiv.classList.add('cover');
      const img = document.createElement('img');
      img.src = book.cover_i
        ? `${COVERS_BASE}${book.cover_i}-M.jpg`
        : 'https://via.placeholder.com/70x100?text=No+Cover';
      coverDiv.appendChild(img);

      const infoDiv = document.createElement('div');
      infoDiv.classList.add('info');

      const title = document.createElement('a');
      title.classList.add('title');
      title.href = `https://openlibrary.org${book.key}`;
      title.target = '_blank';
      title.textContent = book.title;

      const authors = document.createElement('p');
      authors.classList.add('authors');
      authors.textContent =
        book.author_name ? book.author_name.join(', ') : 'Unknown author';

      infoDiv.appendChild(title);
      infoDiv.appendChild(authors);

      card.appendChild(coverDiv);
      card.appendChild(infoDiv);

      resultsEl.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    statusEl.textContent = 'Error fetching results. Try again.';
  }
}
