var GHPATH = '/zn-sleepbox';
var APP_PREFIX = 'zn-sleepbox_';
var VERSION = 'version_009';
var URLS = [    
  `${GHPATH}/`,
  `${GHPATH}/index.html`,
  `${GHPATH}/sound/avenida_las_camelias.mp3`,
  `${GHPATH}/sound/benjamin_amadeo_para_siempre.mp3`,
  `${GHPATH}/sound/dame_tu_manito.mp3`,
  `${GHPATH}/sound/lullaby_1.ogg`,
  `${GHPATH}/sound/marolio.mp3`,
  `${GHPATH}/sound/rain.ogg`,
  `${GHPATH}/sound/shh_shh_shh_shh_shh.ogg`,
  `${GHPATH}/sound/shh_shh_shh.ogg`,
  `${GHPATH}/sound/shh_shh.ogg`,
  `${GHPATH}/sound/white_noise.ogg`,
  `${GHPATH}/sound/wind.ogg`,
  `${GHPATH}/font/Roboto-Light.ttf`,
  `${GHPATH}/font/Roboto-Medium.ttf`,
  `${GHPATH}/font/Roboto-Regular.ttf`,
  `${GHPATH}/css/styles.css`,
  `${GHPATH}/img/icon.png`,
  `${GHPATH}/js/app.js`,
  `${GHPATH}/js/AudioControler.js`,
  `${GHPATH}/js/ButtonBuilder.js`,
  `${GHPATH}/js/State.js`,
  `${GHPATH}/js/Utils.js`
]

var CACHE_NAME = APP_PREFIX + VERSION
self.addEventListener('fetch', function (e) {
  console.log('Fetch request : ' + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) { 
        console.log('Responding with cache : ' + e.request.url);
        return request
      } else {       
        console.log('File is not cached, fetching : ' + e.request.url);
        return fetch(e.request)
      }
    })
  )
})

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('Installing cache : ' + CACHE_NAME);
      return cache.addAll(URLS)
    })
  )
})

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX)
      })
      cacheWhitelist.push(CACHE_NAME);
      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('Deleting cache : ' + keyList[i] );
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})