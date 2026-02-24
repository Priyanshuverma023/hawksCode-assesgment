'use strict';

// ─── Config ───────────────────────────────────────────────────────────────────
const STORAGE_KEY    = 'ssa_v2';
const TOTAL_QUESTIONS = 40; // always 40 total, split evenly across selected cats

// ─── Category Metadata ────────────────────────────────────────────────────────
const CATEGORY_META = {
  Communication: { color: '#38bdf8' },
  Leadership:    { color: '#a78bfa' },
  Confidence:    { color: '#fb923c' },
  Teamwork:      { color: '#4ade80' },
};

// ─── Scales ───────────────────────────────────────────────────────────────────
// type:'likert'  → Strongly Agree … Strongly Disagree
// type:'freq'    → Always … Never
// type:'choice'  → 4 labelled scenario options, each has a score 1–4

const LIKERT_SCALE = [
  { label:'Strongly Agree',    value:5, color:'#22c55e' },
  { label:'Agree',             value:4, color:'#86efac' },
  { label:'Neutral',           value:3, color:'#fbbf24' },
  { label:'Disagree',          value:2, color:'#fb923c' },
  { label:'Strongly Disagree', value:1, color:'#ef4444' },
];

const FREQ_SCALE = [
  { label:'Always',    value:5, color:'#22c55e' },
  { label:'Often',     value:4, color:'#86efac' },
  { label:'Sometimes', value:3, color:'#fbbf24' },
  { label:'Rarely',    value:2, color:'#fb923c' },
  { label:'Never',     value:1, color:'#ef4444' },
];

const LIKERT = LIKERT_SCALE; // alias — PDF/chart code uses LIKERT

