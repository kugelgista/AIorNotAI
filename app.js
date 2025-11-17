// Self-assessment logic (Deutsch) — angepasste, nicht-technische Fragen
const questions = [
  {
    id: "q1",
    title: "Soll das System Dinge automatisch erkennen, einordnen oder vorhersagen?",
    hint: "Beispiele: Produkte vorschlagen, E‑Mails nach Thema sortieren, vorhersagen, ob ein Kunde kündigt.",
    weight: 2
  },
  {
    id: "q2",
    title: "Gibt es bereits Informationen oder Daten, die das Problem beschreiben (z. B. Tabellen, Texte, Bilder)?",
    hint: "Zum Beispiel: Excel‑Listen, gespeicherte Nachrichten, Fotos, Aufzeichnungen oder andere gespeicherte Informationen.",
    weight: 2
  },
  {
    id: "q3",
    title: "Wird eine einfache Regel oder Checkliste wahrscheinlich nicht ausreichen, weil viele Ausnahmen vorkommen?",
    hint: "Beispiele: Zu viele Sonderfälle, die sich nicht gut mit festen Regeln abbilden lassen.",
    weight: 2
  },
  {
    id: "q4",
    title: "Geht es um Texte, Bilder, Töne oder sonstige unstrukturierte Inhalte?",
    hint: "Zum Beispiel: Kundenbewertungen (Text), Fotos von Schäden, Telefongespräche (Audio).",
    weight: 2
  },
  {
    id: "q5",
    title: "Muss das System mit Unsicherheit umgehen können (z. B. Wahrscheinlichkeiten, Schätzungen statt absoluten Antworten)?",
    hint: "Wenn ein klares Ja/Nein nicht immer möglich ist und eine Einschätzung oder Trendaussage hilft.",
    weight: 1
  },
  {
    id: "q6",
    title: "Soll das System im Laufe der Zeit besser werden, wenn neue Informationen hinzukommen?",
    hint: "Zum Beispiel: Das System lernt aus Feedback oder zusätzlichen Daten und verbessert seine Vorschläge.",
    weight: 1
  },
  {
    id: "q7",
    title: "Gibt es eine einfache Möglichkeit zu prüfen, ob die Lösung gut funktioniert (z. B. 'Anzahl korrekt sortierter Fälle')?",
    hint: "Überlege, ob du später messen kannst, ob das System gute Arbeit leistet.",
    weight: 1
  },
  {
    id: "q8",
    title: "Sind Datenschutz, Fairness oder Sicherheitsfragen wichtig für diese Lösung?",
    hint: "Zum Beispiel: Personenbezogene Daten, mögliche Benachteiligung von Gruppen oder Sicherheitsrisiken.",
    weight: 1
  }
];

const questionsContainer = document.getElementById("questions");
const resultSection = document.getElementById("result");
const scoreText = document.getElementById("scoreText");
const explanation = document.getElementById("explanation");
const nextStepsList = document.getElementById("nextSteps");

function createQuestionNode(q){
  const div = document.createElement("div");
  div.className = "question";
  div.dataset.id = q.id;

  const title = document.createElement("div");
  title.className = "q-title";
  title.textContent = q.title;
  div.appendChild(title);

  if(q.hint){
    const hint = document.createElement("div");
    hint.className = "q-hint";
    hint.style.color = "#555";
    hint.style.fontSize = "0.95rem";
    hint.style.marginBottom = "8px";
    hint.textContent = q.hint;
    div.appendChild(hint);
  }

  const opts = document.createElement("div");
  opts.className = "options";

  ["Ja","Nein","Weiß nicht"].forEach(optText => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    btn.textContent = optText;
    btn.addEventListener("click", () => {
      // deselect siblings
      [...opts.querySelectorAll(".option-btn")].forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      div.dataset.answer = optText;
    });
    opts.appendChild(btn);
  });

  div.appendChild(opts);
  return div;
}

function renderQuestions(){
  questionsContainer.innerHTML = "";
  questions.forEach(q => {
    questionsContainer.appendChild(createQuestionNode(q));
  });
}

