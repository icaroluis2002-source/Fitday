// Telas (Hoje, Perfil, Painel) e acoes dos botoes
function vHoje(){const d=hoje(),ok=S.check[d],rs=S.refs[d]||[],dt=new Date();
 return `<p class="mu" style="margin:0 0 10px">${dt.toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}</p>
 <div class="card"><button class="big ${ok?"done":""}" onclick="toggle()">${ok?"✅ Treino feito hoje":"Fui à academia hoje"}</button>
 <p class="mu" style="margin:10px 0 0">🔥 Sequência: <b>${streak()}</b> dia(s)</p></div>
 <div class="card"><h2>Refeições de hoje</h2>
 <div class="g g2"><select id="tp"><option>Café da manhã</option><option>Almoço</option><option>Lanche</option><option>Jantar</option><option>Outra</option></select>
 <label class="btn" style="text-align:center;margin:0;color:var(--on);font-size:16px">📷 Enviar foto<input type="file" accept="image/*" hidden onchange="foto(this.files[0])"></label></div>
 ${rs.length?rs.map((m,i)=>`<div class="meal">${m.img?`<img src="${m.img}" alt="">`:`<div class="ph"></div>`}<div style="flex:1"><b>${m.t}</b><div class="mu">${m.h}</div></div><button class="ghost" onclick="delRef(${i})">✕</button></div>`).join(""):`<p class="mu">Nenhuma refeição registrada ainda.</p>`}</div>`}
function toggle(){const d=hoje();S.check[d]?delete S.check[d]:S.check[d]=1;save();render()}
function foto(f){if(!f)return;const r=new FileReader();r.onload=e=>{const i=new Image();i.onload=()=>{const s=Math.min(1,480/Math.max(i.width,i.height)),c=document.createElement("canvas");c.width=i.width*s;c.height=i.height*s;c.getContext("2d").drawImage(i,0,0,c.width,c.height);
 const d=hoje();(S.refs[d]=S.refs[d]||[]).push({t:$("tp").value,h:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),img:c.toDataURL("image/jpeg",.6)});save();render()};i.src=e.target.result};r.readAsDataURL(f)}
function delRef(i){S.refs[hoje()].splice(i,1);save();render()}
function vPerfil(){const u=ultimoPeso(),a=+S.altura;const imc=u&&a?u.w/((a/100)**2):null;
 return `<div class="card"><h2>Meus dados</h2><div class="g">
 <div><label>Altura (cm)</label><input id="al" type="number" inputmode="decimal" value="${S.altura}" placeholder="ex: 170"></div>
 <div class="g g2"><div><label>Peso (kg)</label><input id="pe" type="number" inputmode="decimal" step="0.1" value="${u?u.w:""}" placeholder="ex: 78,5"></div>
 <div><label>Gordura (%)</label><input id="gd" type="number" inputmode="decimal" step="0.1" value="${u&&u.bf?u.bf:""}" placeholder="ex: 22"></div></div>
 <button onclick="salvaPerfil()">Salvar medidas de hoje</button></div></div>
 ${imc?`<div class="card"><span class="mu">IMC atual</span><div class="big-num">${fmt(imc)}</div></div>`:""}
 <div class="card"><h2>Histórico</h2>${S.pesos.length?[...S.pesos].sort((a,b)=>a.d<b.d?1:-1).slice(0,8).map(p=>`<div class="meal row sp"><span>${p.d.split("-").reverse().join("/")}</span><b>${fmt(p.w)} kg${p.bf?" · "+fmt(p.bf)+"%":""}</b></div>`).join(""):`<p class="mu">Salve sua primeira medida acima.</p>`}</div>`}
function salvaPerfil(){const w=parseFloat($("pe").value.replace(",",".")),bf=parseFloat($("gd").value.replace(",","."));S.altura=$("al").value;
 if(w>0){S.pesos=S.pesos.filter(p=>p.d!==hoje());S.pesos.push({d:hoje(),w,bf:bf>0?bf:null})}save();tab="painel";render()}
function vPainel(){const m=vm||ym(hoje()),[y,mo]=m.split("-").map(Number),r=resumo(m),n=new Date(y,mo,0).getDate(),off=new Date(y,mo-1,1).getDay();
 const nav=`<div class="row sp card"><button class="ghost" onclick="mudaMes(-1)">‹</button><b>${MES[mo-1]} ${y}</b><button class="ghost" onclick="mudaMes(1)">›</button></div>`;
 let res="";if(r.perdeu!==null){const v=r.perdeu;res=`<div class="card"><span class="mu">Resultado do mês</span><div class="big-num ${v>0?"pos":v<0?"neg":""}">${v>0?"−":v<0?"+":""}${fmt(Math.abs(v))} kg</div><p class="mu" style="margin:8px 0 0">${v>0?"Você perdeu peso em "+MES[mo-1]+". Continue assim! 💪":v<0?"Seu peso subiu um pouco. Recomece forte no próximo mês!":"Peso estável neste mês."} ${fmt(r.ini.w)} → ${fmt(r.fim.w)} kg</p></div>`}
 else res=`<div class="card mu">Registre seu peso na aba Perfil para ver o resultado do mês.</div>`;
 const bfs=r.ps.filter(p=>p.bf),dbf=bfs.length>1?bfs[0].bf-bfs[bfs.length-1].bf:null;
 const days=Array.from({length:off},()=>"<i style='background:none'></i>").join("")+Array.from({length:n},(_,i)=>`<i class="${S.check[m+"-"+pad(i+1)]?"y":""}">${i+1}</i>`).join("");
 return nav+res+`<div class="g g3" style="margin-bottom:14px"><div class="card stat" style="margin:0"><b>${r.dias}</b><span class="mu">treinos</span></div><div class="card stat" style="margin:0"><b>${r.ref}</b><span class="mu">refeições</span></div><div class="card stat" style="margin:0"><b>${Math.round(r.dias/n*100)}%</b><span class="mu">dos dias</span></div></div>`
 +`<div class="card"><h2>Peso no mês</h2>${grafico(r.ps)}${dbf!==null?`<p class="mu" style="margin:8px 0 0">Gordura corporal: ${dbf>0?"−":"+"}${fmt(Math.abs(dbf))} p.p.</p>`:""}</div>`
 +`<div class="card"><h2>Dias de treino</h2><div class="cal">${days}</div></div>`}
function mudaMes(k){const m=vm||ym(hoje()),[y,mo]=m.split("-").map(Number),d=new Date(y,mo-1+k,1);vm=d.getFullYear()+"-"+pad(d.getMonth()+1);render()}
function grafico(ps){if(ps.length<2)return `<p class="mu">Registre pelo menos 2 pesagens no mês para ver o gráfico.</p>`;
 const ws=ps.map(p=>p.w),mn=Math.min(...ws)-1,mx=Math.max(...ws)+1,W=300,H=130,x=i=>10+i*(W-20)/(ps.length-1),y=w=>H-15-(w-mn)/(mx-mn)*(H-30);
 return `<svg viewBox="0 0 ${W} ${H}"><polyline fill="none" stroke="var(--ac)" stroke-width="3" stroke-linejoin="round" points="${ps.map((p,i)=>x(i)+","+y(p.w)).join(" ")}"/>${ps.map((p,i)=>`<circle cx="${x(i)}" cy="${y(p.w)}" r="4" fill="var(--ac)"/>`).join("")}<text x="10" y="12" font-size="11" fill="var(--mu)">${fmt(mx-1)} kg</text><text x="10" y="${H-2}" font-size="11" fill="var(--mu)">${fmt(mn+1)} kg</text></svg>`}
