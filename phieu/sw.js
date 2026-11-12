const C='psc-v15',F=['./','./index.html','./manifest.json','./icon-180.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('psc-')&&x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin||!u.pathname.startsWith(new URL('./',self.registration.scope).pathname))return;
  e.respondWith(fetch(e.request).then(r=>{if(!r.ok)throw 0;const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r})
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))));
});
/* thông báo đẩy: máy chủ chỉ gõ cửa, app hỏi lại nội dung rồi hiện pop-up */
self.addEventListener('push',e=>{e.waitUntil((async()=>{let ds=[];
  try{const c=await caches.open('tk-psc'),r=await c.match('./__tk');if(r){const tk=await r.json(),dk=await self.registration.pushManager.getSubscription();
    const x=await fetch(tk.api,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({fn:'layNhac',args:[tk.token,dk?dk.endpoint:'']}),redirect:'follow'});
    const j=await x.json();if(j.ok)ds=j.r||[]}}catch(err){}
  if(!ds.length)ds=[{t:'Phiếu sửa chữa',b:'Có việc cần xem, mở app để kiểm tra.',id:''}];
  for(const n of ds)await self.registration.showNotification(n.t,{body:n.b,tag:n.id?'v-'+n.id+'-'+Date.now():'psc',icon:'icon-180.png',badge:'icon-180.png',data:{id:n.id||''},requireInteraction:true,vibrate:[200,100,200]});
})())});
self.addEventListener('notificationclick',e=>{e.notification.close();const id=(e.notification.data||{}).id||'';
  const u=new URL('./'+(id?'?viec='+encodeURIComponent(id):''),self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(ws=>{for(const w of ws){if('focus'in w){w.navigate(u).catch(()=>{});return w.focus()}}return self.clients.openWindow(u)}))});