// ─── Question Pools (20 per category: ~10 likert, ~5 freq, ~5 choice) ─────────
const questionPools = {

  // ══════════════════════════════════════════════════════════════════════════
  Communication: [
    // ── Likert ──────────────────────────────────────────────────────────────
    { id:'c01', type:'likert', text:'During a project kickoff, your manager gives confusing instructions. You clarify immediately rather than proceeding and figuring it out later.' },
    { id:'c02', type:'likert', text:'When a client gives vague feedback you ask specific clarifying questions before making any changes to the work.' },
    { id:'c03', type:'likert', text:'When challenged mid-presentation you stay composed, address the concern directly, and continue confidently.' },
    { id:'c04', type:'likert', text:'When an ambiguous message you sent causes a teammate to misunderstand a task, you take ownership and clarify immediately.' },
    { id:'c05', type:'likert', text:'You naturally shift your language and examples when explaining technical concepts to non-technical stakeholders.' },
    { id:'c06', type:'likert', text:'I actively listen without planning my response until the other person has fully finished speaking.' },
    { id:'c07', type:'likert', text:'I adjust my communication style whether I am writing a Slack message, a formal report, or giving a live presentation.' },
    { id:'c08', type:'likert', text:'When I receive critical feedback my first instinct is to understand the perspective before defending my choices.' },
    { id:'c09', type:'likert', text:'I feel equally comfortable delivering difficult news — such as a missed deadline — as I do sharing positive updates.' },
    { id:'c10', type:'likert', text:'I can hold a difficult one-to-one conversation — giving critical feedback or raising a sensitive issue — without it becoming personal.' },
    // ── Frequency ───────────────────────────────────────────────────────────
    { id:'c11', type:'freq', text:'I summarise key decisions and next steps at the end of meetings so everyone leaves aligned.' },
    { id:'c12', type:'freq', text:'I re-read written messages from the recipient\'s perspective before sending, checking for potential misunderstanding.' },
    { id:'c13', type:'freq', text:'After sending an important message I follow up to confirm the recipient understood the required actions.' },
    { id:'c14', type:'freq', text:'In remote or async settings I deliberately ensure my tone cannot be read as cold or abrupt.' },
    { id:'c15', type:'freq', text:'I check in with people after a challenging conversation to make sure the working relationship is still intact.' },
    // ── Scenario / Choice ───────────────────────────────────────────────────
    { id:'c16', type:'choice', text:'A stakeholder emails saying your report "lacks depth" — no further detail. What do you do first?',
      options:[
        { label:'Rewrite the whole report immediately and resend',                            score:1 },
        { label:'Reply asking which specific sections need more depth and why',               score:4 },
        { label:'Forward it to your manager and ask them to deal with it',                    score:1 },
        { label:'Add more data everywhere and resend without replying',                       score:2 },
      ]},
    { id:'c17', type:'choice', text:'You are presenting live and realise mid-slide that one of your figures is incorrect. You:',
      options:[
        { label:'Skip past it quickly and hope nobody noticed',                               score:1 },
        { label:'Acknowledge the error calmly, correct it verbally, and move on',             score:4 },
        { label:'Stop the presentation and apologise at length',                              score:2 },
        { label:'Finish presenting and send a correction email afterwards',                   score:3 },
      ]},
    { id:'c18', type:'choice', text:'A colleague from another team built the wrong thing because your brief was ambiguous. You:',
      options:[
        { label:'Point out they should have asked for clarification earlier',                 score:1 },
        { label:'Acknowledge the brief was unclear, meet to realign, and rewrite it',         score:4 },
        { label:'Accept the output and work around it',                                       score:2 },
        { label:'Rewrite the brief and resend without a conversation',                        score:2 },
      ]},
    { id:'c19', type:'choice', text:'You need to tell a long-standing client that their project will be three weeks late. You:',
      options:[
        { label:'Send a brief email and hope they do not push back',                          score:1 },
        { label:'Call them directly, explain the reason clearly, and outline the new plan',   score:4 },
        { label:'Ask your manager to make the call',                                          score:2 },
        { label:'Delay telling them until you are certain of the new date',                   score:2 },
      ]},
    { id:'c20', type:'choice', text:'Two senior colleagues are having a heated disagreement in a meeting you are facilitating. You:',
      options:[
        { label:'Let them resolve it themselves — it is not your place to intervene',         score:1 },
        { label:'Pause the meeting, acknowledge both views, and redirect to the shared goal', score:4 },
        { label:'Side with whoever you think is right and move on',                          score:1 },
        { label:'Suggest taking it offline and move to the next agenda item',                score:3 },
      ]},
  ],

  // ══════════════════════════════════════════════════════════════════════════
  Leadership: [
    // ── Likert ──────────────────────────────────────────────────────────────
    { id:'l01', type:'likert', text:'After a team failure you take time to rebuild morale and run a retrospective before pushing toward the next deadline.' },
    { id:'l02', type:'likert', text:'You raise process inefficiencies constructively even when they exist in another team\'s domain.' },
    { id:'l03', type:'likert', text:'When two team members have ongoing tension affecting output you address it directly with both parties rather than waiting.' },
    { id:'l04', type:'likert', text:'Under a tight deadline with incomplete information you make a clear call, communicate the reasoning, and commit.' },
    { id:'l05', type:'likert', text:'You deliver honest, specific feedback to a high-performer about a significant blind spot even when it is awkward.' },
    { id:'l06', type:'likert', text:'I invest time developing junior colleagues even when it temporarily slows my own output.' },
    { id:'l07', type:'likert', text:'Before starting an initiative I define clear success criteria so the team knows exactly what done looks like.' },
    { id:'l08', type:'likert', text:'I delegate meaningful responsibilities even when I believe I could personally do them better.' },
    { id:'l09', type:'likert', text:'I can articulate a compelling why behind decisions rather than simply issuing directives.' },
    { id:'l10', type:'likert', text:'I hold myself to the same standards I hold my team — I do not ask others to do things I would not do myself.' },
    // ── Frequency ───────────────────────────────────────────────────────────
    { id:'l11', type:'freq', text:'I check in on my team\'s wellbeing and workload — not just on task completion and deadlines.' },
    { id:'l12', type:'freq', text:'I create space for quieter voices in meetings where louder personalities tend to dominate.' },
    { id:'l13', type:'freq', text:'When pressure pushes toward cutting corners I push back constructively while still working toward the core objective.' },
    { id:'l14', type:'freq', text:'I lead a structured review after significant setbacks to extract lessons before moving on.' },
    { id:'l15', type:'freq', text:'I acknowledge my own mistakes openly in front of my team rather than quietly correcting them.' },
    // ── Scenario / Choice ───────────────────────────────────────────────────
    { id:'l16', type:'choice', text:'A strong performer on your team is resistant to feedback and dismisses your input each time. You:',
      options:[
        { label:'Stop giving feedback to avoid the conflict',                                 score:1 },
        { label:'Escalate directly to HR without speaking to them first',                     score:1 },
        { label:'Have a direct one-to-one exploring why feedback feels threatening to them',  score:4 },
        { label:'Document the pattern but take no further action yet',                        score:2 },
      ]},
    { id:'l17', type:'choice', text:'Your team is divided on a key strategic decision and the deadline is tomorrow. You:',
      options:[
        { label:'Pick the most popular option to keep everyone happy',                        score:2 },
        { label:'Make the call yourself, explain your reasoning clearly, and move forward',   score:4 },
        { label:'Delay the decision and commission more research',                            score:1 },
        { label:'Let the team vote and commit to the majority outcome',                       score:3 },
      ]},
    { id:'l18', type:'choice', text:'A new joiner is struggling visibly in their first month but has not asked for help. You:',
      options:[
        { label:'Wait — they need to learn to advocate for themselves',                       score:1 },
        { label:'Proactively check in, ask open questions, and offer concrete support',       score:4 },
        { label:'Ask their onboarding buddy to handle it',                                    score:2 },
        { label:'Raise it as a concern in their first formal review',                         score:1 },
      ]},
    { id:'l19', type:'choice', text:'Senior leadership publicly praises a project that your team delivered but does not mention the team. You:',
      options:[
        { label:'Say nothing — credit disputes look unprofessional',                          score:1 },
        { label:'Thank leadership and take the opportunity to highlight your team\'s work',   score:4 },
        { label:'Post about the team\'s contribution on an internal channel',                 score:3 },
        { label:'Tell your team privately but do not raise it further',                       score:2 },
      ]},
    { id:'l20', type:'choice', text:'A team member is consistently delivering good work but seems disengaged and quiet lately. You:',
      options:[
        { label:'Give them space — they probably just have something going on personally',    score:2 },
        { label:'Check in informally, ask how things are going beyond the work',              score:4 },
        { label:'Wait to see if their output starts to drop before acting',                   score:1 },
        { label:'Mention it in their next scheduled one-to-one',                              score:3 },
      ]},
  ],

  // ══════════════════════════════════════════════════════════════════════════
  Confidence: [
    // ── Likert ──────────────────────────────────────────────────────────────
    { id:'cf01', type:'likert', text:'When asked a question in a senior meeting that you do not know the answer to, you acknowledge it openly and offer to follow up.' },
    { id:'cf02', type:'likert', text:'When invited to present work-in-progress to executives you present clearly and own the current limitations without over-apologising.' },
    { id:'cf03', type:'likert', text:'When you publicly back a project that fails you own it transparently and focus on lessons rather than distancing yourself.' },
    { id:'cf04', type:'likert', text:'In a salary negotiation where the first offer is below expectations you counter with a clear and calm rationale.' },
    { id:'cf05', type:'likert', text:'When a senior stakeholder challenges your analysis in front of others you calmly stand by your data while staying open to new evidence.' },
    { id:'cf06', type:'likert', text:'I volunteer for high-visibility projects rather than waiting to be assigned.' },
    { id:'cf07', type:'likert', text:'Constructive criticism motivates me to improve rather than making me question my overall ability.' },
    { id:'cf08', type:'likert', text:'I take on stretch assignments outside my current skill set because I trust I can grow into them.' },
    { id:'cf09', type:'likert', text:'I feel confident contributing my perspective even in rooms full of significantly more experienced people.' },
    { id:'cf10', type:'likert', text:'I genuinely believe my contributions make a meaningful difference to my team\'s results.' },
    // ── Frequency ───────────────────────────────────────────────────────────
    { id:'cf11', type:'freq', text:'After making a visible mistake in front of colleagues I recover quickly without excessive dwelling or self-criticism.' },
    { id:'cf12', type:'freq', text:'I speak up when I notice something going wrong — even if it means respectfully challenging a senior colleague.' },
    { id:'cf13', type:'freq', text:'When starting something entirely unfamiliar I approach the learning curve with curiosity rather than anxiety.' },
    { id:'cf14', type:'freq', text:'I accept public recognition gracefully without deflecting, minimising my role, or feeling uncomfortable.' },
    { id:'cf15', type:'freq', text:'I reflect on wins as well as failures — I give myself credit when things go well.' },
    // ── Scenario / Choice ───────────────────────────────────────────────────
    { id:'cf16', type:'choice', text:'You have a strong opinion in a meeting but the room seems to be leaning the other way. You:',
      options:[
        { label:'Stay quiet — it is not worth the potential conflict',                        score:1 },
        { label:'Share your view clearly with evidence and invite others to push back',       score:4 },
        { label:'Wait until after the meeting to mention it privately to one person',         score:2 },
        { label:'Go along with the room but flag your concern in the follow-up email',        score:3 },
      ]},
    { id:'cf17', type:'choice', text:'You are asked to lead a project that is significantly outside your experience. You:',
      options:[
        { label:'Decline and suggest someone more experienced takes it',                      score:1 },
        { label:'Accept, identify your gaps honestly, and put a plan in place to address them',score:4 },
        { label:'Accept but do not flag the gaps, planning to figure it out as you go',       score:2 },
        { label:'Accept but immediately ask for a co-lead to share the responsibility',       score:3 },
      ]},
    { id:'cf18', type:'choice', text:'A peer publicly disputes your findings in a team meeting. Your data is correct. You:',
      options:[
        { label:'Back down to avoid the confrontation',                                       score:1 },
        { label:'Calmly present your evidence and invite them to share theirs',               score:4 },
        { label:'Become defensive and try to talk over them',                                 score:1 },
        { label:'Say nothing in the meeting but raise it with them one-to-one afterwards',    score:3 },
      ]},
    { id:'cf19', type:'choice', text:'You have been preparing for a big presentation for weeks. Right before it starts your main slide deck fails to load. You:',
      options:[
        { label:'Panic visibly and ask to reschedule',                                        score:1 },
        { label:'Calmly acknowledge the issue, present from notes or memory, and follow up with slides', score:4 },
        { label:'Spend ten minutes trying to fix it while the audience waits',                score:2 },
        { label:'Ask a colleague to take over',                                               score:1 },
      ]},
    { id:'cf20', type:'choice', text:'You have been in your role for six months and your manager has not given you any formal feedback. You:',
      options:[
        { label:'Assume things are fine since nobody has complained',                         score:1 },
        { label:'Proactively request a feedback conversation and come prepared with questions',score:4 },
        { label:'Ask colleagues informally what they think of your work',                     score:3 },
        { label:'Wait until the formal review cycle',                                         score:2 },
      ]},
  ],

  Teamwork: [
   
    { id:'t01', type:'likert', text:'When a teammate is visibly overwhelmed you offer to absorb some of their tasks without being asked.' },
    { id:'t02', type:'likert', text:'When the team makes a decision that goes against your recommendation you commit to it fully and constructively.' },
    { id:'t03', type:'likert', text:'When a new team member joins and seems lost you proactively reach out to help them settle in.' },
    { id:'t04', type:'likert', text:'During a brainstorm when a colleague raises an idea you initially think is weak you build on it rather than dismissing it.' },
    { id:'t05', type:'likert', text:'When a colleague is underperforming and affecting morale you address it with them directly and supportively.' },
    { id:'t06', type:'likert', text:'In group projects I contribute as fully as I would if I were solely responsible, regardless of how credit is shared.' },
    { id:'t07', type:'likert', text:'I acknowledge a colleague\'s contribution publicly when their input leads to a positive team outcome.' },
    { id:'t08', type:'likert', text:'I keep teammates informed of my progress, blockers, and priority shifts without waiting to be asked.' },
    { id:'t09', type:'likert', text:'I treat shared team agreements — stand-ups, deadlines, response times — as genuine commitments, not loose suggestions.' },
    { id:'t10', type:'likert', text:'I give honest, constructive input even when it means disagreeing with the direction the team is heading.' },
    // ── Frequency ───────────────────────────────────────────────────────────
    { id:'t11', type:'freq', text:'I surface uncomfortable team issues early rather than letting them fester.' },
    { id:'t12', type:'freq', text:'After a team success I focus on recognising the collective effort rather than individual contributions.' },
    { id:'t13', type:'freq', text:'I actively seek out perspectives from teammates whose backgrounds or thinking styles differ significantly from mine.' },
    { id:'t14', type:'freq', text:'When the team is under pressure I stay calm and focus on solutions rather than adding to the stress.' },
    { id:'t15', type:'freq', text:'I check in on teammates\' wellbeing outside of work deliverables — not just when a task needs doing.' },
    // ── Scenario / Choice ───────────────────────────────────────────────────
    { id:'t16', type:'choice', text:'Your team is behind schedule. A teammate is blocked and has not flagged it. You notice. You:',
      options:[
        { label:'It is their responsibility to speak up — you focus on your own work',        score:1 },
        { label:'Check in with them privately, offer to help unblock, and flag the risk to the team', score:4 },
        { label:'Mention it to your manager without speaking to the teammate first',           score:2 },
        { label:'Wait until the next standup to raise it',                                    score:2 },
      ]},
    { id:'t17', type:'choice', text:'In a retrospective a colleague shares feedback about your communication style that feels unfair. You:',
      options:[
        { label:'Dismiss it — they clearly misunderstood your intent',                        score:1 },
        { label:'Thank them, ask for a specific example, and reflect on it genuinely',        score:4 },
        { label:'Defend yourself in the meeting to set the record straight',                  score:1 },
        { label:'Say nothing in the meeting but raise it with them one-to-one later',         score:3 },
      ]},
    { id:'t18', type:'choice', text:'Credit for a major team win is being given entirely to one colleague in leadership communications. You:',
      options:[
        { label:'Say nothing — getting into credit disputes looks unprofessional',            score:1 },
        { label:'Raise it with your manager, focusing on ensuring the full team is recognised',score:4 },
        { label:'Post about the team\'s collective work on an internal channel',               score:3 },
        { label:'Confront the colleague directly and tell them to correct it',                score:2 },
      ]},
    { id:'t19', type:'choice', text:'A team member you work closely with has started missing small commitments repeatedly. You:',
      options:[
        { label:'Cover for them silently to keep things moving',                              score:2 },
        { label:'Have a direct, supportive conversation about the pattern you have noticed',  score:4 },
        { label:'Start documenting the misses in case it becomes a formal issue',             score:2 },
        { label:'Raise it with your manager before speaking to the person directly',          score:1 },
      ]},
    { id:'t20', type:'choice', text:'Your team is about to present a solution you privately believe has a serious flaw. There is still time to raise it. You:',
      options:[
        { label:'Stay quiet — the team decided and you do not want to derail things now',     score:1 },
        { label:'Raise the concern clearly before the presentation and propose a mitigation', score:4 },
        { label:'Mention it to one teammate privately and leave the decision to them',        score:2 },
        { label:'Let it proceed and raise it in the retrospective if it goes wrong',          score:2 },
      ]},
  ],
};

