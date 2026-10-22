'use strict';
const escapeHTML=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
fetch('games.json').then(response=>{if(!response.ok)throw new Error('load');return response.json();}).then(games=>{
 document.querySelector('#games').innerHTML=games.map(game=>{
  const username=new URL(game.source).pathname.split('/')[1].replace(/^@/,'');
  return `<tr><td><a href="${escapeHTML(game.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(game.name)}</a></td><td>${escapeHTML(game.description)}</td><td><a class="provider-name" href="${escapeHTML(game.source)}" target="_blank" rel="noopener noreferrer">${escapeHTML(username)}</a><br><span class="likes">${game.likes.toLocaleString()} 讚</span></td></tr>`;
 }).join('');
}).catch(()=>{document.querySelector('#games').innerHTML='<tr><td colspan="3">遊戲清單載入失敗，請重新整理。</td></tr>';});
