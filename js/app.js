'use strict';

// ─── Config ──────────────────────────────────────────────────────────────────
const STORAGE_KEY   = 'ssa_v2';
const QUESTIONS_PER_CATEGORY = 10;   // randomly pick 10 from each pool

// ─── Question Pools (15 per category, scenario-based psychometric) ───────────
const questionPools = {
  Communication: [
    { id:'c01', text:'During a project kickoff, your manager gives confusing instructions. You would clarify in the moment rather than proceed and figure it out later.' },
    { id:'c02', text:'When a colleague misunderstands your message over chat, you prefer to call them rather than write a longer explanation.' },
    { id:'c03', text:'You are presenting quarterly results to senior leadership. Even when challenged, you maintain your composure and address concerns clearly.' },
    { id:'c04', text:'You find it easy to adjust your vocabulary and tone when explaining a technical topic to a non-technical stakeholder.' },
    { id:'c05', text:'After sending an important email, you follow up to confirm the recipient understood the key actions required.' },
    { id:'c06', text:'In a heated team debate, you listen fully before forming your response rather than preparing your rebuttal while others speak.' },
    { id:'c07', text:'You can summarise a complex 30-minute discussion into three clear bullet points without losing key nuance.' },
    { id:'c08', text:'When a client gives vague feedback ("make it pop"), you probe with specific questions rather than guessing what they mean.' },
    { id:'c09', text:'You are comfortable delivering bad news — like a delayed deadline — directly and professionally, without sugarcoating.' },
    { id:'c10', text:'During remote meetings, you actively use non-verbal signals (camera on, nodding, reactions) to show engagement.' },
    { id:'c11', text:'You tailor written reports differently for a CEO briefing versus a team operations update.' },
    { id:'c12', text:'If a colleague interrupts you mid-sentence repeatedly, you address it calmly without letting it escalate.' },
    { id:'c13', text:'You feel confident moderating a discussion where two senior stakeholders strongly disagree.' },
    { id:'c14', text:'You proactively share relevant information with your team even when nobody specifically asked for it.' },
    { id:'c15', text:'When receiving feedback on your work, your first instinct is to understand the perspective rather than defend your choices.' },
  ],
  Leadership: [
    { id:'l01', text:'When your team is demotivated after a project failure, you take steps to rebuild morale before pushing toward the next deadline.' },
    { id:'l02', text:'You spot a process inefficiency in another department. Even though it is outside your remit, you raise it with the right people.' },
    { id:'l03', text:'When two team members have a recurring conflict, you address it directly rather than waiting for it to resolve itself.' },
    { id:'l04', text:'You invest time in helping junior colleagues grow, even when it slows down your own output.' },
    { id:'l05', text:'Before starting a new initiative, you define clear success metrics so the team knows exactly what "done" looks like.' },
    { id:'l06', text:'Under a tight deadline with incomplete information, you make a call and commit to it rather than stalling for certainty.' },
    { id:'l07', text:'You delegate important tasks to others even when you believe you could do them better yourself.' },
    { id:'l08', text:'You consciously create space for quieter team members to contribute in meetings dominated by louder voices.' },
    { id:'l09', text:'After a significant setback, you conduct a structured review to understand what went wrong before moving forward.' },
    { id:'l10', text:'You deliver honest performance feedback to a high-performing team member who has a blind spot.' },
    { id:'l11', text:'When you commit to something, colleagues can count on it being done — even if circumstances change.' },
    { id:'l12', text:'You can articulate a clear "why" behind decisions to bring the team along, not just issue directives.' },
    { id:'l13', text:'When facing pressure from leadership to cut corners, you push back constructively while still meeting the core objective.' },
    { id:'l14', text:'You actively champion ideas from your team even when you personally prefer a different approach.' },
    { id:'l15', text:'You regularly check in on your team\'s capacity and wellbeing, not just task completion.' },
  ],
  Confidence: [
    { id:'cf01', text:'When asked a question you do not know the answer to in a meeting, you acknowledge it openly rather than bluffing.' },
    { id:'cf02', text:'You are comfortable presenting your work-in-progress to senior stakeholders, knowing it is not yet perfect.' },
    { id:'cf03', text:'After making a visible mistake in front of peers, you recover quickly without dwelling on it.' },
    { id:'cf04', text:'You trust your own judgment enough to disagree with a popular opinion when you have evidence to support your view.' },
    { id:'cf05', text:'When negotiating your salary or project scope, you advocate for what you believe is fair rather than accepting the first offer.' },
    { id:'cf06', text:'You volunteer to lead a high-stakes presentation rather than waiting to be assigned.' },
    { id:'cf07', text:'Constructive criticism from your manager motivates you to improve rather than making you doubt your abilities.' },
    { id:'cf08', text:'You take on stretch assignments outside your comfort zone because you believe you can grow into them.' },
    { id:'cf09', text:'In a room full of experts, you still feel confident contributing your perspective.' },
    { id:'cf10', text:'When a project you championed fails, you own it publicly rather than distancing yourself from the outcome.' },
    { id:'cf11', text:'You can make a significant decision with 70% of the information rather than waiting for complete certainty.' },
    { id:'cf12', text:'You speak up immediately when you notice something going wrong, even if it means challenging a senior colleague.' },
    { id:'cf13', text:'You genuinely believe your contributions make a meaningful difference to your team\'s outcomes.' },
    { id:'cf14', text:'When starting something entirely new, you approach the learning curve with excitement rather than anxiety.' },
    { id:'cf15', text:'Receiving public recognition feels natural to you — you accept it gracefully without deflecting or minimising your role.' },
  ],
  Teamwork: [
    { id:'t01', text:'When a teammate is overwhelmed, you proactively offer to take on part of their workload without being asked.' },
    { id:'t02', text:'In a group project where credit is shared equally, you contribute as fully as if you were solely responsible.' },
    { id:'t03', text:'When a team decision goes against your recommendation, you commit to executing it fully rather than doing it half-heartedly.' },
    { id:'t04', text:'You acknowledge a colleague\'s contribution publicly when their idea leads to a team win.' },
    { id:'t05', text:'When a new teammate joins, you go out of your way to help them integrate and get up to speed.' },
    { id:'t06', text:'In brainstorming sessions, you build on others\' ideas rather than immediately pushing your own.' },
    { id:'t07', text:'You surface team issues early — even uncomfortable ones — rather than letting problems simmer.' },
    { id:'t08', text:'You keep your teammates informed of your progress, blockers, and changes in priority without being prompted.' },
    { id:'t09', text:'When a colleague is underperforming and affecting the team, you address it with them directly and supportively.' },
    { id:'t10', text:'You treat team agreements (stand-ups, deadlines, norms) as commitments, not suggestions.' },
    { id:'t11', text:'You are equally engaged and collaborative whether working with your favourite colleague or someone you find difficult.' },
    { id:'t12', text:'After a team success, you focus on celebrating the group effort rather than individual standouts.' },
    { id:'t13', text:'You actively seek perspectives from team members whose background or thinking differs from yours.' },
    { id:'t14', text:'When the team is under pressure, you stay calm and solution-focused rather than adding to the tension.' },
    { id:'t15', text:'You reflect on your role in team dynamics and take steps to improve how you show up for others.' },
  ],
};

