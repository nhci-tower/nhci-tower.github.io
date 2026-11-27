const C="nhci-v3",D="nhci-data-v1";
const SB="abxwjwsuqtniykfijqsx.supabase.co";
const RPC_OK=/\/rest\/v1\/rpc\/(my_role|my_prefs|ai_key_set)$/;
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(["./","index.html","manifest.webmanifest","app.enc"])).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!==D).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const netFirst=(req,cache,key)=>fetch(req).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(cache).then(c=>c.put(key||req,cp))}return r}).catch(()=>caches.match(key||req,{ignoreVary:true}).then(r=>r||Promise.reject("offline")));
self.addEventListener("fetch",e=>{const q=e.request,u=new URL(q.url);
  if(q.method==="POST"&&u.host===SB&&RPC_OK.test(u.pathname)){e.respondWith(q.clone().text().then(b=>{const k=new Request(u.href+"?__b="+encodeURIComponent(b));return netFirst(q,D,k)}));return}
  if(q.method!=="GET")return;
  if(u.origin===location.origin){e.respondWith(fetch(q).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(q,cp));return r}).catch(()=>caches.match(q).then(r=>r||caches.match("index.html"))));return}
  if(u.host===SB&&(/^\/rest\/v1\//.test(u.pathname)||/^\/storage\/v1\/object\/public\//.test(u.pathname))){e.respondWith(netFirst(q,D));return}
  if(/cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|unpkg\.com|fonts\.googleapis\.com|fonts\.gstatic\.com/.test(u.host)){e.respondWith(caches.match(q).then(r=>r||fetch(q).then(n=>{const cp=n.clone();caches.open(C).then(c=>c.put(q,cp));return n})))}});

self.addEventListener("push",e=>{let d={};try{d=e.data?e.data.json():{}}catch(_){d={body:e.data&&e.data.text()}}
  e.waitUntil(self.registration.showNotification(d.title||"NHCI Tower",{body:d.body||"",tag:d.tag||"nhci",renotify:true,dir:"rtl",lang:"ar",icon:"https://abxwjwsuqtniykfijqsx.supabase.co/storage/v1/object/public/pub/icons/icon-192.png?v=3",badge:"https://abxwjwsuqtniykfijqsx.supabase.co/storage/v1/object/public/pub/icons/icon-192.png?v=3",data:{url:d.url||"./"}}))});
self.addEventListener("notificationclick",e=>{e.notification.close();const u=new URL((e.notification.data&&e.notification.data.url)||"./",self.registration.scope).href;
  e.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(ws=>{for(const w of ws){if(w.url.startsWith(self.registration.scope)){w.focus();try{w.navigate(u)}catch(_){}return}}return clients.openWindow(u)}))});
