function addSwipeListeners() {
    const sideMenu = document.getElementById('side-menu');
    let startX;
    
    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    document.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const deltaX = endX - startX;

        if (Math.abs(deltaX) > 50) {
            if (deltaX < 0) {
                sideMenu.classList.add('open');
            } else {
                sideMenu.classList.remove('open');
            }
        }
    });
}

function createAndDisplayMenu(menuData) {
    const sideMenu = document.getElementById('side-menu');
    const menuList = sideMenu.querySelector('ul');
    
    menuList.innerHTML = '';

    menuData.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        
        a.textContent = item.text;
        
        if (item.text.toLowerCase().includes('hivoaka')) {
            a.href = '#';
            a.onclick = function() {
                if (confirm("Hakatona tokoa ve ny fampiharana?")) {
                    window.close();
                }
                return false;
            };
        } else {
            a.href = '#';
            a.onclick = function() {
                if (item.text.toLowerCase().includes('mombamomba')) {
                    showInfoPage('about');
                } else if (item.text.toLowerCase().includes('fifandraisana')) {
                    showInfoPage('contact');
                } else if (item.text.toLowerCase().includes('fanohanana')) {
                    showInfoPage('support');
                } else if (item.text.toLowerCase().includes('kaseho')) {
                    showInfoPage('version');
                }
                sideMenu.classList.remove('open');
                return false;
            };
        }

        li.appendChild(a);
        menuList.appendChild(li);
    });
    
    const menuHeader = sideMenu.querySelector('.menu-header');
    menuHeader.innerHTML = `
        <img src="icon.png" alt="Icon" class="menu-icon">
        <h2>Halashon Ivryt Ofisialy</h2>
    `;
    
    addSwipeListeners();
}
