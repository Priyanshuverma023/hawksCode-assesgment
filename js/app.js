'use strict';

// ─── Config ──────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'ssa_v2';
const QUESTIONS_PER_CATEGORY = 10;

// ─── Category Metadata ────────────────────────────────────────────────────────
const CATEGORY_META = {
  Communication: { color: '#38bdf8'},
  Leadership:    { color: '#a78bfa'},
  Confidence:    { color: '#fb923c'},
  Teamwork:      { color: '#4ade80'},
};

// ─── Question Pools — Mixed types: scenario, reflective, frequency, self-report
//     Each question has a `type` tag for transparency (not shown to user).
// ─────────────────────────────────────────────────────────────────────────────
const questionPools = {
  Communication: [
    // Scenario-based
    { id:'c01', text:'During a project kickoff, your manager gives confusing instructions. You would clarify in the moment rather than proceed and figure it out later.' },
    { id:'c02', text:'A client sends vague feedback saying the work needs to "feel more dynamic." Rather than guessing, you schedule a call to ask specific clarifying questions.' },
    { id:'c03', text:'You are presenting quarterly results to senior leadership and get challenged mid-slide. You stay composed, address the concern directly, and continue confidently.' },
    { id:'c04', text:'A teammate misunderstands an important task because of an ambiguous message you sent. You take ownership and clarify immediately rather than letting it play out.' },
    { id:'c05', text:'When explaining a technical concept to a non-technical stakeholder, you naturally shift your language and examples to match their background.' },
    // Reflective / self-report
    { id:'c06', text:'I actively listen without planning my response until the other person has fully finished speaking.' },
    { id:'c07', text:'I adjust my communication style depending on whether I am writing a quick Slack message, a formal report, or giving a presentation.' },
    { id:'c08', text:'When I receive critical feedback on my work, my first instinct is to understand the perspective before defending my choices.' },
    { id:'c09', text:'I feel equally comfortable delivering difficult news — such as a missed deadline — as I do sharing positive updates.' },
    { id:'c10', text:'I proactively share information my team needs even when nobody has explicitly asked for it.' },
    // Frequency / behavioural
    { id:'c11', text:'I summarise key decisions and next steps at the end of meetings so everyone leaves aligned.' },
    { id:'c12', text:'In written communications, I re-read messages from the recipient\'s perspective before sending to check for potential misunderstanding.' },
    { id:'c13', text:'When moderating a discussion between two people who strongly disagree, I can keep the conversation productive and respectful.' },
    { id:'c14', text:'I follow up after sending important emails or messages to confirm the recipient understood the required actions.' },
    { id:'c15', text:'Even in remote or async settings, I make deliberate efforts to ensure my communication tone is clear and does not come across as cold or abrupt.' },
  ],
  Leadership: [
    // Scenario-based
    { id:'l01', text:'Your team has just failed a high-profile project. Before pushing toward the next deadline, you take time to rebuild morale and run a structured retrospective.' },
    { id:'l02', text:'You notice a process inefficiency in another department that is slowing your team\'s work. Even though it is outside your remit, you raise it constructively.' },
    { id:'l03', text:'Two team members have an ongoing tension that is starting to affect output. You address it directly with both parties rather than hoping it resolves on its own.' },
    { id:'l04', text:'Under a tight deadline with incomplete information, you make a clear call, communicate the reasoning, and commit — rather than stalling for certainty.' },
    { id:'l05', text:'A high-performing team member has a significant blind spot that is affecting the team. You deliver honest, specific feedback despite the awkwardness.' },
    // Reflective / self-report
    { id:'l06', text:'I invest time developing junior colleagues even when it temporarily slows my own output.' },
    { id:'l07', text:'Before starting a new initiative, I define clear success criteria so the team knows exactly what "done" looks like.' },
    { id:'l08', text:'I delegate meaningful responsibilities to others even when I believe I could personally do them better.' },
    { id:'l09', text:'I can articulate a compelling "why" behind decisions, rather than simply issuing directives and expecting compliance.' },
    { id:'l10', text:'When I commit to something, people can rely on it being delivered — even when circumstances change.' },
    // Frequency / behavioural
    { id:'l11', text:'I regularly check in on my team\'s workload and wellbeing, not just on task completion and deadlines.' },
    { id:'l12', text:'I consciously create space for quieter voices to contribute in meetings where louder personalities tend to dominate.' },
    { id:'l13', text:'When leadership pressure pushes me toward cutting corners, I push back constructively while still working toward the core objective.' },
    { id:'l14', text:'I champion ideas from my team in wider forums, even when I personally would have approached the problem differently.' },
    { id:'l15', text:'After any significant setback, I lead a structured review to extract lessons before moving to the next challenge.' },
  ],
  Confidence: [
    // Scenario-based
    { id:'cf01', text:'You are asked a question in a senior meeting that you genuinely do not know the answer to. You acknowledge it openly and offer to follow up, rather than bluffing.' },
    { id:'cf02', text:'Your manager invites you to present work-in-progress to executives. Despite it being imperfect, you present it clearly and own the current limitations.' },
    { id:'cf03', text:'You publicly back a project proposal, and it fails. Rather than distancing yourself from the outcome, you own it transparently and focus on lessons.' },
    { id:'cf04', text:'In a salary negotiation, the first offer is below your expectations. You counter with a clear rationale rather than accepting it to avoid discomfort.' },
    { id:'cf05', text:'A senior stakeholder pushes back hard on your analysis in front of others. You calmly stand by your data while remaining open to new information.' },
    // Reflective / self-report
    { id:'cf06', text:'I volunteer for high-visibility projects and presentations rather than waiting to be assigned.' },
    { id:'cf07', text:'Constructive criticism from a manager or peer motivates me to improve — it does not make me question my overall ability.' },
    { id:'cf08', text:'I take on stretch assignments that sit outside my current skill set because I trust I can grow into them.' },
    { id:'cf09', text:'I feel confident contributing my perspective even in rooms full of more experienced people.' },
    { id:'cf10', text:'I am comfortable making significant decisions with around 70% of the information, rather than waiting for complete certainty.' },
    // Frequency / behavioural
    { id:'cf11', text:'After making a visible mistake in front of colleagues, I recover quickly without excessive dwelling or self-criticism.' },
    { id:'cf12', text:'I speak up immediately when I notice something going wrong — even if it means respectfully challenging a more senior colleague.' },
    { id:'cf13', text:'I genuinely believe my contributions make a meaningful difference to my team\'s results.' },
    { id:'cf14', text:'When starting something entirely new or unfamiliar, I approach the learning curve with curiosity rather than anxiety.' },
    { id:'cf15', text:'When I receive public recognition, I accept it gracefully — without deflecting, minimising my role, or feeling uncomfortable.' },
  ],
  Teamwork: [
    // Scenario-based
    { id:'t01', text:'A teammate is visibly overwhelmed with their workload. Without being asked, you offer to absorb some of their tasks to help the team hit its deadline.' },
    { id:'t02', text:'The team makes a decision that goes against your recommendation. You commit to executing it fully and constructively, rather than doing it half-heartedly.' },
    { id:'t03', text:'A new team member joins and seems lost in the first week. You proactively reach out to help them understand processes and feel welcomed.' },
    { id:'t04', text:'During a brainstorm, a colleague raises an idea you initially think is weak. Instead of dismissing it, you build on it and it becomes the strongest concept in the room.' },
    { id:'t05', text:'You notice a colleague who is underperforming and it is starting to affect team morale. You address it with them directly and supportively, rather than venting to others.' },
    // Reflective / self-report
    { id:'t06', text:'In group projects, I contribute as fully as I would if I were solely responsible — regardless of whether credit is shared equally.' },
    { id:'t07', text:'I acknowledge a colleague\'s contribution publicly when their input leads to a positive team outcome.' },
    { id:'t08', text:'I keep teammates informed of my progress, blockers, and shifts in priority — without waiting to be asked.' },
    { id:'t09', text:'I treat shared team agreements — stand-ups, response times, deadlines — as genuine commitments rather than loose suggestions.' },
    { id:'t10', text:'I am equally collaborative and engaged whether I am working with my favourite colleague or someone I find personally challenging.' },
    // Frequency / behavioural
    { id:'t11', text:'I surface uncomfortable team issues early rather than letting problems fester and worsen over time.' },
    { id:'t12', text:'After a team success, I focus attention on recognising the collective effort rather than highlighting individual contributions, including my own.' },
    { id:'t13', text:'I actively seek out perspectives from team members whose backgrounds, experiences, or thinking styles differ significantly from mine.' },
    { id:'t14', text:'When the team is under pressure or things go wrong, I stay calm and focus on solutions rather than adding to the stress.' },
    { id:'t15', text:'I regularly reflect on how I show up for my team and take concrete steps to improve my collaboration and reliability.' },
  ],
};