const ALL_CATEGORIES = Object.keys(questionPools);

// ─── State ────────────────────────────────────────────────────────────────────
let state = {
  employeeData:        null,
  selectedCategories:  [...ALL_CATEGORIES],
  selectedQuestions:   {},
  answers:             {},
  activeCategoryIndex: 0,
  activeQuestionIndex: 0,
  phase:               'welcome',
  answerLocked:        false,
};

// Helpers 
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Always pick TOTAL_QUESTIONS (40) spread evenly across selected categories.
// e.g. 1 cat = 40q | 2 cats = 20 each | 3 cats = 14/13/13 | 4 cats = 10 each
function pickQuestions() {
  const result = {};
  const cats   = state.selectedCategories;
  const base   = Math.floor(TOTAL_QUESTIONS / cats.length);
  const extra  = TOTAL_QUESTIONS % cats.length; // first `extra` cats get +1
  cats.forEach((cat, i) => {
    const count = base + (i < extra ? 1 : 0);
    result[cat] = shuffle(questionPools[cat]).slice(0, count);
  });
  return result;
}

// Map choice score (1-4) onto 1-5 numeric scale for consistent scoring
function choiceToScore(s) { return 1 + ((s - 1) / 3) * 4; }

function getAnswer(qid) { return state.answers[qid] ?? null; }

