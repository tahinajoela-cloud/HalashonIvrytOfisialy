// Anaran'ny cache
const CACHE_NAME = 'halashon-ivryt-cache-v1';

// Lohahevitra ho an'ny fisintonana (manifest)
const MANIFEST_URL = 'manifest.json';

// Ny rakitra fototra ho tahirizina foana
const urlsToCache = [
    '/',
    'index.html',
    'home.html', 
    'home.css', 
    'home.js'
];

// Fandinihana ny fisintonana
self.addEventListener('install', (event) => {
    console.log('Manomboka ny fametrahana...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache nosokafana, mitahiry rakitra fototra...');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('Fametrahana vita. Manomboka mifehy ny clients.');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Tsy nahomby ny fametrahana:', error);
            })
    );
});

// Fandinihana ny fanetsiketsehana (activation)
self.addEventListener('activate', (event) => {
    console.log('Manomboka ny fanetsiketsehana...');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Famafana cache taloha:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Fanetsiketsehana vita.');
            return self.clients.claim();
        })
    );
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
                if (event.request.method === 'GET') {
                    const clonedResponse = fetchedResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, clonedResponse);
                    });
                }
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
    let filesCached = 0;
    let totalFiles = 0;

    try {
        const manifestResponse = await fetch(MANIFEST_URL);
        if (!manifestResponse.ok) {
            throw new Error('Tsy nahomby ny fisintonana ny manifest.json');
        }

        const manifestData = await manifestResponse.json();
        const filesToCache = manifestData.files;
        totalFiles = filesToCache.length;

        const cache = await caches.open(CACHE_NAME);

        const cachePromises = filesToCache.map(async (relativeUrl) => {
            try {
                const fullUrl = new URL(relativeUrl, self.location.href).href;
                
                const cachedResponse = await cache.match(fullUrl);
                if (cachedResponse) {
                    filesCached++;
                    client.postMessage({ type: 'progress', filesCached, totalFiles });
                    return; // Efa ao anaty cache, tsy misy ilana azy intsony
                }
                
                const fetchedResponse = await fetch(fullUrl);
                if (fetchedResponse.ok) {
                    await cache.put(fullUrl, fetchedResponse.clone());
                    filesCached++;
                    console.log('Voatahiry:', fullUrl);
                    client.postMessage({ type: 'progress', filesCached, totalFiles });
                } else {
                    console.error('Tsy nahomby ny fisintonana:', fullUrl, fetchedResponse.status);
                }
            } catch (error) {
                console.error('Tsy nahomby ny fanampiana cache:', relativeUrl, error);
            }
        });

        await Promise.all(cachePromises);

        client.postMessage({ type: 'complete' });
        console.log('Vita tanteraka ny fisintomana sy fitahirizana.');

    } catch (error) {
        console.error('Tsy nahomby ny fanombohana caching:', error);
        client.postMessage({ type: 'error', message: error.message });
    }
}