const CATEGORIES = Object.keys(questionPools);

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
  selectedQuestions: {},   // { Communication: [...], ... }
  answers: {},             // { questionId: value | 'skipped' }
  activeCategoryIndex: 0,
  activeQuestionIndex: 0,
  phase: 'welcome',        // welcome | assessment | results
  answerLocked: false,     // ✅ PREVENT MULTIPLE CLICKS
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
  CATEGORIES.forEach(cat => {
    result[cat] = shuffle(questionPools[cat]).slice(0, QUESTIONS_PER_CATEGORY);
  });
  return result;
}

function getAnswer(qid) {
  return state.answers[qid] ?? null;
}

function activeCategory() { return CATEGORIES[state.activeCategoryIndex]; }
function activeQuestions() { return state.selectedQuestions[activeCategory()] || []; }
function activeQuestion()  { return activeQuestions()[state.activeQuestionIndex]; }

function categoryStats(cat) {
  const qs = state.selectedQuestions[cat] || [];
  let total = 0, count = 0, skipped = 0;
  qs.forEach(q => {
    const a = state.answers[q.id];
    if (a === 'skipped') { skipped++; }
    else if (a !== null && a !== undefined) { total += a; count++; }
  });
  const answered = count;
  const pct = count > 0 ? Math.round((total / (count * 5)) * 100) : null;
  return { answered, skipped, total: qs.length, pct, raw: count > 0 ? (total / count) : null };
}

