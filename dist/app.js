'use strict';
const escapeHTML=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const pixelPatterns={
dog:['..aa......aa..','..aba....aba..','..abbaaaabba..','..acbbbbaca..','..abbbbbbbba..','..abdbbdbba..','...bbbbbb...','....beeb....','.....bb.....','....aaaa....','...abbbba...','..abbbbbba..','..abbbbbba..','...aa..aa...'],
market:['......a......','.....aaa.....','....aaaaa....','...bbbbbbb...','..bcbcbcbcb..','..ddddddddd..','...e.e.e.e...','...e.e.e.e...','..fffffffff..','..fgfgggfgf..','..fgfgggfgf..','..fffffffff..','..a.......a..','..a.......a..'],
race:['.....aaaa.....','....abbbba....','....abccba....','...aabccbaa...','...abbbbbba...','..addaaaadda..','..adebbb eda..'.replace(/ /g,'b'),'..addbbbbdda..','...adddddda...','....affffa....','....afggfa....','....affffa....','....h....h....','....h....h....']};
function pixelArt(type){
 const palettes={dog:{a:'#6f462b',b:'#e5b879',c:'#efcd9e',d:'#25354b',e:'#9f554a'},market:{a:'#f1b662',b:'#d85643',c:'#fff0b4',d:'#e3c27e',e:'#f4df83',f:'#593d4a',g:'#e9a778'},race:{a:'#182749',b:'#68c3da',c:'#aecfe6',d:'#e46071',e:'#fff2b8',f:'#1b2542',g:'#58769b',h:'#f3df8a'}};
 const icons={horse:'♞',pan:'🍳',takoyaki:'🐙',crepe:'🥞',shop:'♜',pumpkin:'🎃',gift:'🎁',egg:'🥚',book:'▤',cake:'🍰',sword:'⚔',icecream:'🍦',baseball:'⚾',planet:'✦',chart:'↗',map:'▧',coffee:'☕'};
 if(!pixelPatterns[type])return `<span aria-hidden="true" class="small-symbol">${icons[type]||'✦'}</span>`;
 const p=palettes[type];let rects='';pixelPatterns[type].forEach((row,y)=>Array.from(row).forEach((c,x)=>{if(p[c])rects+=`<rect x="${x}" y="${y}" width="1" height="1" fill="${p[c]}"/>`;}));
 return `<svg class="pixel-art" viewBox="-1 -1 16 16" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}

fetch('games.json').then(response=>{if(!response.ok)throw new Error('load');return response.json();}).then(games=>{
 document.querySelector('#banners').innerHTML=games.slice(0,3).map((game,index)=>`<a class="game-banner banner-${index}" href="${escapeHTML(game.url)}" target="_blank" rel="noopener noreferrer">${pixelArt(['dog','market','race'][index])}<span class="banner-info"><strong>${escapeHTML(game.name)}</strong><small>♥ ${game.likes.toLocaleString()}</small></span></a>`).join('');
 const pageSize=15;
 const pageCount=Math.ceil(games.length/pageSize);
 const pagination=document.querySelector('#pagination');
 let currentPage=1;
 const pageButton=(label,page,ariaLabel)=>`<button type="button" data-page="${page}"${ariaLabel?` aria-label="${ariaLabel}"`:''}>${label}</button>`;
 pagination.innerHTML=pageButton('上一頁','previous')+Array.from({length:pageCount},(_,index)=>pageButton(index+1,index+1,`第 ${index+1} 頁`)).join('')+pageButton('下一頁','next');
 pagination.hidden=pageCount<=1;
 function renderPage(page){
  currentPage=Math.max(1,Math.min(pageCount,page));
  const start=(currentPage-1)*pageSize;
  document.querySelector('#games').innerHTML=games.slice(start,start+pageSize).map(game=>`<tr><td><a class="game-title" href="${escapeHTML(game.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(game.name)}</a></td><td>${escapeHTML(game.description)}</td><td class="likes"><a href="${escapeHTML(game.source)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(game.name)}，${game.likes.toLocaleString()} 讚，查看來源留言">${game.likes.toLocaleString()}</a></td></tr>`).join('');
  pagination.querySelectorAll('button').forEach(button=>{
   const target=button.dataset.page;
   button.disabled=(target==='previous'&&currentPage===1)||(target==='next'&&currentPage===pageCount);
   if(Number(target)===currentPage)button.setAttribute('aria-current','page');
   else button.removeAttribute('aria-current');
  });
 }
 pagination.addEventListener('click',event=>{
  const button=event.target.closest('button[data-page]');
  if(!button||button.disabled)return;
  const target=button.dataset.page;
  renderPage(target==='previous'?currentPage-1:target==='next'?currentPage+1:Number(target));
  document.querySelector('.game-list').scrollIntoView({block:'start'});
 });
 renderPage(1);
}).catch(()=>{document.querySelector('#games').innerHTML='<tr><td colspan="3">遊戲清單載入失敗，請重新整理。</td></tr>';});