const ALL_CATEGORIES = Object.keys(questionPools);

const LIKERT = [
  { label: 'Strongly Agree',    value: 5, color: '#22c55e' },
  { label: 'Agree',             value: 4, color: '#86efac' },
  { label: 'Neutral',           value: 3, color: '#fbbf24' },
  { label: 'Disagree',          value: 2, color: '#fb923c' },
  { label: 'Strongly Disagree', value: 1, color: '#ef4444' },
];

// ─── State ────────────────────────────────────────────────────────────────────
let state = {
  employeeData: null,
  selectedCategories: [...ALL_CATEGORIES], // user picks which ones
  selectedQuestions: {},
  answers: {},
  activeCategoryIndex: 0,
  activeQuestionIndex: 0,
  phase: 'welcome',
  answerLocked: false,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickQuestions() {
  const result = {};
  state.selectedCategories.forEach(cat => {
    result[cat] = shuffle(questionPools[cat]).slice(0, QUESTIONS_PER_CATEGORY);
  });
  return result;
}

function getAnswer(qid) { return state.answers[qid] ?? null; }

function activeCategory() { return state.selectedCategories[state.activeCategoryIndex]; }
function activeQuestions() { return state.selectedQuestions[activeCategory()] || []; }
function activeQuestion()  { return activeQuestions()[state.activeQuestionIndex]; }

function categoryStats(cat) {
  const qs = state.selectedQuestions[cat] || [];
  let total = 0, count = 0, skipped = 0;
  qs.forEach(q => {
    const a = state.answers[q.id];
    if (a === 'skipped') skipped++;
    else if (a !== null && a !== undefined) { total += a; count++; }
  });
  const pct = count > 0 ? Math.round((total / (count * 5)) * 100) : null;
  return { answered: count, skipped, total: qs.length, pct, raw: count > 0 ? total / count : null };
}

function allCategoryStats() {
  const result = {};
  state.selectedCategories.forEach(cat => { result[cat] = categoryStats(cat); });
  return result;
}

function overallScore() {
  const stats = allCategoryStats();
  const valid = Object.values(stats).filter(s => s.pct !== null);
  if (!valid.length) return 0;
  return Math.round(valid.reduce((s, v) => s + v.pct, 0) / valid.length);
}

function getLevel(pct) {
  if (pct === null) return { label: 'Not Assessed', color: '#94a3b8' };
  if (pct >= 85)   return { label: 'Exceptional',   color: '#22c55e' };
  if (pct >= 70)   return { label: 'Proficient',    color: '#86efac' };
  if (pct >= 55)   return { label: 'Developing',    color: '#fbbf24' };
  if (pct >= 40)   return { label: 'Needs Focus',   color: '#fb923c' };
  return              { label: 'Critical Gap',   color: '#ef4444' };
}

let toastTimer = null;
function showToast(msg, type = 'info') {
  const t = document.getElementById('ssa-toast');
  if (toastTimer) clearTimeout(toastTimer);
  t.textContent = msg;
  t.className = `ssa-toast ssa-toast--${type} show`;
  toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
}

// ─── Render: Welcome ──────────────────────────────────────────────────────────
function renderWelcome() {
  document.getElementById('ssa-welcome').classList.add('active');
  document.getElementById('ssa-assessment').classList.remove('active');
  document.getElementById('ssa-results').classList.remove('active');
  renderCategorySelector();
}

function renderCategorySelector() {
  const grid = document.getElementById('cat-selector-grid');
  if (!grid) return;
  grid.innerHTML = '';
  ALL_CATEGORIES.forEach(cat => {
    const meta = CATEGORY_META[cat];
    const isSelected = state.selectedCategories.includes(cat);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `cat-select-btn${isSelected ? ' selected' : ''}`;
    btn.dataset.cat = cat;
    btn.innerHTML = `
      <span class="cat-select-icon">${meta.icon}</span>
      <span class="cat-select-name">${cat}</span>
      <span class="cat-select-check">${isSelected ? '✓' : ''}</span>
    `;
    btn.style.setProperty('--cat-color', meta.color);
    btn.addEventListener('click', () => toggleCategory(cat));
    grid.appendChild(btn);
  });
  updateStartButton();
}

function toggleCategory(cat) {
  const idx = state.selectedCategories.indexOf(cat);
  if (idx === -1) {
    state.selectedCategories.push(cat);
  } else {
    if (state.selectedCategories.length === 1) {
      showToast('At least one category must be selected.', 'warning');
      return;
    }
    state.selectedCategories.splice(idx, 1);
  }
  renderCategorySelector();
}

function updateStartButton() {
  const btn = document.getElementById('ssa-start-btn');
  const count = state.selectedCategories.length;
  const qCount = count * QUESTIONS_PER_CATEGORY;
  if (btn) {
    btn.textContent = `Start Assessment → ${count} ${count === 1 ? 'category' : 'categories'} · ${qCount} questions`;
  }
  // update the stat display
  const statCat = document.getElementById('stat-categories');
  const statQ   = document.getElementById('stat-questions');
  if (statCat) statCat.textContent = count;
  if (statQ)   statQ.textContent = qCount;
}

// ─── Render: Assessment ───────────────────────────────────────────────────────
function renderAssessment() {
  document.getElementById('ssa-welcome').classList.remove('active');
  document.getElementById('ssa-assessment').classList.add('active');
  document.getElementById('ssa-results').classList.remove('active');
  renderCategoryTabs();
  renderCategoryProgress();
  renderQuestionCard();
}

function renderCategoryTabs() {
  const container = document.getElementById('ssa-cat-tabs');
  container.innerHTML = '';
  state.selectedCategories.forEach((cat, i) => {
    const stats = categoryStats(cat);
    const isActive = i === state.activeCategoryIndex;
    const isDone = stats.answered + stats.skipped === stats.total;
    const meta = CATEGORY_META[cat];
    const tab = document.createElement('button');
    tab.className = `cat-tab${isActive ? ' active' : ''}${isDone ? ' done' : ''}`;
    tab.innerHTML = `
      <span class="cat-tab__icon">${meta.icon}</span>
      <span class="cat-tab__name">${cat}</span>
      <span class="cat-tab__count">${stats.answered}/${stats.total}</span>
    `;
    tab.addEventListener('click', () => {
      state.activeCategoryIndex = i;
      state.activeQuestionIndex = 0;
      renderAssessment();
    });
    container.appendChild(tab);
  });
}

function renderCategoryProgress() {
  const qs = activeQuestions();
  const container = document.getElementById('ssa-q-dots');
  container.innerHTML = '';
  qs.forEach((q, i) => {
    const dot = document.createElement('button');
    const ans = state.answers[q.id];
    let cls = 'q-dot';
    if (i === state.activeQuestionIndex) cls += ' active';
    else if (ans === 'skipped') cls += ' skipped';
    else if (ans !== null && ans !== undefined) cls += ' answered';
    dot.className = cls;
    dot.setAttribute('aria-label', `Question ${i + 1}`);
    dot.addEventListener('click', () => {
      state.activeQuestionIndex = i;
      renderAssessment();
    });
    container.appendChild(dot);
  });
}

function renderQuestionCard() {
  const q = activeQuestion();
  const cat = activeCategory();
  const qNum = state.activeQuestionIndex + 1;
  const total = activeQuestions().length;
  const meta = CATEGORY_META[cat];

  document.getElementById('ssa-cat-label').textContent = `${meta.icon} ${cat}`;
  document.getElementById('ssa-q-num').textContent = `Question ${qNum} of ${total}`;
  document.getElementById('ssa-q-text').textContent = q.text;

  const container = document.getElementById('ssa-likert');
  container.innerHTML = '';
  const currentAnswer = getAnswer(q.id);

  LIKERT.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = `likert-btn${currentAnswer === opt.value ? ' selected' : ''}`;
    btn.dataset.value = opt.value;
    btn.innerHTML = `
      <span class="likert-dot" style="background:${opt.color}"></span>
      <span class="likert-label">${opt.label}</span>
    `;
    btn.addEventListener('click', () => {
      if (state.answerLocked) return;
      state.answerLocked = true;
      state.answers[q.id] = opt.value;
      document.querySelectorAll('.likert-btn').forEach(b => {
        b.disabled = true;
        b.classList.toggle('selected', parseInt(b.dataset.value) === opt.value);
      });
      renderCategoryProgress();
      renderCategoryTabs();
      setTimeout(() => {
        state.answerLocked = false;
        advanceQuestion();
      }, 350);
    });
    container.appendChild(btn);
  });

  document.getElementById('ssa-btn-prev-q').disabled =
    (state.activeQuestionIndex === 0 && state.activeCategoryIndex === 0);
  const isLastQ   = state.activeQuestionIndex === total - 1;
  const isLastCat = state.activeCategoryIndex === state.selectedCategories.length - 1;
  document.getElementById('ssa-btn-next-q').textContent = (isLastQ && isLastCat) ? 'Finish' : 'Next →';
}

