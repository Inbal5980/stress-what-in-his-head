(function(){
'use strict';
var C=window.GAME_CONFIG, ART=window.ART;
var $=function(s){return document.querySelector(s)};
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var cards=C.CARDS, idx=0, score=0, maxScore=0, results=[];
cards.forEach(function(c){maxScore+=1+(c.primary==='threat'?2:0)});
var S1=C.STAGE1+' <small>('+C.STAGE1_BAGRUT+')</small>', S2=C.STAGE2+' <small>('+C.STAGE2_BAGRUT+')</small>';
function g(c,m,f){return c.gender==='f'?f:m}
function capLabel(c,yes){return (yes?'':'לא ')+g(c,'מסוגל','מסוגלת')}

/* intro */
$('#t-title').textContent=C.TITLE; $('#t-sub').textContent=C.SUBTITLE; document.title=C.TITLE+' · מודל האינטראקציה של לזרוס';
$('#i-title').textContent=C.TITLE;
$('#i-text').innerHTML=C.INTRO.map(function(p){return '<p>'+esc(p)+'</p>'}).join('');
$('#how1').innerHTML='<b style="all:unset;font-weight:700">שלב ראשון:</b> '+esc(C.STAGE1)+' ('+esc(C.STAGE1_BAGRUT)+')';
$('#how2').innerHTML='<b style="all:unset;font-weight:700">שלב שני:</b> '+esc(C.STAGE2)+' ('+esc(C.STAGE2_BAGRUT)+')';
$('#intro-art').innerHTML=[cards[0],cards[3],cards[6]].map(function(c){return '<div class="avatar">'+ART.avatar(c,'neutral')+'</div>'}).join('');
$('#start').addEventListener('click',function(){$('#intro').classList.add('hidden');renderCard();});

/* help */
var hb='';C.DEFINITIONS.forEach(function(d){hb+='<div class="quote def"><div class="t">'+esc(d.term)+'</div>"'+esc(d.text)+'"<span class="src">'+esc(d.source)+'</span></div>'});
hb+='<div class="quote def"><div class="t">הערכת יכולת ההתמודדות של האדם תלויה בכמה גורמים:</div><ol class="res-list">'+C.RESOURCES.map(function(r){return '<li>'+esc(r.label)+'</li>'}).join('')+'</ol><span class="src">מתוך הסיכום ביחידה</span></div>';
$('#help-body').innerHTML=hb;
$('#help-btn').addEventListener('click',function(){$('#help').classList.remove('hidden');$('#help-close').focus();});
$('#help-close').addEventListener('click',function(){$('#help').classList.add('hidden');});
$('#help').addEventListener('click',function(e){if(e.target.id==='help')$('#help').classList.add('hidden');});
document.addEventListener('keydown',function(e){if(e.key==='Escape')$('#help').classList.add('hidden');});

function updateTop(){
  $('#progress').textContent='כרטיס '+Math.min(idx+1,cards.length)+'/'+cards.length;
  $('#score').textContent='⭐ '+score;
}
function setStepper(on,skip){
  document.querySelectorAll('#stepper li').forEach(function(li){
    var s=+li.dataset.s; li.className='';
    if(s<on) li.classList.add('done'); if(s===on) li.classList.add('on'); if(skip&&s===2&&on===3) li.className='skip';
  });
}
function trail(html,cls){var li=document.createElement('li');li.innerHTML=html;if(cls)li.className=cls;$('#trail').appendChild(li);}
function arrow(){trail('←','arrow');}
function scrollToSteps(){
  if(window.innerWidth>=860) return;
  var el=$('#steps'); var y=el.getBoundingClientRect().top+window.pageYOffset-8;
  window.scrollTo({top:y,behavior:'smooth'});
}

function renderCard(){
  var c=cards[idx]; updateTop();
  var card=$('#card'); card.style.animation='none'; void card.offsetWidth; card.style.animation='';
  var pt=$('#pairtag');
  if(c.twin){pt.className='pairtag twin';pt.innerHTML='👯 הדמות התאומה: אותו מצב, מסלול אחר?';}
  else {pt.className='pairtag';pt.textContent='זוג '+c.pair+' · '+c.topic;}
  $('#avatar').innerHTML=ART.avatar(c,'neutral');
  $('#c-name').textContent=c.name; $('#c-situation').textContent=c.situation; $('#c-thought').textContent=c.thought;
  $('#trail').innerHTML='';
  step1();
  window.scrollTo({top:0});
}

function choiceStep(opts){
  // opts: title, q, choices[{id,label,emoji}], correct, hint, onDone(firstTry,choiceLabel)
  var first=true;
  var body=$('#step-body');
  body.innerHTML='<h2 class="st-title">'+opts.title+'</h2>'+(opts.q?'<p class="st-q">'+opts.q+'</p>':'')+
    '<div class="choices'+(opts.choices.length===2?' two':'')+'" role="group">'+opts.choices.map(function(o){
      return '<button type="button" class="choice" data-id="'+o.id+'">'+(o.emoji?'<span class="em" aria-hidden="true">'+o.emoji+'</span>':'')+'<span>'+esc(o.label)+'</span></button>'}).join('')+'</div><div id="fb"></div>';
  body.querySelectorAll('.choice').forEach(function(b){
    b.addEventListener('click',function(){
      if(b.classList.contains('wrong')||body.dataset.locked) return;
      var id=b.dataset.id;
      if(String(id)===String(opts.correct)){
        body.dataset.locked='1'; b.classList.add('right');
        body.querySelectorAll('.choice').forEach(function(x){x.disabled=true});
        if(first){score++;updateTop();}
        $('#fb').innerHTML='<div class="ok-msg">'+(first?'✔ נכון! +1':'✔ נכון.')+'</div>';
        var lbl=b.querySelector('span:last-child').textContent.trim();
        setTimeout(function(){delete body.dataset.locked;opts.onDone(first,lbl,b.querySelector('.em')?b.querySelector('.em').textContent:'')},750);
      } else {
        first=false; b.classList.add('wrong','shake'); b.setAttribute('aria-disabled','true');
        $('#fb').innerHTML='<div class="hint"><b>💡 רמז:</b> '+esc(opts.hint)+'</div>';
      }
    });
  });
}

function step1(){
  var c=cards[idx]; setStepper(1);
  choiceStep({
    title:'שלב ראשון: '+S1,
    q:C.STAGE1_QUESTIONS.map(function(q){return '<span>'+esc(q)+'</span>'}).join(' ')+'<br>מה '+esc(c.name)+' '+g(c,'עונה לעצמו','עונה לעצמה')+'?',
    choices:C.PRIMARY_OPTIONS, correct:c.primary, hint:c.primaryHint,
    onDone:function(ft,lbl,em){
      trail(esc(em+' '+lbl));
      if(c.primary==='threat'){ arrow(); step2a(); }
      else { result(); }
      scrollToSteps();
    }
  });
}

function step2a(){
  var c=cards[idx]; setStepper(2);
  var body=$('#step-body');
  body.innerHTML='<h2 class="st-title">שלב שני: '+S2+'</h2><p class="st-q">אילו משאבים יש ל'+esc(c.name)+'? סמנו רק מה שכתוב בכרטיס (אפשר גם אף אחד).</p>'+
    '<div class="res-grid">'+C.RESOURCES.map(function(r){return '<button type="button" class="res" aria-pressed="false" data-id="'+r.id+'"><span class="row"><span class="box" aria-hidden="true"></span><span>'+r.emoji+' '+esc(r.label)+'</span></span><span class="why"></span></button>'}).join('')+'</div>'+
    '<div class="actions"><button type="button" class="btn" id="check">בדיקה</button></div><div id="fb"></div>';
  var checked=false;
  body.querySelectorAll('.res').forEach(function(b){b.addEventListener('click',function(){ if(checked)return; var on=b.getAttribute('aria-pressed')!=='true'; b.setAttribute('aria-pressed',on); b.querySelector('.box').textContent=on?'✓':''; });});
  $('#check').addEventListener('click',function(){
    if(checked){step2b();scrollToSteps();return;}
    checked=true; var allOk=true, have=0;
    body.querySelectorAll('.res').forEach(function(b){
      var id=b.dataset.id, picked=b.getAttribute('aria-pressed')==='true', has=!!c.resources[id];
      if(has)have++;
      var ok=picked===has; if(!ok)allOk=false;
      b.classList.add(ok?'ok':'bad'); b.disabled=true;
      b.querySelector('.box').textContent=has?'✓':'✗';
      b.querySelector('.why').textContent=(has?'':'חסר: ')+(c.resourceWhy[id]||'');
      if(!has&&(c.resourceWhy[id]||'').indexOf('לא מוזכר')===0) b.querySelector('.why').textContent=c.resourceWhy[id];
    });
    if(allOk){score++;updateTop();}
    $('#fb').innerHTML=allOk?'<div class="ok-msg">✔ זיהיתם בדיוק את המשאבים! +1</div>':'<div class="hint"><b>שימו לב:</b> בירוק מה שנכון, באדום מה שפספסתם. כך זה מופיע בכרטיס.</div>';
    $('#check').textContent='המשך ←';
    trail('🧰 '+have+'/'+C.RESOURCES.length+' משאבים');
  });
}

function step2b(){
  var c=cards[idx];
  choiceStep({
    title:'שלב שני: '+S2,
    q:'אז מה '+esc(c.name)+' '+g(c,'מעריך','מעריכה')+' לגבי היכולת שלו'.replace('שלו',g(c,'שלו','שלה'))+' להתמודד?',
    choices:[{id:'true',label:capLabel(c,true),emoji:'💪'},{id:'false',label:capLabel(c,false),emoji:'😣'}],
    correct:String(!!c.capable), hint:c.capableHint,
    onDone:function(ft,lbl,em){ arrow(); trail(esc(em+' '+lbl)); result(); scrollToSteps(); }
  });
}

function result(){
  var c=cards[idx];
  var stressed=(c.primary==='threat'&&c.capable===false);
  var level=c.level!=null?c.level:(stressed?0.9:0.08);
  setStepper(3,c.primary!=='threat');
  arrow(); trail(stressed?'יש לחץ':'אין לחץ',stressed?'res-stress':'res-calm');
  results.push({c:c,stressed:stressed});
  var next=cards[idx+1];
  var nextLbl=!next?'לסיכום ולקוד הסיום 🏁':(next.twin?'לדמות התאומה ←':'לזוג הבא ←');
  var body=$('#step-body');
  body.innerHTML='<h2 class="st-title">מד הלחץ</h2><div class="result"><div><div id="meter">'+ART.meterSVG()+'</div><div class="meter-scale"><span>אין לחץ</span><span>יש לחץ</span></div>'+
    '<div class="verdict '+(stressed?'stress':'calm')+'">'+(stressed?'יש לחץ':'אין לחץ')+'</div></div>'+
    '<div><p class="explain">'+esc(c.explanation)+'</p>'+(c.primary!=='threat'?'<p class="explain" style="color:var(--dim);font-size:14px;margin-top:6px">התשובה בשלב הראשון לא הייתה "זה מאיים", ולכן לא עוברים לשלב השני.</p>':'')+'</div></div>'+
    (next&&next.twin?'<div class="twin-teaser">👯 עכשיו: '+esc(next.name)+', באותו מצב בדיוק. האם המסלול יהיה אותו דבר?</div>':'')+
    '<div class="actions next-wrap"><button type="button" class="btn" id="next">'+nextLbl+'</button></div>';
  requestAnimationFrame(function(){requestAnimationFrame(function(){ART.setMeter($('#meter'),level);})});
  setTimeout(function(){$('#avatar').innerHTML=ART.avatar(c,stressed?'stress':'calm');},600);
  $('#next').addEventListener('click',function(){ idx++; if(idx>=cards.length) end(); else renderCard(); });
}

function pad(n){return (n<10?'0':'')+n}
function end(){
  setTimeout(function(){if(window.CONFETTI)CONFETTI();},250);
  $('#game').classList.add('hidden'); $('#end').classList.remove('hidden');
  updateTop(); $('#progress').textContent='סיום ✓';
  $('#end-game-title').textContent=C.TITLE;
  $('#end-score').textContent=score; $('#end-max').textContent='/'+maxScore;
  var pct=score/maxScore; var stars=pct>=0.85?3:pct>=0.6?2:1;
  $('#stars').textContent='★★★'.slice(0,stars)+'☆☆☆'.slice(0,3-stars);
  $('#end-sub').textContent=pct>=0.85?'מעולה! אתם מזהים את שני שלבי ההערכה כמו מומחים.':pct>=0.6?'יפה מאוד! עוד סיבוב קטן ותהיו מושלמים.':'התחלה טובה. כדאי לקרוא שוב את התזכורת ולשחק עוד פעם.';
  $('#end-code').textContent=C.COMPLETION_CODE;
  var d=new Date(); $('#end-date').textContent=pad(d.getDate())+'.'+pad(d.getMonth()+1)+'.'+d.getFullYear()+' · '+pad(d.getHours())+':'+pad(d.getMinutes());
  $('#end-note').textContent=C.END_NOTE;
  $('#recap').innerHTML=results.map(function(r){
    var c=r.c, path=C.PRIMARY_OPTIONS.filter(function(o){return o.id===c.primary})[0].label;
    if(c.primary==='threat') path+=' ← '+capLabel(c,!!c.capable);
    return '<li><span class="avatar">'+ART.avatar(c,r.stressed?'stress':'calm')+'</span><span class="p"><b>'+esc(c.name)+'</b> · '+esc(path)+'</span><span class="r '+(r.stressed?'stress':'calm')+'">'+(r.stressed?'יש לחץ':'אין לחץ')+'</span></li>';
  }).join('');
  window.scrollTo({top:0});
  try{ if(window.parent&&window.parent!==window) window.parent.postMessage({type:'stress-game-complete',game:'what-in-his-head',code:String(C.COMPLETION_CODE),score:score,max:maxScore},'*'); }catch(e){}
}
function copyText(t,cb){
  function fb(){ var a=document.createElement('textarea'); a.value=t; a.setAttribute('readonly',''); a.style.position='fixed'; a.style.top='-200px'; document.body.appendChild(a); a.select(); var ok=false; try{ok=document.execCommand('copy')}catch(e){} a.remove(); cb(ok); }
  if(navigator.clipboard&&window.isSecureContext){ navigator.clipboard.writeText(t).then(function(){cb(true)},fb); } else fb();
}
$('#copy-code').addEventListener('click',function(){
  var nm=$('#student-name').value.trim();
  var t=(nm?nm+' | ':'')+C.TITLE+' | קוד סיום: '+C.COMPLETION_CODE+' | ניקוד: '+score+'/'+maxScore;
  copyText(t,function(ok){ $('#copied').textContent=ok?'✔ הועתק! הדביקו בקלאסרום':'לא הצלחתי להעתיק, צלמו מסך במקום'; });
});
$('#again').addEventListener('click',function(){ idx=0;score=0;results=[]; $('#end').classList.add('hidden'); $('#game').classList.remove('hidden'); renderCard(); });

window.__g1={state:function(){return {idx:idx,score:score,max:maxScore,card:cards[idx]&&cards[idx].id}},cards:cards};
})();
