const formO=document.getElementById('oportunidadeForm'),tabO=document.getElementById('oportunidadesTabela');
(async()=>{try{await loadClientsInto('clienteId');await carregarOp();}catch(e){alert(e.message)}})();
async function carregarOp(){const data=await request('/api/oportunidades');tabO.innerHTML=data.map(o=>`<tr><td>${escapeHtml(o.Cliente)}</td><td>${escapeHtml(o.Titulo)}</td><td>${money(o.Valor)}</td><td>${escapeHtml(o.Etapa)}</td><td>${dateTime(o.DataCriacao)}</td></tr>`).join('');}
formO.onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(formO));d.clienteId=Number(d.clienteId);d.valor=Number(d.valor||0);try{await request('/api/oportunidades',{method:'POST',body:JSON.stringify(d)});formO.reset();await carregarOp();}catch(e){alert(e.message)}};
