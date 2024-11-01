let glossaryData = [];  // Store original glossary data for easy resetting
let globalTermCounts = {};  // Store term counts for the entire glossary

async function loadGlossary() {
    try {
        const response = await fetch('data/bim-glossary.json');
        if (!response.ok) throw new Error(`Failed to load glossary data. Status: ${response.status} - ${response.statusText}`);

        const glossary = await response.json();
        glossaryData = glossary;

        // Calculate term counts for the entire glossary and store it in globalTermCounts
        globalTermCounts = glossary.reduce((acc, term) => {
            acc[term.term] = (acc[term.term] || 0) + 1;
            return acc;
        }, {});

        // Populate the publisher dropdown and display the full glossary
        populatePublisherDropdown(glossary);
        displayGlossary(glossary, globalTermCounts);
    } catch (error) {
        console.error("Error details:", error);
        document.getElementById('glossary-container').innerHTML = 'Error loading glossary. Check console for details.';
    }
}

function populatePublisherDropdown(glossary) {
    const publisherDropdown = document.getElementById('publisher-filter');
    const uniquePublishers = new Set();
    glossary.forEach(term => {
        if (term.citation && term.citation.publisher) {
            uniquePublishers.add(term.citation.publisher);
        }
    });

    Array.from(uniquePublishers).sort().forEach(publisher => {
        const option = document.createElement('option');
        option.value = publisher;
        option.textContent = publisher;
        publisherDropdown.appendChild(option);
    });
}

function filterByPublisher() {
    const selectedPublisher = document.getElementById('publisher-filter').value;
    const filteredGlossary = selectedPublisher
        ? glossaryData.filter(term => term.citation && term.citation.publisher === selectedPublisher)
        : glossaryData;

    const termCounts = filteredGlossary.reduce((acc, term) => {
        acc[term.term] = (acc[term.term] || 0) + 1;
        return acc;
    }, {});

    displayGlossary(filteredGlossary, termCounts);
}

// Filter Glossary and Search Glossary
function filterGlossaryByTerm(selectedTerm) {
    console.log(`Filtering by term: ${selectedTerm}`);  // Debugging statement

    const filteredGlossary = glossaryData.filter(item => item.term === selectedTerm);

    if (filteredGlossary.length === 0) {
        console.log(`No entries found for term: ${selectedTerm}`);  // Debugging statement
    } else {
        console.log(`Found ${filteredGlossary.length} entries for term: ${selectedTerm}`);  // Debugging statement
    }

    const termCounts = filteredGlossary.reduce((acc, term) => {
        acc[term.term] = (acc[term.term] || 0) + 1;
        return acc;
    }, {});

    displayGlossary(filteredGlossary, globalTermCounts);
}

function searchGlossary() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const filteredGlossary = glossaryData.filter(term => term.term.toLowerCase().includes(query));
    const termCounts = filteredGlossary.reduce((acc, term) => {
        acc[term.term] = (acc[term.term] || 0) + 1;
        return acc;
    }, {});

    displayGlossary(filteredGlossary, globalTermCounts);
}

// Display function to render glossary terms on the page
function displayGlossary(glossary, termCounts) {
    const container = document.getElementById('glossary-container');
    container.innerHTML = '';  // Clear previous entries

    // Sort glossary alphabetically by term name
    glossary.sort((a, b) => a.term.localeCompare(b.term));

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

        // Use globalTermCounts to determine if "See all definitions" link should appear
        if (globalTermCounts[term.term] > 1) {
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

// loadGlossary is called on page load
window.onload = loadGlossary;

function resetGlossary() {
    // Clear the search bar input
    document.getElementById('search-bar').value = '';

    // Recalculate term counts for the full glossary
    const termCounts = glossaryData.reduce((acc, term) => {
        acc[term.term] = (acc[term.term] || 0) + 1;
        return acc;
    }, {});

    // Display the full glossary
    displayGlossary(glossaryData, termCounts);
}
