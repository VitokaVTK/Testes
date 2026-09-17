(async()=>{
  try{
    const data=await request('/api/dashboard');
    document.getElementById('clientes').textContent=data.clientes;
    document.getElementById('oportunidades').textContent=data.oportunidades;
    document.getElementById('valor').textContent=money(data.valorOportunidades);
    document.getElementById('tarefas').textContent=data.tarefasPendentes;
    const s=document.getElementById('apiStatus'); s.textContent='Banco conectado'; s.classList.add('ok');
  }catch(e){const s=document.getElementById('apiStatus');s.textContent='Banco indisponível';s.classList.add('error');}
})();
