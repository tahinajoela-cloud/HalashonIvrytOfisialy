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

// Fampisehoana ny atiny ho an'ny pejy mombamomba.html
const contentContainer = document.getElementById('content-container');

// Asehoy ny atiny default ho an'ny pejy Mombamomba
function displayMombamombaContent() {
    contentContainer.innerHTML = `
        <h1 style="text-align: center;">Halashon Ivryt Ofisialy v.1.0.0</h1>
        <p style="text-align:center; font-style: italic;">Finaritra,</p>
        <p>Ity fampiharana ity dia novolavolaina sy noforonin'Andriamatoa RAKOTOZAFY Tahina Joela izay mpanangana sy mpitantana ny Halashon Ivryt Ofisialy izay vondrona mampianatra fiteny hebreo mivantana sy an-tserasera.</p>
        <p>Noforonina ity fampiharana ity mba hanampy ny rehetra te hianatra sy hifehy ny fiteny hebreo haingana. Koa amin'ny maha fampiharaha mikendry fanabeazana azy ity dia nasiana sarany ny fahafahanao misintona ireo rakitra ka mitahiry izany anaty fampiharana ary mampiasa ny fampiharana tsy mila aterineto intsony aorian'izay ka 12000 Ariary ho an'ny taona 2025 ary miakatra 2000 Ariary isan-taona izany sarany izany ho an'ny olona vaovao hafa.</p>
        <p>Raha hanao fampanarahan'andro kosa ianao dia tsara ny manjohy ny mpamolavola ao amin'ny Kaonty Fesiboky sy Instagram mba ahafantaranao na efa misy ny Kaseho vaovao na tsia. Raha hanao fampanarahan'andro ianao dia tsy voatery mampiditra fampiharana vaovao hafa anaty finday fa ity fampiharana ity ihany dia mety. Akisano miankavia fotsiny ny efijery ary tsindrio ny rohy Kaseho antin'ny boatin-drohy ary araho ny toromarika omena ao.</p>
        <p>Mirary soa indrindra, mianarā finaritra.</p>
        <p>Raha misy fanontaniana dia aza misalasala ny mifandray amin'ny mpamolavola ity fampiharana ity.</p>
        <p style="text-align: center; margin-top: 2rem;">
            © <span id="current-year"></span> Halashon Ivryt Ofisialy. Zo rehetra voatokana.
        </p>
    `;
    // Manavao ny taona ao amin'ny footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
}

// Antsoy ny fiasa rehefa vonona ny pejy
document.addEventListener('DOMContentLoaded', displayMombamombaContent);
