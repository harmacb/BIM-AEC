let glossaryData = [];  // Store original glossary data for easy resetting

// Main function to load the glossary JSON data
async function loadGlossary() {
    try {
        const response = await fetch('data/bim-glossary.json');
        if (!response.ok) throw new Error(`Failed to load glossary data. Status: ${response.status} - ${response.statusText}`);

        const glossary = await response.json();
        glossaryData = glossary;  // Save full glossary data for searching and filtering

        // Count occurrences of each term
        const termCounts = glossary.reduce((acc, term) => {
            acc[term.term] = (acc[term.term] || 0) + 1;
            return acc;
        }, {});

        displayGlossary(glossary, termCounts);
    } catch (error) {
        console.error("Error details:", error);
        document.getElementById('glossary-container').innerHTML = 'Error loading glossary. Check console for details.';
    }
}

// Function to filter glossary by term and redisplay results
function filterGlossaryByTerm(selectedTerm) {
    const filteredGlossary = glossaryData.filter(item => item.term === selectedTerm);

    // Recalculate term counts for filtered view (all will be same term)
    const termCounts = filteredGlossary.reduce((acc, term) => {
        acc[term.term] = (acc[term.term] || 0) + 1;
        return acc;
    }, {});

    displayGlossary(filteredGlossary, termCounts);
}

// Display function to render glossary terms on the page
function displayGlossary(glossary, termCounts) {
    const container = document.getElementById('glossary-container');
    container.innerHTML = '';  // Clear previous entries

    glossary.forEach(term => {
        const termElement = document.createElement('div');
        termElement.classList.add('term');

        // Title and other fields
        const title = document.createElement('h3');
        title.innerHTML = `<strong>${term.term} ${term.version ? `(v${term.version})` : ''}</strong>`;
        
        const definition = document.createElement('p');
        definition.innerHTML = `<strong>Definition:</strong> ${term.definition || 'No definition available.'}`;
        
        const category = document.createElement('p');
        category.innerHTML = `<strong>Category:</strong> ${term.category || 'No category available.'}`;

        const usage = document.createElement('p');
        usage.innerHTML = `<strong>Usage:</strong> ${term.usage || 'No usage information available.'}`;

        termElement.appendChild(title);
        termElement.appendChild(definition);
        termElement.appendChild(category);
        termElement.appendChild(usage);

        // Add notes and citation conditionally
        if (term.notes) {
            const notesElement = document.createElement('p');
            notesElement.innerHTML = `<strong>Notes:</strong> ${term.notes}`;
            termElement.appendChild(notesElement);
        }

        if (term.citation) {
            const citation = document.createElement('p');
            citation.innerHTML = `<strong>Citation:</strong> ${term.citation.author || 'Unknown author'}, "${term.citation.title || 'Unknown title'}", ${term.citation.publisher || 'Unknown publisher'}, ${term.citation.year || 'Unknown year'}, ${term.citation.source || 'No source available'}.
            <br><em>Filename:</em> ${term.citation.filename || 'No filename available.'}`;
            termElement.appendChild(citation);
        }

        // Add link to view all definitions if the term appears more than once
        if (termCounts[term.term] > 1) {
            const link = document.createElement('a');
            link.href = `#`;  // Prevent page jump by keeping href="#"
            link.innerText = `See all definitions for ${term.term}`;
            link.classList.add('see-all-link');
            
            // Add an event listener to filter glossary by the term when clicked
            link.addEventListener('click', (event) => {
                event.preventDefault();
                filterGlossaryByTerm(term.term);  // Call the filter function with the term
            });
            
            termElement.appendChild(link);
        }

        container.appendChild(termElement);
    });
}

// Function to filter glossary by term
function filterGlossaryByTerm(term) {
    // Filter glossary items by the selected term and re-render
    const container = document.getElementById('glossary-container');
    const glossary = JSON.parse(localStorage.getItem('glossary'));  // Assume glossary data stored in localStorage
    const filteredGlossary = glossary.filter(item => item.term === term);

    displayGlossary(filteredGlossary, {[term]: filteredGlossary.length});  // Only display filtered terms
}

// Store glossary in localStorage for easy access in filtering
document.addEventListener('DOMContentLoaded', () => {
    loadGlossary().then(glossary => localStorage.setItem('glossary', JSON.stringify(glossary)));
});
