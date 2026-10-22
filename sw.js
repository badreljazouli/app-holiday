/* Carnet de poche — fonctionne hors connexion.
   Page : réseau d'abord (toujours la dernière version quand on est en ligne), cache sinon.
   Polices, images et moteur de carte (MapLibre) : cache d'abord, rafraîchis en arrière-plan.
   Fond de carte OpenFreeMap : tuiles, polices et pictos gardés au fil des consultations (plafond) ;
   le style et l'index des tuiles passent par le réseau d'abord (ils changent chaque semaine). */
var CACHE = 'carnet-poche-2.3.1';
var TILES = 'carnet-carte-2';
var TILE_MAX = 1500;
var SHELL = ['./', './index.html', './manifest.webmanifest', './apple-touch-icon.png', './icon-192.png', './icon-512.png', './vendor/maplibre-gl.js', './vendor/maplibre-gl.css'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE && k !== TILES; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

var trimming = false;
function trimTiles() {
  if (trimming) return; trimming = true;
  caches.open(TILES).then(function (c) {
    return c.keys().then(function (keys) {
      var extra = keys.length - TILE_MAX;
      return Promise.all(keys.slice(0, Math.max(0, extra)).map(function (k) { return c.delete(k); }));
    });
  }).then(function () { trimming = false; }, function () { trimming = false; });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;

  if (req.mode === 'navigate' || (sameOrigin && (url.pathname.endsWith('/') || url.pathname.endsWith('.html')))) {
    e.respondWith(
      fetch(req, { cache: 'no-cache' }).then(function (res) {
        if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put('./index.html', copy); }); }
        return res;
      }).catch(function () {
        return caches.match('./index.html').then(function (r) { return r || caches.match('./'); });
      })
    );
    return;
  }

  if (url.hostname === 'tiles.openfreemap.org') {
    var asset = /\.(pbf|png|webp|jpg)$/.test(url.pathname);
    e.respondWith(
      caches.open(TILES).then(function (c) {
        if (asset) {
          return c.match(req).then(function (hit) {
            if (hit) return hit;
            return fetch(req).then(function (res) {
              if (res && res.ok) { c.put(req, res.clone()); trimTiles(); }
              return res;
            });
          });
        }
        return fetch(req).then(function (res) {
          if (res && res.ok) c.put(req, res.clone());
          return res;
        }).catch(function () { return c.match(req); });
      })
    );
    return;
  }

  if (sameOrigin || url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.match(req).then(function (cached) {
        var net = fetch(req).then(function (res) {
          if (res && (res.ok || res.type === 'opaque')) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
          return res;
        }).catch(function () { return cached; });
        return cached || net;
      })
    );
  }
});
