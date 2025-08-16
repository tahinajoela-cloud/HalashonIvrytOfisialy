function createAndDisplayMenu(menuData) {
    const sideMenu = document.getElementById('side-menu');
    const menuList = sideMenu.querySelector('ul');
    
    menuList.innerHTML = '';

    menuData.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        
        a.textContent = item.text;
        
        // Fomba hivoahana ny fampiharana
        if (item.text.toLowerCase().includes('hivoaka')) {
            a.href = '#';
            a.onclick = function() {
                if (confirm("Hakatona tokoa ve ny fampiharana?")) {
                    window.close();
                }
                return false;
            };
        } else {
            // Io andalana io no ovaina
            a.href = '#';
            a.onclick = function() {
                // Miankina amin'ny soratra ao anaty menu.csv ny anaran'ny pejy
                if (item.text.toLowerCase().includes('mombamomba')) {
                    showInfoPage('about');
                } else if (item.text.toLowerCase().includes('fifandraisana')) {
                    showInfoPage('contact');
                } else if (item.text.toLowerCase().includes('fanohanana')) {
                    showInfoPage('support');
                } else if (item.text.toLowerCase().includes('kaseho')) {
                    showInfoPage('version');
                }
                return false;
            };
        }

        li.appendChild(a);
        menuList.appendChild(li);
    });
    
    // ... (Ny sisa amin'ny code dia tsy miova) ...
}