function activeCategory()  { return state.selectedCategories[state.activeCategoryIndex]; }
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
  const r = {};
  state.selectedCategories.forEach(cat => { r[cat] = categoryStats(cat); });
  return r;
}

function overallScore() {
  const stats = allCategoryStats();
  const valid = Object.values(stats).filter(s => s.pct !== null);
  if (!valid.length) return 0;
  return Math.round(valid.reduce((s, v) => s + v.pct, 0) / valid.length);
}

function getLevel(pct) {
  if (pct === null) return { label:'Not Assessed', color:'#94a3b8' };
  if (pct >= 85)   return { label:'Exceptional',   color:'#22c55e' };
  if (pct >= 70)   return { label:'Proficient',    color:'#86efac' };
  if (pct >= 55)   return { label:'Developing',    color:'#fbbf24' };
  if (pct >= 40)   return { label:'Needs Focus',   color:'#fb923c' };
  return               { label:'Critical Gap',  color:'#ef4444' };
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
  const btn   = document.getElementById('ssa-start-btn');
  const count = state.selectedCategories.length;
  // Always 40 questions regardless of category count
  const qCount = TOTAL_QUESTIONS;
  const perCat = Math.floor(qCount / count);

  const statCat = document.getElementById('stat-categories');
  const statQ   = document.getElementById('stat-questions');
  if (statCat) statCat.textContent = count;
  if (statQ)   statQ.textContent   = qCount;

  if (!btn) return;
  const arrowSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  btn.innerHTML =
    `<span class="btn-text-mobile">Start · ${count} cat · ${qCount}q ${arrowSvg}</span>` +
    `<span class="btn-text-desktop">Start Assessment · ${count} ${count === 1 ? 'category' : 'categories'} · ${qCount} questions (${perCat}${count > 1 ? ' each' : ''}) ${arrowSvg}</span>`;
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
    const stats    = categoryStats(cat);
    const isActive = i === state.activeCategoryIndex;
    const isDone   = stats.answered + stats.skipped === stats.total;
    const tab      = document.createElement('button');
    tab.className  = `cat-tab${isActive ? ' active' : ''}${isDone ? ' done' : ''}`;
    tab.innerHTML  = `
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
  const qs        = activeQuestions();
  const container = document.getElementById('ssa-q-dots');
  container.innerHTML = '';
  qs.forEach((q, i) => {
    const dot = document.createElement('button');
    const ans = state.answers[q.id];
    let cls   = 'q-dot';
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
  const q     = activeQuestion();
  const cat   = activeCategory();
  const qNum  = state.activeQuestionIndex + 1;
  const total = activeQuestions().length;

  // Badge shows category + question type
  const typeLabel = { likert:'Agree/Disagree', freq:'Frequency', choice:'Scenario' }[q.type] || '';
  document.getElementById('ssa-cat-label').textContent = `${cat}  ·  ${typeLabel}`;
  document.getElementById('ssa-q-num').textContent     = `Question ${qNum} of ${total}`;
  document.getElementById('ssa-q-text').textContent    = q.text;

  const container = document.getElementById('ssa-likert');
  container.innerHTML = '';

  if (q.type === 'choice') {
    renderChoiceOptions(q, container);
  } else {
    const scale = q.type === 'freq' ? FREQ_SCALE : LIKERT_SCALE;
    renderScaleOptions(q, scale, container);
  }

  // Prev / Next button states
  document.getElementById('ssa-btn-prev-q').disabled =
    (state.activeQuestionIndex === 0 && state.activeCategoryIndex === 0);

  const isLastQ   = state.activeQuestionIndex === total - 1;
  const isLastCat = state.activeCategoryIndex === state.selectedCategories.length - 1;
  const nextBtn   = document.getElementById('ssa-btn-next-q');
  nextBtn.innerHTML = (isLastQ && isLastCat)
    ? 'Finish'
    : 'Next <svg class="btn-arrow-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
}

// Likert or Frequency scale buttons
function renderScaleOptions(q, scale, container) {
  const current = getAnswer(q.id);
  scale.forEach(opt => {
    const btn = document.createElement('button');
    btn.className    = `likert-btn${current === opt.value ? ' selected' : ''}`;
    btn.dataset.value = opt.value;
    btn.innerHTML    = `
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
      setTimeout(() => { state.answerLocked = false; advanceQuestion(); }, 350);
    });
    container.appendChild(btn);
  });
}