function evaluate(){
  // compute score
  let score = 0;
  let maxScore = questions.reduce((s,q)=>s+q.weight,0);
  const details = [];

  for(const q of questions){
    const node = document.querySelector(`.question[data-id="${q.id}"]`);
    const answer = node?.dataset?.answer || "Nicht beantwortet";
    let gained = 0;
    if(answer === "Ja") gained = q.weight;
    else if(answer === "Weiß nicht") gained = Math.round(q.weight/2);
    // Nein -> 0

    score += gained;
    details.push({id:q.id, question:q.title, weight:q.weight, answer, gained});
  }

  const pct = Math.round((score / maxScore) * 100);
  let classification = "";
  if(pct >= 70) classification = "Wahrscheinlich ein AI Use Case";
  else if(pct >= 40) classification = "Möglicherweise ein AI Use Case — weitere Analyse empfohlen";
  else classification = "Wahrscheinlich kein AI Use Case";

  // populate result UI
  scoreText.innerHTML = `<strong>${classification}</strong> — Punkte ${score} / ${maxScore} (${pct}%)`;
  explanation.innerHTML = "";

  const explList = document.createElement("ul");
  explList.style.marginTop = "8px";
  details.forEach(d=>{
    const li = document.createElement("li");
    li.innerHTML = `<span class="code">${d.gained}/${d.weight}</span> — ${d.question} → <em>${d.answer}</em>`;
    explList.appendChild(li);
  });
  explanation.appendChild(explList);

  // next steps
  nextStepsList.innerHTML = "";
  if(pct >= 70){
    addNext("Mache ein einfaches Daten‑Inventar: Welche Informationen liegen vor und wie sind sie gespeichert?");
    addNext("Teste eine einfache Basislösung (z. B. ein kleines Experiment mit vorhandenen Daten oder vortrainierten Modellen).");
    addNext("Definiere klare Erfolgskriterien (Was ist eine 'gute' Lösung?).");
    addNext("Prüfe Datenschutz, Fairness und Sicherheit bevor du groß investierst.");
  }else if(pct >= 40){
    addNext("Sammle eine kleine Datenprobe und vergleiche eine einfache Datenbasierte Lösung mit einer Regel‑Lösung.");
    addNext("Führe Nutzergespräche durch, um Anforderungen zu präzisieren.");
    addNext("Schätze Aufwand und Nutzen ab, bevor du ein größeres Projekt startest.");
  }else{
    addNext("Ziehe eine Regel‑ oder Prozess‑Lösung in Betracht — oft schneller und transparenter.");
    addNext("Falls sich das Problem ändert oder mehr Daten verfügbar werden, bewerte erneut.");
    addNext("Behalte Monitoring/Feedback im Auge, um später bei Bedarf auf datengetriebene Ansätze zu wechseln.");
  }

  // always give a short checklist for data
  const checklistTitle = document.createElement("h4");
  checklistTitle.textContent = "Kurze Daten-Checkliste";
  explanation.appendChild(checklistTitle);
  const checklist = document.createElement("ul");
  ["Sind relevante Informationen vorhanden und zugänglich?","Gibt es Beispiele (Labels) oder einfache Möglichkeiten, welche zu erzeugen?","Ist die Datenmenge für einen kleinen Test ausreichend?","Sind Datenschutz-/Compliance‑Fragen geklärt?"].forEach(s=> {
    const li = document.createElement("li"); li.textContent = s; checklist.appendChild(li);
  });
  explanation.appendChild(checklist);

  resultSection.classList.remove("hidden");
}

function addNext(text){
  const li = document.createElement("li");
  li.textContent = text;
  nextStepsList.appendChild(li);
}

function exportAnswers(){
  const answers = {};
  for(const q of questions){
    const node = document.querySelector(`.question[data-id="${q.id}"]`);
    answers[q.id] = {
      question: q.title,
      answer: node?.dataset?.answer || null,
      weight: q.weight
    };
  }
  const payload = {
    timestamp: new Date().toISOString(),
    answers
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "assessment.json";
  a.click();
  URL.revokeObjectURL(url);
}

// init
renderQuestions();

document.getElementById("evaluate").addEventListener("click", evaluate);
document.getElementById("export").addEventListener("click", exportAnswers);
document.getElementById("reset").addEventListener("click", () => {
  renderQuestions();
  resultSection.classList.add("hidden");
});