function advanceQuestion() {
  const qs = activeQuestions();
  if (state.activeQuestionIndex < qs.length - 1) {
    state.activeQuestionIndex++;
    renderAssessment();
  } else if (state.activeCategoryIndex < state.selectedCategories.length - 1) {
    state.activeCategoryIndex++;
    state.activeQuestionIndex = 0;
    renderAssessment();
    showToast(`Moving to ${activeCategory()}`, 'info');
  } else {
    finishAssessment();
  }
}

function prevQuestion() {
  if (state.activeQuestionIndex > 0) {
    state.activeQuestionIndex--;
  } else if (state.activeCategoryIndex > 0) {
    state.activeCategoryIndex--;
    state.activeQuestionIndex = activeQuestions().length - 1;
  }
  renderAssessment();
}

function skipQuestion() {
  const q = activeQuestion();
  state.answers[q.id] = 'skipped';
  renderCategoryProgress();
  renderCategoryTabs();
  advanceQuestion();
}

function nextQuestion() {
  const isLastQ   = state.activeQuestionIndex === activeQuestions().length - 1;
  const isLastCat = state.activeCategoryIndex === state.selectedCategories.length - 1;
  if (isLastQ && isLastCat) finishAssessment();
  else advanceQuestion();
}

// ─── Finish ───────────────────────────────────────────────────────────────────
function finishAssessment() {
  saveToStorage();
  renderResults();
}