// 4-option scenario choice buttons
function renderChoiceOptions(q, container) {
  const current  = getAnswer(q.id);
  const shuffled = shuffle(q.options);
  shuffled.forEach(opt => {
    const score     = choiceToScore(opt.score);
    const isSelected = current !== null && current !== 'skipped' &&
                       Math.abs(current - score) < 0.01;
    const btn = document.createElement('button');
    btn.className = `likert-btn choice-btn${isSelected ? ' selected' : ''}`;
    btn.innerHTML = `
      <span class="choice-marker"></span>
      <span class="likert-label">${opt.label}</span>
    `;
    btn.addEventListener('click', () => {
      if (state.answerLocked) return;
      state.answerLocked = true;
      state.answers[q.id] = score;
      document.querySelectorAll('.likert-btn').forEach(b => {
        b.disabled = true;
        b.classList.remove('selected');
      });
      btn.classList.add('selected');
      renderCategoryProgress();
      renderCategoryTabs();
      setTimeout(() => { state.answerLocked = false; advanceQuestion(); }, 350);
    });
    container.appendChild(btn);
  });
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

  document.getElementById('res-name').textContent        = state.employeeData.name;
  document.getElementById('res-role').textContent        = state.employeeData.role;
  document.getElementById('res-date').textContent        = new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
  document.getElementById('res-overall-pct').textContent = overall + '%';
  document.getElementById('res-overall-level').textContent = getLevel(overall).label;
  document.getElementById('res-overall-level').style.color = getLevel(overall).color;

  const circle = document.getElementById('res-overall-circle');
  if (circle) circle.style.setProperty('--pct', overall);

  const cardsContainer = document.getElementById('res-cat-cards');
  cardsContainer.innerHTML = '';
  state.selectedCategories.forEach(cat => {
    const s     = stats[cat];
    const level = getLevel(s.pct);
    const card  = document.createElement('div');
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

  drawRadarChart(stats);
  drawBarChart(stats);
  drawDistributionChart();
}

// ─── Charts ───────────────────────────────────────────────────────────────────
function drawRadarChart(stats) {
  const canvas = document.getElementById('chart-radar');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const maxR = Math.min(W, H) / 2 - 44;
  ctx.clearRect(0, 0, W, H);
  const cats   = state.selectedCategories;
  const angles = cats.map((_, i) => (Math.PI * 2 * i / cats.length) - Math.PI / 2);

  [0.2, 0.4, 0.6, 0.8, 1.0].forEach(r => {
    ctx.beginPath();
    angles.forEach((a, i) => {
      const x = cx + Math.cos(a) * maxR * r;
      const y = cy + Math.sin(a) * maxR * r;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.font = 'bold 9px DM Sans, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(Math.round(r * 100) + '%', cx + 4, cy - maxR * r + 4);
  });
  angles.forEach(a => {
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * maxR, cy + Math.sin(a) * maxR);
    ctx.strokeStyle = 'rgba(0,0,0,0.08)'; ctx.lineWidth = 1; ctx.stroke();
  });

  const values = cats.map(cat => (stats[cat].pct || 0) / 100);
  ctx.beginPath();
  angles.forEach((a, i) => {
    const x = cx + Math.cos(a) * maxR * values[i];
    const y = cy + Math.sin(a) * maxR * values[i];
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,198,47,0.2)'; ctx.fill();
  ctx.strokeStyle = '#ffc62f'; ctx.lineWidth = 2.5; ctx.stroke();
  angles.forEach((a, i) => {
    const x = cx + Math.cos(a) * maxR * values[i];
    const y = cy + Math.sin(a) * maxR * values[i];
    ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffc62f'; ctx.fill();
  });
  angles.forEach((a, i) => {
    const ox = cx + Math.cos(a) * (maxR + 24);
    const oy = cy + Math.sin(a) * (maxR + 24);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = 'bold 11px DM Sans, sans-serif'; ctx.fillStyle = '#111';
    ctx.fillText(cats[i], ox, oy);
    if (stats[cats[i]].pct !== null) {
      ctx.font = 'bold 10px DM Sans, sans-serif'; ctx.fillStyle = '#444';
      ctx.fillText(stats[cats[i]].pct + '%', ox, oy + 13);
    }
  });
}

function drawBarChart(stats) {
  const canvas = document.getElementById('chart-bar');
  const ctx    = canvas.getContext('2d');
  const cats   = state.selectedCategories;
  const LABEL_MAP = { Communication:'Comm.', Leadership:'Leader.', Confidence:'Confid.', Teamwork:'Teamwork' };
  const pad = { top:36, right:20, bottom:36, left:50 };
  const W   = canvas.width;
  const TOTAL_H = pad.top + 20 + 200 + 28 + pad.bottom;
  canvas.height = TOTAL_H;
  const chartW = W - pad.left - pad.right;
  const chartH = 200;
  const chartY = pad.top + 20;
  const barW   = (chartW / cats.length) * 0.54;
  const gap    = chartW / cats.length;
  ctx.clearRect(0, 0, W, TOTAL_H);
  [0, 25, 50, 75, 100].forEach(v => {
    const y = chartY + chartH - (v / 100) * chartH;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + chartW, y);
    ctx.strokeStyle = v === 0 ? 'rgba(128,128,128,0.7)' : 'rgba(128,128,128,0.18)';
    ctx.lineWidth = v === 0 ? 1.5 : 1; ctx.stroke();
    ctx.fillStyle = '#888'; ctx.font = 'bold 10px DM Sans, sans-serif';
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    ctx.fillText(v + '%', pad.left - 8, y);
  });
  cats.forEach((cat, i) => {
    const s     = stats[cat];
    const pct   = s.pct || 0;
    const level = getLevel(s.pct);
    const x     = pad.left + gap * i + (gap - barW) / 2;
    const barH  = (pct / 100) * chartH;
    const barY  = chartY + chartH - barH;
    const midX  = x + barW / 2;
    ctx.fillStyle = 'rgba(128,128,128,0.12)';
    ctx.beginPath(); ctx.roundRect(x, chartY, barW, chartH, [4,4,0,0]); ctx.fill();
    if (barH > 0) {
      const grad = ctx.createLinearGradient(midX, barY, midX, chartY + chartH);
      grad.addColorStop(0, level.color); grad.addColorStop(1, level.color + 'bb');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.roundRect(x, barY, barW, barH, barH > 6 ? [4,4,0,0] : [2,2,0,0]); ctx.fill();
    }
    if (s.pct !== null) {
      ctx.fillStyle = '#555'; ctx.font = 'bold 12px DM Sans, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText(pct + '%', midX, barY - 4);
    }
    ctx.fillStyle = '#888'; ctx.font = 'bold 11px DM Sans, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(LABEL_MAP[cat] || cat, midX, chartY + chartH + 10);
  });
  ctx.beginPath(); ctx.moveTo(pad.left, chartY + chartH); ctx.lineTo(pad.left + chartW, chartY + chartH);
  ctx.strokeStyle = 'rgba(128,128,128,0.7)'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(pad.left, chartY); ctx.lineTo(pad.left, chartY + chartH);
  ctx.strokeStyle = 'rgba(128,128,128,0.7)'; ctx.lineWidth = 1.5; ctx.stroke();
}

function drawDistributionChart() {
  const canvas = document.getElementById('chart-dist');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  // Bucket answers: choice answers are fractional, round to nearest integer bucket
  const counts = { 5:0, 4:0, 3:0, 2:0, 1:0 };
  let total = 0;
  Object.values(state.answers).forEach(v => {
    if (v !== 'skipped' && v !== null) {
      const bucket = Math.min(5, Math.max(1, Math.round(v)));
      counts[bucket] = (counts[bucket] || 0) + 1;
      total++;
    }
  });
  if (total === 0) return;
  const pad      = { top:20, right:20, bottom:55, left:45 };
  const chartW   = W - pad.left - pad.right;
  const chartH   = H - pad.top - pad.bottom;
  const barW     = chartW / 5 * 0.6;
  const gap      = chartW / 5;
  const maxCount = Math.max(...Object.values(counts), 1);
  [0, 0.25, 0.5, 0.75, 1].forEach(r => {
    const v = Math.round(r * maxCount);
    const y = pad.top + chartH - r * chartH;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + chartW, y);
    ctx.strokeStyle = r === 0 ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.07)';
    ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = '#888'; ctx.font = 'bold 10px DM Sans, sans-serif';
    ctx.textAlign = 'right'; ctx.fillText(v, pad.left - 6, y + 3);
  });
  LIKERT_SCALE.forEach((opt, i) => {
    const count = counts[opt.value] || 0;
    const barH  = (count / maxCount) * chartH;
    const x     = pad.left + gap * i + (gap - barW) / 2;
    const y     = pad.top + chartH - barH;
    ctx.fillStyle = 'rgba(128,128,128,0.1)';
    ctx.beginPath(); ctx.roundRect(x, pad.top, barW, chartH, [4,4,0,0]); ctx.fill();
    if (barH > 0) {
      const grad = ctx.createLinearGradient(x, y, x, pad.top + chartH);
      grad.addColorStop(0, opt.color); grad.addColorStop(1, opt.color + '44');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.roundRect(x, y, barW, barH, barH > 8 ? [4,4,0,0] : [2,2,0,0]); ctx.fill();
      ctx.fillStyle = '#666'; ctx.font = 'bold 12px DM Sans, sans-serif';
      ctx.textAlign = 'center'; ctx.fillText(count, x + barW / 2, y - 8);
    }
    ctx.fillStyle = '#888'; ctx.font = 'bold 10px DM Sans, sans-serif'; ctx.textAlign = 'center';
    const words = opt.label.split(' ');
    ctx.fillText(words[0], x + barW / 2, pad.top + chartH + 16);
    if (words[1]) ctx.fillText(words[1], x + barW / 2, pad.top + chartH + 28);
    const pct = total ? Math.round((count / total) * 100) : 0;
    ctx.fillStyle = '#666'; ctx.font = 'bold 11px DM Sans, sans-serif';
    ctx.fillText(pct + '%', x + barW / 2, pad.top + chartH + 42);
  });
}

// ─── PDF Export ───────────────────────────────────────────────────────────────
async function generatePDF() {
  const btn = document.getElementById('res-btn-pdf');
  btn.disabled = true; btn.textContent = 'Generating…';
  try {
    const { jsPDF } = window.jspdf;
    const doc     = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
    const PW      = doc.internal.pageSize.getWidth();
    const PH      = doc.internal.pageSize.getHeight();
    const stats   = allCategoryStats();
    const overall = overallScore();
    let y = 0;

    doc.setFillColor(26,26,26); doc.rect(0,0,PW,50,'F');
    doc.setFillColor(255,198,47); doc.rect(0,48,PW,2,'F');
    doc.setFont('helvetica','bold'); doc.setFontSize(22);
    doc.setTextColor(255,255,255);
    doc.text('Soft Skills Assessment', PW/2, 18, { align:'center' });
    doc.setFont('helvetica','normal'); doc.setFontSize(11);
    doc.setTextColor(180,180,180);
    doc.text('Psychometric Competency Report', PW/2, 30, { align:'center' });
    doc.setFontSize(9); doc.setTextColor(255,198,47);
    doc.text(`Categories: ${state.selectedCategories.join(' · ')}`, PW/2, 40, { align:'center' });

    y = 62;
    [['Employee:', state.employeeData.name],['Role:', state.employeeData.role],
     ['Date:', new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})]
    ].forEach(([label, value]) => {
      doc.setFont('helvetica','normal'); doc.setFontSize(10); doc.setTextColor(80,80,80); doc.text(label,20,y);
      doc.setFont('helvetica','bold'); doc.setTextColor(26,26,26); doc.text(value,65,y); y+=8;
    });

    y = 98;
    doc.setFillColor(255,198,47); doc.circle(PW/2,y+18,20,'F');
    doc.setFont('helvetica','bold'); doc.setFontSize(28); doc.setTextColor(26,26,26);
    doc.text(overall+'%', PW/2, y+22, {align:'center'});
    doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(80,80,80);
    doc.text('Overall Score', PW/2, y+33, {align:'center'});
    const lvl = getLevel(overall); const lc = hexToRgb(lvl.color);
    doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.setTextColor(lc.r,lc.g,lc.b);
    doc.text(lvl.label, PW/2, y+43, {align:'center'});

    y = 152;
    doc.setFont('helvetica','bold'); doc.setFontSize(13); doc.setTextColor(26,26,26);
    doc.text('Category Breakdown', 20, y); y += 10;
    state.selectedCategories.forEach(cat => {
      const s = stats[cat]; const catLvl = getLevel(s.pct);
      const pctVal = s.pct !== null ? s.pct : 0; const rc = hexToRgb(catLvl.color);
      doc.setFillColor(248,248,248); doc.roundedRect(18,y-6,PW-36,16,2,2,'F');
      doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.setTextColor(26,26,26); doc.text(cat,22,y+2);
      doc.setFillColor(220,220,220); doc.roundedRect(75,y-1,70,5,2,2,'F');
      doc.setFillColor(rc.r,rc.g,rc.b);
      if (pctVal>0) doc.roundedRect(75,y-1,70*pctVal/100,5,2,2,'F');
      doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.setTextColor(rc.r,rc.g,rc.b);
      doc.text(s.pct!==null?s.pct+'%':'—', PW-22, y+2, {align:'right'});
      doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(120,120,120);
      doc.text(`${s.answered} answered · ${s.skipped} skipped`, PW-22, y+8, {align:'right'});
      y += 18;
    });

    y += 6;
    try { const img = document.getElementById('chart-radar').toDataURL('image/png'); if(img&&img.length>100) doc.addImage(img,'PNG',15,y,75,65); } catch(e){}
    try { const img = document.getElementById('chart-bar').toDataURL('image/png');   if(img&&img.length>100) doc.addImage(img,'PNG',100,y,78,65); } catch(e){}

    doc.addPage(); y = 15;
    doc.setFont('helvetica','bold'); doc.setFontSize(14); doc.setTextColor(26,26,26);
    doc.text('Detailed Question Responses', 20, y); y+=6;
    doc.setFillColor(255,198,47); doc.rect(20,y,PW-40,1.5,'F'); y+=9;

    state.selectedCategories.forEach(cat => {
      if (y>PH-40) { doc.addPage(); y=15; }
      doc.setFont('helvetica','bold'); doc.setFontSize(11);
      doc.setTextColor(255,255,255); doc.setFillColor(26,26,26);
      doc.rect(18,y-6,PW-36,11,'F'); doc.text(cat,22,y); y+=13;
      (state.selectedQuestions[cat]||[]).forEach((q,qi) => {
        if (y>PH-28) { doc.addPage(); y=15; }
        const ans = state.answers[q.id];
        let ansLabel='—', ansColor={r:150,g:150,b:150};
        if (ans==='skipped') { ansLabel='Skipped'; ansColor={r:180,g:180,b:180}; }
        else if (ans!=null) {
          if (q.type==='choice') {
            // Find closest option label for PDF display
            const closest = q.options.reduce((best,o) => Math.abs(choiceToScore(o.score)-ans)<Math.abs(choiceToScore(best.score)-ans)?o:best, q.options[0]);
            ansLabel = closest.label; ansColor={r:86,g:239,b:172};
          } else {
            const scale = q.type==='freq'?FREQ_SCALE:LIKERT_SCALE;
            const opt = scale.find(l=>l.value===ans);
            if (opt) { ansLabel=opt.label; ansColor=hexToRgb(opt.color); }
          }
        }
        doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(40,40,40);
        const lines = doc.splitTextToSize(`Q${qi+1}. ${q.text}`, PW-50);
        doc.text(lines,20,y); y+=lines.length*4.8;
        doc.setFont('helvetica','bold'); doc.setFontSize(9);
        doc.setTextColor(ansColor.r,ansColor.g,ansColor.b); doc.text(ansLabel,25,y); y+=8;
      });
      y+=4;
    });

    doc.addPage(); y=15;
    doc.setFont('helvetica','bold'); doc.setFontSize(14); doc.setTextColor(26,26,26);
    doc.text('Response Distribution',20,y); y+=8;
    try { const img=document.getElementById('chart-dist').toDataURL('image/png'); if(img&&img.length>100) doc.addImage(img,'PNG',15,y,PW-30,70); } catch(e){}
    doc.setFont('helvetica','italic'); doc.setFontSize(8); doc.setTextColor(120,120,120);
    doc.text(`Assessment covers: ${state.selectedCategories.join(', ')} — mixed question types (Likert, Frequency, Scenario).`,PW/2,PH-10,{align:'center',maxWidth:PW-40});

    doc.save(`SSA_${state.employeeData.name.replace(/\s+/g,'_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    showToast('PDF exported successfully!','success');
  } catch(err) {
    console.error(err); showToast('PDF generation failed. Please try again.','error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export PDF';
  }
}

function hexToRgb(hex) {
  return { r:parseInt(hex.slice(1,3),16), g:parseInt(hex.slice(3,5),16), b:parseInt(hex.slice(5,7),16) };
}

// ─── Storage ─────────────────────────────────────────────────────────────────
function saveToStorage() {
  try {
    let stored = { version:2, assessments:[] };
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { try { const p=JSON.parse(raw); if(p.assessments) stored=p; } catch(_){} }
    stored.assessments.push({
      id: Date.now(), employee: state.employeeData,
      categories: state.selectedCategories, timestamp: new Date().toISOString(),
      answers: state.answers, stats: allCategoryStats(), overall: overallScore(),
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch(_){}
}

// ─── Init ─────────────────────────────────────────────────────────────────────
function init() {
  renderCategorySelector();

  document.getElementById('ssa-form').addEventListener('submit', e => {
    e.preventDefault();
    const name=document.getElementById('inp-name').value.trim();
    const role=document.getElementById('inp-role').value.trim();
    const nameErr=document.getElementById('err-name');
    const roleErr=document.getElementById('err-role');
    nameErr.textContent=''; roleErr.textContent='';
    let ok=true;
    if (!name||name.length<2) { nameErr.textContent='Please enter a valid name.'; ok=false; }
    if (!role||role.length<2) { roleErr.textContent='Please enter a valid role.'; ok=false; }
    if (!ok) return;
    state.employeeData      = { name, role };
    state.selectedQuestions = pickQuestions();
    state.answers           = {};
    state.activeCategoryIndex = 0;
    state.activeQuestionIndex = 0;
    state.answerLocked        = false;
    renderAssessment();
  });

  document.getElementById('ssa-btn-prev-q').addEventListener('click', prevQuestion);
  document.getElementById('ssa-btn-next-q').addEventListener('click', nextQuestion);
  document.getElementById('ssa-btn-skip').addEventListener('click', skipQuestion);
  document.getElementById('ssa-btn-finish-early').addEventListener('click', () => {
    const anyAnswered = Object.values(state.answers).some(v => v !== 'skipped');
    if (!anyAnswered) { showToast('Please answer at least one question.','warning'); return; }
    finishAssessment();
  });

  document.getElementById('res-btn-pdf').addEventListener('click', generatePDF);
  document.getElementById('res-btn-restart').addEventListener('click', () => {
    state = {
      employeeData:null, selectedCategories:[...ALL_CATEGORIES],
      selectedQuestions:{}, answers:{},
      activeCategoryIndex:0, activeQuestionIndex:0,
      phase:'welcome', answerLocked:false,
    };
    document.getElementById('ssa-form').reset();
    document.getElementById('err-name').textContent='';
    document.getElementById('err-role').textContent='';
    document.getElementById('ssa-welcome').classList.add('active');
    document.getElementById('ssa-assessment').classList.remove('active');
    document.getElementById('ssa-results').classList.remove('active');
    renderCategorySelector();
  });

  document.getElementById('ssa-welcome').classList.add('active');
}

document.addEventListener('DOMContentLoaded', init);