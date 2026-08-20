const defaults = {
  screen:'entry', onboarding:false, route:null, discovery:null,
  capacity:{mode:'zero',deadline:'7d',hours:'6h',people:'solo',third:'low',objective:'Lançar uma primeira versão funcional e testável do produto.',context:'Validar fluxo, clareza, retomada e foco operacional antes de integrar backend.'},
  cognitive:'adhd', color:'mono', motion:'little', view:'fractal', time:'Agora',
  emission:'kit', emissionQr:'action', automationSymbol:'open', vcardName:'', copilotChannels:['ai'], planVersion:1, replanHistory:[],
  cycle:{capacity:72, consumed:18, day:1, status:'ACTIVE'},
  activeActionId:'ACT-001',
  evidence:[],
  notes:[],
  importedFiles:[],
  tasks:[
    {id:'TSK-001',wf:1,name:'Definir núcleo do fluxo',deliverable:'Fluxo aprovado',state:'ACTIVE',actions:[
      {id:'ACT-001',name:'Validar a tela AGORA em mobile',state:'ACTIVE',dod:'A ação atual, o motivo, o tempo e o CTA de conclusão são compreensíveis sem ajuda.',dep:'Nenhuma',mins:15},
      {id:'ACT-002',name:'Testar retorno ao último contexto',state:'READY',dod:'Reabrir o app retorna à última ação ativa.',dep:'ACT-001',mins:15},
      {id:'ACT-003',name:'Revisar hierarquia H1/H2',state:'READY',dod:'H1 temporal e H2 utilitário não competem visualmente.',dep:'ACT-002',mins:15}
    ]},
    {id:'TSK-002',wf:1,name:'Validar onboarding',deliverable:'Fluxo aprovado',state:'READY',actions:[
      {id:'ACT-004',name:'Comparar as três rotas de entrada',state:'READY',dod:'Cada rota é compreensível em menos de 10 segundos.',dep:'ACT-001',mins:15},
      {id:'ACT-005',name:'Testar formulário de capacidade',state:'READY',dod:'As decisões principais cabem em uma única sequência curta.',dep:'ACT-004',mins:15}
    ]},
    {id:'TSK-003',wf:1,name:'Validar pré-aprovação',deliverable:'Fluxo aprovado',state:'BLOCKED',actions:[{id:'ACT-006',name:'Validar fit de escopo',state:'BLOCKED',dod:'Usuário distingue o que cabe do que excede.',dep:'ACT-005',mins:15}]},
    {id:'TSK-004',wf:2,name:'Testar Flash Card',deliverable:'Modelo de execução',state:'READY',actions:[{id:'ACT-007',name:'Alternar Padrão / Smart / Nota',state:'READY',dod:'Progressive disclosure funciona sem perder contexto.',dep:'ACT-003',mins:15}]},
    {id:'TSK-005',wf:2,name:'Testar Timeline',deliverable:'Modelo de execução',state:'READY',actions:[{id:'ACT-008',name:'Trocar para Timeline',state:'READY',dod:'A identidade das tarefas permanece a mesma.',dep:'ACT-003',mins:15}]},
    {id:'TSK-006',wf:2,name:'Testar Funil Fractal',deliverable:'Modelo de execução',state:'READY',actions:[{id:'ACT-009',name:'Trocar para Funil',state:'READY',dod:'A hierarquia Projeto→Ação fica legível.',dep:'ACT-003',mins:15}]},
    {id:'TSK-007',wf:3,name:'Registrar evidência',deliverable:'Ciclo verificável',state:'READY',actions:[{id:'ACT-010',name:'Anexar primeira evidência',state:'READY',dod:'A evidência aparece em Docs com proveniência.',dep:'ACT-001',mins:15}]},
    {id:'TSK-008',wf:3,name:'Validar Re-Plan',deliverable:'Ciclo verificável',state:'READY',actions:[{id:'ACT-011',name:'Alterar capacidade sem duplicar projeto',state:'READY',dod:'Re-Plan mantém IDs, histórico e evidências.',dep:'ACT-010',mins:15}]},
    {id:'TSK-009',wf:3,name:'Executar Gate',deliverable:'Ciclo verificável',state:'BLOCKED',actions:[{id:'ACT-012',name:'Avaliar Gate do ciclo',state:'BLOCKED',dod:'Gate retorna PASS, CARRYOVER ou RE-PLAN.',dep:'ACT-011',mins:15}]}
  ]
};
let state = loadState();
function loadState(){ try { const saved=JSON.parse(localStorage.getItem('executarPrototype')); const merged=deepMerge(structuredClone(defaults),saved||{}); const fresh=!sessionStorage.getItem('executarSession'); sessionStorage.setItem('executarSession','1'); const q=new URLSearchParams(location.search).get('mode'); if(q==='scanner') merged.screen='scanner'; else if(q==='focus'&&merged.onboarding&&merged.activeActionId) merged.screen='workspace'; else if(fresh&&merged.onboarding&&merged.activeActionId) merged.screen='workspace'; return merged;} catch(e){return structuredClone(defaults)} }
function deepMerge(a,b){ if(!b||typeof b!=='object')return a; for(const k of Object.keys(b)){ if(Array.isArray(b[k])) a[k]=b[k]; else if(b[k]&&typeof b[k]==='object'&&a[k]&&typeof a[k]==='object') a[k]=deepMerge(a[k],b[k]); else a[k]=b[k]; } return a }
function save(){ localStorage.setItem('executarPrototype',JSON.stringify(state)) }
function setScreen(s){state.screen=s;save();render();window.scrollTo(0,0)}
function activeAction(){for(const t of state.tasks) for(const a of t.actions) if(a.id===state.activeActionId)return {...a,task:t}; return null}
function findAction(id){for(const t of state.tasks) for(const a of t.actions) if(a.id===id)return {a,t};return null}
function toast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1800)}
function icon(name){const m={app:'▦',scan:'⌗',ai:'✦',json:'{ }',docs:'▤',focus:'▶',chart:'▥',plan:'↻',search:'⌕',settings:'⚙'};return m[name]||'•'}
function topbar(back){return `<div class="topbar"><div class="brand"><span class="brand-mark">E</span> EXECUTAR <span class="proto-tag">PWA · PROTÓTIPO</span></div><div>${back?`<button class="btn small" onclick="setScreen('${back}')">Voltar</button>`:''}</div></div>`}
function entry(){return `${topbar('')}<main class="page narrow"><div class="hero"><div class="eyebrow">Entrada</div><h1>Onde você quer começar?</h1><p class="lead">App e Scanner acessam o mesmo estado canônico. O protótipo mantém o último contexto de execução no dispositivo.</p></div><div class="cards"><article class="card entry-card choice" onclick="enterApp()"><div><div class="entry-icon">${icon('app')}</div><h2 style="margin-top:22px">APP</h2><p>Workspace completo de planejamento, execução, evidências e replanejamento.</p></div><button class="btn primary">Abrir Workspace</button></article><article class="card entry-card choice" onclick="setScreen('scanner')"><div><div class="entry-icon">${icon('scan')}</div><h2 style="margin-top:22px">SCANNER</h2><p>Captura rápida para abrir, registrar, concluir ou consultar objetos do mesmo projeto.</p></div><button class="btn">Abrir Scanner</button></article></div><div class="section"><button class="btn subtle danger small" onclick="resetPrototype()">Reiniciar protótipo e onboarding</button></div></main>`}
function enterApp(){ if(state.onboarding){state.screen='workspace';save();render()}else setScreen('discovery') }
