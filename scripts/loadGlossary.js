// loadGlossary.js

// Function to load the glossary JSON data
async function loadGlossary() {
    try {
        // Fetch glossary data from the JSON file
        const response = await fetch('data/bim-glossary.json');
        
        // Check if the response is OK
        if (!response.ok) throw new Error('Failed to load glossary data.');

        // Parse the JSON data
        const glossary = await response.json();

        // Display the data on the page
        displayGlossary(glossary);
    } catch (error) {
        console.error(error);
        document.getElementById('glossary-container').innerHTML = 'Error loading glossary.';
    }
}

// Function to display the glossary data in HTML
function displayGlossary(glossary) {
    const container = document.getElementById('glossary-container');
    glossary.forEach(term => {
        // Create HTML elements for each term
        const termElement = document.createElement('div');
        termElement.classList.add('term');

        const title = document.createElement('h3');
        title.innerText = term.term;

        const definition = document.createElement('p');
        definition.innerText = term.definition;

        // Append the term and definition to the container
        termElement.appendChild(title);
        termElement.appendChild(definition);
        container.appendChild(termElement);
    });
}

// Call the loadGlossary function when the page loads
window.onload = loadGlossary;