// ─── Render: Results ─────────────────────────────────────────────────────────
function renderResults() {
  document.getElementById('ssa-welcome').classList.remove('active');
  document.getElementById('ssa-assessment').classList.remove('active');
  document.getElementById('ssa-results').classList.add('active');

  const stats   = allCategoryStats();
  const overall = overallScore();

  document.getElementById('res-name').textContent  = state.employeeData.name;
  document.getElementById('res-role').textContent  = state.employeeData.role;
  document.getElementById('res-date').textContent  = new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
  document.getElementById('res-overall-pct').textContent   = overall + '%';
  document.getElementById('res-overall-level').textContent = getLevel(overall).label;
  document.getElementById('res-overall-level').style.color = getLevel(overall).color;

  // Category cards — only assessed ones
  const cardsContainer = document.getElementById('res-cat-cards');
  cardsContainer.innerHTML = '';
  state.selectedCategories.forEach(cat => {
    const s     = stats[cat];
    const level = getLevel(s.pct);
    const meta  = CATEGORY_META[cat];
    const card  = document.createElement('div');
    card.className = 'res-cat-card';
    card.innerHTML = `
      <div class="res-cat-card__header">
        <span class="res-cat-card__name">${meta.icon} ${cat}</span>
        <span class="res-cat-card__level" style="color:${level.color}">${level.label}</span>
      </div>
      <div class="res-cat-card__score">${s.pct !== null ? s.pct + '%' : '—'}</div>
      <div class="res-cat-card__bar">
        <div class="res-cat-card__fill" style="width:${s.pct || 0}%; background:${level.color}"></div>
      </div>
      <div class="res-cat-card__meta">${s.answered} answered · ${s.skipped} skipped · ${s.total - s.answered - s.skipped} unanswered</div>
    `;
    cardsContainer.appendChild(card);
  });

  drawRadarChart(stats);
  drawBarChart(stats);
  drawDistributionChart();
}

