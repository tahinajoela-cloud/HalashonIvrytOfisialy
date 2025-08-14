let lastExpandedItem = null;

function initializeTopicPage() {
    const topicData = JSON.parse(localStorage.getItem('currentTopic'));
    if (topicData) {
        const topicPageTitle = document.getElementById('topic-page-title');
        if (topicPageTitle) topicPageTitle.textContent = 'Fianarana Hebreo - ' + topicData.topic;
        const topicTitleLink = document.getElementById('topic-title-link');
        if (topicTitleLink) topicTitleLink.querySelector('.title').textContent = '‹ ' + topicData.topic;

        displayTopicPhrases(topicData);

        const topicSearchBar = document.getElementById('topic-search-bar');
        if (topicSearchBar) {
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
        
        const topicTitleLinkElem = document.getElementById('topic-title-link');
        if (topicTitleLinkElem) {
            topicTitleLinkElem.addEventListener('click', (e) => {
                e.preventDefault();
                window.showIndexPage(); 
            });
        }
    }
}

function removeNikkud(text) {
    if (!text) return '';
    const nikkud = /[\u0591-\u05BD\u05BF-\u05C5\u05C7]/g;
    return text.replace(nikkud, '');
}

function displayTopicPhrases(topic) {
    const phrasesList = document.getElementById('phrases-list');
    if (!phrasesList) return;
    phrasesList.innerHTML = '';
    
    topic.phrases.forEach(phrase => {
        const phraseItem = document.createElement('div');
        phraseItem.className = 'phrase-item';
        
        phraseItem.innerHTML = `
            <p class="heb">${phrase.hebreo}</p>
            <p class="phonetic-text">${phrase.phonetic}</p>
            <p class="malagasy-text">${phrase.malagasy}</p>
            <p class="topic">Lohahevitra: ${phrase.topic}</p>
        `;
        
        phraseItem.addEventListener('click', function() {
            if (lastExpandedItem && lastExpandedItem !== this) {
                lastExpandedItem.classList.remove('expanded');
            }
            this.classList.toggle('expanded');
            lastExpandedItem = this;
        });

        phrasesList.appendChild(phraseItem);
    });
}

function displayFilteredPhrases(topic) {
    const phrasesList = document.getElementById('phrases-list');
    if (!phrasesList) return;
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
            phraseItem.className = 'phrase-item expanded';
            
            phraseItem.innerHTML = `
                <p class="heb">${phrase.hebreo}</p>
                <p class="phonetic-text">${phrase.phonetic}</p>
                <p class="malagasy-text">${phrase.malagasy}</p>
                <p class="topic">Lohahevitra: ${phrase.topic}</p>
            `;
            
            phraseItem.addEventListener('click', function() {
                if (lastExpandedItem && lastExpandedItem !== this) {
                    lastExpandedItem.classList.remove('expanded');
                }
                this.classList.toggle('expanded');
                lastExpandedItem = this;
            });
            phrasesList.appendChild(phraseItem);
        });
    }
}
