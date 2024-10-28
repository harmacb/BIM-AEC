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

        // Display term and definition
        const title = document.createElement('h3');
        title.innerText = `${term.term} (v${term.version})`;
        
        const definition = document.createElement('p');
        definition.innerText = `Definition: ${term.definition}`;

        // Additional fields
        const category = document.createElement('p');
        category.innerText = `Category: ${term.category}`;

        const usage = document.createElement('p');
        usage.innerText = `Usage: ${term.usage}`;

        if (term.notes) {
            const notes = document.createElement('p');
            notes.innerText = `Notes: ${term.notes}`;
            termElement.appendChild(notes);
        }

        // Display related terms
        if (term.related_terms && term.related_terms.length > 0) {
            const related = document.createElement('p');
            related.innerText = `Related Terms: ${term.related_terms.join(', ')}`;
            termElement.appendChild(related);
        }

        // Display citation details if available
        if (term.citation) {
            const citation = document.createElement('p');
            citation.innerHTML = `
                <strong>Citation:</strong> ${term.citation.author}, "${term.citation.title}", ${term.citation.publisher}, ${term.citation.year}, ${term.citation.source}. <br>
                <em>Filename:</em> ${term.citation.filename}
            `;
            termElement.appendChild(citation);
        }

        // Append everything to the term container
        termElement.appendChild(title);
        termElement.appendChild(definition);
        termElement.appendChild(category);
        termElement.appendChild(usage);
        
        container.appendChild(termElement);
    });
}

// Call the loadGlossary function when the page loads
window.onload = loadGlossary;

