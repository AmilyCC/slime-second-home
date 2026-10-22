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
 document.querySelector('#games').innerHTML=games.map(game=>`<tr><td><a class="game-title" href="${escapeHTML(game.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(game.name)}</a></td><td>${escapeHTML(game.description)}</td><td class="likes"><a href="${escapeHTML(game.source)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(game.name)}，${game.likes.toLocaleString()} 讚，查看來源留言">${game.likes.toLocaleString()}</a></td></tr>`).join('');
}).catch(()=>{document.querySelector('#games').innerHTML='<tr><td colspan="3">遊戲清單載入失敗，請重新整理。</td></tr>';});
