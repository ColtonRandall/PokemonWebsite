/* Base address for the Pokemon endpoints. Add the endpoint name and parameters onto this */
const ENDPOINT_BASE_URL = "https://trex-sandwich.com/pokesignment/";


/* TODO: Your code here */

window.addEventListener("load", function () {


    // Universal variables 
    const imageURL = "https://trex-sandwich.com/pokesignment/img/";
    const mainPokemonURL = "https://trex-sandwich.com/pokesignment/pokemon?pokemon=";
    const mainColumnContainer = document.querySelector(".pokemonPanels");


    // Function calls
    displayPokemonPanels();
    fetchPokeOfDay();
    showDetailsButton();
    getRandomPokemon();


    // ------------------ MENU BUTTONS (Left column) -------------- 

    async function getRandomPokemon() {
        let response = await fetch("https://trex-sandwich.com/pokesignment/pokemon?random=random");
        let randomPokemon = await response.json();
        return randomPokemon;
    }

    // ---- LOAD RANDOM POKEMON BUTTON ----
    let randomPokemonButton = document.querySelector("#loadRandomPokemon");
    randomPokemonButton.addEventListener("click", function () {

        let random = getRandomPokemon();
        createMain(random);

    });




    // ---- SHOW LIST BUTTON ----
    let showListButton = document.querySelector("#showList");

    showListButton.addEventListener("click", function () {

        mainColumnContainer.innerHTML = "";
        displayPokemonPanels();
    });



    // ---- SHOW DETAILS BUTTON ----
    async function showDetailsButton() {

        let showDetailsButton = document.querySelector("#showDetails");
        showDetailsButton.addEventListener("click", function () {

            mainColumnContainer.innerHTML = "";

            createMain(fetchPokeOfDay());

        })

    }



    // ------------------ POKEMON DETAILS (Middle column) -------------- 


    // Create function that loads clickable pokemon panels
    async function displayPokemonPanels() {

        // retrieve array of pokemon names
        let response = await fetch(`https://trex-sandwich.com/pokesignment/pokemon`);
        pokemonNamesArray = await response.json();

        // loop through array and append onto specific pokemon endpoint
        for (let i = 0; i < pokemonNamesArray.length; i++) {

            let nameResponse = await fetch(mainPokemonURL + `${pokemonNamesArray[i]}`);

            // Create a new pokemon object to access tags
            pokemonObject = await nameResponse.json();


            // Create the panel for each pokemon
            mainColumnContainer.innerHTML += `
    
                <div class="panelImage" id="${pokemonObject.name}">
                    <img src="${imageURL + pokemonObject.image}"/>
                    <h4>${pokemonObject.name}</h4>
                </div>
            `
        }
        clickablePanels();
    }


    async function createMain(pokemon) {

        // remove all HTML elements
        mainColumnContainer.innerHTML = "";


        // ------ FETCH MAIN POKEMON DETAILS -------- 
        let response = await fetch(mainPokemonURL + `${pokemon.id}`);
        let pokemonObjectJS = await response.json();


        // ---------------- FETCH WEAK AGAINST IMAGES --------------
        let weakResponse = await fetch(mainPokemonURL + `${pokemonObjectJS.opponents.weak_against[0]}`);
        let weakAgainst = await weakResponse.json();

        const weakAgainstImage = weakAgainst.image;


        let weakResponse2 = await fetch(mainPokemonURL + `${pokemonObjectJS.opponents.weak_against[1]}`);
        let weakAgainst2 = await weakResponse2.json();

        const weakAgainstImage2 = weakAgainst2.image;


        // ------------- FETCH STRONG AGAINST IMAGES --------------
        let strongResponse = await fetch(mainPokemonURL + `${pokemonObjectJS.opponents.strong_against[0]}`);
        let strongAgainst = await strongResponse.json();

        const strongAgainstImage = strongAgainst.image;

        let strongResponse2 = await fetch(mainPokemonURL + `${pokemonObjectJS.opponents.strong_against[1]}`);
        let strongAgainst2 = await strongResponse2.json();

        const strongAgainstImage2 = strongAgainst2.image;




        // -------- ADD CODE FOR NEW COLUMN DESIGN --------
        mainColumnContainer.innerHTML +=

            `
    <div class="clickedPokemonDetails">  

      <div id="weakAgainst">
            Weak Against

          <div class="weak panelImage">
            <img src="${imageURL + weakAgainstImage}" id="weakImg"/>
            <p>${pokemonObjectJS.opponents.weak_against[0]}</P>
          </div>

          <div class="weak panelImage">      
            <img src="${imageURL + weakAgainstImage2}" id="weakImg"/>
            <p>${pokemonObjectJS.opponents.weak_against[1]}</p>
          </div>  
      </div>

        

      <div id="pokemonDetailsColumn">
            <h4>${pokemonObjectJS.name}</h4>
            <img src="${imageURL + pokemonObjectJS.image}"/>
            <p>${pokemonObjectJS.description}</p>
      

      <div id="skills">
            <div id="classList">
                Class List
                
            </div>

            <div id="sigMoves">
                Signature Moves
                <p>${pokemonObjectJS.signature_skills[0]}</p>
                <p>${pokemonObjectJS.signature_skills[1]}</p>

            </div>

      </div>
      </div> 
            
      <div id="strongAgainst">
            Strong Against

        <div class="strong panelImage">
            <img src="${imageURL + strongAgainstImage}" id="strongImg"/>
            <p>${pokemonObjectJS.opponents.strong_against[0]}</p>
        </div>

        <div class="strong panelImage">
            <img src="${imageURL + strongAgainstImage2}" id="strongImg"/>
            <p>${pokemonObjectJS.opponents.strong_against[1]}</p>
        </div>

      </div>

    </div> 
            `

        // loop through pokemon class list to add styles
        const classList = pokemonObjectJS.classes;

        // For each class in the list of classes 
        for (let classType of classList) {

            // Declare a container div to house the pokemon's classes
            let classListDiv = document.getElementById("classList");
            // Assign the asychronously fetched class colours to a local variable
            let colours = await (getClassColours(classType));
            // Create a new paragraph element
            let para = document.createElement('p');

            para.innerText = classType;

            // Retrieve both background and font colours from pokemon endpoints
            para.style.backgroundColor = colours.background;
            para.style.color = colours.foreground;

            // Add the div to the paragraph
            classListDiv.appendChild(para);

        }

        // Make 'Strong and Weak Against' panels clickable
        clickablePanels();

    }



    // ------------- FETCH ENDPOINT COLOURS (CLASSLIST SECTION) --------------
    async function getClassColours(className) {
        let classResponse = await fetch("https://trex-sandwich.com/pokesignment/keyword?keyword=" + className);
        let classColours = await classResponse.json();
        return classColours;
    }



    // ------------------- CLICKABLE PANELS --------------------
    async function clickablePanels() {

        let pokemonObjectArray = document.querySelectorAll(".panelImage");


        // Iterate through each element in pokemon array
        pokemonObjectArray.forEach((pokemon) => {

            pokemon.addEventListener("click", () => {

                createMain(pokemon);

            });

        });

    }



    // ------------------ POKEMON OF THE DAY (Right column) -------------- 


    // Fetch random pokemon info
    async function fetchPokeOfDay() {
        const randomResponse = await fetch("https://trex-sandwich.com/pokesignment/pokemon?random=random");
        const randomPokemon = await randomResponse.json();

        // Image element
        const pokemonOfDayImage = document.createElement("img");
        pokemonOfDayImage.src = imageURL + randomPokemon.image;
        displayRandomPokemon(randomPokemon);


        // Change HTML content on page
        function displayRandomPokemon(randomPokemon) {

            // Image
            const pokeImage = document.querySelector("#podImage");
            pokeImage.innerHTML = "";
            pokeImage.appendChild(pokemonOfDayImage);

            // Name
            const pokemonName = document.querySelector("#podName");
            pokemonName.innerHTML = randomPokemon.name;

            // Details
            const pokemonDetails = document.querySelector("#podDetails");
            pokemonDetails.innerHTML = randomPokemon.description;

        }
    }

    // Make pokemonOfDayImage clickable to refresh the pokemon of the day
    const pokemonOfDayButton = document.querySelector("#podImage");
    pokemonOfDayButton.addEventListener("click", function () {

        fetchPokeOfDay();

    });

});

