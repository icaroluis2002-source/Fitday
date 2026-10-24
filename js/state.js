// Dados, localStorage e funcoes de calculo
const MES=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
let S={altura:"",pesos:[],check:{},refs:{},vistos:{}},tab="hoje",vm=null;
try{const r=localStorage.getItem("fitdia");if(r)S=Object.assign(S,JSON.parse(r))}catch(e){}
const save=()=>{try{localStorage.setItem("fitdia",JSON.stringify(S))}catch(e){alert("Sem espaço para salvar. Remova algumas fotos antigas.")}};
const pad=n=>String(n).padStart(2,"0");
const ymd=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const hoje=()=>ymd(new Date()),ym=s=>s.slice(0,7),$=id=>document.getElementById(id);
const fmt=n=>(Math.round(n*10)/10).toString().replace(".",",");
function ultimoPeso(){return [...S.pesos].sort((a,b)=>a.d<b.d?-1:1).pop()}
function pendente(){const h=hoje(),now=new Date(),fim=new Date(now.getFullYear(),now.getMonth()+1,0).getDate()===now.getDate();
 const ms=[...new Set(S.pesos.map(p=>ym(p.d)))].sort().reverse();
 return ms.find(m=>!S.vistos[m]&&(m<ym(h)||(fim&&m===ym(h))))}
function resumo(m){const ps=S.pesos.filter(p=>ym(p.d)===m).sort((a,b)=>a.d<b.d?-1:1);
 const ant=S.pesos.filter(p=>p.d<m+"-01").sort((a,b)=>a.d<b.d?-1:1).pop();
 const ini=ant||ps[0],fim=ps[ps.length-1];
 const dias=Object.keys(S.check).filter(d=>ym(d)===m).length;
 const ref=Object.entries(S.refs).filter(([d])=>ym(d)===m).reduce((a,[,v])=>a+v.length,0);
 return{ps,ini,fim,perdeu:ini&&fim?ini.w-fim.w:null,dias,ref}}
function streak(){let n=0,d=new Date();if(!S.check[ymd(d)])d.setDate(d.getDate()-1);while(S.check[ymd(d)]){n++;d.setDate(d.getDate()-1)}return n}
