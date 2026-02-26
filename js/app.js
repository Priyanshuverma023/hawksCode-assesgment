'use strict';

//Config 
const STORAGE_KEY    = 'ssa_v2';

function getQuestionsPerCategory() {
  const catCount = state.selectedCategories?.length || 4;
  if (catCount === 1) return 40;
  return 20;
}

const CATEGORY_META = {
  Communication: { color: '#38bdf8' },
  Leadership:    { color: '#a78bfa' },
  Confidence:    { color: '#fb923c' },
  Teamwork:      { color: '#4ade80' },
};

//Scales 
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

const LIKERT = LIKERT_SCALE;

//  Question Pools 
const questionPools = {

  Communication: [
    { id:'c01', type:'likert', text:'I clarify unclear instructions with my manager before starting work, rather than trying to figure it out later.' },
    { id:'c02', type:'likert', text:'When receiving vague feedback, I ask specific questions to understand what needs to improve.' },
    { id:'c03', type:'likert', text:'If challenged during a presentation, I stay calm and address the concern directly.' },
    { id:'c04', type:'likert', text:'When my own unclear communication causes a misunderstanding, I take ownership and fix it quickly.' },
    { id:'c05', type:'likert', text:'I can explain technical ideas in simple language when talking to people outside my field.' },
    { id:'c06', type:'likert', text:'I listen fully to what others say before thinking about my response.' },
    { id:'c07', type:'likert', text:'I adjust how I communicate depending on the situation — casual Slack vs formal reports vs live talks.' },
    { id:'c08', type:'likert', text:'When I get critical feedback, I first try to understand the other person\'s perspective.' },
    { id:'c09', type:'likert', text:'I\'m comfortable sharing both good news and difficult news — like missed deadlines or setbacks.' },
    { id:'c10', type:'likert', text:'I can have tough conversations with teammates about sensitive issues without it damaging our relationship.' },
    { id:'c11', type:'freq', text:'At the end of meetings, I recap key decisions and action items so everyone is aligned.' },
    { id:'c12', type:'freq', text:'Before sending an important message, I read it from the recipient\'s view to check for confusion.' },
    { id:'c13', type:'freq', text:'After sending important information, I follow up to confirm people understood what I needed.' },
    { id:'c14', type:'freq', text:'In remote or async work, I deliberately write messages that sound warm, not cold or curt.' },
    { id:'c15', type:'freq', text:'After a difficult conversation, I check in to make sure the working relationship is still good.' },
    { id:'c16', type:'choice', text:'A colleague says your work "needs more depth" but gives no other details. What do you do first?',
      options:[
        { label:'Ask specifically which parts they mean and why they need more detail',               score:4 },
        { label:'Add more information to everything and resend',                                      score:2 },
        { label:'Rewrite the whole thing immediately',                                               score:1 },
        { label:'Pass it to your manager to handle',                                                 score:1 },
      ]},
    { id:'c17', type:'choice', text:'During a live presentation, you notice a number on your slide is wrong. You:',
      options:[
        { label:'Stop and correct it calmly, then move on',             score:4 },
        { label:'Quickly move past it and hope nobody notices',         score:1 },
        { label:'Finish the presentation, then email a correction',     score:2 },
        { label:'Stop to apologize at length about the mistake',        score:2 },
      ]},
    { id:'c18', type:'choice', text:'Your brief was unclear, so a colleague built the wrong thing. You:',
      options:[
        { label:'Take responsibility, meet with them to realign, and rewrite it together',  score:4 },
        { label:'Point out they should have asked for clarification',                       score:1 },
        { label:'Accept what they built and find a workaround',                            score:2 },
        { label:'Rewrite and resend the brief without talking to them',                    score:2 },
      ]},
    { id:'c19', type:'choice', text:'You need to tell an important client their project is delayed by three weeks. You:',
      options:[
        { label:'Call them directly, explain the reason, and share the new timeline',       score:4 },
        { label:'Send a brief email and hope they don\'t push back',                       score:1 },
        { label:'Wait until you\'re certain about the new date before telling them',       score:2 },
        { label:'Ask your manager to deliver the news',                                   score:2 },
      ]},
    { id:'c20', type:'choice', text:'Two senior people are in a heated disagreement in your meeting. You:',
      options:[
        { label:'Pause and acknowledge both viewpoints, then redirect to the shared goal',  score:4 },
        { label:'Stay out of it and let them sort it themselves',                         score:1 },
        { label:'Suggest moving the conversation offline, then continue the meeting',      score:3 },
        { label:'Side with whoever you think is right',                                   score:1 },
      ]},
  ],

  
  Leadership: [
    { id:'l01', type:'likert', text:'After a team failure, I take time to support the team before pushing toward the next deadline.' },
    { id:'l02', type:'likert', text:'I bring up process problems constructively, even when they\'re in another team\'s area.' },
    { id:'l03', type:'likert', text:'When tension between teammates is affecting work, I address it directly with both of them.' },
    { id:'l04', type:'likert', text:'Under tight deadlines with incomplete info, I make a clear decision and explain my reasoning.' },
    { id:'l05', type:'likert', text:'I give honest feedback to strong performers about their blind spots, even when it\'s awkward.' },
    { id:'l06', type:'likert', text:'I spend time developing junior team members, even if it slows my own work.' },
    { id:'l07', type:'likert', text:'Before starting a project, I define what success looks like so the team knows the goal.' },
    { id:'l08', type:'likert', text:'I delegate meaningful work to my team, even when I could do it faster myself.' },
    { id:'l09', type:'likert', text:'I explain the "why" behind my decisions instead of just telling people what to do.' },
    { id:'l10', type:'likert', text:'I hold myself to the same standards I expect from my team.' },
    { id:'l11', type:'freq', text:'I check in on how my team is doing — not just if they\'re meeting deadlines.' },
    { id:'l12', type:'freq', text:'I make sure quieter team members get heard in meetings.' },
    { id:'l13', type:'freq', text:'When pressure is pushing us to cut corners, I push back while still working toward the goal.' },
    { id:'l14', type:'freq', text:'After a big setback, I lead a review to understand what happened before moving on.' },
    { id:'l15', type:'freq', text:'I admit my own mistakes openly to the team instead of quietly fixing them.' },
    { id:'l16', type:'choice', text:'A strong team member resists feedback and dismisses your input every time. You:',
      options:[
        { label:'Have a one-on-one to understand why they feel defensive about feedback',        score:4 },
        { label:'Stop giving them feedback to avoid conflict',                                  score:1 },
        { label:'Escalate to HR without talking to them first',                                score:1 },
        { label:'Document the pattern and wait',                                               score:2 },
      ]},
    { id:'l17', type:'choice', text:'Your team disagrees on a key decision and you need to decide tomorrow. You:',
      options:[
        { label:'Make the call yourself, explain why, and move forward',            score:4 },
        { label:'Pick the most popular option to keep everyone happy',              score:2 },
        { label:'Let them vote and commit to what the majority wants',              score:3 },
        { label:'Delay the decision and get more research',                         score:1 },
      ]},
    { id:'l18', type:'choice', text:'A new team member is struggling but hasn\'t asked for help. You:',
      options:[
        { label:'Check in proactively, ask how things are going, and offer support',  score:4 },
        { label:'Wait — they need to learn to ask for help themselves',               score:1 },
        { label:'Ask their onboarding buddy to handle it',                            score:2 },
        { label:'Bring it up in their first formal review',                           score:1 },
      ]},
    { id:'l19', type:'choice', text:'Leadership publicly credits a project to you, but your team did the real work. You:',
      options:[
        { label:'Thank them and highlight your team\'s work',           score:4 },
        { label:'Say nothing — it looks unprofessional to dispute credit',  score:1 },
        { label:'Tell your team privately but don\'t raise it further',     score:2 },
        { label:'Post on the team channel about the team\'s contributions',  score:3 },
      ]},
    { id:'l20', type:'choice', text:'A good performer seems disengaged and quiet lately. You:',
      options:[
        { label:'Check in casually, ask how things are going beyond work',      score:4 },
        { label:'Give them space — they probably have something personal going on',  score:2 },
        { label:'Wait to see if their work quality drops',                       score:1 },
        { label:'Bring it up at your next scheduled one-on-one',                 score:3 },
      ]},
  ],

  Confidence: [
    { id:'cf01', type:'likert', text:'When asked something I don\'t know in a senior meeting, I say so and offer to follow up.' },
    { id:'cf02', type:'likert', text:'I can present early-stage work to senior people without over-apologizing for what\'s not done yet.' },
    { id:'cf03', type:'likert', text:'If I publicly back a project that fails, I take responsibility and focus on what we\'ll learn.' },
    { id:'cf04', type:'likert', text:'In salary discussions, I can counter a low offer with clear reasoning.' },
    { id:'cf05', type:'likert', text:'When a senior person challenges my data in front of others, I calmly stand by it while staying open to new info.' },
    { id:'cf06', type:'likert', text:'I volunteer for high-visibility projects instead of waiting to be asked.' },
    { id:'cf07', type:'likert', text:'Constructive criticism makes me want to improve, not question my abilities.' },
    { id:'cf08', type:'likert', text:'I take on projects outside my current skill set because I believe I can learn and grow.' },
    { id:'cf09', type:'likert', text:'I\'m comfortable sharing my perspective even in rooms full of experienced people.' },
    { id:'cf10', type:'likert', text:'I genuinely believe my work makes a real difference to my team\'s results.' },
    { id:'cf11', type:'freq', text:'If I make a visible mistake in front of colleagues, I move on quickly without dwelling on it.' },
    { id:'cf12', type:'freq', text:'I speak up when I see something wrong, even if it means respectfully challenging a senior person.' },
    { id:'cf13', type:'freq', text:'When starting something unfamiliar, I approach it with curiosity, not anxiety.' },
    { id:'cf14', type:'freq', text:'When someone recognizes my work publicly, I accept it gracefully without deflecting.' },
    { id:'cf15', type:'freq', text:'I celebrate my own wins and give myself credit when things go well.' },
    { id:'cf16', type:'choice', text:'You have a strong opinion in a meeting but the room is leaning the other way. You:',
      options:[
        { label:'Share your view with evidence and invite pushback',                  score:4 },
        { label:'Stay quiet — it\'s not worth the potential conflict',               score:1 },
        { label:'Mention it privately to one person after the meeting',              score:2 },
        { label:'Go along with the room but flag your concern in the follow-up email',  score:3 },
      ]},
    { id:'cf17', type:'choice', text:'You\'re asked to lead a project way outside your experience. You:',
      options:[
        { label:'Accept, identify your gaps honestly, and make a plan to address them',  score:4 },
        { label:'Decline and suggest someone more experienced',                          score:1 },
        { label:'Accept but don\'t flag the gaps, figure it out as you go',              score:2 },
        { label:'Accept but immediately ask for a co-lead',                              score:3 },
      ]},
    { id:'cf18', type:'choice', text:'A colleague publicly disputes your findings in a meeting. Your data is correct. You:',
      options:[
        { label:'Calmly show your evidence and invite them to share theirs',   score:4 },
        { label:'Back down to avoid the confrontation',                        score:1 },
        { label:'Get defensive and try to talk over them',                     score:1 },
        { label:'Say nothing in the meeting, raise it with them one-on-one later',  score:3 },
      ]},
    { id:'cf19', type:'choice', text:'Right before a big presentation, your main slide deck fails to load. You:',
      options:[
        { label:'Stay calm, present from memory or notes, and follow up with the slides later',  score:4 },
        { label:'Panic and ask to reschedule',                                                   score:1 },
        { label:'Spend ten minutes trying to fix it while the audience waits',                  score:2 },
        { label:'Ask a colleague to take over',                                                score:1 },
      ]},
    { id:'cf20', type:'choice', text:'You\'ve been in your role for six months with no formal feedback from your manager. You:',
      options:[
        { label:'Proactively ask for a feedback conversation and come with questions',  score:4 },
        { label:'Assume things are fine since nobody has complained',                   score:1 },
        { label:'Ask colleagues informally what they think of your work',               score:3 },
        { label:'Wait until the formal review cycle',                                   score:2 },
      ]},
  ],

  Teamwork: [
    { id:'t01', type:'likert', text:'When a teammate looks overwhelmed, I offer to help with their work without being asked.' },
    { id:'t02', type:'likert', text:'When the team decides something I disagreed with, I still commit and support the decision.' },
    { id:'t03', type:'likert', text:'When someone new joins the team and seems lost, I reach out and help them get settled.' },
    { id:'t04', type:'likert', text:'In brainstorms, if a colleague suggests an idea I initially think is weak, I build on it rather than dismiss it.' },
    { id:'t05', type:'likert', text:'If a teammate\'s performance is dropping and affecting morale, I address it with them supportively.' },
    { id:'t06', type:'likert', text:'On group projects, I contribute fully, regardless of how credit is shared.' },
    { id:'t07', type:'likert', text:'I acknowledge teammates\' contributions publicly when their work leads to a positive outcome.' },
    { id:'t08', type:'likert', text:'I keep my team informed about my progress, blockers, and priority changes without being asked.' },
    { id:'t09', type:'likert', text:'When the team commits to something — standups, deadlines, response times — I treat it seriously.' },
    { id:'t10', type:'likert', text:'I give honest input even when it means disagreeing with where the team is headed.' },
    { id:'t11', type:'freq', text:'I bring up team problems early rather than letting them build up.' },
    { id:'t12', type:'freq', text:'After a team win, I focus on recognizing the collective effort, not individual contributions.' },
    { id:'t13', type:'freq', text:'I actively seek out perspectives from teammates with different backgrounds or thinking styles.' },
    { id:'t14', type:'freq', text:'Under pressure, I stay calm and focus on solutions, not adding to the stress.' },
    { id:'t15', type:'freq', text:'I check in on how my teammates are doing personally, not just on their work.' },
    { id:'t16', type:'choice', text:'Your team is behind. A teammate is blocked but hasn\'t said anything. You notice. You:',
      options:[
        { label:'Check in privately, offer help to unblock them, and flag the risk to the team',  score:4 },
        { label:'It\'s their job to speak up — focus on your own work',                           score:1 },
        { label:'Mention it to your manager without talking to the teammate first',               score:2 },
        { label:'Wait until the next standup to raise it',                                        score:2 },
      ]},
    { id:'t17', type:'choice', text:'In a retrospective, a colleague gives you feedback about your communication that feels unfair. You:',
      options:[
        { label:'Thank them, ask for a specific example, and genuinely reflect',     score:4 },
        { label:'Dismiss it — they misunderstood your intent',                       score:1 },
        { label:'Defend yourself in the meeting to set the record straight',         score:1 },
        { label:'Say nothing in the meeting, raise it with them one-on-one later',   score:3 },
      ]},
    { id:'t18', type:'choice', text:'Leadership is crediting one colleague for a major team accomplishment. You:',
      options:[
        { label:'Raise it with your manager, focusing on ensuring the whole team gets recognized',  score:4 },
        { label:'Say nothing — getting into credit disputes looks unprofessional',                  score:1 },
        { label:'Tell your team privately but don\'t raise it further',                             score:2 },
        { label:'Post about the team\'s collective work on the team channel',                       score:3 },
      ]},
    { id:'t19', type:'choice', text:'A teammate you work closely with has started missing small commitments. You:',
      options:[
        { label:'Have a direct, supportive conversation about the pattern you\'ve noticed',  score:4 },
        { label:'Cover for them silently to keep things moving',                              score:2 },
        { label:'Start documenting the misses in case it becomes formal',                    score:2 },
        { label:'Raise it with your manager before talking to them',                         score:1 },
      ]},
    { id:'t20', type:'choice', text:'Your team is about to present a solution you think has a serious flaw. There\'s still time to raise it. You:',
      options:[
        { label:'Raise the concern clearly before the presentation and suggest a fix',    score:4 },
        { label:'Stay quiet — the team decided and you don\'t want to derail things',     score:1 },
        { label:'Mention it to one teammate privately and leave the decision to them',   score:2 },
        { label:'Let it proceed and bring it up in the retrospective if it goes wrong',  score:2 },
      ]},
  ],
};

