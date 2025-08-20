// Sidebar (aside) - Mitovy amin'ny pejy rehetra
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

// Fampisehoana ny atiny ho an'ny pejy Fanohanana
document.addEventListener('DOMContentLoaded', () => {
    const contentContainer = document.getElementById('content-container');
    
    // Mamorona ny lohateny sy ny paragrafy
    const title = document.createElement('h1');
    title.textContent = "Fanohanana";

    const paragraph1 = document.createElement('p');
    paragraph1.textContent = "Tetikasa maharitra ity fampiharana ity koa iangaviana ianao hanome fanohanana ara-bola araka izay tratra ho fampiroboroboana sy fanatsarana ity tetikasa ity";

    const paragraph2 = document.createElement('p');
    paragraph2.innerHTML = `
        Andriamatoa RAKOTOZAFY Tahina Joela<br>
        Teaching Ancient, Classical and Modern Hebrew<br>
        Phone: 0349725267 | 0322221353<br>
        Mail: tahinajoela@gmail.com
    `;

    // Ampidirina ao anaty content-container
    contentContainer.appendChild(title);
    contentContainer.appendChild(paragraph1);
    contentContainer.appendChild(paragraph2);

    // Afaka manampy style manokana eto raha ilaina
    contentContainer.style.textAlign = 'center';
    contentContainer.style.padding = '2rem';
});