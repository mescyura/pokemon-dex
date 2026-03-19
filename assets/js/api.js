const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchDetailsByUrls(urlList) {
	return await Promise.all(
		urlList.map(item =>
			fetch(item.url || item.pokemon.url).then(res => res.json()),
		),
	);
}

export async function fetchLimitPokemons(limit = 20, offset = 0) {
	const response = await fetch(
		`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
	);
	const data = await response.json();
	return await fetchDetailsByUrls(data.results);
}

export async function fetchAllPokemonNames() {
	const response = await fetch(`${BASE_URL}/pokemon?limit=10000`);
	const data = await response.json();
	return data.results;
}

export async function fetchTypes() {
	const response = await fetch(`${BASE_URL}/type`);
	const data = await response.json();
	return data.results;
}

export async function fetchTypeData(typeName) {
	const response = await fetch(`${BASE_URL}/type/${typeName.toLowerCase()}`);
	return await response.json();
}

export async function fetchPokemonDetails(idOrName) {
	const response = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
	return await response.json();
}

export async function fetchEvolutionChain(speciesUrl) {
	const speciesRes = await fetch(speciesUrl);
	const speciesData = await speciesRes.json();
	const evoRes = await fetch(speciesData.evolution_chain.url);
	return await evoRes.json();
}
