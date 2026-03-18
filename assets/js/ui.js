const TYPE_COLORS = {
	fire: 'bg-orange-400',
	water: 'bg-blue-400',
	grass: 'bg-green-400',
	electric: 'bg-yellow-300',
	psychic: 'bg-purple-400',
	ice: 'bg-cyan-200',
	dragon: 'bg-indigo-500',
	ghost: 'bg-indigo-700',
	dark: 'bg-gray-700',
	steel: 'bg-gray-400',
	fairy: 'bg-pink-300',
	normal: 'bg-gray-300',
	fighting: 'bg-red-700',
	flying: 'bg-sky-300',
	poison: 'bg-fuchsia-600',
	ground: 'bg-amber-600',
	rock: 'bg-stone-500',
	bug: 'bg-lime-500',
};

export function createSkeletonCard() {
	return `
        <div class="bg-gray-200 p-4 rounded-2xl shadow-md animate-pulse">
            <div class="w-10 h-4 bg-gray-300 rounded ml-auto mb-2"></div>
            <div class="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <div class="w-24 h-6 bg-gray-300 rounded mx-auto mb-2"></div>
            <div class="w-20 h-4 bg-gray-300 rounded mx-auto"></div>
        </div>
    `;
}

export function renderEmptySearch(message = 'Покемонів не знайдено') {
	return `
        <div class="col-span-full text-center py-20">
            <div class="text-6xl mb-4">🔍</div>
            <p class="text-xl text-gray-500 font-medium">${message}</p>
            <p class="text-sm text-gray-400 mt-2">Спробуйте змінити запит або фільтр</p>
        </div>
    `;
}

export function createPokemonCard(pokemon) {
	const primaryType = pokemon.types[0].type.name;
	const bgColor = TYPE_COLORS[primaryType] || 'bg-white';
	return `
        <div class="pokemon-card ${bgColor} p-4 rounded-2xl shadow-md cursor-pointer transform transition hover:scale-105" data-id="${pokemon.id}">
            <p class="text-right font-bold opacity-50 text-sm">#${String(pokemon.id).padStart(3, '0')}</p>
            <img class="w-32 h-32 mx-auto drop-shadow-lg" src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
            <h3 class="text-xl font-bold capitalize text-center mt-2">${pokemon.name}</h3>
			<div class="flex justify-center gap-1 mt-1 text-xs font-bold opacity-60">
                ${pokemon.types.map(t => `<span>${t.type.name}</span>`).join(' • ')}
            </div>
        </div>
    `;
}

export function renderDetails(pokemon, evolutionData) {
	const primaryType = pokemon.types[0].type.name;
	const bgColor = TYPE_COLORS[primaryType] || 'bg-red-600';
	const parseEvo = (chain, names = []) => {
		names.push(chain.species.name);
		if (chain.evolves_to.length > 0)
			return parseEvo(chain.evolves_to[0], names);
		return names;
	};

	const evoChain = parseEvo(evolutionData.chain).join(' → ');

	return `
        <div class="flex flex-col md:flex-row gap-8 items-start">
            <div class="w-full md:w-1/3 text-center">
                <img class="w-48 h-48 mx-auto" src="${pokemon.sprites.other['official-artwork'].front_default}">
                <h2 class="text-3xl font-bold capitalize mt-4">${pokemon.name}</h2>
				<div class="flex justify-center gap-1 mt-1 text-xs font-bold opacity-60">
                ${pokemon.types.map(t => `<span>${t.type.name}</span>`).join(' • ')}
            </div>
            </div>
            <div class="w-full md:w-2/3">
                <h4 class="font-bold mb-3 uppercase text-gray-500">Stats</h4>
                <div class="space-y-3">
                    ${pokemon.stats
											.map(
												s => `
                        <div class="text-xs font-bold uppercase">${s.stat.name}: ${s.base_stat}</div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="${bgColor} h-2 rounded-full" style="width: ${Math.min((s.base_stat / 150) * 100, 100)}%"></div>
                        </div>
                    `,
											)
											.join('')}
                </div>
				<div class="mt-6 text-sm">
                    <h4 class="font-bold mb-1 uppercase text-gray-500 text-xs">Abilities</h4>
                    <p class="capitalize">${pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
                </div>
                <div class="mt-6 p-3 bg-gray-50 rounded-lg">
                    <h4 class="font-bold text-xs uppercase text-gray-400 mb-1">Evolution Path</h4>
                    <p class="capitalize font-medium text-sm">${evoChain}</p>
                </div>
            </div>
        </div>
    `;
}
