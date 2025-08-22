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
function startCaching(client) {
    console.log('Manomboka ny caching...');
    let filesCached = 0;
    let totalFiles = 0;

    fetch(MANIFEST_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Tsy nahomby ny fisintonana ny manifest.json');
            }
            return response.json();
        })
        .then(manifestData => {
            const filesToCache = manifestData.files;
            totalFiles = filesToCache.length;
            
            return caches.open(CACHE_NAME);
        })
        .then(cache => {
            // Mampiasa promise chain ho an'ny rakitra tsirairay
            return new Promise((resolve, reject) => {
                let currentPromise = Promise.resolve();
                filesToCache.forEach(relativeUrl => {
                    currentPromise = currentPromise.then(() => {
                        return cache.match(relativeUrl);
                    }).then((cachedResponse) => {
                        if (cachedResponse) {
                            filesCached++;
                            client.postMessage({ type: 'progress', filesCached, totalFiles });
                            return;
                        }
                        return fetch(relativeUrl).then(fetchedResponse => {
                            if (fetchedResponse.ok) {
                                return cache.put(relativeUrl, fetchedResponse).then(() => {
                                    filesCached++;
                                    console.log('Voatahiry:', relativeUrl);
                                    client.postMessage({ type: 'progress', filesCached, totalFiles });
                                });
                            } else {
                                console.error('Tsy nahomby ny fisintonana:', relativeUrl, fetchedResponse.status);
                                // Tsy mijanona ny caching raha misy fahadisoana iray
                                return Promise.resolve();
                            }
                        }).catch(error => {
                            console.error('Tsy nahomby ny fanampiana cache:', relativeUrl, error);
                            return Promise.resolve();
                        });
                    });
                });
                resolve(currentPromise);
            });
        })
        .then(() => {
            client.postMessage({ type: 'complete' });
            console.log('Vita tanteraka ny fisintomana sy fitahirizana.');
        })
        .catch(error => {
            console.error('Tsy nahomby ny fanombohana caching:', error);
        });
}