function allCategoryStats() {
  const result = {};
  CATEGORIES.forEach(cat => { result[cat] = categoryStats(cat); });
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
  CATEGORIES.forEach((cat, i) => {
    const stats = categoryStats(cat);
    const isActive = i === state.activeCategoryIndex;
    const isDone = stats.answered + stats.skipped === stats.total;

    const tab = document.createElement('button');
    tab.className = `cat-tab${isActive ? ' active' : ''}${isDone ? ' done' : ''}`;
    tab.innerHTML = `
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

  document.getElementById('ssa-cat-label').textContent = cat;
  document.getElementById('ssa-q-num').textContent = `Question ${qNum} of ${total}`;
  document.getElementById('ssa-q-text').textContent = q.text;

  // render Likert options
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
    // ✅ FIX: Only allow one click per question
    btn.addEventListener('click', (e) => {
      if (state.answerLocked) return;  // ✅ PREVENT MULTIPLE CLICKS
      
      state.answerLocked = true;  // ✅ LOCK IMMEDIATELY
      state.answers[q.id] = opt.value;
      
      // Update UI
      document.querySelectorAll('.likert-btn').forEach(b => {
        b.disabled = true;  // ✅ DISABLE ALL BUTTONS
        b.classList.toggle('selected', parseInt(b.dataset.value) === opt.value);
      });
      
      renderCategoryProgress();
      renderCategoryTabs();
      
      // Advance after delay
      setTimeout(() => {
        state.answerLocked = false;  // ✅ UNLOCK FOR NEXT QUESTION
        advanceQuestion();
      }, 350);
    });
    container.appendChild(btn);
  });

  // nav buttons
  document.getElementById('ssa-btn-prev-q').disabled = (state.activeQuestionIndex === 0 && state.activeCategoryIndex === 0);
  const isLastQ = state.activeQuestionIndex === total - 1;
  const isLastCat = state.activeCategoryIndex === CATEGORIES.length - 1;
  const nextBtn = document.getElementById('ssa-btn-next-q');
  nextBtn.textContent = (isLastQ && isLastCat) ? 'Finish' : 'Next →';
}

function advanceQuestion() {
  const qs = activeQuestions();
  if (state.activeQuestionIndex < qs.length - 1) {
    state.activeQuestionIndex++;
    renderAssessment();
  } else if (state.activeCategoryIndex < CATEGORIES.length - 1) {
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
  const isLastQ = state.activeQuestionIndex === activeQuestions().length - 1;
  const isLastCat = state.activeCategoryIndex === CATEGORIES.length - 1;
  if (isLastQ && isLastCat) {
    finishAssessment();
  } else {
    advanceQuestion();
  }
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

  const stats = allCategoryStats();
  const overall = overallScore();

  // Header
  document.getElementById('res-name').textContent = state.employeeData.name;
  document.getElementById('res-role').textContent = state.employeeData.role;
  document.getElementById('res-date').textContent = new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
  document.getElementById('res-overall-pct').textContent = overall + '%';
  document.getElementById('res-overall-level').textContent = getLevel(overall).label;
  document.getElementById('res-overall-level').style.color = getLevel(overall).color;

  // Category cards
  const cardsContainer = document.getElementById('res-cat-cards');
  cardsContainer.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const s = stats[cat];
    const level = getLevel(s.pct);
    const card = document.createElement('div');
    card.className = 'res-cat-card';
    card.innerHTML = `
      <div class="res-cat-card__header">
        <span class="res-cat-card__name">${cat}</span>
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

  // Draw charts
  drawRadarChart(stats);
  drawBarChart(stats);
  drawDistributionChart();
}
// ─── CHART FUNCTIONS WITH DARK TEXT ────────────────────────────────────────

function drawRadarChart(stats) {
  const canvas = document.getElementById('chart-radar');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const maxR = Math.min(W, H) / 2 - 40;

  ctx.clearRect(0, 0, W, H);

  const cats = CATEGORIES;
  const N = cats.length;
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
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';  // ✅ DARK LINES
    ctx.lineWidth = 1;
    ctx.stroke();
    // label
    ctx.fillStyle = 'rgba(0,0,0,0.35)';  // ✅ DARK GRAY TEXT
    ctx.font = 'bold 10px DM Sans, sans-serif';  // ✅ BOLD
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(r * 100) + '%', cx + 4, cy - maxR * r + 4);
  });

  // Spokes
  angles.forEach(a => {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * maxR, cy + Math.sin(a) * maxR);
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';  // ✅ DARK LINES
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
  ctx.fillStyle = 'rgba(255,198,47,0.25)';
  ctx.fill();
  ctx.strokeStyle = '#ffc62f';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Dots
  angles.forEach((a, i) => {
    const x = cx + Math.cos(a) * maxR * values[i];
    const y = cy + Math.sin(a) * maxR * values[i];
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffc62f';
    ctx.fill();
  });

  // Labels
  ctx.font = 'bold 12px DM Sans, sans-serif';
  ctx.fillStyle = '#000';  // ✅ BLACK TEXT FOR CATEGORY NAMES
  angles.forEach((a, i) => {
    const offset = 22;
    const x = cx + Math.cos(a) * (maxR + offset);
    const y = cy + Math.sin(a) * (maxR + offset);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(cats[i], x, y);
    if (stats[cats[i]].pct !== null) {
      ctx.font = 'bold 11px DM Sans, sans-serif';  // ✅ BOLD
      ctx.fillStyle = '#333';  // ✅ DARK GRAY FOR PERCENTAGES
      ctx.fillText(stats[cats[i]].pct + '%', x, y + 14);
      ctx.font = 'bold 12px DM Sans, sans-serif';
      ctx.fillStyle = '#000';
    }
  });
}

