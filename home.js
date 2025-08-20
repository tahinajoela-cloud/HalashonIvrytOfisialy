// Sidebar (aside)
const aside = document.getElementById('main-aside');
const body = document.body;

let startX = 0;
let endX = 0;

document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

document.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    const swipeDistance = startX - endX;

    if (startX > window.innerWidth * 0.75 && swipeDistance > 50) {
        aside.classList.add('active');
    }
    else if (aside.classList.contains('active') && swipeDistance < -50) {
        aside.classList.remove('active');
    }
});

// Fikarohana rehetra
const searchInput = document.getElementById('search-input');
const contentContainer = document.getElementById('content-container');

let fehezantenyData = [];
let voambolanaData = [];

// Load data using PapaParse
function loadCSV() {
    Papa.parse("fehezanteny.csv", {
        download: true,
        header: true,
        complete: function(results) {
            fehezantenyData = results.data.filter(item => item.hebrew && item.topic);
        }
    });

    Papa.parse("voambolana.csv", {
        download: true,
        header: true,
        complete: function(results) {
            voambolanaData = results.data.filter(item => item.hebrew && item.topic);
        }
    });
}

function displayDefaultContent() {
    contentContainer.innerHTML = '<h1>Fandraisana</h1>';
}

function performSearch(query) {
    const queryLower = query.toLowerCase();
    const allData = [...fehezantenyData, ...voambolanaData];
    const results = allData.filter(item => {
        const hebreo = item.hebrew ? item.hebrew.toLowerCase() : '';
        const phonetic = item.phonetic ? item.phonetic.toLowerCase() : '';
        const malagasy = item.malagasy ? item.malagasy.toLowerCase() : '';

        return hebreo.includes(queryLower) ||
               phonetic.includes(queryLower) ||
               malagasy.includes(queryLower);
    });

    displaySearchResults(results);
}

function displaySearchResults(results) {
    contentContainer.innerHTML = '';

    if (results.length === 0) {
        contentContainer.innerHTML = `<p style="text-align: center;">Tsy mbola tafiditra anaty rindrambaiko ny teny nokarohinao.</p>`;
        return;
    }

    results.forEach(item => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'search-result-item';

        const hebrewP = document.createElement('p');
        hebrewP.className = 'result-hebrew';
        hebrewP.textContent = item.hebrew;

        const phoneticP = document.createElement('p');
        phoneticP.className = 'result-phonetic';
        phoneticP.textContent = item.phonetic;
        
        const malagasyP = document.createElement('p');
        malagasyP.className = 'result-malagasy';
        malagasyP.textContent = item.malagasy;

        const topicP = document.createElement('p');
        topicP.className = 'result-topic';
        topicP.textContent = item.topic;

        resultDiv.appendChild(hebrewP);
        resultDiv.appendChild(phoneticP);
        resultDiv.appendChild(malagasyP);
        resultDiv.appendChild(topicP);

        contentContainer.appendChild(resultDiv);
    });
}

// Event listener ho an'ny search input
searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    if (query.length > 1) {
        performSearch(query);
    } else {
        displayDefaultContent();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadCSV();
    displayDefaultContent(); // Asehoy ny content default rehefa misokatra ny pejy
});