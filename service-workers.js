// Anaran'ny cache
const CACHE_NAME = 'halashon-ivryt-cache-v1';

// Lohahevitra ho an'ny fisintonana (manifest)
const MANIFEST_URL = 'manifest.json';

// Ny rakitra fototra ho tahirizina foana
const urlsToCache = [
    '/',
    'index.html'
];

// Fandinihana ny fisintonana
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Cache fototra nosokafana');
            return cache.addAll(urlsToCache);
        })
    );
});

// Fandinihana ny fanetsiketsehana (activation)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Famafana cache taloha:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    event.waitUntil(self.clients.claim());
});

// Fandinihana ny hafatra avy amin'ny pejy web
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'start-caching') {
        startCaching(event.source);
    }
});

// Fandinihana ny fangatahana (fetch)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then((fetchedResponse) => {
                const clonedResponse = fetchedResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, clonedResponse);
                });
                return fetchedResponse;
            }).catch(() => {
                console.error('Tsy misy tambajotra ary tsy ao anaty cache ilay rakitra.');
                return new Response('Tsy misy tambajotra');
            });
        })
    );
});


// Fampandehanana ny caching lehibe
async function startCaching(client) {
    console.log('Manomboka ny caching...');
    try {
        const manifestResponse = await fetch(MANIFEST_URL);
        const manifestData = await manifestResponse.json();
        const filesToCache = manifestData.files;

        const totalFiles = filesToCache.length;
        let filesCached = 0;

        const cache = await caches.open(CACHE_NAME);

        // Mampiasa loop for...of mba tsy hijanona raha misy fahadisoana
        for (const relativeUrl of filesToCache) {
            const fileUrl = new URL(relativeUrl, location.href).href;
            try {
                const cachedResponse = await cache.match(fileUrl);
                if (cachedResponse) {
                    filesCached++;
                    client.postMessage({
                        type: 'progress',
                        filesCached,
                        totalFiles
                    });
                    continue;
                }
                
                const fetchedResponse = await fetch(fileUrl);
                if (fetchedResponse.ok) {
                    await cache.put(fileUrl, fetchedResponse);
                    filesCached++;
                    console.log('Voatahiry:', fileUrl);
                    client.postMessage({
                        type: 'progress',
                        filesCached,
                        totalFiles
                    });
                } else {
                    console.error('Tsy nahomby ny fisintonana:', fileUrl, fetchedResponse.status);
                }
            } catch (error) {
                console.error('Tsy nahomby ny fanampiana cache:', fileUrl, error);
            }
        }
        
        client.postMessage({
            type: 'complete'
        });

        console.log('Vita tanteraka ny fisintomana sy fitahirizana.');

    } catch (error) {
        console.error('Tsy nahomby ny fanombohana caching:', error);
    }
}
