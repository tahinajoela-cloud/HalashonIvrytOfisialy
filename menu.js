document.addEventListener('DOMContentLoaded', () => {
    const categoriesContainer = document.getElementById('categories');

    // Mampiasa Papa.parse handosirana ny rakitra CSV
    Papa.parse('menu.csv', {
        download: true,
        header: true,
        complete: function(results) {
            const categories = results.data;
            displayCategories(categories);
        }
    });

    function displayCategories(categories) {
        categories.forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.classList.add('category');

            const categoryName = document.createElement('h2');
            categoryName.textContent = category.name;
            categoryElement.appendChild(categoryName);

            const topicsList = document.createElement('ul');
            categoryElement.appendChild(topicsList);

            const topics = category.topics.split(';');

            topics.forEach(topic => {
                const topicItem = document.createElement('li');
                const topicLink = document.createElement('a');
                topicLink.href = '#'; // Tsy manana rohy izy aloha fa miandry ny 'click'
                topicLink.textContent = topic.trim();
                topicLink.onclick = () => openTopic(topic.trim()); // Antsoina ny function openTopic
                topicItem.appendChild(topicLink);
                topicsList.appendChild(topicItem);
            });

            categoriesContainer.appendChild(categoryElement);
        });
    }

    // Ity function ity no voaova mba hitahiry ny id
    function openTopic(id) {
        sessionStorage.setItem('selectedTopic', id);
        location.href = 'topic.html';
    }
});
