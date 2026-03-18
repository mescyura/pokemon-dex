import * as api from './api.js';
import * as ui from './ui.js';

let allNamesIndex = [];
let displayedPokemons = [];
let typePool = [];
let offset = 0;
const LIMIT = 20;
let isLoading = false;
let currentMode = 'all';

const gallery = document.getElementById('pokemonGallery');
const searchInput = document.getElementById('searchInput');
const typeFilter = document.getElementById('typeFilter');
const modal = document.getElementById('modalOverlay');
// const modalContent = document.getElementById('modalContent');

async function init() {
	const types = await api.fetchTypes();
	types.forEach(t => {
		const opt = document.createElement('option');
		opt.value = t.name;
		opt.textContent = t.name.toUpperCase();
		typeFilter.appendChild(opt);
	});
	allNamesIndex = await api.fetchAllPokemonNames();
	await loadMore();
}

async function loadMore() {
	if (isLoading || searchInput.value.trim() !== '') return;
	isLoading = true;

	// Створюємо тимчасовий контейнер для скелетонів пагінації
	const skeletonWrapper = document.createElement('div');
	skeletonWrapper.id = 'pagination-skeletons';
	skeletonWrapper.className = 'contents';
	skeletonWrapper.innerHTML = Array(LIMIT)
		.fill(ui.createSkeletonCard())
		.join('');
	gallery.appendChild(skeletonWrapper);

	try {
		let newData = [];
		if (currentMode === 'all') {
			newData = await api.fetchLimitPokemons(LIMIT, offset);
		} else {
			const slice = typePool.slice(offset, offset + LIMIT);
			newData = await api.fetchDetailsByUrls(slice);
		}

		// Видаляємо скелетони безпосередньо перед рендером даних
		skeletonWrapper.remove();

		displayedPokemons = [...displayedPokemons, ...newData];
		render(displayedPokemons);
		offset += LIMIT;
	} catch (error) {
		skeletonWrapper.remove();
		console.error('Помилка завантаження:', error);
	} finally {
		isLoading = false;
	}
}

async function handleSearch() {
	const query = searchInput.value.toLowerCase().trim();

	if (query === '') {
		render(displayedPokemons);
		return;
	}

	let matches = [];
	if (currentMode === 'all') {
		matches = allNamesIndex.filter(
			p =>
				p.name.includes(query) ||
				p.url.split('/').filter(Boolean).pop() === query,
		);
	} else {
		matches = typePool
			.filter(p => p.pokemon.name.includes(query))
			.map(p => p.pokemon);
	}

	if (matches.length === 0) {
		gallery.innerHTML = ui.renderEmptySearch(
			`За запитом "${query}" нічого не знайдено`,
		);
		return;
	}

	const limitedMatches = matches.slice(0, 20);
	gallery.innerHTML = ui.createSkeletonCard().repeat(limitedMatches.length);

	const detailedMatches = await api.fetchDetailsByUrls(limitedMatches);
	render(detailedMatches);
}

function render(list) {
	if (!list || list.length === 0) {
		gallery.innerHTML = ui.renderEmptySearch();
		return;
	}
	gallery.innerHTML = list.map(p => ui.createPokemonCard(p)).join('');
}

// Фільтрація
typeFilter.addEventListener('change', async () => {
	const type = typeFilter.value;
	gallery.innerHTML = '';
	displayedPokemons = [];
	offset = 0;
	searchInput.value = '';

	if (type === 'all') {
		currentMode = 'all';
	} else {
		currentMode = 'type';
		const data = await api.fetchTypeData(type);
		typePool = data.pokemon;
	}
	loadMore();
});

searchInput.addEventListener('input', () => {
	clearTimeout(window.searchTimer);
	window.searchTimer = setTimeout(handleSearch, 400);
});

window.addEventListener('scroll', () => {
	if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
		loadMore();
	}
});

// МОДАЛЬНЕ ВІКНО
gallery.addEventListener('click', async e => {
	const card = e.target.closest('.pokemon-card');
	if (!card) return;

	modal.classList.remove('hidden');
	document.body.style.overflow = 'hidden'; // Забороняємо прокрутку фону
	document.getElementById('pokemonDetails').innerHTML =
		'<p class="text-center p-10">Завантаження...</p>';

	const [pokemon, evolutionData] = await Promise.all([
		api.fetchPokemonDetails(card.dataset.id),
		api.fetchEvolutionChain(card.dataset.id),
	]);
	document.getElementById('pokemonDetails').innerHTML = ui.renderDetails(
		pokemon,
		evolutionData,
	);
});

// ФУНКЦІЯ ЗАКРИТТЯ
const closeModal = () => {
	modal.classList.add('hidden');
	document.body.style.overflow = ''; // Повертаємо прокрутку
};

// Закриття по кнопці
document.getElementById('closeModal').onclick = closeModal;

// НОВЕ: Закриття при кліку поза межами контенту
modal.addEventListener('click', e => {
	// Якщо клікнули саме по overlay (фон), а не по modalContent чи його дітях
	if (e.target === modal) {
		closeModal();
	}
});

// НОВЕ: Закриття по клавіші Escape (додатковий UX)
document.addEventListener('keydown', e => {
	if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
		closeModal();
	}
});

init();
