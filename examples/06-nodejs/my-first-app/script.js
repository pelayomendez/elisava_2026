const button = document.getElementById("myButton");
button.addEventListener("click", function() {
    // https://pokeapi.co/api/v2/pokemon/ditto
    fetch("https://pokeapi.co/api/v2/pokemon/ditto")
        .then(response => response.json())
        .then(data => {
            console.log(data.name);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
});