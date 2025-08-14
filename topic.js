let lastExpandedItem = null;

// Ity code ity dia tsy maintsy miasa na misy aterineto na tsia
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('phrases-list')) {
        const topicData = JSON.parse(localStorage.getItem('currentTopic'));
        if (topicData) {
            displayTopicPhrases(topicData);
            
            const topicSearchBar = document.getElementById('topic-search-bar');
            topicSearchBar.addEventListener('input', (e) => {
                const searchText = e.target.value.toLowerCase();
                
                if (searchText.trim() === '') {
                    displayTopicPhrases(topicData);
                    return;
                }

                const filteredPhrases = topicData.phrases.filter(phrase =>
                    removeNikkud(phrase.hebreo).includes(removeNikkud(searchText)) ||
                    phrase.phonetic.toLowerCase().includes(searchText) ||
                    phrase.malagasy.toLowerCase().includes(searchText)
                );
                
                displayFilteredPhrases({ ...topicData, phrases: filteredPhrases });
            });
        }
    }
});

function removeNikkud(text) {
    if (!text) return '';
    const nikkud = /[\u0591-\u05BD\u05BF-\u05C5\u05C7]/g;
    return text.replace(nikkud, '');
}

function displayTopicPhrases(topic) {
    const topicPageTitle = document.getElementById('topic-page-title');
    topicPageTitle.textContent = 'Fianarana Hebreo - ' + topic.topic;
    const topicTitleLink = document.getElementById('topic-title-link');
    topicTitleLink.querySelector('.title').textContent = topic.topic;
    
    const phrasesList = document.getElementById('phrases-list');
    phrasesList.innerHTML = '';

    topic.phrases.forEach(phrase => {
        const phraseItem = document.createElement('div');
        phraseItem.className = 'phrase-item';
        
        phraseItem.innerHTML = `
            <p class="heb">${phrase.hebreo}</p>
            <p class="phonetic-text">${phrase.phonetic}</p>
            <p class="malagasy-text">${phrase.malagasy}</p>
        `;
        
        // Raha tiana, azo atao ny mampiseho bebe kokoa rehefa tsindriana
        phraseItem.addEventListener('click', () => {
            if (lastExpandedItem && lastExpandedItem !== phraseItem) {
                lastExpandedItem.classList.remove('expanded');
            }
            phraseItem.classList.toggle('expanded');
            lastExpandedItem = phraseItem;
        });

        phrasesList.appendChild(phraseItem);
    });
}

function displayFilteredPhrases(topic) {
    const phrasesList = document.getElementById('phrases-list');
    phrasesList.innerHTML = '';
    
    if (topic.phrases.length === 0) {
        const noResultItem = document.createElement('div');
        noResultItem.className = 'phrase-item';
        noResultItem.style.textAlign = 'center';
        noResultItem.style.color = '#888';
        noResultItem.style.padding = '2rem';
        noResultItem.textContent = "Tsy ato anat'ity lohahevitra ity ny teny nokarohinao";
        phrasesList.appendChild(noResultItem);
    } else {
        topic.phrases.forEach(phrase => {
            const phraseItem = document.createElement('div');
            phraseItem.className = 'phrase-item';
            
            phraseItem.innerHTML = `
                <p class="heb">${phrase.hebreo}</p>
                <p class="phonetic-text">${phrase.phonetic}</p>
                <p class="malagasy-text">${phrase.malagasy}</p>
            `;
            
            phrasesList.appendChild(phraseItem);
        });
    }
}        
