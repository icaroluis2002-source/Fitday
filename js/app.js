// Tema, navegacao e renderizacao principal
// tema
try{const t=localStorage.getItem("fitdia-tema");if(t)document.documentElement.dataset.theme=t}catch(e){}
$("th").onclick=()=>{const d=document.documentElement,dark=d.dataset.theme?d.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;d.dataset.theme=dark?"light":"dark";try{localStorage.setItem("fitdia-tema",d.dataset.theme)}catch(e){}};
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{tab=b.dataset.t;render()});
function render(){document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("on",b.dataset.t===tab));
 const p=pendente();let h="";
 if(p){const r=resumo(p),[y,mo]=p.split("-");h+=`<div class="card banner" onclick="vm='${p}';S.vistos['${p}']=1;save();tab='painel';render()"><b>🎉 Fechou ${MES[+mo-1]}!</b><br>${r.perdeu===null?"Veja seu relatório do mês":"Toque para ver quantos kg você perdeu"}</div>`}
 $("app").innerHTML=h+({hoje:vHoje,painel:vPainel,perfil:vPerfil}[tab])();window.scrollTo(0,0)}

// Inicia o app
render();
