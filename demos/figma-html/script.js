const button = document.querySelector('.item-button');

button.addEventListener('click', function () {
  // https://pokeapi.co/api/v2/pokemon/ditto
  fetch('https://pokeapi.co/api/v2/pokemon/ditto')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const name = data.name;
      const imageUrl = data.sprites.front_default;
      const pokemonInfo = document.querySelector('.pokemon-info');
      pokemonInfo.innerHTML = `
        <h2>${name}</h2>
        <img src="${imageUrl}" alt="${name}">
      `;
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});