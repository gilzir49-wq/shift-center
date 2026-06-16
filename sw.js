// Service worker — app shell cache (data stays live from Firebase)
const CACHE='shift-center-v1';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  // נתונים מ-Firebase: תמיד מהרשת (לא מהמטמון)
  if(u.hostname.includes('firebasedatabase.app')){ return; }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
