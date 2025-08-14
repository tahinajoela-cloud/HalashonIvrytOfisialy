let lastExpandedItem = null;

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('phrases-list')) {
        const topicData = JSON.parse(localStorage.getItem('currentTopic'));
        if (topicData) {
            displayTopicPhrases(topicData);
            
            const topicSearchBar = document.getElementById('topic-search-bar');
            topicSearchBar.addEventListener('input', (e) => {
                const searchText = e.target.value.toLowerCase();
                
                if (searchText.trim() === '') {
                    // Rehefa foana ny fikarohana, averina ny fomba fiasa mahazatra
                    displayTopicPhrases(topicData);
                    return;
                }

                // Rehefa misy teny karohina
                const filteredPhrases = topicData.phrases.filter(phrase =>
                    removeNikkud(phrase.hebreo).includes(removeNikkud(searchText)) ||
                    phrase.phonetic.toLowerCase().includes(searchText) ||
                    phrase.malagasy.toLowerCase().includes(searchText)
                );
                
                // Antsoina ny asa iray hafa hanehoana ny valiny fikarohana
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

// Asa mahazatra ho an'ny fampisehoana ny lisitra ao anatin'ny lohahevitra
// Mampiseho ny Hebreo sy ny Lohahevitra fotsiny
function displayTopicPhrases(topic) {
    document.getElementById('topic-page-title').textContent = topic.topic + ' - Fianarana Hebreo';
    const topicTitleLink = document.getElementById('topic-title-link');
    topicTitleLink.querySelector('.title').textContent = topic.topic;
    
    const phrasesList = document.getElementById('phrases-list');
    phrasesList.innerHTML = '';

    topic.phrases.forEach(phrase => {
        const phraseItem = document.createElement('div');
        phraseItem.className = 'phrase-item';
        
        // Eto no ampiana ny anaran'ny lohahevitra
        phraseItem.innerHTML = `
            <p class="heb">${phrase.hebreo}</p>
            <p class="phonetic-text">${phrase.phonetic}</p>
            <p class="malagasy-text">${phrase.malagasy}</p>
            <p class="topic">${phrase.topic}</p>
        `;
        
        const phonetic = phraseItem.querySelector('.phonetic-text');
        const malagasy = phraseItem.querySelector('.malagasy-text');
        const topicName = phraseItem.querySelector('.topic'); // Manampy ity
        
        phonetic.style.display = 'none';
        malagasy.style.display = 'none';
        
        // Tsy mampiseho afa-tsy ny teny hebreo sy ny lohahevitra rehefa feno ny lisitra
        topicName.style.display = 'block';

        phraseItem.addEventListener('click', () => {
            if (lastExpandedItem && lastExpandedItem !== phraseItem) {
                lastExpandedItem.querySelector('.phonetic-text').style.display = 'none';
                lastExpandedItem.querySelector('.malagasy-text').style.display = 'none';
                // lastExpandedItem.querySelector('.topic').style.display = 'none';
            }
            
            if (phonetic.style.display === 'none') {
                phonetic.style.display = 'block';
                malagasy.style.display = 'block';
                // topicName.style.display = 'none'; // Afenina ny lohahevitra rehefa misokatra
                lastExpandedItem = phraseItem;
            } else {
                phonetic.style.display = 'none';
                malagasy.style.display = 'none';
                // topicName.style.display = 'block'; // Aseho ny lohahevitra rehefa mihidy
                lastExpandedItem = null;
            }
        });
        
        phrasesList.appendChild(phraseItem);
    });
}


// Asa manokana ho an'ny fikarohana ao amin'ny topic.html
// Mampiseho avy hatrany ny singa 4 rehetra
function displayFilteredPhrases(topic) {
    document.getElementById('topic-page-title').textContent = topic.topic + ' - Fianarana Hebreo';
    const topicTitleLink = document.getElementById('topic-title-link');
    topicTitleLink.querySelector('.title').textContent = topic.topic;
    
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
                <p class="topic">Lohahevitra: ${phrase.topic}</p>
            `;
            
            // Mampiseho avy hatrany ny phonetic sy malagasy rehefa misy fikarohana
            phraseItem.querySelector('.phonetic-text').style.display = 'block';
            phraseItem.querySelector('.malagasy-text').style.display = 'block';
            
            phrasesList.appendChild(phraseItem);
        });
    }
}