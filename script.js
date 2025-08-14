let allData = [];
let topicsData = [];

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('topics-list')) {
        Papa.parse("data.csv", {
            download: true,
            header: true,
            dynamicTyping: true,
            complete: function(results) {
                allData = results.data;
                if (allData.length > 0) {
                    const groupedData = allData.reduce((acc, current) => {
                        if (!acc[current.topic]) {
                            acc[current.topic] = [];
                        }
                        acc[current.topic].push(current);
                        return acc;
                    }, {});
                    topicsData = Object.keys(groupedData).map(key => ({
                        topic: key,
                        phrases: groupedData[key]
                    }));
                    displayTopics(topicsData);
                }
            }
        });

        const globalSearchBar = document.getElementById('global-search-bar');
        globalSearchBar.addEventListener('input', (e) => {
            const searchText = e.target.value.toLowerCase();
            
            if (searchText.trim() === '') {
                displayTopics(topicsData);
                return;
            }

            const filteredResults = allData.filter(phrase =>
                removeNikkud(phrase.hebreo).includes(removeNikkud(searchText)) ||
                phrase.phonetic.toLowerCase().includes(searchText) ||
                phrase.malagasy.toLowerCase().includes(searchText)
            );
            displaySearchResults(filteredResults);
        });
    }
});

function removeNikkud(text) {
    if (!text) return '';
    const nikkud = /[\u0591-\u05BD\u05BF-\u05C5\u05C7]/g;
    return text.replace(nikkud, '');
}

function displayTopics(topics) {
    const topicsList = document.getElementById('topics-list');
    topicsList.innerHTML = '';
    topics.forEach(topic => {
        const topicItem = document.createElement('div');
        topicItem.className = 'topic-item';
        topicItem.textContent = topic.topic;
        topicItem.addEventListener('click', () => {
            localStorage.setItem('currentTopic', JSON.stringify(topic));
            window.location.href = 'topic.html';
        });
        topicsList.appendChild(topicItem);
    });
}

function displaySearchResults(results) {
    const topicsList = document.getElementById('topics-list');
    topicsList.innerHTML = '';

    if (results.length === 0) {
        const noResultItem = document.createElement('div');
        noResultItem.className = 'phrase-item';
        noResultItem.style.textAlign = 'center';
        noResultItem.style.color = '#888';
        noResultItem.style.padding = '2rem';
        noResultItem.textContent = 'Tsy ato anaty rindrambaiko ny teny nokarohinao';
        topicsList.appendChild(noResultItem);
    } else {
        results.forEach(phrase => {
            const phraseItem = document.createElement('div');
            phraseItem.className = 'phrase-item search-result';
            
            phraseItem.innerHTML = `
                <p class="heb">${phrase.hebreo}</p>
                <p class="phonetic-text">${phrase.phonetic}</p>
                <p class="malagasy-text">${phrase.malagasy}</p>
                <p class="topic">${phrase.topic}</p>
            `;
            
            topicsList.appendChild(phraseItem);
        });
    }
}
