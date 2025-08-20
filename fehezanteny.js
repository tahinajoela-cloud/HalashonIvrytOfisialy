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

let fehezantenyData = [];
let currentTopicData = [];
let isTopicView = true;

// Load data using PapaParse
function loadFehezantenyCSV() {
    Papa.parse("fehezanteny.csv", {
        download: true,
        header: true,
        complete: function(results) {
            fehezantenyData = results.data.filter(item => item.hebrew && item.topic);
            displayTopics();
        }
    });
}

// Mampiseho ny lisitry ny topic
function displayTopics() {
    isTopicView = true;
    mainHeader.innerHTML = `
        <a href="home.html" id="back-to-home" style="color: white; text-decoration: none;">
            <h1 id="main-title" style="margin: 0 0 1rem 0; font-size: 1.75.rem; text-align: center;">Fehezanteny</h1>
        </a>
        <div class="search-container">
            <input type="text" id="search-input" placeholder="Mikaroka teny anaty rakitra fehezanteny...">
        </div>
    `;
    
    const newSearchInput = document.getElementById('search-input');
    newSearchInput.addEventListener('input', searchInAllSentences);

    contentContainer.innerHTML = '';

    const topics = [...new Set(fehezantenyData.map(item => item.topic))];

    if (topics.length === 0) {
        contentContainer.innerHTML = '<p style="text-align: center;">Tsy misy lohahevitra hita.</p>';
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

// Mampiseho ny fehezanteny anaty topic iray
function displaySentencesByTopic(topic) {
    isTopicView = false;
    mainHeader.innerHTML = `
        <a href="#" id="back-to-topics" style="color: white; text-decoration: none;">
            <h1 id="main-title-link" style="margin: 0 0 1rem 0; font-size: 1.75rem; text-align: center;">${topic}</h1>
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
    currentTopicData = fehezantenyData.filter(item => item.topic === topic);

    if (currentTopicData.length === 0) {
        contentContainer.innerHTML = '<p style="text-align: center;">Tsy misy fehezanteny ahitana ny teny nokarohinao anatin\'ity lohahevitra ity.</p>';
        return;
    }

    currentTopicData.forEach(item => {
        const sentenceDiv = createSentenceDiv(item);
        contentContainer.appendChild(sentenceDiv);
    });
}

// Mamorona div fehezanteny
function createSentenceDiv(item, isSearchResult = false) {
    const sentenceDiv = document.createElement('div');
    sentenceDiv.className = 'sentence-item';

    const hebrewP = document.createElement('p');
    hebrewP.className = 'sentence-hebrew';
    hebrewP.textContent = item.hebrew;

    const phoneticP = document.createElement('p');
    phoneticP.className = 'sentence-phonetic';
    phoneticP.textContent = item.phonetic;
    
    const malagasyP = document.createElement('p');
    malagasyP.className = 'sentence-malagasy';
    malagasyP.textContent = item.malagasy;

    const topicP = document.createElement('p');
    topicP.className = 'sentence-topic';
    topicP.textContent = item.topic;

    // Fandaharana vaovao
    sentenceDiv.appendChild(hebrewP);
    sentenceDiv.appendChild(phoneticP);
    sentenceDiv.appendChild(malagasyP);
    sentenceDiv.appendChild(topicP);

    if (isSearchResult) {
        phoneticP.style.display = 'block';
        malagasyP.style.display = 'block';
    } else {
        sentenceDiv.addEventListener('click', () => {
            if (phoneticP.style.display === 'block') {
                phoneticP.style.display = 'none';
                malagasyP.style.display = 'none';
            } else {
                document.querySelectorAll('.sentence-phonetic, .sentence-malagasy').forEach(el => {
                    el.style.display = 'none';
                });
                phoneticP.style.display = 'block';
                malagasyP.style.display = 'block';
            }
        });
    }

    return sentenceDiv;
}

// Event listener ho an'ny fanindriana div topic
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('topic-item')) {
        const topic = e.target.dataset.topic;
        displaySentencesByTopic(topic);
    }
});

// Fikarohana fehezanteny rehetra
function searchInAllSentences(e) {
    const query = e.target.value.toLowerCase();
    
    if (query.length === 0) {
        displayTopics();
        return;
    }

    const queryClean = removeHebrewVowels(query);
    const allData = fehezantenyData;

    const results = allData.filter(item => {
        const hebreoClean = removeHebrewVowels(item.hebrew ? item.hebrew.toLowerCase() : '');
        const phonetic = item.phonetic ? item.phonetic.toLowerCase() : '';
        const malagasy = item.malagasy ? item.malagasy.toLowerCase() : '';

        return hebreoClean.includes(queryClean) ||
               phonetic.includes(query) ||
               malagasy.includes(query);
    });

    displaySearchResults(results, `Tsy mbola ato anatin'ity sokajy fehezanteny ity ny teny nokarohinao.`);
}


// Fikarohana anaty topic iray manokana
function searchInCurrentTopic(e) {
    const query = e.target.value.toLowerCase();
    
    if (query.length === 0) {
        displaySentencesByTopic(mainHeader.querySelector('h1').textContent);
        return;
    }
    
    const queryClean = removeHebrewVowels(query);
    const results = currentTopicData.filter(item => {
        const hebreoClean = removeHebrewVowels(item.hebrew ? item.hebrew.toLowerCase() : '');
        const phonetic = item.phonetic ? item.phonetic.toLowerCase() : '';
        const malagasy = item.malagasy ? item.malagasy.toLowerCase() : '';
        return hebreoClean.includes(queryClean) || phonetic.includes(query) || malagasy.includes(query);
    });

    displaySearchResults(results, `Tsy mbola ato anatin\'ity lohahevitra ity ny teny nokarohinao.`);
}

// Mampiseho ny valin'ny fikarohana
function displaySearchResults(results, notFoundMessage) {
    contentContainer.innerHTML = '';
    if (results.length === 0) {
        contentContainer.innerHTML = `<p style="text-align: center;">${notFoundMessage}</p>`;
        return;
    }
    results.forEach(item => {
        const sentenceDiv = createSentenceDiv(item, true);
        contentContainer.appendChild(sentenceDiv);
    });
}

// Load data rehefa misokatra ny pejy Fehezanteny
document.addEventListener('DOMContentLoaded', () => {
    loadFehezantenyCSV();
});