// ─── CHARTS ───────────────────────────────────────────────────────────────────
function drawRadarChart(stats) {
  const canvas = document.getElementById('chart-radar');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const maxR = Math.min(W, H) / 2 - 44;

  ctx.clearRect(0, 0, W, H);

  const cats   = state.selectedCategories;
  const N      = cats.length;
  const angles = cats.map((_, i) => (Math.PI * 2 * i / N) - Math.PI / 2);

  // Grid rings
  [0.2, 0.4, 0.6, 0.8, 1.0].forEach(r => {
    ctx.beginPath();
    angles.forEach((a, i) => {
      const x = cx + Math.cos(a) * maxR * r;
      const y = cy + Math.sin(a) * maxR * r;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.font = 'bold 9px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(r * 100) + '%', cx + 4, cy - maxR * r + 4);
  });

  angles.forEach(a => {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * maxR, cy + Math.sin(a) * maxR);
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Data polygon
  const values = cats.map(cat => (stats[cat].pct || 0) / 100);
  ctx.beginPath();
  angles.forEach((a, i) => {
    const x = cx + Math.cos(a) * maxR * values[i];
    const y = cy + Math.sin(a) * maxR * values[i];
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle   = 'rgba(255,198,47,0.2)';
  ctx.fill();
  ctx.strokeStyle = '#ffc62f';
  ctx.lineWidth   = 2.5;
  ctx.stroke();

  angles.forEach((a, i) => {
    const x = cx + Math.cos(a) * maxR * values[i];
    const y = cy + Math.sin(a) * maxR * values[i];
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffc62f';
    ctx.fill();
  });

  // Labels
  angles.forEach((a, i) => {
    const offset = 24;
    const x = cx + Math.cos(a) * (maxR + offset);
    const y = cy + Math.sin(a) * (maxR + offset);
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.font         = 'bold 11px DM Sans, sans-serif';
    ctx.fillStyle    = '#111';
    ctx.fillText(cats[i], x, y);
    if (stats[cats[i]].pct !== null) {
      ctx.font      = 'bold 10px DM Sans, sans-serif';
      ctx.fillStyle = '#444';
      ctx.fillText(stats[cats[i]].pct + '%', x, y + 13);
    }
  });
}

function drawBarChart(stats) {
  const canvas = document.getElementById('chart-bar');
  const ctx    = canvas.getContext('2d');

  const cats = state.selectedCategories;
  const LABEL_MAP = {
    Communication: 'Comm.',
    Leadership:    'Leader.',
    Confidence:    'Confid.',
    Teamwork:      'Teamwork',
  };

  const pad        = { top: 36, right: 20, bottom: 36, left: 50 };
  const LABEL_ZONE = 28;
  const PCT_ZONE   = 20;

  const W       = canvas.width;
  const TOTAL_H = pad.top + PCT_ZONE + 200 + LABEL_ZONE + pad.bottom;
  canvas.height = TOTAL_H;
  const H       = TOTAL_H;

  const chartW = W - pad.left - pad.right;
  const chartH = 200;
  const chartY = pad.top + PCT_ZONE;
  const barW   = (chartW / cats.length) * 0.54;
  const gap    = chartW / cats.length;

  ctx.clearRect(0, 0, W, H);

  [0, 25, 50, 75, 100].forEach(v => {
    const y = chartY + chartH - (v / 100) * chartH;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + chartW, y);
    ctx.strokeStyle = v === 0 ? 'rgba(128,128,128,0.7)' : 'rgba(128,128,128,0.18)';
    ctx.lineWidth   = v === 0 ? 1.5 : 1;
    ctx.stroke();
    ctx.fillStyle    = '#888';
    ctx.font         = 'bold 10px DM Sans, sans-serif';
    ctx.textAlign    = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(v + '%', pad.left - 8, y);
  });

  cats.forEach((cat, i) => {
    const s     = stats[cat];
    const pct   = s.pct || 0;
    const level = getLevel(s.pct);
    const meta  = CATEGORY_META[cat];
    const x     = pad.left + gap * i + (gap - barW) / 2;
    const barH  = (pct / 100) * chartH;
    const barY  = chartY + chartH - barH;
    const midX  = x + barW / 2;

    ctx.fillStyle = 'rgba(128,128,128,0.12)';
    ctx.beginPath();
    ctx.roundRect(x, chartY, barW, chartH, [4, 4, 0, 0]);
    ctx.fill();

    if (barH > 0) {
      const grad = ctx.createLinearGradient(midX, barY, midX, chartY + chartH);
      grad.addColorStop(0, level.color);
      grad.addColorStop(1, level.color + 'bb');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, barY, barW, barH, barH > 6 ? [4, 4, 0, 0] : [2, 2, 0, 0]);
      ctx.fill();
    }

    if (s.pct !== null) {
      ctx.fillStyle    = '#555';
      ctx.font         = 'bold 12px DM Sans, sans-serif';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(pct + '%', midX, barY - 4);
    }

    ctx.fillStyle    = '#888';
    ctx.font         = 'bold 11px DM Sans, sans-serif';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(LABEL_MAP[cat] || cat, midX, chartY + chartH + 10);
  });

  ctx.beginPath();
  ctx.moveTo(pad.left, chartY + chartH);
  ctx.lineTo(pad.left + chartW, chartY + chartH);
  ctx.strokeStyle = 'rgba(128,128,128,0.7)';
  ctx.lineWidth   = 1.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(pad.left, chartY);
  ctx.lineTo(pad.left, chartY + chartH);
  ctx.strokeStyle = 'rgba(128,128,128,0.7)';
  ctx.lineWidth   = 1.5;
  ctx.stroke();
}

function drawDistributionChart() {
  const canvas = document.getElementById('chart-dist');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let total = 0;
  Object.values(state.answers).forEach(v => {
    if (v !== 'skipped' && v !== null) { counts[v] = (counts[v] || 0) + 1; total++; }
  });
  if (total === 0) return;

  const pad     = { top: 20, right: 20, bottom: 55, left: 45 };
  const chartW  = W - pad.left - pad.right;
  const chartH  = H - pad.top - pad.bottom;
  const barW    = chartW / 5 * 0.6;
  const gap     = chartW / 5;
  const maxCount = Math.max(...Object.values(counts), 1);

  [0, 0.25, 0.5, 0.75, 1].forEach(r => {
    const v = Math.round(r * maxCount);
    const y = pad.top + chartH - r * chartH;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + chartW, y);
    ctx.strokeStyle = r === 0 ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.07)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#888';
    ctx.font = 'bold 10px DM Sans, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(v, pad.left - 6, y + 3);
  });

  LIKERT.forEach((opt, i) => {
    const count = counts[opt.value] || 0;
    const barH  = (count / maxCount) * chartH;
    const x     = pad.left + gap * i + (gap - barW) / 2;
    const y     = pad.top + chartH - barH;

    ctx.fillStyle = 'rgba(128,128,128,0.1)';
    ctx.beginPath();
    ctx.roundRect(x, pad.top, barW, chartH, [4,4,0,0]);
    ctx.fill();

    if (barH > 0) {
      const grad = ctx.createLinearGradient(x, y, x, pad.top + chartH);
      grad.addColorStop(0, opt.color);
      grad.addColorStop(1, opt.color + '44');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, barH > 8 ? [4,4,0,0] : [2,2,0,0]);
      ctx.fill();
      ctx.fillStyle = '#666';
      ctx.font = 'bold 12px DM Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(count, x + barW / 2, y - 8);
    }

    ctx.fillStyle = '#888';
    ctx.font = 'bold 10px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    const words = opt.label.split(' ');
    ctx.fillText(words[0], x + barW / 2, pad.top + chartH + 16);
    if (words[1]) ctx.fillText(words[1], x + barW / 2, pad.top + chartH + 28);

    const pct = total ? Math.round((count / total) * 100) : 0;
    ctx.fillStyle = '#666';
    ctx.font = 'bold 11px DM Sans, sans-serif';
    ctx.fillText(pct + '%', x + barW / 2, pad.top + chartH + 42);
  });
}

