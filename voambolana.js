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

// Fiasa hanesorana ny 'points voyelles' (nikud)
function removeHebrewVowels(text) {
    if (!text) return '';
    return text.replace(/[\u0591-\u05BD\u05BF-\u05C5\u05C7]/g, '');
}

// Fampidirana PapaParse sy fanamboarana ny pejy
const searchInput = document.getElementById('search-input');
const mainHeader = document.getElementById('main-header');
const mainTitle = document.getElementById('main-title');
const contentContainer = document.getElementById('content-container');

let voambolanaData = [];
let currentTopicData = [];
let isTopicView = true;

// Load data using PapaParse
function loadVoambolanaCSV() {
    Papa.parse("voambolana.csv", {
        download: true,
        header: true,
        complete: function(results) {
            voambolanaData = results.data.filter(item => item.hebrew && item.topic);
            displayTopics();
        }
    });
}

// Mampiseho ny lisitry ny topic
function displayTopics() {
    isTopicView = true;
    mainHeader.innerHTML = `
        <a href="home.html" id="back-to-home" style="color: white; text-decoration: none;">
            <h1 id="main-title" style="margin: 0 0 1rem 0; font-size: 2.5rem; text-align: center;">Voambolana</h1>
        </a>
        <div class="search-container">
            <input type="text" id="search-input" placeholder="Mikaroka teny anatin'ny sokajy voambolana...">
        </div>
    `;
    
    const newSearchInput = document.getElementById('search-input');
    newSearchInput.addEventListener('input', searchInAllWords);

    contentContainer.innerHTML = '';

    const topics = [...new Set(voambolanaData.map(item => item.topic))];

    if (topics.length === 0) {
        contentContainer.innerHTML = '<p style="text-align: center;">Tsy mbola vonona ny votoatin\'ity sokajy voambolana ity.<br>Iangaviana indrindra ianao mba hanao fampanarahan\'andro afaka telo volana mba ahafahanao misitraka izany.<br>Misaotra indrindra anao amin\'ny faharetana.</p>';
        return;
    }

    topics.forEach(topic => {
        if (topic) {
            const topicDiv = document.createElement('div');
            topicDiv.className = 'topic-item';
            topicDiv.textContent = topic;
            topicDiv.dataset.topic = topic;
            contentContainer.appendChild(topicDiv);
        }
    });
}

// Mampiseho ny teny anaty topic iray
function displayWordsByTopic(topic) {
    isTopicView = false;
    mainHeader.innerHTML = `
        <a href="#" id="back-to-topics" style="color: white; text-decoration: none;">
            <h1 id="main-title-link" style="margin: 0 0 1rem 0; font-size: 2.5rem; text-align: center;">${topic}</h1>
        </a>
        <div class="search-container">
            <input type="text" id="search-input" placeholder="Mikaroka teny anatin'ity lohahevitra ity...">
        </div>
    `;
    
    const newSearchInput = document.getElementById('search-input');
    newSearchInput.addEventListener('input', searchInCurrentTopic);

    document.getElementById('back-to-topics').addEventListener('click', (e) => {
        e.preventDefault();
        displayTopics();
    });

    contentContainer.innerHTML = '';
    currentTopicData = voambolanaData.filter(item => item.topic === topic);

    if (currentTopicData.length === 0) {
        contentContainer.innerHTML = '<p style="text-align: center;">Tsy misy teny ato amin\'ity lohahevitra ity.</p>';
        return;
    }

    currentTopicData.forEach(item => {
        const wordDiv = createWordDiv(item);
        contentContainer.appendChild(wordDiv);
    });
}

// Mamorona div voambolana
function createWordDiv(item, isSearchResult = false) {
    const wordDiv = document.createElement('div');
    wordDiv.className = 'word-item';

    const hebrewP = document.createElement('p');
    hebrewP.className = 'word-hebrew';
    hebrewP.textContent = item.hebrew;

    const phoneticP = document.createElement('p');
    phoneticP.className = 'word-phonetic';
    phoneticP.textContent = item.phonetic;
    
    const malagasyP = document.createElement('p');
    malagasyP.className = 'word-malagasy';
    malagasyP.textContent = item.malagasy;

    const topicP = document.createElement('p');
    topicP.className = 'word-topic';
    topicP.textContent = item.topic;

    // Fandaharana araka ny baiko
    wordDiv.appendChild(hebrewP);
    wordDiv.appendChild(phoneticP);
    wordDiv.appendChild(malagasyP);
    wordDiv.appendChild(topicP);

    if (isSearchResult) {
        phoneticP.style.display = 'block';
        malagasyP.style.display = 'block';
    } else {
        wordDiv.addEventListener('click', () => {
            if (phoneticP.style.display === 'block') {
                phoneticP.style.display = 'none';
                malagasyP.style.display = 'none';
            } else {
                document.querySelectorAll('.word-phonetic, .word-malagasy').forEach(el => {
                    el.style.display = 'none';
                });
                phoneticP.style.display = 'block';
                malagasyP.style.display = 'block';
            }
        });
    }

    return wordDiv;
}

// Event listener ho an'ny fanindriana div topic
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('topic-item')) {
        const topic = e.target.dataset.topic;
        displayWordsByTopic(topic);
    }
});

// Fikarohana teny rehetra
function searchInAllWords(e) {
    const query = e.target.value.toLowerCase();
    
    if (query.length === 0) {
        displayTopics();
        return;
    }

    const queryClean = removeHebrewVowels(query);
    const allData = voambolanaData;
    
    const results = allData.filter(item => {
        const hebreoClean = removeHebrewVowels(item.hebrew ? item.hebrew.toLowerCase() : '');
        const phonetic = item.phonetic ? item.phonetic.toLowerCase() : '';
        const malagasy = item.malagasy ? item.malagasy.toLowerCase() : '';

        return hebreoClean.includes(queryClean) ||
               phonetic.includes(query) ||
               malagasy.includes(query);
    });

    displaySearchResults(results, `Tsy mbola ato anatin'ity sokajy voambolana ity ny teny nokarohinao.`);
}


// Fikarohana anaty topic iray manokana
function searchInCurrentTopic(e) {
    const query = e.target.value.toLowerCase();
    
    if (query.length === 0) {
        displayWordsByTopic(mainHeader.querySelector('h1').textContent);
        return;
    }

    const queryClean = removeHebrewVowels(query);
    const results = currentTopicData.filter(item => {
        const hebreoClean = removeHebrewVowels(item.hebrew ? item.hebrew.toLowerCase() : '');
        const phonetic = item.phonetic ? item.phonetic.toLowerCase() : '';
        const malagasy = item.malagasy ? item.malagasy.toLowerCase() : '';
        return hebreoClean.includes(queryClean) || phonetic.includes(query) || malagasy.includes(query);
    });

    displaySearchResults(results, `Tsy mbola ato anatin'ny lohahevitra ity ny teny nokarohinao.`);
}

// Mampiseho ny valin'ny fikarohana
function displaySearchResults(results, notFoundMessage) {
    contentContainer.innerHTML = '';
    if (results.length === 0) {
        contentContainer.innerHTML = `<p style="text-align: center;">${notFoundMessage}</p>`;
        return;
    }
    results.forEach(item => {
        const wordDiv = createWordDiv(item, true);
        contentContainer.appendChild(wordDiv);
    });
}

// Load data rehefa misokatra ny pejy Voambolana
document.addEventListener('DOMContentLoaded', () => {
    loadVoambolanaCSV();
});