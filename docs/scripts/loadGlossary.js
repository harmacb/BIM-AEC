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

// Function to display the glossary data in HTML with updated formatting
function displayGlossary(glossary) {
    const container = document.getElementById('glossary-container');
    glossary.forEach(term => {
        // Create HTML elements for each term
        const termElement = document.createElement('div');
        termElement.classList.add('term');

        // Format the term title and version
        const title = document.createElement('h3');
        title.innerHTML = `<strong>${term.term} (v${term.version})</strong>`;
        
        // Add definition
        const definition = document.createElement('p');
        definition.innerHTML = `<strong>Definition:</strong> ${term.definition}`;

        // Add category
        const category = document.createElement('p');
        category.innerHTML = `<strong>Category:</strong> ${term.category}`;

        // Add usage
        const usage = document.createElement('p');
        usage.innerHTML = `<strong>Usage:</strong> ${term.usage}`;

        // Add notes if available
        if (term.notes) {
            const notes = document.createElement('p');
            notes.innerHTML = `<strong>Notes:</strong> ${term.notes}`;
            termElement.appendChild(notes);
        }

        // Add citation details if available
        if (term.citation) {
            const citation = document.createElement('p');
            citation.innerHTML = `<strong>Citation:</strong> ${term.citation.author}, "${term.citation.title}", ${term.citation.publisher}, ${term.citation.year}, ${term.citation.source}.<br><em>Filename:</em> ${term.citation.filename}`;
            termElement.appendChild(citation);
        }

        // Append everything in the correct order to the term container
        termElement.appendChild(title);
        termElement.appendChild(definition);
        termElement.appendChild(category);
        termElement.appendChild(usage);

        // Only add notes and citation if they exist
        if (term.notes) termElement.appendChild(notes);
        if (term.citation) termElement.appendChild(citation);

        container.appendChild(termElement);
    });
}

// Call the loadGlossary function when the page loads
window.onload = loadGlossary;