// ─── PDF Export ───────────────────────────────────────────────────────────────
async function generatePDF() {
  const btn = document.getElementById('res-btn-pdf');
  btn.disabled = true;
  btn.textContent = 'Generating…';
  try {
    const { jsPDF } = window.jspdf;
    const doc     = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const PW      = doc.internal.pageSize.getWidth();
    const PH      = doc.internal.pageSize.getHeight();
    const stats   = allCategoryStats();
    const overall = overallScore();
    let y = 0;

    // ── PAGE 1: COVER ─────────────────────────────────────────────────────────
    doc.setFillColor(26, 26, 26);
    doc.rect(0, 0, PW, 50, 'F');
    doc.setFillColor(255, 198, 47);
    doc.rect(0, 48, PW, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('Soft Skills Assessment', PW / 2, 18, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(180, 180, 180);
    doc.text('Psychometric Competency Report', PW / 2, 30, { align: 'center' });

    // Assessed categories tag
    doc.setFontSize(9);
    doc.setTextColor(255, 198, 47);
    doc.text(`Categories: ${state.selectedCategories.join(' · ')}`, PW / 2, 40, { align: 'center' });

    y = 62;
    [['Employee:', state.employeeData.name], ['Role:', state.employeeData.role],
     ['Date:', new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })]
    ].forEach(([label, value]) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(label, 20, y);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(26, 26, 26);
      doc.text(value, 65, y);
      y += 8;
    });

    y = 98;
    doc.setFillColor(255, 198, 47);
    doc.circle(PW / 2, y + 18, 20, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(26, 26, 26);
    doc.text(overall + '%', PW / 2, y + 22, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text('Overall Score', PW / 2, y + 33, { align: 'center' });
    const lvl = getLevel(overall);
    const lc  = hexToRgb(lvl.color);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(lc.r, lc.g, lc.b);
    doc.text(lvl.label, PW / 2, y + 43, { align: 'center' });

    y = 152;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(26, 26, 26);
    doc.text('Category Breakdown', 20, y);
    y += 10;

    state.selectedCategories.forEach(cat => {
      const s      = stats[cat];
      const catLvl = getLevel(s.pct);
      const pctVal = s.pct !== null ? s.pct : 0;
      const rc     = hexToRgb(catLvl.color);

      doc.setFillColor(248, 248, 248);
      doc.roundedRect(18, y - 6, PW - 36, 16, 2, 2, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(26, 26, 26);
      doc.text(cat, 22, y + 2);

      const barX = 75, barW2 = 70, barH = 5;
      doc.setFillColor(220, 220, 220);
      doc.roundedRect(barX, y - 1, barW2, barH, 2, 2, 'F');
      doc.setFillColor(rc.r, rc.g, rc.b);
      if (pctVal > 0) doc.roundedRect(barX, y - 1, barW2 * pctVal / 100, barH, 2, 2, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(rc.r, rc.g, rc.b);
      doc.text(s.pct !== null ? s.pct + '%' : '—', PW - 22, y + 2, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(`${s.answered} answered · ${s.skipped} skipped`, PW - 22, y + 8, { align: 'right' });

      y += 18;
    });

    y += 6;

    // Charts side by side
    const radarCanvas = document.getElementById('chart-radar');
    try {
      const img = radarCanvas.toDataURL('image/png');
      if (img && img.length > 100) doc.addImage(img, 'PNG', 15, y, 75, 65);
    } catch(e) {}

    const barCanvas = document.getElementById('chart-bar');
    try {
      const img = barCanvas.toDataURL('image/png');
      if (img && img.length > 100) doc.addImage(img, 'PNG', 100, y, 78, 65);
    } catch(e) {}

    // ── PAGE 2: DETAILED RESPONSES ────────────────────────────────────────────
    doc.addPage();
    y = 15;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(26, 26, 26);
    doc.text('Detailed Question Responses', 20, y);
    y += 6;
    doc.setFillColor(255, 198, 47);
    doc.rect(20, y, PW - 40, 1.5, 'F');
    y += 9;

    state.selectedCategories.forEach(cat => {
      if (y > PH - 40) { doc.addPage(); y = 15; }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(26, 26, 26);
      doc.rect(18, y - 6, PW - 36, 11, 'F');
      doc.text(cat, 22, y);
      y += 13;

      (state.selectedQuestions[cat] || []).forEach((q, qi) => {
        if (y > PH - 28) { doc.addPage(); y = 15; }

        const ans = state.answers[q.id];
        let ansLabel = '—';
        let ansColor = { r:150, g:150, b:150 };
        if (ans === 'skipped') {
          ansLabel = 'Skipped'; ansColor = { r:180,g:180,b:180 };
        } else if (ans != null) {
          const opt = LIKERT.find(l => l.value === ans);
          if (opt) { ansLabel = opt.label; ansColor = hexToRgb(opt.color); }
        }

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(40, 40, 40);
        const lines = doc.splitTextToSize(`Q${qi + 1}. ${q.text}`, PW - 50);
        doc.text(lines, 20, y);
        y += lines.length * 4.8;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(ansColor.r, ansColor.g, ansColor.b);
        doc.text(ansLabel, 25, y);
        y += 8;
      });
      y += 4;
    });

    // ── PAGE 3: DISTRIBUTION ──────────────────────────────────────────────────
    doc.addPage();
    y = 15;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(26, 26, 26);
    doc.text('Response Distribution', 20, y);
    y += 8;

    try {
      const img = document.getElementById('chart-dist').toDataURL('image/png');
      if (img && img.length > 100) doc.addImage(img, 'PNG', 15, y, PW - 30, 70);
    } catch(e) {}

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `Assessment covers: ${state.selectedCategories.join(', ')} — evaluated using a 5-point Likert scale.`,
      PW / 2, PH - 10, { align: 'center', maxWidth: PW - 40 }
    );

    doc.save(`SSA_${state.employeeData.name.replace(/\s+/g,'_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    showToast('PDF exported successfully!', 'success');
  } catch (err) {
    console.error(err);
    showToast('PDF generation failed. Please try again.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Export PDF';
  }
}

function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1,3),16),
    g: parseInt(hex.slice(3,5),16),
    b: parseInt(hex.slice(5,7),16),
  };
}

// ─── Storage ─────────────────────────────────────────────────────────────────
function saveToStorage() {
  try {
    let stored = { version: 2, assessments: [] };
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { try { const p = JSON.parse(raw); if (p.assessments) stored = p; } catch(_){} }
    stored.assessments.push({
      id: Date.now(),
      employee: state.employeeData,
      categories: state.selectedCategories,
      timestamp: new Date().toISOString(),
      answers: state.answers,
      stats: allCategoryStats(),
      overall: overallScore(),
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch(_) {}
}

// ─── Init ─────────────────────────────────────────────────────────────────────
function init() {
  renderCategorySelector();

  document.getElementById('ssa-form').addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('inp-name').value.trim();
    const role    = document.getElementById('inp-role').value.trim();
    const nameErr = document.getElementById('err-name');
    const roleErr = document.getElementById('err-role');
    nameErr.textContent = '';
    roleErr.textContent = '';
    let ok = true;
    if (!name || name.length < 2) { nameErr.textContent = 'Please enter a valid name.'; ok = false; }
    if (!role || role.length < 2) { roleErr.textContent = 'Please enter a valid role.'; ok = false; }
    if (!ok) return;

    state.employeeData      = { name, role };
    state.selectedQuestions = pickQuestions();
    state.answers           = {};
    state.activeCategoryIndex  = 0;
    state.activeQuestionIndex  = 0;
    state.answerLocked         = false;
    renderAssessment();
  });

  document.getElementById('ssa-btn-prev-q').addEventListener('click', prevQuestion);
  document.getElementById('ssa-btn-next-q').addEventListener('click', nextQuestion);
  document.getElementById('ssa-btn-skip').addEventListener('click', skipQuestion);
  document.getElementById('ssa-btn-finish-early').addEventListener('click', () => {
    const anyAnswered = Object.values(state.answers).some(v => v !== 'skipped');
    if (!anyAnswered) { showToast('Please answer at least one question.', 'warning'); return; }
    finishAssessment();
  });

  document.getElementById('res-btn-pdf').addEventListener('click', generatePDF);
  document.getElementById('res-btn-restart').addEventListener('click', () => {
    state = {
      employeeData: null,
      selectedCategories: [...ALL_CATEGORIES],
      selectedQuestions: {},
      answers: {},
      activeCategoryIndex: 0,
      activeQuestionIndex: 0,
      phase: 'welcome',
      answerLocked: false,
    };
    document.getElementById('ssa-form').reset();
    document.getElementById('err-name').textContent = '';
    document.getElementById('err-role').textContent = '';
    document.getElementById('ssa-welcome').classList.add('active');
    document.getElementById('ssa-assessment').classList.remove('active');
    document.getElementById('ssa-results').classList.remove('active');
    renderCategorySelector();
  });

  document.getElementById('ssa-welcome').classList.add('active');
}

document.addEventListener('DOMContentLoaded', init);