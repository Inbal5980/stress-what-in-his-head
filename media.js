/* מפת הדמויות של המשחק (שם בהגדרות ← קובץ תמונה) */
window.MEDIA={
 "NAMES": {
  "אורי": "uri",
  "נדב": "nadav",
  "שירה": "shira",
  "רותם": "rotem",
  "גיא": "guy",
  "טל": "tal",
  "נחום": "nahum",
  "אירית": "irit"
 }
};

/* דמויות תלת ממד. התמונות בתיקייה media/img. */
(function(){
  var M=window.MEDIA;
  var ART=window.ART;
  function key(c){ return c && M.NAMES[c.name]; }
  ART.avatar=function(c,mood){
    var k=key(c); mood=mood||'neutral';
    if(!k) return ART.avatarSVG(c.avatar||{},mood);
    var lbl=c.name+(mood==='stress'?' לחוץ/ה':mood==='calm'?' רגוע/ה':'');
    return '<img class="av3d mood-'+mood+'" src="media/img/'+k+'-'+mood+'.webp" alt="'+lbl+'" width="256" height="256" decoding="async">';
  };
  /* preload */
  window.addEventListener('load',function(){ Object.keys(M.NAMES).forEach(function(n){['neutral','stress','calm'].forEach(function(m){var i=new Image(); i.src='media/img/'+M.NAMES[n]+'-'+m+'.webp';});}); });

  /* ---- confetti (end screen) ---- */
  window.CONFETTI=function(){
    if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var cv=document.createElement('canvas'); cv.className='confetti'; document.body.appendChild(cv);
    var ctx=cv.getContext('2d'), W, H, dpr=Math.min(2,window.devicePixelRatio||1);
    function rs(){ W=cv.width=innerWidth*dpr; H=cv.height=innerHeight*dpr; } rs();
    var cols=['#7e5cf2','#ff6fae','#ffcf4a','#12a38f','#4cc3ff','#ff8a3d'], ps=[];
    for(var i=0;i<140;i++) ps.push({x:Math.random()*W,y:-Math.random()*H*0.6,w:(6+Math.random()*7)*dpr,h:(9+Math.random()*9)*dpr,vy:(2+Math.random()*3.5)*dpr,vx:(Math.random()-.5)*2.4*dpr,r:Math.random()*6,vr:(Math.random()-.5)*.25,c:cols[i%cols.length]});
    var t0=performance.now();
    (function f(t){ ctx.clearRect(0,0,W,H); var alive=false;
      ps.forEach(function(p){ p.x+=p.vx; p.y+=p.vy; p.r+=p.vr; if(p.y<H+20) alive=true; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.fillStyle=p.c; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h*Math.abs(Math.cos(p.r*1.7))); ctx.restore(); });
      if(alive&&t-t0<6000) requestAnimationFrame(f); else cv.remove(); })(t0);
  };
})();
