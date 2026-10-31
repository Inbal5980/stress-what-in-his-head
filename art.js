/* ציור דמויות ומד לחץ (מקורי, ללא תמונות חיצוניות) */
(function(){
  function hairTop(a){
    var h=a.grey?'#b9b6b1':a.hair;
    switch(a.style){
      case 'long': return '<path d="M35 52 C33 25 87 24 85 52 C80 38 70 33 60 34 C49 33 40 39 35 52Z" fill="'+h+'"/>';
      case 'ponytail': return '<path d="M35 52 C33 25 87 24 85 52 C80 38 70 33 60 34 C49 33 40 39 35 52Z" fill="'+h+'"/><path d="M83 40 C100 44 100 70 90 80 C94 64 90 52 82 48Z" fill="'+h+'"/>';
      case 'curly': var s='';var pts=[[38,44],[44,34],[53,29],[63,28],[72,31],[80,37],[84,46],[36,54],[86,55]];
        pts.forEach(function(p){s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="8.5" fill="'+h+'"/>';});return s;
      case 'bun': return '<circle cx="60" cy="24" r="10" fill="'+h+'"/><path d="M35 52 C33 27 87 26 85 52 C80 39 70 35 60 36 C49 35 40 40 35 52Z" fill="'+h+'"/>';
      case 'bald': return '<path d="M35 58 C34 50 36 46 39 44 L40 56Z M85 58 C86 50 84 46 81 44 L80 56Z" fill="'+h+'"/>';
      default: return '<path d="M35 50 C34 26 86 24 85 50 C82 40 74 36 66 37 C58 34 44 36 35 50Z" fill="'+h+'"/>';
    }
  }
  function avatarSVG(a, mood){
    a=a||{};mood=mood||'neutral';
    var skin=a.skin||'#f1c7a1', shirt=a.shirt||'#5b3fd1', bg=a.bg||'#ece8ff', hair=a.grey?'#b9b6b1':(a.hair||'#3b2a20');
    var id='c'+Math.random().toString(36).slice(2,8);
    var s='<svg viewBox="0 0 120 120" class="avatar-svg" role="img" aria-hidden="true">';
    s+='<defs><clipPath id="'+id+'"><circle cx="60" cy="60" r="60"/></clipPath></defs>';
    s+='<circle cx="60" cy="60" r="60" fill="'+bg+'"/><g clip-path="url(#'+id+')">';
    if(a.style==='long') s+='<path d="M31 54 C30 24 90 24 89 54 L93 96 C80 102 40 102 27 96Z" fill="'+hair+'"/>';
    s+='<path d="M16 124 C18 94 38 86 60 86 C82 86 102 94 104 124Z" fill="'+shirt+'"/>';
    if(a.uniform) s+='<path d="M48 88 L60 104 L72 88" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="3"/>';
    s+='<rect x="52" y="70" width="16" height="18" rx="6" fill="'+skin+'"/>';
    s+='<circle cx="36" cy="59" r="5" fill="'+skin+'"/><circle cx="84" cy="59" r="5" fill="'+skin+'"/>';
    s+='<ellipse cx="60" cy="56" rx="24" ry="27" fill="'+skin+'"/>';
    if(a.helmet){ s+='<path d="M33 52 C33 22 87 22 87 52 L87 54 L33 54Z" fill="'+(a.helmet===true?'#6b7a3c':a.helmet)+'"/><path d="M30 54 L90 54" stroke="#4d5a26" stroke-width="4" stroke-linecap="round"/><path d="M38 56 C40 76 50 82 60 83" stroke="#4d5a26" stroke-width="2" fill="none"/>'; }
    else s+=hairTop(a);
    if(a.beard) s+='<path d="M37 60 C38 78 48 86 60 86 C72 86 82 78 83 60 C80 70 72 74 60 74 C48 74 40 70 37 60Z" fill="'+hair+'"/>';
    // brows
    if(mood==='stress') s+='<path d="M44 46 L55 49 M76 46 L65 49" stroke="#3a2a22" stroke-width="2.6" stroke-linecap="round"/>';
    else if(mood==='calm') s+='<path d="M44 47 Q50 44 55 47 M65 47 Q70 44 76 47" stroke="#3a2a22" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    else s+='<path d="M45 47 L55 47 M65 47 L75 47" stroke="#3a2a22" stroke-width="2.4" stroke-linecap="round"/>';
    // eyes
    if(mood==='calm') s+='<path d="M47 56 Q51 52 55 56 M65 56 Q69 52 73 56" stroke="#2b2230" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
    else s+='<circle cx="51" cy="56" r="'+(mood==='stress'?3.2:2.7)+'" fill="#2b2230"/><circle cx="69" cy="56" r="'+(mood==='stress'?3.2:2.7)+'" fill="#2b2230"/>';
    if(a.glasses) s+='<g fill="none" stroke="#2b2230" stroke-width="2"><circle cx="51" cy="56" r="7"/><circle cx="69" cy="56" r="7"/><path d="M58 56 L62 56"/></g>';
    // mouth
    if(mood==='stress') s+='<path d="M51 71 Q60 64 69 71" stroke="#7a2e2e" stroke-width="2.8" fill="none" stroke-linecap="round"/><path d="M86 38 C83 44 82 47 86 49 C90 47 89 44 86 38Z" fill="#6cc6ff"/>';
    else if(mood==='calm') s+='<path d="M50 66 Q60 76 70 66" stroke="#7a2e2e" stroke-width="2.8" fill="none" stroke-linecap="round"/><circle cx="44" cy="65" r="4" fill="#ff9f9f" opacity=".5"/><circle cx="76" cy="65" r="4" fill="#ff9f9f" opacity=".5"/>';
    else s+='<path d="M53 69 Q60 71 67 69" stroke="#7a2e2e" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
    s+='</g></svg>';
    return s;
  }
  function meterSVG(){
    return '<svg viewBox="0 0 200 118" class="meter-svg" aria-hidden="true">'+
      '<defs><linearGradient id="mg" x1="0" x2="1"><stop offset="0" stop-color="#18b79f"/><stop offset=".5" stop-color="#ffcf4a"/><stop offset="1" stop-color="#ef4f4f"/></linearGradient></defs>'+
      '<path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="#e7e3f5" stroke-width="20" stroke-linecap="round"/>'+
      '<path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="url(#mg)" stroke-width="20" stroke-linecap="round" opacity=".95"/>'+
      '<g class="needle" style="transform-origin:100px 100px;transform:rotate(-90deg)"><path d="M100 100 L97 36 L100 26 L103 36Z" fill="#2c2350"/></g>'+
      '<circle cx="100" cy="100" r="9" fill="#2c2350"/></svg>';
  }
  function setMeter(el, level){
    var n=el.querySelector('.needle'); if(!n) return;
    var deg=-90+Math.max(0,Math.min(1,level))*180; n.style.transform='rotate('+deg+'deg)';
  }
  window.ART={avatarSVG:avatarSVG,meterSVG:meterSVG,setMeter:setMeter};
})();
