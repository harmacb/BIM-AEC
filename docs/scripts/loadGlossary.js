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
        // Create a container for each term entry
        const termElement = document.createElement('div');
        termElement.classList.add('term');

        // Display the term and version
        const title = document.createElement('h3');
        title.innerHTML = `<strong>${term.term} ${term.version ? `(v${term.version})` : ''}</strong>`;
        
        // Display definition
        const definition = document.createElement('p');
        definition.innerHTML = `<strong>Definition:</strong> ${term.definition || 'No definition available.'}`;
        
        // Display category
        const category = document.createElement('p');
        category.innerHTML = `<strong>Category:</strong> ${term.category || 'No category available.'}`;
        
        // Display usage if present
        const usage = document.createElement('p');
        usage.innerHTML = `<strong>Usage:</strong> ${term.usage || 'No usage information available.'}`;

        // Display notes if they exist
        if (term.notes) {
            const notesElement = document.createElement('p');
            notesElement.innerHTML = `<strong>Notes:</strong> ${term.notes}`;
            termElement.appendChild(notesElement);
        }

        // Display citation details if they exist
        if (term.citation) {
            const citation = document.createElement('p');
            citation.innerHTML = `
                <strong>Citation:</strong> ${term.citation.author || 'Unknown author'}, 
                "${term.citation.title || 'Unknown title'}", 
                ${term.citation.publisher || 'Unknown publisher'}, 
                ${term.citation.year || 'Unknown year'}, 
                ${term.citation.source || 'No source available'}.
                <br><em>Filename:</em> ${term.citation.filename || 'No filename available.'}
            `;
            termElement.appendChild(citation);
        }

        // Append all elements in the correct order
        termElement.appendChild(title);
        termElement.appendChild(definition);
        termElement.appendChild(category);
        termElement.appendChild(usage);

        // Finally, add the term element to the container
        container.appendChild(termElement);
    });
}


// Call the loadGlossary function when the page loads
window.onload = loadGlossary;