function drawBarChart(stats) {
  const canvas = document.getElementById('chart-bar');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  
  // ✅ MASSIVELY INCREASED BOTTOM PADDING - PREVENT CUT-OFF AND OVERLAP
  const pad = { top: 40, right: 30, bottom: 120, left: 60 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const barW = chartW / CATEGORIES.length * 0.50;  // ✅ SLIGHTLY NARROWER BARS
  const gap  = chartW / CATEGORIES.length;

  ctx.clearRect(0, 0, W, H);

  // ✅ Y AXIS - UNIVERSAL DARK GRAY
  [0, 25, 50, 75, 100].forEach(v => {
    const y = pad.top + chartH - (v / 100) * chartH;
    
    // Grid lines - subtle
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + chartW, y);
    ctx.strokeStyle = v === 0 ? '#999' : '#ddd';
    ctx.lineWidth = v === 0 ? 2 : 1;
    ctx.stroke();
    
    // Y-axis labels
    ctx.fillStyle = '#555';
    ctx.font = 'bold 11px DM Sans, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(v + '%', pad.left - 15, y);
  });

  // ✅ BARS WITH PROPER SPACING
  CATEGORIES.forEach((cat, i) => {
    const s = stats[cat];
    const pct = s.pct || 0;
    const level = getLevel(s.pct);
    const x = pad.left + gap * i + (gap - barW) / 2;
    const barH = (pct / 100) * chartH;
    const y = pad.top + chartH - barH;

    // Background bar
    ctx.fillStyle = '#e8e8e8';
    ctx.beginPath();
    ctx.roundRect(x, pad.top, barW, chartH, [4, 4, 0, 0]);
    ctx.fill();

    // Active bar with gradient
    const grad = ctx.createLinearGradient(x, y, x, pad.top + chartH);
    grad.addColorStop(0, level.color);
    grad.addColorStop(1, level.color + 'cc');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, barH > 8 ? [4, 4, 0, 0] : [2, 2, 0, 0]);
    ctx.fill();

    // ✅ BAR PERCENTAGE VALUE
    if (s.pct !== null) {
      ctx.fillStyle = '#1a1a1a';
      ctx.font = 'bold 14px DM Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(pct + '%', x + barW / 2, y - 12);
    }

    // ✅ CATEGORY NAME - SPLIT ACROSS TWO LINES IF LONG
    // Position 1: First line of category (if needed)
    ctx.fillStyle = '#444';
    ctx.font = 'bold 11px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    // ✅ POSITIONED MUCH LOWER WITH PLENTY OF SPACE
    // Y = pad.top + chartH + space from bottom
    const categoryY = pad.top + chartH + 35;  // 35mm below chart
    
    ctx.fillText(cat, x + barW / 2, categoryY);
  });

  // ✅ BOTTOM AXIS LINE
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top + chartH);
  ctx.lineTo(pad.left + chartW, pad.top + chartH);
  ctx.strokeStyle = '#999';
  ctx.lineWidth = 2;
  ctx.stroke();

  // ✅ LEFT AXIS LINE (for professional look)
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top);
  ctx.lineTo(pad.left, pad.top + chartH);
  ctx.strokeStyle = '#999';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawDistributionChart() {
  const canvas = document.getElementById('chart-dist');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  // Count all answers by value
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let total = 0;
  Object.values(state.answers).forEach(v => {
    if (v !== 'skipped' && v !== null) { counts[v] = (counts[v] || 0) + 1; total++; }
  });

  if (total === 0) return;

  const pad = { top: 20, right: 20, bottom: 55, left: 45 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const barW = chartW / 5 * 0.6;
  const gap  = chartW / 5;
  const maxCount = Math.max(...Object.values(counts), 1);

  // Y grid
  [0, 0.25, 0.5, 0.75, 1].forEach(r => {
    const v = Math.round(r * maxCount);
    const y = pad.top + chartH - r * chartH;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + chartW, y);
    ctx.strokeStyle = r === 0 ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.08)';  // ✅ DARK LINES
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = 'rgba(0,0,0,0.4)';  // ✅ DARK TEXT FOR Y-AXIS
    ctx.font = 'bold 10px DM Sans, sans-serif';  // ✅ BOLD
    ctx.textAlign = 'right';
    ctx.fillText(v, pad.left - 6, y + 3);
  });

  // Bars per Likert value
  LIKERT.forEach((opt, i) => {
    const count = counts[opt.value] || 0;
    const barH = (count / maxCount) * chartH;
    const x = pad.left + gap * i + (gap - barW) / 2;
    const y = pad.top + chartH - barH;

    ctx.fillStyle = 'rgba(0,0,0,0.05)';  // ✅ DARK BACKGROUND
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

      // ✅ DARK TEXT ABOVE BAR - BOLD BLACK
      ctx.fillStyle = '#000';  // ✅ BLACK TEXT - VISIBLE ON LIGHT
      ctx.font = 'bold 12px DM Sans, sans-serif';  // ✅ LARGER BOLD
      ctx.textAlign = 'center';
      ctx.fillText(count, x + barW / 2, y - 8);  // ✅ MOVED HIGHER
    }

    // ✅ DARK LABEL TEXT
    ctx.fillStyle = '#333';  // ✅ DARK GRAY - VERY VISIBLE
    ctx.font = 'bold 10px DM Sans, sans-serif';  // ✅ BOLD
    ctx.textAlign = 'center';
    // wrap label
    const words = opt.label.split(' ');
    ctx.fillText(words[0], x + barW / 2, pad.top + chartH + 16);
    if (words[1]) ctx.fillText(words[1], x + barW / 2, pad.top + chartH + 28);
    
    // ✅ DARK PERCENTAGE TEXT - DARKEST
    const pct = total ? Math.round((count / total) * 100) : 0;
    ctx.fillStyle = '#000';  // ✅ BLACK TEXT
    ctx.font = 'bold 11px DM Sans, sans-serif';  // ✅ BOLD AND LARGER
    ctx.fillText(pct + '%', x + barW / 2, pad.top + chartH + 42);
  });
}
async function generatePDF() {
  const btn = document.getElementById('res-btn-pdf');
  btn.disabled = true;
  btn.textContent = 'Generating…';
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const PW = doc.internal.pageSize.getWidth();
    const PH = doc.internal.pageSize.getHeight();
    const stats = allCategoryStats();
    const overall = overallScore();
    let y = 0;

    // ── PAGE 1: COVER PAGE ─────────────────────────────────────────────────
    
    // Header band
    doc.setFillColor(26, 26, 26);
    doc.rect(0, 0, PW, 50, 'F');
    doc.setFillColor(255, 198, 47);
    doc.rect(0, 48, PW, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text('Soft Skills Assessment', PW / 2, 18, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(180, 180, 180);
    doc.text('Psychometric Competency Report', PW / 2, 32, { align: 'center' });

    // Employee info section
    y = 62;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    
    doc.text('Employee:', 20, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 26, 26);
    doc.text(state.employeeData.name, 65, y);
    
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text('Role:', 20, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 26, 26);
    doc.text(state.employeeData.role, 65, y);
    
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text('Date:', 20, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 26, 26);
    doc.text(new Date().toLocaleDateString('en-GB', {day:'numeric',month:'long',year:'numeric'}), 65, y);
    
    // ✅ INCREASED SPACING FOR OVERALL SCORE
    y = 95;

    // Overall score circle
    doc.setFillColor(255, 198, 47);
    doc.circle(PW / 2, y + 18, 20, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(32);
    doc.setTextColor(26, 26, 26);
    doc.text(overall + '%', PW / 2, y + 21, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text('Overall Score', PW / 2, y + 32, { align: 'center' });
    
    const lvl = getLevel(overall);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    const lc = hexToRgb(lvl.color);
    doc.setTextColor(lc.r, lc.g, lc.b);
    doc.text(lvl.label, PW / 2, y + 42, { align: 'center' });

    // ✅ MAJOR SPACING INCREASE - NOW AT LINE 145
    y = 150;

    // Category score table with BETTER SPACING
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(26, 26, 26);
    doc.text('Category Breakdown', 20, y);
    y += 10;

    CATEGORIES.forEach(cat => {
      const s = stats[cat];
      const catLvl = getLevel(s.pct);
      const pctVal = s.pct !== null ? s.pct : 0;
      const rc = hexToRgb(catLvl.color);

      // Row background - ✅ LARGER ROW HEIGHT
      doc.setFillColor(248, 248, 248);
      doc.roundedRect(18, y - 6, PW - 36, 16, 2, 2, 'F');

      // Category name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(26, 26, 26);
      doc.text(cat, 22, y + 2);

      // Progress bar
      const barX = 75;
      const barW2 = 75;  // ✅ FIXED WIDTH FOR CONSISTENCY
      const barH = 6;
      
      // Background bar
      doc.setFillColor(230, 230, 230);
      doc.roundedRect(barX, y - 2, barW2, barH, 2, 2, 'F');
      
      // Fill bar
      doc.setFillColor(rc.r, rc.g, rc.b);
      doc.roundedRect(barX, y - 2, barW2 * pctVal / 100, barH, 2, 2, 'F');

      // Percentage value - ✅ BOLD AND LARGER
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(rc.r, rc.g, rc.b);
      doc.text(s.pct !== null ? s.pct + '%' : '—', PW - 22, y + 2, { align: 'right' });

      // Stats text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(`${s.answered} answered · ${s.skipped} skipped`, PW - 22, y + 8, { align: 'right' });

      y += 18;  // ✅ INCREASED FROM 17 to 18
    });

    // ✅ MAJOR SPACING - CHARTS ON NEW LAYOUT
    y += 8;

    // Radar and Bar charts on same page with better sizing
    const radarCanvas = document.getElementById('chart-radar');
    try {
      const radarImg = radarCanvas.toDataURL('image/png');
      if (radarImg && radarImg.length > 100) {
        doc.addImage(radarImg, 'PNG', 15, y, 75, 65);
      }
    } catch (err) {
      console.warn('Radar chart rendering skipped', err);
    }

    const barCanvas = document.getElementById('chart-bar');
    try {
      const barImg = barCanvas.toDataURL('image/png');
      if (barImg && barImg.length > 100) {
        doc.addImage(barImg, 'PNG', 100, y, 75, 65);
      }
    } catch (err) {
      console.warn('Bar chart rendering skipped', err);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // ── PAGE 2: DETAILED QUESTION RESPONSES ──────────────────────────────────
    // ══════════════════════════════════════════════════════════════════════════
    
    doc.addPage();
    y = 15;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(26, 26, 26);
    doc.text('Detailed Question Responses', 20, y);
    
    y += 6;
    doc.setFillColor(255, 198, 47);
    doc.rect(20, y, PW - 40, 1.5, 'F');
    y += 8;

    CATEGORIES.forEach(cat => {
      // Check if need new page
      if (y > PH - 40) {
        doc.addPage();
        y = 15;
      }

      // Category header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(26, 26, 26);
      doc.rect(18, y - 6, PW - 36, 12, 'F');
      doc.text(cat, 22, y + 1);
      y += 14;

      const qs = state.selectedQuestions[cat] || [];
      qs.forEach((q, qi) => {
        // Check page break - ✅ MORE SPACE NEEDED
        if (y > PH - 30) {
          doc.addPage();
          y = 15;
        }

        const ans = state.answers[q.id];
        let ansLabel = '—';
        let ansColor = { r: 150, g: 150, b: 150 };
        
        if (ans === 'skipped') {
          ansLabel = 'Skipped';
          ansColor = { r: 180, g: 180, b: 180 };
        } else if (ans !== null && ans !== undefined) {
          const opt = LIKERT.find(l => l.value === ans);
          if (opt) {
            ansLabel = opt.label;
            ansColor = hexToRgb(opt.color);
          }
        }

        // ✅ QUESTION TEXT ONLY - NO ANSWER ON SAME LINE
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(40, 40, 40);
        
        const questionText = `Q${qi + 1}. ${q.text}`;
        const lines = doc.splitTextToSize(questionText, PW - 50);
        
        // Print question 
        doc.text(lines, 20, y);
        
        // ✅ MOVE Y POSITION AFTER QUESTION
        const questionHeight = lines.length * 4.8;
        y += questionHeight;

        // ✅ ANSWER LABEL ON SEPARATE LINE - INDENTED AND COLORED
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(ansColor.r, ansColor.g, ansColor.b);
        doc.text(ansLabel, 25, y);  // Indented by 5mm

        // ✅ ADD SPACE AFTER ANSWER
        y += 8;
      });

      y += 5;  // Space between categories
    });

    // ══════════════════════════════════════════════════════════════════════════
    // ── PAGE 3: RESPONSE DISTRIBUTION ───────────────────────────────────────
    // ══════════════════════════════════════════════════════════════════════════
    
    doc.addPage();
    y = 15;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(26, 26, 26);
    doc.text('Response Distribution', 20, y);
    y += 8;

    const distCanvas = document.getElementById('chart-dist');
    try {
      const distImg = distCanvas.toDataURL('image/png');
      if (distImg && distImg.length > 100) {
        doc.addImage(distImg, 'PNG', 15, y, PW - 30, 70);
      }
    } catch (err) {
      console.warn('Distribution chart rendering skipped', err);
    }

    // Footer
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      'This psychometric assessment evaluates Communication, Leadership, Confidence & Teamwork using a 5-point Likert scale.',
      PW / 2,
      PH - 10,
      { align: 'center', maxWidth: PW - 40 }
    );

    const fname = `SSA_${state.employeeData.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fname);
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
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
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
  // Welcome form
  document.getElementById('ssa-form').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('inp-name').value.trim();
    const role = document.getElementById('inp-role').value.trim();
    const nameErr = document.getElementById('err-name');
    const roleErr = document.getElementById('err-role');
    nameErr.textContent = '';
    roleErr.textContent = '';
    let ok = true;
    if (!name || name.length < 2) { nameErr.textContent = 'Please enter a valid name.'; ok = false; }
    if (!role || role.length < 2) { roleErr.textContent = 'Please enter a valid role.'; ok = false; }
    if (!ok) return;

    state.employeeData = { name, role };
    state.selectedQuestions = pickQuestions();
    state.answers = {};
    state.activeCategoryIndex = 0;
    state.activeQuestionIndex = 0;
    state.answerLocked = false;  // ✅ RESET LOCK
    renderAssessment();
  });

  // Assessment navigation
  document.getElementById('ssa-btn-prev-q').addEventListener('click', prevQuestion);
  document.getElementById('ssa-btn-next-q').addEventListener('click', nextQuestion);
  document.getElementById('ssa-btn-skip').addEventListener('click', skipQuestion);
  document.getElementById('ssa-btn-finish-early').addEventListener('click', () => {
    const anyAnswered = Object.values(state.answers).some(v => v !== 'skipped');
    if (!anyAnswered) { showToast('Please answer at least one question.', 'warning'); return; }
    finishAssessment();
  });

  // Results
  document.getElementById('res-btn-pdf').addEventListener('click', generatePDF);
  document.getElementById('res-btn-restart').addEventListener('click', () => {
    state = { 
      employeeData: null, 
      selectedQuestions: {}, 
      answers: {}, 
      activeCategoryIndex: 0, 
      activeQuestionIndex: 0, 
      phase: 'welcome',
      answerLocked: false  // ✅ RESET LOCK
    };
    document.getElementById('ssa-form').reset();
    document.getElementById('err-name').textContent = '';
    document.getElementById('err-role').textContent = '';
    document.getElementById('ssa-welcome').classList.add('active');
    document.getElementById('ssa-assessment').classList.remove('active');
    document.getElementById('ssa-results').classList.remove('active');
  });

  // Start screen active
  document.getElementById('ssa-welcome').classList.add('active');
}

document.addEventListener('DOMContentLoaded', init);