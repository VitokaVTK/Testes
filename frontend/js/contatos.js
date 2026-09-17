const formC=document.getElementById('contatoForm'),tabC=document.getElementById('contatosTabela');
(async()=>{try{await loadClientsInto('clienteId');await carregarContatos();}catch(e){alert(e.message)}})();
async function carregarContatos(){const data=await request('/api/contatos');tabC.innerHTML=data.map(c=>`<tr><td>${escapeHtml(c.Cliente)}</td><td>${escapeHtml(c.Assunto)}</td><td>${escapeHtml(c.Descricao||'-')}</td><td>${dateTime(c.DataContato)}</td></tr>`).join('');}
formC.onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(formC));d.clienteId=Number(d.clienteId);try{await request('/api/contatos',{method:'POST',body:JSON.stringify(d)});formC.reset();await carregarContatos();}catch(e){alert(e.message)}};
