const V="stl-v21", TILES="stl-tiles-v1", MAXT=900;
const CORE=["./","index.html","manifest.webmanifest","icon.svg","icon-180.png","icon-192.png","icon-512.png","lib/leaflet.js","lib/leaflet.css","lib/markercluster.js","fonts/pressstart.woff2","fonts/vt323.woff2"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(CORE.map(u=>c.add(new Request(u,{cache:"reload"}))))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==TILES).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
async function trim(c){const k=await c.keys();if(k.length>MAXT)await Promise.all(k.slice(0,k.length-MAXT).map(x=>c.delete(x)))}
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(u.hostname.endsWith("tile.openstreetmap.org")){
    e.respondWith(caches.open(TILES).then(async c=>{const hit=await c.match(r);if(hit)return hit;
      try{const n=await fetch(r);if(n&&(n.ok||n.type==="opaque")){c.put(r,n.clone());trim(c)}return n}catch(err){return hit||Response.error()}}));
    return;
  }
  if(u.origin!==location.origin)return;
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).catch(()=>r.mode==="navigate"?caches.match("index.html"):Response.error())));
});