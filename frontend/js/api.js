async function request(url, options = {}) {
  const response = await fetch(url, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.erro || data.detalhe || 'Erro na requisição.');
  return data;
}
function money(value){return Number(value||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
function dateTime(value){return value ? new Date(value).toLocaleString('pt-BR') : '-';}
function dateOnly(value){return value ? new Date(`${String(value).slice(0,10)}T00:00:00`).toLocaleDateString('pt-BR') : '-';}
async function loadClientsInto(selectId, includeEmpty=true){
  const select=document.getElementById(selectId); if(!select) return;
  const clients=await request('/api/clientes');
  select.innerHTML=(includeEmpty?'<option value="">Selecione</option>':'')+clients.map(c=>`<option value="${c.Id}">${escapeHtml(c.Nome)}</option>`).join('');
}
function escapeHtml(value){return String(value??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
