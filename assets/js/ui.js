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

export function createSkeletonDetailsCard() {
	return `
    <div class="flex flex-col md:flex-row gap-8 items-start animate-pulse">
        <div class="w-full md:w-1/3 text-center">
            <div class="w-48 h-48 mx-auto bg-gray-200 rounded-full"></div>
            <div class="h-8 bg-gray-200 rounded mt-4 w-1/3 mx-auto"></div>
            <div class="flex justify-center gap-2 mt-2">
                <div class="h-3 w-10 bg-gray-200 rounded"></div>
            </div>
        </div>
        <div class="w-full md:w-2/3">
            <div class="h-4 w-20 bg-gray-200 rounded mb-3"></div>
            <div class="space-y-3">
                ${Array.from({ length: 5 })
									.map(
										() => `
                    <div>
                        <div class="h-3 w-24 bg-gray-200 rounded mb-3"></div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-gray-300 h-2 rounded-full w-2/3"></div>
                        </div>
                    </div>
                `,
									)
									.join('')}
            </div>
            <div class="mt-6">
                <div class="h-3 w-24 bg-gray-200 rounded mb-2"></div>
                <div class="h-4 w-2/3 bg-gray-200 rounded"></div>
            </div>
            <div class="mt-6 p-3 bg-gray-100 rounded-lg">
                <div class="h-3 w-28 bg-gray-200 rounded mb-2"></div>
                <div class="h-4 w-1/2 bg-gray-200 rounded"></div>
            </div>
        </div>
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

	const img =
		pokemon.sprites.other['official-artwork']?.front_default ??
		'assets/img/no_image.png';

	return `
        <div class="pokemon-card ${bgColor} p-4 rounded-2xl shadow-md cursor-pointer transform transition hover:scale-105" data-id="${pokemon.id}" data-speciesurl="${pokemon.species.url}">
            <p class="text-right font-bold opacity-50 text-sm">#${pokemon.id}</p>
            <img class="w-32 h-32 mx-auto drop-shadow-lg" src="${img}" alt="${pokemon.name}">
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

	const img =
		pokemon.sprites.other['official-artwork']?.front_default ??
		'assets/img/no_image.png';

	const evoChain = parseEvo(evolutionData.chain).join(' → ');

	return `
        <div class="flex flex-col md:flex-row gap-8 items-start">
            <div class="w-full md:w-1/3 text-center">
                <p class="text-left font-bold opacity-50 text-sm">#${pokemon.id}</p>
                <img class="w-48 h-48 mx-auto" src="${img}">
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