const ALL_CATEGORIES = Object.keys(questionPools);

//State 
let state = {
  employeeData:        null,
  selectedCategories:  [...ALL_CATEGORIES],
  selectedQuestions:   {},
  answers:             {},
  flaggedQuestions:    new Set(),
  activeCategoryIndex: 0,
  activeQuestionIndex: 0,
  phase:               'welcome',
  answerLocked:        false,
  timerEnabled:        false,
  questionTime:        0,
  timerInterval:       null,
  questionTimings:     {}, // Track time per question
  reviewMode:          false,
  reviewOnlyFlagged:   false,
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

function pickQuestions() {
  const result = {};
  const cats   = state.selectedCategories;
  const perCat = getQuestionsPerCategory();

  cats.forEach((cat) => {
    const pool  = questionPools[cat];
    const shuffled = shuffle(pool);
    
    if (pool.length >= perCat) {
      result[cat] = shuffled.slice(0, perCat);
    } else {
      const filled = [];
      while (filled.length < perCat) {
        const remaining = perCat - filled.length;
        const batch = shuffle(pool).slice(0, Math.min(pool.length, remaining));
        batch.forEach((q) => {
          filled.push({ ...q, id: `${q.id}_r${filled.length}` });
        });
      }
      result[cat] = filled.slice(0, perCat);
    }
  });

  return result;
}

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


function toggleFlagQuestion(qid) {
  if (state.flaggedQuestions.has(qid)) {
    state.flaggedQuestions.delete(qid);
  } else {
    state.flaggedQuestions.add(qid);
  }
  renderAssessment();
  showToast('Question flagged for review', 'info');
}

function getFlaggedQuestionsCount() {
  return state.flaggedQuestions.size;
}

function enterReviewMode() {
  const flaggedCount = getFlaggedQuestionsCount();
  const allAnswered = getAllAnsweredCount();
  
  if (flaggedCount === 0) {
    showToast('No questions flagged for review', 'warning');
    return;
  }
  
  state.reviewMode = true;
  state.reviewOnlyFlagged = true;
  state.activeCategoryIndex = 0;
  state.activeQuestionIndex = findFirstFlaggedQuestion();
  
  renderAssessment();
}

function findFirstFlaggedQuestion() {
  const qs = activeQuestions();
  for (let i = 0; i < qs.length; i++) {
    if (state.flaggedQuestions.has(qs[i].id)) return i;
  }
  return 0;
}

function getNextFlaggedQuestion() {
  const cats = state.selectedCategories;

  // Search forward in current category
  const currentQs = state.selectedQuestions[cats[state.activeCategoryIndex]] || [];
  for (let i = state.activeQuestionIndex + 1; i < currentQs.length; i++) {
    if (state.flaggedQuestions.has(currentQs[i].id)) {
      return { catIdx: state.activeCategoryIndex, qIdx: i };
    }
  }

  // Search in subsequent categories
  for (let ci = state.activeCategoryIndex + 1; ci < cats.length; ci++) {
    const qs = state.selectedQuestions[cats[ci]] || [];
    for (let qi = 0; qi < qs.length; qi++) {
      if (state.flaggedQuestions.has(qs[qi].id)) {
        return { catIdx: ci, qIdx: qi };
      }
    }
  }

  return null;
}

function getPrevFlaggedQuestion() {
  const cats = state.selectedCategories;

  // Search backward in current category
  const currentQs = state.selectedQuestions[cats[state.activeCategoryIndex]] || [];
  for (let i = state.activeQuestionIndex - 1; i >= 0; i--) {
    if (state.flaggedQuestions.has(currentQs[i].id)) {
      return { catIdx: state.activeCategoryIndex, qIdx: i };
    }
  }

  // Search in previous categories (from end)
  for (let ci = state.activeCategoryIndex - 1; ci >= 0; ci--) {
    const qs = state.selectedQuestions[cats[ci]] || [];
    for (let qi = qs.length - 1; qi >= 0; qi--) {
      if (state.flaggedQuestions.has(qs[qi].id)) {
        return { catIdx: ci, qIdx: qi };
      }
    }
  }

  return null;
}

function getAllAnsweredCount() {
  let count = 0;
  Object.values(state.answers).forEach(v => {
    if (v !== null && v !== undefined && v !== 'skipped') count++;
  });
  return count;
}

function getNotAnsweredCount() {
  let count = 0;
  state.selectedCategories.forEach(cat => {
    const qs = state.selectedQuestions[cat] || [];
    qs.forEach(q => {
      const a = state.answers[q.id];
      if (a === null || a === undefined) count++;
    });
  });
  return count;
}

function checkAllCategoriesMeetThreshold() {
  return state.selectedCategories.every(cat => {
    const qs = state.selectedQuestions[cat] || [];
    const answered = qs.filter(q => {
      const a = state.answers[q.id];
      return a !== null && a !== undefined && a !== 'skipped';
    }).length;
    return answered >= Math.ceil(qs.length * 0.5);
  });
}

// check while crash 
function getCategoryShortfallMessage() {
  const lines = [];
  state.selectedCategories.forEach(cat => {
    const qs = state.selectedQuestions[cat] || [];
    const answered = qs.filter(q => {
      const a = state.answers[q.id];
      return a !== null && a !== undefined && a !== 'skipped';
    }).length;
    const needed = Math.ceil(qs.length * 0.5);
    if (answered < needed) {
      lines.push(`${cat}: ${answered}/${needed}`);
    }
  });
  return lines.join(' · ');
}

function getSkippedCount() {
  let count = 0;
  Object.values(state.answers).forEach(v => {
    if (v === 'skipped') count++;
  });
  return count;
}

function getTotalQuestionsCount() {
  let total = 0;
  state.selectedCategories.forEach(cat => {
    const qs = state.selectedQuestions[cat] || [];
    total += qs.length;
  });
  return total;
}

function updateCompletionStatus() {
  const statusEl = document.getElementById('completion-status');
  if (!statusEl) return;

  let allCatsMet = true;
  let totalAnswered = 0;
  let totalNeeded = 0;

  state.selectedCategories.forEach(cat => {
    const qs = state.selectedQuestions[cat] || [];
    const answered = qs.filter(q => {
      const a = state.answers[q.id];
      return a !== null && a !== undefined && a !== 'skipped';
    }).length;
    const needed = Math.ceil(qs.length * 0.5);
    totalAnswered += answered;
    totalNeeded += needed;
    if (answered < needed) allCatsMet = false;
  });

  if (allCatsMet) {
    statusEl.textContent = `✓ 50%+ answered in each category — Ready to submit`;
    statusEl.style.background = 'rgba(74, 222, 128, 0.12)';
    statusEl.style.color = '#166534';
    statusEl.style.borderColor = '#86efac';
  } else {
    // Find which categories are still short
    const shortCats = state.selectedCategories.filter(cat => {
      const qs = state.selectedQuestions[cat] || [];
      const answered = qs.filter(q => {
        const a = state.answers[q.id];
        return a !== null && a !== undefined && a !== 'skipped';
      }).length;
      return answered < Math.ceil(qs.length * 0.5);
    });
    statusEl.textContent = `Need 50% in: ${shortCats.join(', ')}`;
    statusEl.style.background = 'rgba(251, 191, 36, 0.12)';
    statusEl.style.color = '#78350f';
    statusEl.style.borderColor = '#fbbf24';
  }
}

// Timer Functions
function startTimer() {
  if (!state.timerEnabled) return;
  state.questionTime = 0;
  if (state.timerInterval) clearInterval(state.timerInterval);
  
  state.timerInterval = setInterval(() => {
    state.questionTime++;
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
  
  // Store timing for current question
  const q = activeQuestion();
  if (q && state.timerEnabled) {
    state.questionTimings[q.id] = state.questionTime;
  }
}

function updateTimerDisplay() {
  const timerEl = document.getElementById('ssa-timer');
  if (!timerEl) return;
  
  const mins = Math.floor(state.questionTime / 60);
  const secs = state.questionTime % 60;
  timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

let toastTimer = null;
function showToast(msg, type = 'info') {
  const t = document.getElementById('ssa-toast');
  if (toastTimer) clearTimeout(toastTimer);
  t.textContent = msg;
  t.className = `ssa-toast ssa-toast--${type} show`;
  toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
}

//Render: Welcome 
function renderWelcome() {
  document.getElementById('ssa-welcome').classList.add('active');
  document.getElementById('ssa-assessment').classList.remove('active');
  document.getElementById('ssa-review').classList.remove('active');
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
  const qPerCat = count === 1 ? 40 : 20;
  const qCount = count * qPerCat;

  const statCat = document.getElementById('stat-categories');
  const statQ   = document.getElementById('stat-questions');
  if (statCat) statCat.textContent = count;
  if (statQ)   statQ.textContent   = qPerCat;

  if (!btn) return;
  const arrowSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  
  if (count === 1) {
    btn.innerHTML =
      `<span class="btn-text-mobile">Start · 1 cat · 40q ${arrowSvg}</span>` +
      `<span class="btn-text-desktop">Start Assessment · 1 category · 40 questions ${arrowSvg}</span>`;
  } else {
    btn.innerHTML =
      `<span class="btn-text-mobile">Start · ${count} cat · ${qCount}q ${arrowSvg}</span>` +
      `<span class="btn-text-desktop">Start Assessment · ${count} categories · ${qCount} questions (${qPerCat} each) ${arrowSvg}</span>`;
  }
}

//Render: Assessment 
function renderAssessment() {
  document.getElementById('ssa-welcome').classList.remove('active');
  document.getElementById('ssa-assessment').classList.add('active');
  document.getElementById('ssa-review').classList.remove('active');
  document.getElementById('ssa-results').classList.remove('active');
  renderCategoryTabs();
  renderCategoryProgress();
  renderQuestionCard();
  startTimer();
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
    const isFlagged = state.flaggedQuestions.has(q.id);
    let cls   = 'q-dot';
    if (i === state.activeQuestionIndex) cls += ' active';
    else if (isFlagged) cls += ' flagged';
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
  const isFlagged = state.flaggedQuestions.has(q.id);

  const typeLabel = { likert:'Agree/Disagree', freq:'Frequency', choice:'Scenario' }[q.type] || '';
  document.getElementById('ssa-cat-label').textContent = `${cat}  ·  ${typeLabel}`;
  document.getElementById('ssa-q-num').textContent     = `Question ${qNum} of ${total}`;
  document.getElementById('ssa-q-text').textContent    = q.text;

  // Update flag button
  const flagBtn = document.getElementById('ssa-btn-flag');
  if (flagBtn) {
    flagBtn.classList.toggle('flagged', isFlagged);
    flagBtn.innerHTML = isFlagged
      ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-8l-4 4v-4H6a2 2 0 0 1-2-2V4z"/></svg> Flagged'
      : '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-8l-4 4v-4H6a2 2 0 0 1-2-2V4z"/></svg> Flag';
  }

  // Update completion status
  updateCompletionStatus();

  const container = document.getElementById('ssa-likert');
  container.innerHTML = '';

  if (q.type === 'choice') {
    renderChoiceOptions(q, container);
  } else {
    const scale = q.type === 'freq' ? FREQ_SCALE : LIKERT_SCALE;
    renderScaleOptions(q, scale, container);
  }

  // Prev / Next button states
  if (state.reviewMode && state.reviewOnlyFlagged) {
    const prevBtn = document.getElementById('ssa-btn-prev-q');
    const nextBtn = document.getElementById('ssa-btn-next-q');

    const prevResult = getPrevFlaggedQuestion();
    const nextResult = getNextFlaggedQuestion();

    prevBtn.disabled = prevResult === null;

    nextBtn.innerHTML = nextResult === null
      ? 'Back to Summary'
      : 'Next Flagged <svg class="btn-arrow-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  } else {
    const prevBtn = document.getElementById('ssa-btn-prev-q');
    const nextBtn = document.getElementById('ssa-btn-next-q');

    prevBtn.disabled = (state.activeQuestionIndex === 0 && state.activeCategoryIndex === 0);

    const isLastQ   = state.activeQuestionIndex === total - 1;
    const isLastCat = state.activeCategoryIndex === state.selectedCategories.length - 1;

    nextBtn.innerHTML = (isLastQ && isLastCat)
      ? 'Review & Submit'
      : 'Next <svg class="btn-arrow-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  }
}

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
  stopTimer();
  const qs = activeQuestions();

  if (state.reviewMode && state.reviewOnlyFlagged) {
    const next = getNextFlaggedQuestion();
    if (next !== null) {
      state.activeCategoryIndex = next.catIdx;
      state.activeQuestionIndex = next.qIdx;
      renderAssessment();
    } else {
      renderReviewSummary();
    }
  } else {
    if (state.activeQuestionIndex < qs.length - 1) {
      state.activeQuestionIndex++;
      renderAssessment();
    } else if (state.activeCategoryIndex < state.selectedCategories.length - 1) {
      state.activeCategoryIndex++;
      state.activeQuestionIndex = 0;
      renderAssessment();
      showToast(`Moving to ${activeCategory()}`, 'info');
    } else {
      renderReviewSummary();
    }
  }
}

function prevQuestion() {
  stopTimer();

  if (state.reviewMode && state.reviewOnlyFlagged) {
    const prev = getPrevFlaggedQuestion();
    if (prev !== null) {
      state.activeCategoryIndex = prev.catIdx;
      state.activeQuestionIndex = prev.qIdx;
      renderAssessment();
    }
  } else {
    if (state.activeQuestionIndex > 0) {
      state.activeQuestionIndex--;
    } else if (state.activeCategoryIndex > 0) {
      state.activeCategoryIndex--;
      state.activeQuestionIndex = activeQuestions().length - 1;
    }
    renderAssessment();
  }
}

function prevQuestion() {
  stopTimer();
  
  if (state.reviewMode && state.reviewOnlyFlagged) {
    const prevIdx = getPrevFlaggedQuestion();
    if (prevIdx !== null) {
      state.activeQuestionIndex = prevIdx;
      renderAssessment();
    }
  } else {
    if (state.activeQuestionIndex > 0) {
      state.activeQuestionIndex--;
    } else if (state.activeCategoryIndex > 0) {
      state.activeCategoryIndex--;
      state.activeQuestionIndex = activeQuestions().length - 1;
    }
    renderAssessment();
  }
}

function skipQuestion() {
  stopTimer();
  const q = activeQuestion();
  state.answers[q.id] = 'skipped';
  renderCategoryProgress();
  renderCategoryTabs();
  advanceQuestion();
}

function nextQuestion() {
  const qs = activeQuestions();
  const isLastQ   = state.activeQuestionIndex === qs.length - 1;
  const isLastCat = state.activeCategoryIndex === state.selectedCategories.length - 1;

  if (state.reviewMode && state.reviewOnlyFlagged) {
    advanceQuestion();
  } else if (isLastQ && isLastCat) {
    if (!checkAllCategoriesMeetThreshold()) {
      showToast(`Answer 50%+ per category. Still short: ${getCategoryShortfallMessage()}`, 'warning');
      return;
    }
    renderReviewSummary();
  } else {
    advanceQuestion();
  }
}


function renderReviewSummary() {
  stopTimer();
  document.getElementById('ssa-welcome').classList.remove('active');
  document.getElementById('ssa-assessment').classList.remove('active');
  document.getElementById('ssa-review').classList.add('active');
  document.getElementById('ssa-results').classList.remove('active');
  
  state.reviewMode = false;
  state.reviewOnlyFlagged = false;
  
  const answeredCount = getAllAnsweredCount();
  const skippedCount = getSkippedCount();
  const notAnsweredCount = getNotAnsweredCount();
  const flaggedCount = getFlaggedQuestionsCount();
  
  document.getElementById('rev-answered-count').textContent = answeredCount;
  document.getElementById('rev-skipped-count').textContent = skippedCount;
  document.getElementById('rev-notanswered-count').textContent = notAnsweredCount;
  document.getElementById('rev-flagged-count').textContent = flaggedCount;
  
  // Build review cards
  const container = document.getElementById('rev-summary-cards');
  container.innerHTML = '';
  
  state.selectedCategories.forEach(cat => {
    const stats = categoryStats(cat);
    const card = document.createElement('div');
    card.className = 'rev-cat-card';
    card.innerHTML = `
      <div class="rev-cat-card__name">${cat}</div>
      <div class="rev-cat-card__status">
        <span class="rev-badge rev-badge--answered">${stats.answered} Answered</span>
        <span class="rev-badge rev-badge--skipped">${stats.skipped} Skipped</span>
        <span class="rev-badge rev-badge--unanswered">${stats.total - stats.answered - stats.skipped} Unanswered</span>
      </div>
    `;
    container.appendChild(card);
  });
}

//Finish 
function finishAssessment() {
  if (!checkAllCategoriesMeetThreshold()) {
    showToast(`Cannot submit. Need 50%+ in every category. Short: ${getCategoryShortfallMessage()}`, 'error');
    return;
  }
  stopTimer();
  saveToStorage();
  renderResults();
}

//Render: Results 
function renderResults() {
  document.getElementById('ssa-welcome').classList.remove('active');
  document.getElementById('ssa-assessment').classList.remove('active');
  document.getElementById('ssa-review').classList.remove('active');
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

//Charts 
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

//PDF Export
async function generatePDF() {
  const btn = document.getElementById('res-btn-pdf');
  const loader = document.getElementById('pdf-loader');

  btn.disabled = true;
  btn.textContent = 'Generating…';
  loader.style.display = 'flex';

  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    const { jsPDF } = window.jspdf;
    const doc     = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
    const PW      = doc.internal.pageSize.getWidth();
    const PH      = doc.internal.pageSize.getHeight();
    const stats   = allCategoryStats();
    const overall = overallScore();
    const ML = 20, MR = 20, CW = PW - ML - MR;
    let y = 0;

    function checkPage(needed = 20) {
      if (y + needed > PH - 15) { doc.addPage(); y = 18; }
    }

    function sectionTitle(title, pageCheck = 24) {
      checkPage(pageCheck);
      doc.setFillColor(26, 26, 26);
      doc.roundedRect(ML, y, CW, 10, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(255, 198, 47);
      doc.text(title, ML + 5, y + 7);
      y += 16;
    }

    function drawProgressBar(x, barY, w, h, pct, color) {
      doc.setFillColor(220, 220, 220);
      doc.roundedRect(x, barY, w, h, 1, 1, 'F');
      if (pct > 0) {
        const rgb = hexToRgb(color);
        doc.setFillColor(rgb.r, rgb.g, rgb.b);
        doc.roundedRect(x, barY, w * pct / 100, h, 1, 1, 'F');
      }
    }

    function wrappedText(text, x, textY, maxW, lineH = 5.5) {
      const lines = doc.splitTextToSize(text, maxW);
      doc.text(lines, x, textY);
      return textY + lines.length * lineH;
    }

    const FEEDBACK = {
      Communication: {
        Exceptional:  { fb: 'You demonstrate outstanding communication skills. You adapt effortlessly across formats, handle difficult conversations with confidence, and ensure clarity and alignment in all interactions.', strength: 'Adaptive communication, clarity under pressure, active listening', weakness: 'May benefit from further developing advanced negotiation or cross-cultural communication nuances.' },
        Proficient:   { fb: 'You communicate effectively in most situations. You handle feedback well and keep stakeholders informed. Focus on refining how you handle high-stakes or ambiguous communication moments.', strength: 'Clear messaging, good feedback reception, solid written communication', weakness: 'Occasional hesitation in confrontational or emotionally charged conversations.' },
        Developing:   { fb: 'You have a foundational communication style but tend to struggle in complex or high-pressure situations. Building confidence in difficult conversations will significantly elevate your effectiveness.', strength: 'Basic clarity, willingness to communicate', weakness: 'Needs improvement in active listening, clarity under pressure, and proactive communication.' },
        'Needs Focus': { fb: 'Communication gaps are creating friction in your work. Investing in structured communication training — especially for feedback delivery and conflict resolution — is essential.', strength: 'Awareness of communication importance', weakness: 'Significant gaps in clarity, active listening, and handling difficult conversations.' },
        'Critical Gap': { fb: 'Critical communication deficits are likely impacting your team and stakeholders. Immediate focus on foundational communication skills is strongly recommended.', strength: 'Room for significant growth identified', weakness: 'Core communication fundamentals need urgent attention across all contexts.' },
      },
      Leadership: {
        Exceptional:  { fb: 'You exemplify strong, empathetic leadership. You develop others, make decisive calls, and create psychological safety — your team likely performs above average because of your influence.', strength: 'Decision-making, team development, inclusive leadership, accountability', weakness: 'At this level, focus on strategic influence and executive presence for even greater impact.' },
        Proficient:   { fb: 'You lead effectively and take ownership. You support your team and make good decisions under pressure. Continue building your ability to develop junior talent and lead through ambiguity.', strength: 'Decisiveness, accountability, team support', weakness: 'Delegation and developing others could be strengthened further.' },
        Developing:   { fb: 'You show leadership potential but still default to individual contribution over team enablement. Focus on developing others and making decisions even with incomplete information.', strength: 'Takes initiative, some awareness of team dynamics', weakness: 'Delegation, developing junior staff, and leading through uncertainty need attention.' },
        'Needs Focus': { fb: 'Leadership behaviours are inconsistent. Addressing conflict, holding others accountable, and making timely decisions are areas requiring significant development.', strength: 'Willing to take on responsibility', weakness: 'Conflict resolution, accountability, and team enablement are critical gaps.' },
        'Critical Gap': { fb: 'Leadership fundamentals need immediate attention. Without improvement, team performance and morale may be at risk. Structured coaching or mentoring is strongly recommended.', strength: 'Opportunity for transformational growth', weakness: 'Core leadership behaviours across all dimensions require urgent development.' },
      },
      Confidence: {
        Exceptional:  { fb: 'You operate with high self-assurance and resilience. You take on stretch challenges, stand by your views under pressure, and recover quickly from setbacks — a powerful professional asset.', strength: 'Resilience, self-advocacy, presence under pressure, growth mindset', weakness: 'Ensure high confidence doesn\'t tip into dismissing others\' perspectives.' },
        Proficient:   { fb: 'You carry yourself with solid confidence in most situations. You speak up and take on challenges. Work on maintaining composure and assertiveness in the highest-stakes moments.', strength: 'Self-advocacy, willingness to volunteer, handling criticism constructively', weakness: 'May occasionally hesitate in very high-visibility or confrontational situations.' },
        Developing:   { fb: 'Your confidence is situational — strong in familiar territory but shaky under scrutiny or in senior settings. Building a track record of small wins will compound into greater self-assurance.', strength: 'Self-awareness, some assertiveness in familiar contexts', weakness: 'Needs development in speaking up in senior rooms, recovering from public mistakes, and self-promotion.' },
        'Needs Focus': { fb: 'Low confidence is limiting your professional impact. You may be holding back valuable contributions. Working with a coach or mentor on visibility and self-advocacy would be highly beneficial.', strength: 'Humility and self-awareness', weakness: 'Assertiveness, visibility, recovering from setbacks, and self-advocacy all need significant work.' },
        'Critical Gap': { fb: 'Confidence deficits are significantly holding back your growth. Immediate and structured work on self-belief, assertiveness, and resilience is strongly recommended.', strength: 'Genuine opportunity for transformational self-development', weakness: 'Fundamental confidence behaviours are absent across nearly all scenarios.' },
      },
      Teamwork: {
        Exceptional:  { fb: 'You are an exceptional team player. You create safety, share credit, address issues proactively, and elevate everyone around you. Your team is better because you\'re in it.', strength: 'Proactive support, credit sharing, conflict resolution, psychological safety creation', weakness: 'At this level, focus on cross-functional collaboration and influencing team culture at a broader scale.' },
        Proficient:   { fb: 'You collaborate well and contribute meaningfully to team success. You support teammates and handle disagreements constructively. Focus on being even more proactive in surfacing issues early.', strength: 'Reliability, credit sharing, supporting teammates, constructive disagreement', weakness: 'Could be more proactive in flagging risks and developing deeper cross-functional relationships.' },
        Developing:   { fb: 'You contribute to your team but sometimes default to independent work over collaborative effort. Leaning into shared ownership and proactive communication will improve team outcomes significantly.', strength: 'Contributes when asked, basic reliability', weakness: 'Proactive help-offering, surfacing team issues early, and sharing credit need development.' },
        'Needs Focus': { fb: 'Teamwork behaviours are inconsistent and may be creating friction. Focus on reliability, proactive communication, and supporting teammates before focusing on individual output.', strength: 'Awareness of team dynamics', weakness: 'Reliability, proactive communication, conflict handling, and recognizing others are critical gaps.' },
        'Critical Gap': { fb: 'Fundamental teamwork behaviours are absent. This is likely creating significant friction and trust issues within your team. Immediate coaching on collaboration fundamentals is recommended.', strength: 'Significant potential for growth in team contribution', weakness: 'Core collaboration, reliability, communication, and support behaviours all require urgent attention.' },
      },
    };

    function getAnalysis(cat, pct) {
      const level = getLevel(pct);
      const data  = FEEDBACK[cat]?.[level.label];
      if (!data) return { fb: 'No feedback available.', strength: '—', weakness: '—' };
      return data;
    }

    const IMPROVEMENT_PLANS = {
      Communication: {
        Exceptional:  ['Mentor a colleague on communication best practices', 'Lead workshops on difficult conversations or stakeholder management', 'Explore executive communication or public speaking programs'],
        Proficient:   ['Practice structured feedback frameworks (SBI, STAR)', 'Take on a project requiring cross-functional stakeholder management', 'Read: "Crucial Conversations" by Patterson et al.'],
        Developing:   ['Join a public speaking group (e.g Toastmasters)', 'Practice active listening daily — summarize before responding', 'Weekly journaling: reflect on one communication situation each week'],
        'Needs Focus': ['Enrol in a foundational business communication course', 'Request weekly feedback from your manager on communication clarity', 'Role-play difficult conversations with a trusted colleague or coach'],
        'Critical Gap': ['Seek immediate coaching or mentoring on communication fundamentals', 'Start with written communication — practice clear, concise emails daily', 'Ask manager for explicit communication goals in your next review'],
      },
      Leadership: {
        Exceptional:  ['Take on a cross-organisational leadership initiative', 'Sponsor a junior colleague\'s development formally', 'Explore executive leadership programs or peer CEO groups'],
        Proficient:   ['Delegate one meaningful project per month you\'d normally keep', 'Schedule monthly development conversations with each team member', 'Read: "The Manager\'s Path" by Camille Fournier'],
        Developing:   ['Practice making decisions with 70% information — then review outcomes', 'Volunteer to lead a small cross-functional project', 'Find a leadership mentor inside or outside your organisation'],
        'Needs Focus': ['Enrol in a structured leadership development programme', 'Work with a coach specifically on conflict resolution and accountability', 'Identify one leadership behaviour to improve each month'],
        'Critical Gap': ['Seek immediate leadership coaching or mentoring', 'Shadow a strong leader in your organisation for 30 days', 'Set specific, measurable leadership goals with your manager this week'],
      },
      Confidence: {
        Exceptional:  ['Deliberately sponsor others\' visibility in senior settings', 'Take on a high-stakes external speaking opportunity', 'Explore how your confidence can create safety for others around you'],
        Proficient:   ['Volunteer for the next high-visibility project before being asked', 'Practice reframing setbacks — write one learning from each challenge', 'Take a negotiation skills workshop to strengthen assertiveness'],
        Developing:   ['Set a goal to share your opinion in every meeting this week', 'Track small wins daily — build evidence of your own competence', 'Read: "The Confidence Code" by Katty Kay & Claire Shipman'],
        'Needs Focus': ['Work with a coach on self-advocacy and visibility strategies', 'Practice a 2-minute "professional highlights" pitch about your work', 'Identify one situation per week where you held back — then act differently'],
        'Critical Gap': ['Begin confidence-focused coaching or therapy immediately', 'Start with low-stakes visibility: contribute one idea per team meeting', 'Journal daily: three things you did well — build a positive evidence base'],
      },
      Teamwork: {
        Exceptional:  ['Champion a team culture initiative across your wider organisation', 'Formally mentor someone on collaboration and team dynamics', 'Explore team facilitation or organisational psychology reading'],
        Proficient:   ['Proactively check in on a blocked teammate before they ask for help', 'Initiate a team retrospective or process improvement session', 'Read: "The Five Dysfunctions of a Team" by Patrick Lencioni'],
        Developing:   ['Set a goal: offer help to one teammate proactively each week', 'Practice surfacing team risks in standups — not just your own updates', 'Reflect after each team interaction: did I contribute to or drain the team?'],
        'Needs Focus': ['Attend a team dynamics or collaboration workshop', 'Ask teammates for honest feedback on how you show up in the team', 'Focus on one reliability improvement: always deliver what you commit to'],
        'Critical Gap': ['Seek immediate coaching focused on team dynamics and trust-building', 'Have honest conversations with your manager about teamwork expectations', 'Start small: respond to teammates promptly and follow through on every commitment'],
      },
    };

    function getImprovementPlan(cat, pct) {
      const level = getLevel(pct);
      return IMPROVEMENT_PLANS[cat]?.[level.label] || ['Focus on building foundational skills in this area.'];
    }

    const rankedCats = [...state.selectedCategories]
      .filter(c => stats[c].pct !== null)
      .sort((a, b) => (stats[b].pct || 0) - (stats[a].pct || 0));

    doc.setFillColor(26, 26, 26); doc.rect(0, 0, PW, 50, 'F');
    doc.setFillColor(255, 198, 47); doc.rect(0, 48, PW, 2, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('Soft Skills Assessment', PW / 2, 18, { align: 'center' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(11);
    doc.setTextColor(180, 180, 180);
    doc.text('Psychometric Competency Report', PW / 2, 30, { align: 'center' });
    doc.setFontSize(9); doc.setTextColor(255, 198, 47);
    doc.text(`Categories: ${state.selectedCategories.join(' · ')}`, PW / 2, 40, { align: 'center' });

    y = 62;
    [['Employee:', state.employeeData.name], ['Role:', state.employeeData.role],
     ['Date:', new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })]
    ].forEach(([label, value]) => {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(80, 80, 80); doc.text(label, 20, y);
      doc.setFont('helvetica', 'bold'); doc.setTextColor(26, 26, 26); doc.text(value, 65, y); y += 8;
    });

    // Overall Score Circle
    y = 98;
    doc.setFillColor(255, 198, 47); doc.circle(PW / 2, y + 18, 20, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(28); doc.setTextColor(26, 26, 26);
    doc.text(overall + '%', PW / 2, y + 22, { align: 'center' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(80, 80, 80);
    doc.text('Overall Score', PW / 2, y + 33, { align: 'center' });
    const lvl = getLevel(overall); const lc = hexToRgb(lvl.color);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(lc.r, lc.g, lc.b);
    doc.text(lvl.label, PW / 2, y + 43, { align: 'center' });

    // Category Breakdown
    y = 152;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(26, 26, 26);
    doc.text('Category Breakdown', 20, y); y += 10;
    state.selectedCategories.forEach(cat => {
      const s = stats[cat]; const catLvl = getLevel(s.pct);
      const pctVal = s.pct !== null ? s.pct : 0; const rc = hexToRgb(catLvl.color);
      doc.setFillColor(248, 248, 248); doc.roundedRect(18, y - 6, PW - 36, 16, 2, 2, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(26, 26, 26); doc.text(cat, 22, y + 2);
      drawProgressBar(75, y - 1, 70, 5, pctVal, catLvl.color);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(rc.r, rc.g, rc.b);
      doc.text(s.pct !== null ? s.pct + '%' : '—', PW - 22, y + 2, { align: 'right' });
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(120, 120, 120);
      doc.text(`${s.answered} answered · ${s.skipped} skipped`, PW - 22, y + 8, { align: 'right' });
      y += 18;
    });

    // Charts
    y += 6;
    try { const img = document.getElementById('chart-radar').toDataURL('image/png'); if (img && img.length > 100) doc.addImage(img, 'PNG', 15, y, 75, 65); } catch (e) { }
    try { const img = document.getElementById('chart-bar').toDataURL('image/png'); if (img && img.length > 100) doc.addImage(img, 'PNG', 100, y, 78, 65); } catch (e) { }

    doc.addPage(); y = 18;

    sectionTitle('SKILL STRENGTH RANKING');

    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(100, 100, 100);
    doc.text('Skills ranked from strongest to most in need of development based on your responses.', ML, y);
    y += 10;

    rankedCats.forEach((cat, i) => {
      checkPage(28);
      const s     = stats[cat];
      const level = getLevel(s.pct);
      const rc    = hexToRgb(level.color);
      const pct   = s.pct || 0;
      const rank  = i + 1;

      doc.setFillColor(rank === 1 ? 255 : rank === 2 ? 248 : 245,
                       rank === 1 ? 248 : rank === 2 ? 248 : 245,
                       rank === 1 ? 220 : 248);
      doc.roundedRect(ML, y, CW, 22, 3, 3, 'F');
      doc.setDrawColor(rc.r, rc.g, rc.b); doc.setLineWidth(0.5);
      doc.roundedRect(ML, y, CW, 22, 3, 3, 'S');

      doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.setTextColor(rc.r, rc.g, rc.b);
      doc.text(`#${rank}`, ML + 5, y + 14);

      doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(26, 26, 26);
      doc.text(cat, ML + 22, y + 9);

      doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(rc.r, rc.g, rc.b);
      doc.text(level.label, ML + 22, y + 17);

      drawProgressBar(ML + 90, y + 6, CW - 110, 4, pct, level.color);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(rc.r, rc.g, rc.b);
      doc.text(`${pct}%`, PW - MR - 2, y + 14, { align: 'right' });

      y += 28;
    });

    y += 4;
    checkPage(16);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(26, 26, 26);
    doc.text('Top Strength:', ML, y);
    if (rankedCats.length > 0) {
      const top = rankedCats[0];
      const topRc = hexToRgb(getLevel(stats[top].pct).color);
      doc.setTextColor(topRc.r, topRc.g, topRc.b);
      doc.text(`${top}  (${stats[top].pct}%)`, ML + 32, y);
    }
    y += 7;
    if (rankedCats.length > 1) {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(26, 26, 26);
      doc.text('Priority to Develop:', ML, y);
      const bottom = rankedCats[rankedCats.length - 1];
      const botRc = hexToRgb(getLevel(stats[bottom].pct).color);
      doc.setTextColor(botRc.r, botRc.g, botRc.b);
      doc.text(`${bottom}  (${stats[bottom].pct}%)`, ML + 38, y);
      y += 7;
    }

    doc.addPage(); y = 18;
    sectionTitle('PERFORMANCE FEEDBACK');

    state.selectedCategories.forEach(cat => {
      if (stats[cat].pct === null) return;
      const analysis = getAnalysis(cat, stats[cat].pct);
      const level    = getLevel(stats[cat].pct);
      const rc       = hexToRgb(level.color);

      checkPage(52);

      doc.setFillColor(rc.r, rc.g, rc.b);
      doc.roundedRect(ML, y, CW, 9, 2, 2, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(255, 255, 255);
      doc.text(`${cat}  ·  ${stats[cat].pct}%  ·  ${level.label}`, ML + 4, y + 6.5);
      y += 13;

      doc.setFont('helvetica', 'italic'); doc.setFontSize(9.5); doc.setTextColor(40, 40, 40);
      const fbLines = doc.splitTextToSize(analysis.fb, CW - 4);
      doc.text(fbLines, ML + 2, y);
      y += fbLines.length * 5.5 + 5;

      checkPage(20);
      doc.setFillColor(240, 255, 245);
      doc.roundedRect(ML, y, (CW / 2) - 3, 5 + doc.splitTextToSize(analysis.strength, (CW / 2) - 10).length * 5, 2, 2, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(22, 163, 74);
      doc.text('+ STRENGTHS', ML + 3, y + 4);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(40, 80, 40);
      const strLines = doc.splitTextToSize(analysis.strength, (CW / 2) - 10);
      doc.text(strLines, ML + 3, y + 10);

      const weakX = ML + CW / 2 + 3;
      doc.setFillColor(255, 243, 240);
      doc.roundedRect(weakX, y, (CW / 2) - 3, 5 + doc.splitTextToSize(analysis.weakness, (CW / 2) - 10).length * 5, 2, 2, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(220, 38, 38);
      doc.text('- AREAS TO DEVELOP', weakX + 3, y + 4);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(120, 30, 30);
      const wkLines = doc.splitTextToSize(analysis.weakness, (CW / 2) - 10);
      doc.text(wkLines, weakX + 3, y + 10);

      const boxH = Math.max(strLines.length, wkLines.length) * 5 + 14;
      y += boxH + 12;
    });

    doc.addPage(); y = 18;
    sectionTitle('PERSONALISED IMPROVEMENT PLAN');

    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(100, 100, 100);
    const planDesc = `Tailored action steps for ${state.employeeData.name} based on current performance levels. Focus on priority areas first.`;
    const planDescLines = doc.splitTextToSize(planDesc, CW);
    doc.text(planDescLines, ML, y);
    y += planDescLines.length * 5 + 8;

    const priorityOrder = [...state.selectedCategories]
      .filter(c => stats[c].pct !== null)
      .sort((a, b) => (stats[a].pct || 0) - (stats[b].pct || 0));

    priorityOrder.forEach((cat, catIdx) => {
      const s     = stats[cat];
      const level = getLevel(s.pct);
      const rc    = hexToRgb(level.color);
      const plan  = getImprovementPlan(cat, s.pct);
      const priority = catIdx === 0 ? 'HIGHEST PRIORITY' : catIdx === 1 ? 'HIGH PRIORITY' : catIdx === 2 ? 'MEDIUM PRIORITY' : 'MAINTENANCE';
      const priorityColor = catIdx === 0 ? { r:220,g:38,b:38 } : catIdx === 1 ? { r:234,g:88,b:12 } : catIdx === 2 ? { r:202,g:138,b:4 } : { r:22,g:163,b:74 };

      checkPage(14 + plan.length * 12);

      doc.setFillColor(26, 26, 26);
      doc.roundedRect(ML, y, CW, 10, 2, 2, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(255, 198, 47);
      doc.text(cat, ML + 4, y + 7);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
      doc.setTextColor(priorityColor.r, priorityColor.g, priorityColor.b);
      doc.text(priority, PW - MR - 2, y + 7, { align: 'right' });
      y += 13;

      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(rc.r, rc.g, rc.b);
      doc.text(`Current Level: ${level.label}  (${s.pct}%)`, ML, y);
      y += 7;

      plan.forEach((step, i) => {
        checkPage(14);
        doc.setFillColor(i % 2 === 0 ? 250 : 255, 250, 255);
        const stepLines = doc.splitTextToSize(step, CW - 16);
        const stepH = stepLines.length * 5.5 + 6;
        doc.roundedRect(ML, y, CW, stepH, 2, 2, 'F');
        doc.setDrawColor(rc.r, rc.g, rc.b); doc.setLineWidth(0.3);
        doc.roundedRect(ML, y, CW, stepH, 2, 2, 'S');

        doc.setFillColor(rc.r, rc.g, rc.b);
        doc.circle(ML + 6, y + stepH / 2, 3.5, 'F');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(255, 255, 255);
        doc.text(`${i + 1}`, ML + 6, y + stepH / 2 + 2.5, { align: 'center' });

        doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(30, 30, 30);
        doc.text(stepLines, ML + 14, y + 5.5);
        y += stepH + 4;
      });
      y += 8;
    });

    doc.addPage(); y = 15;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.setTextColor(26, 26, 26);
    doc.text('Detailed Question Responses', 20, y); y += 6;
    doc.setFillColor(255, 198, 47); doc.rect(20, y, PW - 40, 1.5, 'F'); y += 9;

    state.selectedCategories.forEach(cat => {
      checkPage(20);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
      doc.setTextColor(255, 255, 255); doc.setFillColor(26, 26, 26);
      doc.rect(18, y - 6, PW - 36, 11, 'F'); doc.text(cat, 22, y); y += 13;
      (state.selectedQuestions[cat] || []).forEach((q, qi) => {
        checkPage(28);
        const ans = state.answers[q.id];
        let ansLabel = '—', ansColor = { r: 150, g: 150, b: 150 };
        if (ans === 'skipped') { ansLabel = 'Skipped'; ansColor = { r: 180, g: 180, b: 180 }; }
        else if (ans != null) {
          if (q.type === 'choice') {
            const closest = q.options.reduce((best, o) => Math.abs(choiceToScore(o.score) - ans) < Math.abs(choiceToScore(best.score) - ans) ? o : best, q.options[0]);
            ansLabel = closest.label; ansColor = { r: 86, g: 239, b: 172 };
          } else {
            const scale = q.type === 'freq' ? FREQ_SCALE : LIKERT_SCALE;
            const opt = scale.find(l => l.value === ans);
            if (opt) { ansLabel = opt.label; ansColor = hexToRgb(opt.color); }
          }
        }
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(40, 40, 40);
        const lines = doc.splitTextToSize(`Q${qi + 1}. ${q.text}`, PW - 50);
        doc.text(lines, 20, y); y += lines.length * 4.8;
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
        doc.setTextColor(ansColor.r, ansColor.g, ansColor.b);
        const timingStr = state.timerEnabled && state.questionTimings[q.id] ? ` (${formatTime(state.questionTimings[q.id])})` : '';
        doc.text(ansLabel + timingStr, 25, y); y += 8;
      });
      y += 4;
    });

    doc.addPage(); y = 15;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.setTextColor(26, 26, 26);
    doc.text('Response Distribution', 20, y); y += 8;
    try { const img = document.getElementById('chart-dist').toDataURL('image/png'); if (img && img.length > 100) doc.addImage(img, 'PNG', 15, y, PW - 30, 70); } catch (e) { }
    doc.setFont('helvetica', 'italic'); doc.setFontSize(8); doc.setTextColor(120, 120, 120);

    if (state.timerEnabled) {
      doc.addPage(); y = 15;
      doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.setTextColor(26, 26, 26);
      doc.text('Assessment Timing Summary', 20, y); y += 10;

      let totalTime = 0;
      Object.values(state.questionTimings).forEach(t => { totalTime += t; });

      doc.setFillColor(255, 249, 240);
      doc.roundedRect(18, y, PW - 36, 14, 2, 2, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(26, 26, 26);
      doc.text(`Total Assessment Time: ${formatTime(totalTime)}`, 22, y + 9);
      y += 18;

      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(100, 100, 100);
      doc.text('Time per question helps identify areas where you spent more deliberation. No time pressure — answer at your own pace.', ML, y);
      y += 12;
    }

    //Page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(160, 160, 160);
     doc.text(`Page ${i} of ${pageCount}`, ML, PH - 6);
    }

    doc.save(`SSA_${state.employeeData.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    showToast('PDF exported successfully!', 'success');

  } catch (err) {
    console.error(err);
    showToast('PDF generation failed. Please try again.', 'error');
  } finally {
    // keep loader visible for 2.5s so the animation completes nicely
    setTimeout(() => {
      loader.style.display = 'none';
      btn.disabled = false;
      btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export PDF';
    }, 2500);
  }
}

function hexToRgb(hex) {
  return { r:parseInt(hex.slice(1,3),16), g:parseInt(hex.slice(3,5),16), b:parseInt(hex.slice(5,7),16) };
}

//Storage 
function saveToStorage() {
  try {
    let stored = { version:2, assessments:[] };
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { try { const p=JSON.parse(raw); if(p.assessments) stored=p; } catch(_){} }
    stored.assessments.push({
      id: Date.now(), employee: state.employeeData,
      categories: state.selectedCategories, timestamp: new Date().toISOString(),
      answers: state.answers, stats: allCategoryStats(), overall: overallScore(),
      flagged: Array.from(state.flaggedQuestions), timings: state.questionTimings,
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch(_){}
}

//Init 
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
    if (!name || name.length < 2 || name.length > 70) { 
      nameErr.textContent = 'Name must be between 2 and 70 characters.'; 
      ok = false; 
    }
    if (!role || role.length < 2 || role.length > 70) { 
      roleErr.textContent = 'Role must be between 2 and 70 characters.'; 
      ok = false; 
    }
    if (!ok) return;
    state.employeeData      = { name, role };
    state.selectedQuestions = pickQuestions();
    state.answers           = {};
    state.flaggedQuestions  = new Set();
    state.questionTimings   = {};
    state.activeCategoryIndex = 0;
    state.activeQuestionIndex = 0;
    state.answerLocked        = false;
    
    const timerCheckbox = document.getElementById('ssa-enable-timer');
    state.timerEnabled = timerCheckbox ? timerCheckbox.checked : false;
    
    renderAssessment();
  });

  document.getElementById('ssa-btn-prev-q').addEventListener('click', prevQuestion);
  document.getElementById('ssa-btn-next-q').addEventListener('click', nextQuestion);
  document.getElementById('ssa-btn-skip').addEventListener('click', skipQuestion);
  document.getElementById('ssa-btn-flag').addEventListener('click', () => {
    const q = activeQuestion();
    toggleFlagQuestion(q.id);
  });


  document.getElementById('ssa-btn-finish-early').addEventListener('click', () => {
    if (!checkAllCategoriesMeetThreshold()) {
      showToast(`Answer 50%+ in every category first. Short: ${getCategoryShortfallMessage()}`, 'warning');
      return;
    }
    renderReviewSummary();
  });

  document.getElementById('res-btn-pdf').addEventListener('click', generatePDF);
  document.getElementById('res-btn-restart').addEventListener('click', () => {
    state = {
      employeeData:null, selectedCategories:[...ALL_CATEGORIES],
      selectedQuestions:{}, answers:{},
      flaggedQuestions: new Set(), activeCategoryIndex:0, activeQuestionIndex:0,
      phase:'welcome', answerLocked:false,
      timerEnabled:false, questionTime:0, timerInterval:null,
      questionTimings: {}, reviewMode: false, reviewOnlyFlagged: false,
    };
    document.getElementById('ssa-form').reset();
    document.getElementById('err-name').textContent='';
    document.getElementById('err-role').textContent='';
    document.getElementById('ssa-welcome').classList.add('active');
    document.getElementById('ssa-assessment').classList.remove('active');
    document.getElementById('ssa-review').classList.remove('active');
    document.getElementById('ssa-results').classList.remove('active');
    renderCategorySelector();
  });
  
  document.getElementById('rev-btn-review-flagged').addEventListener('click', enterReviewMode);
  document.getElementById('rev-btn-submit').addEventListener('click', finishAssessment);
  document.getElementById('rev-btn-back').addEventListener('click', () => {
    state.activeCategoryIndex = 0;
    state.activeQuestionIndex = 0;
    renderAssessment();
  });

  document.getElementById('ssa-welcome').classList.add('active');
}

document.addEventListener('DOMContentLoaded', init);