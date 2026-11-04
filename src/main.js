import './style.css'

/* ==================== APP DI BASE ==================== */

const CHIAVE = 'todo-tasks'
const CHIAVE_NOME = 'todo-nome'

let tasks = []   // si riempie all'avvio, in fondo al file

const benvenuto = document.querySelector('#benvenuto')
const form = document.querySelector('#form-task')
const campo = document.querySelector('#campo-task')
const lista = document.querySelector('#lista')
const info = document.querySelector('#info')
const messaggio = document.querySelector('#messaggio')
const azioni = document.querySelector('#azioni')

// View: disegna la lista dei task
function renderLista() {
  lista.innerHTML = ''

  tasks.forEach(t => {
    const li = document.createElement('li')

    const titolo = document.createElement('span')
    titolo.textContent = t.title
    if (t.completed) titolo.classList.add('fatto')
    titolo.addEventListener('click', () => toggleTask(t.id))

    const elimina = document.createElement('button')
    elimina.textContent = '×'
    elimina.addEventListener('click', () => deleteTask(t.id))

    li.appendChild(titolo)
    li.appendChild(elimina)
    lista.appendChild(li)
  })
}

// View: ridisegna tutta la pagina a partire dallo stato
function render() {
  renderLista()
  renderInfo()       // Es 2
  renderMessaggio()  // Es 8
  renderAzioni()     // Es 9
}

// Azioni: cambiano lo stato, mai la pagina
function addTask(title) {
  const pulito = title.trim()
  if (pulito === '') return

  aggiornaStato([...tasks, { id: Date.now(), title: pulito, completed: false }])
}

function toggleTask(id) {
  aggiornaStato(
    tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
  )
}

function deleteTask(id) {
  aggiornaStato(tasks.filter(t => t.id !== id))
}

// Eventi
form.addEventListener('submit', (e) => {
  e.preventDefault()
  addTask(campo.value)
  campo.value = ''
})


//es 1

const TASK_INIZIALI = [
  { id: 1, title: 'Studiare per la verifica', completed: false },
  { id: 2, title: 'Comprare il pane', completed: true },
  { id: 3, title: 'Finire il progetto TPSIT', completed: false },
  { id: 4, title: 'Portare fuori il cane', completed: false }
]


//es2

function renderInfo() {
  const totali = tasks.length
  const completati = tasks.filter(t => t.completed).length
  const daFare = tasks.filter(t => !t.completed).length

  info.textContent =
    `Totali: ${totali} · Completati: ${completati} · Da fare: ${daFare}`
}


//es3

//const intruso = document.createElement('li')
//intruso.textContent = 'Task fantasma'
//lista.appendChild(intruso)



//es4
function salvaStato() {
  localStorage.setItem(CHIAVE, JSON.stringify(tasks))
}

function aggiornaStato(nuoviTasks) {
  tasks = nuoviTasks
  salvaStato()
  render()
}


//es5

function caricaStato() {
  const testo = localStorage.getItem(CHIAVE)
  if (testo === null) return TASK_INIZIALI

  try {
    return JSON.parse(testo)
  } catch (errore) {
    console.error('Dati salvati non validi, riparto da zero:', errore.message)
    return []
  }
}


//es7
function renderBenvenuto() {
  const nome = localStorage.getItem(CHIAVE_NOME)
  benvenuto.innerHTML = ''

  if (nome) {
    const p = document.createElement('p')
    p.textContent = `Bentornato, ${nome}`
    benvenuto.appendChild(p)
    return
  }

  const campoNome = document.createElement('input')
  campoNome.placeholder = 'Come ti chiami?'

  const salva = document.createElement('button')
  salva.textContent = 'Salva'
  salva.addEventListener('click', () => {
    const valore = campoNome.value.trim()
    if (valore === '') return
    localStorage.setItem(CHIAVE_NOME, valore)
    renderBenvenuto()
  })

  benvenuto.appendChild(campoNome)
  benvenuto.appendChild(salva)
}


//es8
function renderMessaggio() {
  const totali = tasks.length
  const restanti = tasks.filter(t => !t.completed).length

  if (totali === 0) {
    messaggio.textContent = 'Non hai task. Buona giornata.'
  } else if (restanti === 0) {
    messaggio.textContent = 'Fatto tutto. Complimenti.'
  } else {
    messaggio.textContent = `Ti restano ${restanti} task su ${totali}.`
  }
}


//es9
function deleteCompletati() {
  if (!confirm('Elimino tutti i task completati?')) return
  aggiornaStato(tasks.filter(t => !t.completed))
}

// Il pulsante c'è solo se esiste almeno un task completato.
function renderAzioni() {
  const completati = tasks.filter(t => t.completed).length

  azioni.innerHTML = ''
  if (completati > 0) {
    const pulisci = document.createElement('button')
    pulisci.textContent = `Elimina completati (${completati})`
    pulisci.addEventListener('click', deleteCompletati)
    azioni.appendChild(pulisci)
  }
}


tasks = caricaStato()
renderBenvenuto()
render()
