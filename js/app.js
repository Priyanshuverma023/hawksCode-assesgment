'use strict';

const STORAGE_KEY = 'ssa_assessments';
const TOTAL_QUESTIONS = 80;

let activeToast = null;
let currentState = {
    employeeData: null,
    currentQuestion: 0,
    answers: [],
    assessmentInProgress: false
};

const assessmentQuestions = [
// ─── COMMUNICATION (20 questions, indices 0–19) ───────────────────────────
{
    category: 'Communication',
    question: 'How effectively do you communicate your ideas?',
    description: 'Rate your ability to express yourself clearly.',
    options: [
        { text: 'Struggles to express ideas clearly', value: 1 },
        { text: 'Communicates with some clarity', value: 2 },
        { text: 'Communicates ideas effectively', value: 3 },
        { text: 'Excellent communicator with exceptional clarity', value: 4 }
    ]
},
{
    category: 'Communication',
    question: 'How well do you listen to feedback?',
    description: 'Rate your receptiveness to constructive criticism.',
    options: [
        { text: 'Rarely listens to feedback', value: 1 },
        { text: 'Sometimes listens to feedback', value: 2 },
        { text: 'Actively listens to feedback', value: 3 },
        { text: 'Excellent listener, always seeks feedback', value: 4 }
    ]
},
{
    category: 'Communication',
    question: 'How do you handle difficult conversations?',
    description: 'Rate your approach to challenging discussions.',
    options: [
        { text: 'Avoids difficult conversations', value: 1 },
        { text: 'Handles with some discomfort', value: 2 },
        { text: 'Handles conversations professionally', value: 3 },
        { text: 'Navigates with skill and empathy', value: 4 }
    ]
},
{
    category: 'Communication',
    question: 'How well do you adapt your communication style?',
    description: 'Rate your ability to adjust communication for different audiences.',
    options: [
        { text: 'Uses same style with everyone', value: 1 },
        { text: 'Occasionally adapts communication', value: 2 },
        { text: 'Adapts well to different audiences', value: 3 },
        { text: 'Highly adaptive and audience-aware', value: 4 }
    ]
},
{
    category: 'Communication',
    question: 'How do you clarify information when confused?',
    description: 'Rate your ability to ask clarifying questions.',
    options: [
        { text: 'Never seeks clarification', value: 1 },
        { text: 'Sometimes asks for clarification', value: 2 },
        { text: 'Regularly seeks clarification', value: 3 },
        { text: 'Excellent at clarifying understanding', value: 4 }
    ]
},
{
    category: 'Communication',
    question: 'How effectively do you write professional emails?',
    description: 'Rate your written communication skills.',
    options: [
        { text: 'Writes unclear or unprofessional emails', value: 1 },
        { text: 'Writes emails with some clarity', value: 2 },
        { text: 'Writes clear and professional emails', value: 3 },
        { text: 'Writes exceptionally clear and concise emails', value: 4 }
    ]
},
{
    category: 'Communication',
    question: 'How well do you present information to groups?',
    description: 'Rate your public speaking and presentation skills.',
    options: [
        { text: 'Uncomfortable presenting to groups', value: 1 },
        { text: 'Can present with some nervousness', value: 2 },
        { text: 'Presents information clearly', value: 3 },
        { text: 'Excellent public speaker and presenter', value: 4 }
    ]
},
{
    category: 'Communication',
    question: 'How do you respond to criticism from others?',
    description: 'Rate your ability to accept feedback without defensiveness.',
    options: [
        { text: 'Becomes defensive when criticized', value: 1 },
        { text: 'Accepts criticism reluctantly', value: 2 },
        { text: 'Accepts criticism and learns from it', value: 3 },
        { text: 'Openly welcomes and values criticism', value: 4 }
    ]
},
{
    category: 'Communication',
    question: 'How well do you summarize complex information?',
    description: 'Rate your ability to simplify complicated concepts.',
    options: [
        { text: 'Struggles to simplify information', value: 1 },
        { text: 'Sometimes simplifies effectively', value: 2 },
        { text: 'Simplifies complex information well', value: 3 },
        { text: 'Exceptionally skilled at simplification', value: 4 }
    ]
},
{
    category: 'Communication',
    question: 'How do you communicate with different personality types?',
    description: 'Rate your ability to connect with diverse personalities.',
    options: [
        { text: 'Struggles with different personality types', value: 1 },
        { text: 'Sometimes connects with different types', value: 2 },
        { text: 'Communicates well with various personalities', value: 3 },
        { text: 'Naturally connects with all personality types', value: 4 }
    ]
},
{
    category: 'Communication',
    question: 'How do you ensure your message is understood?',
    description: 'Rate your follow-up on communication effectiveness.',
    options: [
        { text: 'Rarely checks if message was understood', value: 1 },
        { text: 'Sometimes verifies understanding', value: 2 },
        { text: 'Usually ensures understanding', value: 3 },
        { text: 'Always confirms message understanding', value: 4 }
    ]
},
{
    category: 'Communication',
    question: 'How do you handle disagreements in meetings?',
    description: 'Rate your ability to respectfully disagree.',
    options: [
        { text: 'Avoids or escalates disagreements', value: 1 },
        { text: 'Expresses disagreement with some difficulty', value: 2 },
        { text: 'Respectfully expresses differing views', value: 3 },
        { text: 'Skillfully navigates disagreements', value: 4 }
    ]
},
{
    category: 'Communication',
    question: 'How well do you remember details in conversations?',
    description: 'Rate your attention to conversation details.',
    options: [
        { text: 'Forgets key details from conversations', value: 1 },
        { text: 'Remembers some conversation details', value: 2 },
        { text: 'Remembers most important details', value: 3 },
        { text: 'Excellent memory for conversation details', value: 4 }
    ]
},
{
    category: 'Communication',
    question: 'How do you ask for help or information?',
    description: 'Rate your ability to request support clearly.',
    options: [
        { text: 'Struggles to ask for help', value: 1 },
        { text: 'Asks for help reluctantly', value: 2 },
        { text: 'Asks for help when needed', value: 3 },
        { text: 'Confidently asks for help when necessary', value: 4 }
    ]
},
{
    category: 'Communication',
    question: 'How well do you explain technical concepts?',
    description: 'Rate your ability to make technical ideas accessible.',
    options: [
        { text: 'Cannot explain technical concepts', value: 1 },
        { text: 'Explains with limited clarity', value: 2 },
        { text: 'Explains technical concepts reasonably well', value: 3 },
        { text: 'Explains complex concepts very clearly', value: 4 }
    ]
},
{
    category: 'Communication',
    question: 'How do you handle being interrupted?',
    description: 'Rate your ability to manage interruptions gracefully.',
    options: [
        { text: 'Gets upset or irritated when interrupted', value: 1 },
        { text: 'Handles interruptions with some discomfort', value: 2 },
        { text: 'Handles interruptions professionally', value: 3 },
        { text: 'Gracefully manages interruptions', value: 4 }
    ]
},
{
    category: 'Communication',
    question: 'How effectively do you communicate deadlines and expectations?',
    description: 'Rate your clarity in setting expectations.',
    options: [
        { text: 'Unclear about deadlines and expectations', value: 1 },
        { text: 'Sometimes communicates clearly', value: 2 },
        { text: 'Usually communicates expectations clearly', value: 3 },
        { text: 'Exceptionally clear about expectations', value: 4 }
    ]
},
{
    category: 'Communication',
    question: 'How do you maintain professional tone in communications?',
    description: 'Rate your consistency in professional communication.',
    options: [
        { text: 'Often too casual or unprofessional', value: 1 },
        { text: 'Sometimes professional in tone', value: 2 },
        { text: 'Maintains professional tone consistently', value: 3 },
        { text: 'Always maintains impeccable professional tone', value: 4 }
    ]
},
{
    category: 'Communication',
    question: 'How well do you tailor your message to the situation?',
    description: 'Rate your ability to match communication style to context.',
    options: [
        { text: 'Uses the same approach regardless of situation', value: 1 },
        { text: 'Occasionally adjusts message to context', value: 2 },
        { text: 'Usually tailors message appropriately', value: 3 },
        { text: 'Always perfectly calibrates message to situation', value: 4 }
    ]
},
{
    category: 'Communication',
    question: 'How effectively do you use non-verbal communication?',
    description: 'Rate your awareness and use of body language, tone, and presence.',
    options: [
        { text: 'Unaware of non-verbal signals', value: 1 },
        { text: 'Occasionally mindful of non-verbal cues', value: 2 },
        { text: 'Uses non-verbal communication effectively', value: 3 },
        { text: 'Masters non-verbal communication with great impact', value: 4 }
    ]
},
// ─── LEADERSHIP (20 questions, indices 20–39) ─────────────────────────────
{
    category: 'Leadership',
    question: 'How do you inspire and motivate others?',
    description: 'Rate your ability to influence and energize a team.',
    options: [
        { text: 'Does not motivate others', value: 1 },
        { text: 'Motivates in limited situations', value: 2 },
        { text: 'Effectively motivates team members', value: 3 },
        { text: 'Exceptional at inspiring and motivating', value: 4 }
    ]
},
{
    category: 'Leadership',
    question: 'How do you take initiative and drive change?',
    description: 'Rate your proactivity in driving projects forward.',
    options: [
        { text: 'Rarely takes initiative', value: 1 },
        { text: 'Takes initiative occasionally', value: 2 },
        { text: 'Regularly takes initiative', value: 3 },
        { text: 'Consistently drives projects and change', value: 4 }
    ]
},
{
    category: 'Leadership',
    question: 'How do you handle team conflicts?',
    description: 'Rate your conflict resolution approach.',
    options: [
        { text: 'Avoids or escalates conflicts', value: 1 },
        { text: 'Sometimes resolves conflicts', value: 2 },
        { text: 'Resolves most conflicts effectively', value: 3 },
        { text: 'Expert at resolving conflicts constructively', value: 4 }
    ]
},
{
    category: 'Leadership',
    question: 'How do you develop and mentor others?',
    description: 'Rate your commitment to developing team members.',
    options: [
        { text: 'Does not develop others', value: 1 },
        { text: 'Provides minimal development', value: 2 },
        { text: 'Actively develops team members', value: 3 },
        { text: 'Exceptional mentor and developer', value: 4 }
    ]
},
{
    category: 'Leadership',
    question: 'How well do you set clear goals and objectives?',
    description: 'Rate your goal-setting and clarity skills.',
    options: [
        { text: 'Sets vague or unclear goals', value: 1 },
        { text: 'Sets some clear goals', value: 2 },
        { text: 'Sets clear and measurable goals', value: 3 },
        { text: 'Exceptionally skilled at goal setting', value: 4 }
    ]
},
{
    category: 'Leadership',
    question: 'How do you make decisions under pressure?',
    description: 'Rate your decision-making during crises.',
    options: [
        { text: 'Freezes or makes poor decisions under pressure', value: 1 },
        { text: 'Makes decisions reluctantly under pressure', value: 2 },
        { text: 'Makes reasonable decisions under pressure', value: 3 },
        { text: 'Makes excellent decisions under pressure', value: 4 }
    ]
},
{
    category: 'Leadership',
    question: 'How well do you delegate responsibilities?',
    description: 'Rate your ability to empower others through delegation.',
    options: [
        { text: 'Does not delegate effectively', value: 1 },
        { text: 'Delegates reluctantly or unclear', value: 2 },
        { text: 'Delegates effectively', value: 3 },
        { text: 'Exceptional at strategic delegation', value: 4 }
    ]
},
{
    category: 'Leadership',
    question: 'How do you create a positive team environment?',
    description: 'Rate your ability to foster team culture.',
    options: [
        { text: 'Creates a negative or tense environment', value: 1 },
        { text: 'Creates a somewhat positive environment', value: 2 },
        { text: 'Creates a positive team environment', value: 3 },
        { text: 'Creates an exceptionally positive culture', value: 4 }
    ]
},
{
    category: 'Leadership',
    question: 'How do you handle failure and setbacks?',
    description: 'Rate your resilience and learning from failures.',
    options: [
        { text: 'Blames others or gives up after failure', value: 1 },
        { text: 'Struggles but eventually recovers', value: 2 },
        { text: 'Learns from failures and moves forward', value: 3 },
        { text: 'Turns failures into learning opportunities', value: 4 }
    ]
},
{
    category: 'Leadership',
    question: 'How do you provide constructive feedback?',
    description: 'Rate your feedback delivery skills.',
    options: [
        { text: 'Feedback is unclear or harsh', value: 1 },
        { text: 'Feedback is sometimes constructive', value: 2 },
        { text: 'Provides constructive feedback consistently', value: 3 },
        { text: 'Delivers feedback with exceptional skill', value: 4 }
    ]
},
{
    category: 'Leadership',
    question: 'How well do you follow through on commitments?',
    description: 'Rate your reliability in following through.',
    options: [
        { text: 'Rarely follows through', value: 1 },
        { text: 'Sometimes follows through', value: 2 },
        { text: 'Usually follows through on commitments', value: 3 },
        { text: 'Always follows through reliably', value: 4 }
    ]
},
{
    category: 'Leadership',
    question: 'How do you build trust with your team?',
    description: 'Rate your ability to establish trust.',
    options: [
        { text: 'Struggles to build trust', value: 1 },
        { text: 'Builds trust slowly', value: 2 },
        { text: 'Builds trust effectively', value: 3 },
        { text: 'Builds strong trust relationships quickly', value: 4 }
    ]
},
{
    category: 'Leadership',
    question: 'How do you handle different working styles?',
    description: 'Rate your adaptability to diverse team members.',
    options: [
        { text: 'Struggles with different work styles', value: 1 },
        { text: 'Sometimes accommodates different styles', value: 2 },
        { text: 'Accommodates different working styles', value: 3 },
        { text: 'Excels at working with diverse styles', value: 4 }
    ]
},
{
    category: 'Leadership',
    question: 'How do you encourage innovation and creativity?',
    description: 'Rate your support for new ideas.',
    options: [
        { text: 'Discourages new ideas', value: 1 },
        { text: 'Tolerates new ideas reluctantly', value: 2 },
        { text: 'Encourages innovation and creativity', value: 3 },
        { text: 'Actively champions innovation', value: 4 }
    ]
},
{
    category: 'Leadership',
    question: 'How well do you communicate vision and strategy?',
    description: 'Rate your ability to articulate direction.',
    options: [
        { text: 'Vision is unclear or unstated', value: 1 },
        { text: 'Vision is somewhat communicated', value: 2 },
        { text: 'Communicates vision reasonably well', value: 3 },
        { text: 'Articulates vision with exceptional clarity', value: 4 }
    ]
},
{
    category: 'Leadership',
    question: 'How do you balance team needs with organizational needs?',
    description: 'Rate your ability to balance competing priorities.',
    options: [
        { text: 'Ignores one set of needs', value: 1 },
        { text: 'Struggles to balance both', value: 2 },
        { text: 'Balances both reasonably well', value: 3 },
        { text: 'Excellently balances all priorities', value: 4 }
    ]
},
{
    category: 'Leadership',
    question: 'How do you recognize and reward good performance?',
    description: 'Rate your appreciation for team contributions.',
    options: [
        { text: 'Rarely recognizes good work', value: 1 },
        { text: 'Sometimes recognizes contributions', value: 2 },
        { text: 'Regularly recognizes good performance', value: 3 },
        { text: 'Consistently and meaningfully recognizes excellence', value: 4 }
    ]
},
{
    category: 'Leadership',
    question: 'How do you stay informed about your team and business?',
    description: 'Rate your awareness and engagement.',
    options: [
        { text: 'Often unaware of team and business issues', value: 1 },
        { text: 'Sometimes stays informed', value: 2 },
        { text: 'Usually stays well informed', value: 3 },
        { text: 'Exceptionally aware and engaged', value: 4 }
    ]
},
{
    category: 'Leadership',
    question: 'How do you handle pressure from upper management?',
    description: 'Rate your resilience to leadership pressure.',
    options: [
        { text: 'Crumbles under pressure', value: 1 },
        { text: 'Handles pressure with difficulty', value: 2 },
        { text: 'Handles pressure reasonably well', value: 3 },
        { text: 'Thrives under pressure', value: 4 }
    ]
},
{
    category: 'Leadership',
    question: 'How well do you manage your own time and priorities?',
    description: 'Rate your personal organisation and time management.',
    options: [
        { text: 'Frequently misses deadlines or is disorganised', value: 1 },
        { text: 'Manages time with some difficulty', value: 2 },
        { text: 'Manages time and priorities effectively', value: 3 },
        { text: 'Exceptional at prioritisation and time management', value: 4 }
    ]
},
// ─── CONFIDENCE (20 questions, indices 40–59) ────────────────────────────
{
    category: 'Confidence',
    question: 'How confident are you in your abilities?',
    description: 'Rate your self-assurance in professional competencies.',
    options: [
        { text: 'Lacks confidence in own abilities', value: 1 },
        { text: 'Shows limited confidence', value: 2 },
        { text: 'Confident in most situations', value: 3 },
        { text: 'Highly confident and assured', value: 4 }
    ]
},
{
    category: 'Confidence',
    question: 'How do you handle pressure and challenges?',
    description: 'Rate your resilience under stress.',
    options: [
        { text: 'Struggles significantly under pressure', value: 1 },
        { text: 'Shows some stress tolerance', value: 2 },
        { text: 'Handles pressure well', value: 3 },
        { text: 'Thrives under pressure', value: 4 }
    ]
},
{
    category: 'Confidence',
    question: 'How do you present yourself professionally?',
    description: 'Rate your professional presence and demeanor.',
    options: [
        { text: 'Unprofessional presentation', value: 1 },
        { text: 'Somewhat professional presence', value: 2 },
        { text: 'Professional and poised', value: 3 },
        { text: 'Exceptional professional presence', value: 4 }
    ]
},
{
    category: 'Confidence',
    question: 'How willing are you to take appropriate risks?',
    description: 'Rate your willingness to try new approaches.',
    options: [
        { text: 'Overly cautious or risk-averse', value: 1 },
        { text: 'Hesitant to take risks', value: 2 },
        { text: 'Takes calculated risks', value: 3 },
        { text: 'Confidently pursues appropriate risks', value: 4 }
    ]
},
{
    category: 'Confidence',
    question: 'How do you handle mistakes you make?',
    description: 'Rate your ability to own mistakes.',
    options: [
        { text: 'Denies or blames others for mistakes', value: 1 },
        { text: 'Reluctantly acknowledges mistakes', value: 2 },
        { text: 'Owns mistakes and learns from them', value: 3 },
        { text: 'Confidently addresses and learns from mistakes', value: 4 }
    ]
},
{
    category: 'Confidence',
    question: 'How do you feel about your career progression?',
    description: 'Rate your confidence in your career trajectory.',
    options: [
        { text: 'Doubts career progression', value: 1 },
        { text: 'Uncertain about career path', value: 2 },
        { text: 'Confident in career progression', value: 3 },
        { text: 'Highly confident and ambitious about career', value: 4 }
    ]
},
{
    category: 'Confidence',
    question: 'How do you respond to unexpected situations?',
    description: 'Rate your ability to adapt quickly.',
    options: [
        { text: 'Panics or freezes in unexpected situations', value: 1 },
        { text: 'Shows some difficulty adapting', value: 2 },
        { text: 'Adapts reasonably well', value: 3 },
        { text: 'Adapts quickly and confidently', value: 4 }
    ]
},
{
    category: 'Confidence',
    question: 'How do you express your opinions in meetings?',
    description: 'Rate your willingness to share your views.',
    options: [
        { text: 'Never speaks up in meetings', value: 1 },
        { text: 'Rarely shares opinions', value: 2 },
        { text: 'Shares opinions when appropriate', value: 3 },
        { text: 'Confidently and thoughtfully shares views', value: 4 }
    ]
},
{
    category: 'Confidence',
    question: 'How do you handle rejection or criticism?',
    description: 'Rate your resilience to negative feedback.',
    options: [
        { text: 'Takes rejection very personally', value: 1 },
        { text: 'Struggles with rejection', value: 2 },
        { text: 'Handles rejection reasonably well', value: 3 },
        { text: 'Bounces back quickly from rejection', value: 4 }
    ]
},
{
    category: 'Confidence',
    question: 'How confident are you in your technical skills?',
    description: 'Rate your confidence in your expertise.',
    options: [
        { text: 'Lacks confidence in technical skills', value: 1 },
        { text: 'Has limited technical confidence', value: 2 },
        { text: 'Confident in technical abilities', value: 3 },
        { text: 'Highly confident in technical expertise', value: 4 }
    ]
},
{
    category: 'Confidence',
    question: 'How do you approach learning new skills?',
    description: 'Rate your confidence in acquiring new capabilities.',
    options: [
        { text: 'Avoids learning new skills', value: 1 },
        { text: 'Reluctant to learn new skills', value: 2 },
        { text: 'Willing to learn new skills', value: 3 },
        { text: 'Eagerly pursues new learning', value: 4 }
    ]
},
{
    category: 'Confidence',
    question: 'How do you feel about making important decisions?',
    description: 'Rate your comfort with decision-making.',
    options: [
        { text: 'Avoids making decisions', value: 1 },
        { text: 'Makes decisions with reluctance', value: 2 },
        { text: 'Makes decisions with reasonable confidence', value: 3 },
        { text: 'Confidently makes important decisions', value: 4 }
    ]
},
{
    category: 'Confidence',
    question: 'How do you handle being the center of attention?',
    description: 'Rate your comfort with visibility.',
    options: [
        { text: 'Very uncomfortable with attention', value: 1 },
        { text: 'Uncomfortable but manages', value: 2 },
        { text: 'Comfortable with attention', value: 3 },
        { text: 'Thrives with visibility and attention', value: 4 }
    ]
},
{
    category: 'Confidence',
    question: 'How do you negotiate or advocate for yourself?',
    description: 'Rate your assertiveness.',
    options: [
        { text: 'Does not advocate for self', value: 1 },
        { text: 'Rarely advocates for self', value: 2 },
        { text: 'Advocates for self when appropriate', value: 3 },
        { text: 'Confidently advocates and negotiates', value: 4 }
    ]
},
{
    category: 'Confidence',
    question: 'How do you perform in high-stakes situations?',
    description: 'Rate your composure in critical situations.',
    options: [
        { text: 'Falls apart in high-stakes situations', value: 1 },
        { text: 'Struggles in high-stakes situations', value: 2 },
        { text: 'Performs reasonably well', value: 3 },
        { text: 'Excels in high-stakes situations', value: 4 }
    ]
},
{
    category: 'Confidence',
    question: 'How do you view your past accomplishments?',
    description: 'Rate your acknowledgment of achievements.',
    options: [
        { text: 'Dismisses or minimizes accomplishments', value: 1 },
        { text: 'Acknowledges accomplishments reluctantly', value: 2 },
        { text: 'Appropriately acknowledges achievements', value: 3 },
        { text: 'Confidently recognizes accomplishments', value: 4 }
    ]
},
{
    category: 'Confidence',
    question: 'How do you handle being challenged intellectually?',
    description: 'Rate your comfort with intellectual challenge.',
    options: [
        { text: 'Avoids intellectual challenge', value: 1 },
        { text: 'Uncomfortable with challenge', value: 2 },
        { text: 'Welcomes reasonable challenge', value: 3 },
        { text: 'Thrives on intellectual challenge', value: 4 }
    ]
},
{
    category: 'Confidence',
    question: 'How confident are you in your knowledge?',
    description: 'Rate your comfort with your expertise level.',
    options: [
        { text: 'Questions knowledge constantly', value: 1 },
        { text: 'Sometimes questions knowledge', value: 2 },
        { text: 'Generally confident in knowledge', value: 3 },
        { text: 'Confidently stands by your knowledge', value: 4 }
    ]
},
{
    category: 'Confidence',
    question: 'How do you handle constructive suggestions?',
    description: 'Rate your openness to improvement suggestions.',
    options: [
        { text: 'Dismisses suggestions defensively', value: 1 },
        { text: 'Reluctantly considers suggestions', value: 2 },
        { text: 'Considers suggestions openly', value: 3 },
        { text: 'Enthusiastically welcomes suggestions', value: 4 }
    ]
},
{
    category: 'Confidence',
    question: 'How do you initiate conversations with new colleagues?',
    description: 'Rate your ease of building new professional relationships.',
    options: [
        { text: 'Avoids initiating contact with new people', value: 1 },
        { text: 'Initiates contact with difficulty', value: 2 },
        { text: 'Comfortably initiates professional conversations', value: 3 },
        { text: 'Confidently builds rapport with new people immediately', value: 4 }
    ]
},
// ─── TEAMWORK (20 questions, indices 60–79) ──────────────────────────────
{
    category: 'Teamwork',
    question: 'How well do you collaborate with others?',
    description: 'Rate your ability to work effectively with teammates.',
    options: [
        { text: 'Struggles with collaboration', value: 1 },
        { text: 'Collaborates with difficulty', value: 2 },
        { text: 'Collaborates effectively', value: 3 },
        { text: 'Exceptional team collaborator', value: 4 }
    ]
},
{
    category: 'Teamwork',
    question: 'How do you contribute to team success?',
    description: 'Rate your commitment to collective goals.',
    options: [
        { text: 'Focuses only on individual goals', value: 1 },
        { text: 'Sometimes prioritizes team goals', value: 2 },
        { text: 'Actively contributes to team success', value: 3 },
        { text: 'Deeply committed to team achievements', value: 4 }
    ]
},
{
    category: 'Teamwork',
    question: 'How do you support your team members?',
    description: 'Rate your supportiveness toward colleagues.',
    options: [
        { text: 'Does not support team members', value: 1 },
        { text: 'Provides minimal support', value: 2 },
        { text: 'Supportive of team members', value: 3 },
        { text: 'Highly supportive and encouraging', value: 4 }
    ]
},
{
    category: 'Teamwork',
    question: 'How do you handle responsibilities in a team?',
    description: 'Rate your reliability and accountability.',
    options: [
        { text: 'Unreliable or unaccountable', value: 1 },
        { text: 'Sometimes fulfills responsibilities', value: 2 },
        { text: 'Reliable and accountable', value: 3 },
        { text: 'Exceptionally dependable teammate', value: 4 }
    ]
},
{
    category: 'Teamwork',
    question: 'How do you handle sharing credit with the team?',
    description: 'Rate your generosity in attributing success.',
    options: [
        { text: 'Takes all credit personally', value: 1 },
        { text: 'Reluctantly shares credit', value: 2 },
        { text: 'Shares credit fairly', value: 3 },
        { text: 'Generously credits team members', value: 4 }
    ]
},
{
    category: 'Teamwork',
    question: 'How well do you work toward common goals?',
    description: 'Rate your focus on team objectives.',
    options: [
        { text: 'Does not work toward common goals', value: 1 },
        { text: 'Sometimes works toward goals', value: 2 },
        { text: 'Focuses on common goals', value: 3 },
        { text: 'Fully aligned with team goals', value: 4 }
    ]
},
{
    category: 'Teamwork',
    question: 'How do you contribute diverse perspectives?',
    description: 'Rate your willingness to share unique viewpoints.',
    options: [
        { text: 'Does not contribute different perspectives', value: 1 },
        { text: 'Rarely shares unique views', value: 2 },
        { text: 'Contributes different perspectives', value: 3 },
        { text: 'Actively brings diverse perspectives', value: 4 }
    ]
},
{
    category: 'Teamwork',
    question: 'How do you handle team decisions you disagree with?',
    description: 'Rate your ability to support team decisions.',
    options: [
        { text: 'Refuses to support team decisions', value: 1 },
        { text: 'Reluctantly supports decisions', value: 2 },
        { text: 'Supports team decisions', value: 3 },
        { text: 'Fully commits to team decisions', value: 4 }
    ]
},
{
    category: 'Teamwork',
    question: 'How do you handle competing interests in a team?',
    description: 'Rate your ability to balance individual and team needs.',
    options: [
        { text: 'Prioritizes self over team', value: 1 },
        { text: 'Sometimes balances interests', value: 2 },
        { text: 'Balances interests reasonably well', value: 3 },
        { text: 'Excellently balances all interests', value: 4 }
    ]
},
{
    category: 'Teamwork',
    question: 'How well do you listen to team members?',
    description: 'Rate your attentiveness to teammates.',
    options: [
        { text: 'Does not listen to team members', value: 1 },
        { text: 'Listens with limited attention', value: 2 },
        { text: 'Listens actively to team members', value: 3 },
        { text: 'Exceptionally attentive listener', value: 4 }
    ]
},
{
    category: 'Teamwork',
    question: 'How do you contribute to team meetings?',
    description: 'Rate your participation in team discussions.',
    options: [
        { text: 'Does not contribute to meetings', value: 1 },
        { text: 'Rarely participates in meetings', value: 2 },
        { text: 'Participates in team meetings', value: 3 },
        { text: 'Actively contributes to all meetings', value: 4 }
    ]
},
{
    category: 'Teamwork',
    question: 'How do you celebrate team wins?',
    description: 'Rate your enthusiasm for team success.',
    options: [
        { text: 'Does not celebrate team wins', value: 1 },
        { text: 'Minimally celebrates wins', value: 2 },
        { text: 'Celebrates team success', value: 3 },
        { text: 'Enthusiastically celebrates wins', value: 4 }
    ]
},
{
    category: 'Teamwork',
    question: 'How do you handle team conflicts affecting work?',
    description: 'Rate your involvement in resolving team conflicts.',
    options: [
        { text: 'Ignores or exacerbates conflicts', value: 1 },
        { text: 'Shows minimal involvement', value: 2 },
        { text: 'Works to resolve conflicts', value: 3 },
        { text: 'Actively mediates and resolves conflicts', value: 4 }
    ]
},
{
    category: 'Teamwork',
    question: 'How do you ensure information is shared with the team?',
    description: 'Rate your communication transparency.',
    options: [
        { text: 'Hoards information', value: 1 },
        { text: 'Shares information reluctantly', value: 2 },
        { text: 'Shares relevant information', value: 3 },
        { text: 'Proactively ensures information sharing', value: 4 }
    ]
},
{
    category: 'Teamwork',
    question: 'How do you help new team members integrate?',
    description: 'Rate your support for onboarding.',
    options: [
        { text: 'Does not help new members', value: 1 },
        { text: 'Provides minimal help', value: 2 },
        { text: 'Helps new members integrate', value: 3 },
        { text: 'Actively mentors new team members', value: 4 }
    ]
},
{
    category: 'Teamwork',
    question: 'How well do you adapt to team changes?',
    description: 'Rate your flexibility with team dynamics.',
    options: [
        { text: 'Resists team changes', value: 1 },
        { text: 'Adapts reluctantly', value: 2 },
        { text: 'Adapts to team changes', value: 3 },
        { text: 'Readily embraces team changes', value: 4 }
    ]
},
{
    category: 'Teamwork',
    question: 'How do you respond to team feedback?',
    description: 'Rate your receptiveness to team input.',
    options: [
        { text: 'Ignores or rejects team feedback', value: 1 },
        { text: 'Reluctantly considers feedback', value: 2 },
        { text: 'Considers team feedback', value: 3 },
        { text: 'Actively seeks and implements feedback', value: 4 }
    ]
},
{
    category: 'Teamwork',
    question: 'How do you maintain consistency in team performance?',
    description: 'Rate your contribution to reliable team output.',
    options: [
        { text: 'Performance is inconsistent', value: 1 },
        { text: 'Sometimes maintains consistency', value: 2 },
        { text: 'Maintains consistent performance', value: 3 },
        { text: 'Exceptional consistency in performance', value: 4 }
    ]
},
{
    category: 'Teamwork',
    question: 'How do you manage workload when a teammate needs help?',
    description: 'Rate your willingness to step up for the team.',
    options: [
        { text: 'Refuses to take on extra work for others', value: 1 },
        { text: 'Helps only when required', value: 2 },
        { text: 'Willingly assists teammates when needed', value: 3 },
        { text: 'Proactively steps up to keep the team moving', value: 4 }
    ]
},
{
    category: 'Teamwork',
    question: 'How do you handle a team member who is underperforming?',
    description: 'Rate your approach to addressing performance gaps in the team.',
    options: [
        { text: 'Ignores the issue or complains to others', value: 1 },
        { text: 'Addresses it reluctantly or indirectly', value: 2 },
        { text: 'Addresses the issue constructively', value: 3 },
        { text: 'Proactively supports and coaches the individual', value: 4 }
    ]
}
];

// ─── Safety check (fails loud in dev if count is wrong) ───────────────────
if (assessmentQuestions.length !== TOTAL_QUESTIONS) {
    console.error(
        `Question count mismatch: expected ${TOTAL_QUESTIONS}, got ${assessmentQuestions.length}`
    );
}

const domCache = {
    welcome: null, assessment: null, results: null, sections: null,
    questionTitle: null, questionText: null, optionsContainer: null,
    progressFill: null, progressCurrent: null, progressTotal: null,
    buttonPrev: null, buttonNext: null, buttonRestart: null, buttonPdf: null,
    employeeNameInput: null, employeeRoleInput: null, formEmployee: null,
    toast: null, scoresContainer: null, overallPercentage: null,
    employeeNameDisplay: null
};

function cacheDOM() {
    domCache.welcome            = document.getElementById('ssa-welcome');
    domCache.assessment         = document.getElementById('ssa-assessment');
    domCache.results            = document.getElementById('ssa-results');
    domCache.sections           = document.querySelectorAll('.ssa-section');
    domCache.questionTitle      = document.getElementById('ssa-question-title');
    domCache.questionText       = document.getElementById('ssa-question-text');
    domCache.optionsContainer   = document.getElementById('ssa-options');
    domCache.progressFill       = document.getElementById('ssa-progress-fill');
    domCache.progressCurrent    = document.getElementById('ssa-progress-current');
    domCache.progressTotal      = document.getElementById('ssa-progress-total');
    domCache.buttonPrev         = document.getElementById('ssa-btn-prev');
    domCache.buttonNext         = document.getElementById('ssa-btn-next');
    domCache.buttonRestart      = document.getElementById('ssa-btn-restart');
    domCache.buttonPdf          = document.getElementById('ssa-btn-pdf');
    domCache.employeeNameInput  = document.getElementById('employee-name');
    domCache.employeeRoleInput  = document.getElementById('employee-role');
    domCache.formEmployee       = document.getElementById('ssa-form-employee');
    domCache.toast              = document.getElementById('ssa-toast');
    domCache.scoresContainer    = document.getElementById('ssa-scores-container');
    domCache.overallPercentage  = document.getElementById('ssa-overall-percentage');
    domCache.employeeNameDisplay = document.getElementById('ssa-employee-name-display');
    domCache.progressTotal.textContent = TOTAL_QUESTIONS;
}

function bindEvents() {
    domCache.formEmployee.addEventListener('submit', handleEmployeeSubmit);
    domCache.buttonPrev.addEventListener('click', handlePreviousQuestion);
    domCache.buttonNext.addEventListener('click', handleNextQuestion);
    domCache.buttonRestart.addEventListener('click', handleRestart);
    domCache.buttonPdf.addEventListener('click', handlePDFDownload);
    // Delegate radio changes from the document so re-rendered options are always captured
    document.addEventListener('change', function (e) {
        if (e.target.name === 'question-option') {
            handleOptionChange(e);
        }
    });
}

function validateEmployeeData(name, role) {
    const errorName = document.getElementById('error-name');
    const errorRole = document.getElementById('error-role');
    let isValid = true;

    errorName.textContent = '';
    errorRole.textContent = '';
    domCache.employeeNameInput.classList.remove('error');
    domCache.employeeRoleInput.classList.remove('error');

    if (!name || name.trim().length === 0) {
        errorName.textContent = 'Employee name is required.';
        domCache.employeeNameInput.classList.add('error');
        isValid = false;
    } else if (name.trim().length < 2) {
        errorName.textContent = 'Name must be at least 2 characters.';
        domCache.employeeNameInput.classList.add('error');
        isValid = false;
    }

    if (!role || role.trim().length === 0) {
        errorRole.textContent = 'Role is required.';
        domCache.employeeRoleInput.classList.add('error');
        isValid = false;
    } else if (role.trim().length < 2) {
        errorRole.textContent = 'Role must be at least 2 characters.';
        domCache.employeeRoleInput.classList.add('error');
        isValid = false;
    }

    return isValid;
}

function handleEmployeeSubmit(e) {
    e.preventDefault();
    const name = domCache.employeeNameInput.value.trim();
    const role = domCache.employeeRoleInput.value.trim();

    if (!validateEmployeeData(name, role)) {
        showToast('Please correct the errors above.', 'error');
        return;
    }

    currentState.employeeData        = { name, role };
    currentState.answers             = new Array(TOTAL_QUESTIONS).fill(null);
    currentState.currentQuestion     = 0;
    currentState.assessmentInProgress = true;

    showSection('assessment');
    renderQuestion();
    showToast('Assessment started. Please answer all questions.', 'info');
}

function handlePreviousQuestion() {
    if (currentState.currentQuestion > 0) {
        currentState.currentQuestion--;
        renderQuestion();
    }
}

function handleNextQuestion() {
    if (currentState.answers[currentState.currentQuestion] === null) {
        showToast('Please select an answer before continuing.', 'warning');
        return;
    }
    if (currentState.currentQuestion < TOTAL_QUESTIONS - 1) {
        currentState.currentQuestion++;
        renderQuestion();
    } else {
        completeAssessment();
    }
}

function handleOptionChange(e) {
    const value = parseInt(e.target.value, 10);
    currentState.answers[currentState.currentQuestion] = value;
    updateOptionUI();
}

function handleRestart() {
    currentState = { employeeData: null, currentQuestion: 0, answers: [], assessmentInProgress: false };
    domCache.formEmployee.reset();
    showSection('welcome');
    clearInputErrors();
    showToast('Assessment reset. Start a new assessment.', 'info');
}

function handlePDFDownload() {
    try {
        domCache.buttonPdf.disabled = true;
        domCache.buttonPdf.textContent = 'Generating PDF...';

        const scores  = calculateScores();
        const overall = calculateOverallScore(scores);
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();
        let y = 15;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(26, 26, 26);
        doc.text('Soft Skills Assessment Report', pageWidth / 2, y, { align: 'center' });
        y += 12;

        doc.setDrawColor(255, 198, 47);
        doc.setLineWidth(0.5);
        doc.line(20, y, pageWidth - 20, y);
        y += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);
        doc.text(`Employee: ${currentState.employeeData.name}`, 20, y); y += 6;
        doc.text(`Role: ${currentState.employeeData.role}`, 20, y); y += 6;
        doc.text(`Assessment Date: ${new Date().toLocaleDateString()}`, 20, y); y += 10;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(26, 26, 26);
        doc.text('Category Scores', 20, y); y += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(50, 50, 50);
        Object.entries(scores).forEach(([cat, score]) => {
            doc.text(`• ${cat}: ${score}%`, 25, y); y += 6;
        });

        y += 5;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(26, 26, 26);
        doc.text('Overall Performance', 20, y); y += 8;

        doc.setFontSize(32);
        doc.setTextColor(255, 198, 47);
        doc.text(`${Math.round(overall)}%`, 20, y); y += 15;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        const msg = overall >= 75
            ? 'Excellent soft skills proficiency. Strong candidate for leadership roles.'
            : overall >= 60
            ? 'Good soft skills. Recommended for continued development in key areas.'
            : 'Soft skills require improvement. Consider targeted training programs.';
        doc.text(msg, 20, y, { maxWidth: pageWidth - 40 }); y += 10;

        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.3);
        doc.line(20, y, pageWidth - 20, y); y += 8;

        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text('This assessment measures four critical soft skill areas: Communication, Leadership, Confidence, and Teamwork.', 20, y, { maxWidth: pageWidth - 40 }); y += 5;
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, y);

        const filename = `Soft_Skills_Assessment_${currentState.employeeData.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);
        showToast('PDF downloaded successfully.', 'success');
    } catch (err) {
        showToast('Failed to generate PDF. Please try again.', 'error');
    } finally {
        domCache.buttonPdf.disabled = false;
        domCache.buttonPdf.textContent = 'Export Results';
    }
}

function renderQuestion() {
    const question = assessmentQuestions[currentState.currentQuestion];
    domCache.questionTitle.textContent = question.question;
    domCache.questionText.textContent  = question.description;

    domCache.optionsContainer.innerHTML = '';
    question.options.forEach(option => {
        const isSelected = currentState.answers[currentState.currentQuestion] === option.value;
        domCache.optionsContainer.appendChild(createOptionElement(option, isSelected));
    });

    updateProgressBar();
    updateNavigationButtons();
}

function createOptionElement(option, isSelected) {
    const div   = document.createElement('div');
    div.className = `ssa-option${isSelected ? ' ssa-option--selected' : ''}`;

    const input = document.createElement('input');
    input.type    = 'radio';
    input.id      = `option-${currentState.currentQuestion}-${option.value}`;
    input.name    = 'question-option';
    input.value   = option.value;
    input.checked = isSelected;
    input.className = 'ssa-option__input';

    const label = document.createElement('label');
    label.htmlFor   = input.id;
    label.className = 'ssa-option__label';

    const span  = document.createElement('span');
    span.className  = 'ssa-option__text';
    span.textContent = option.text;

    label.appendChild(span);
    div.appendChild(input);
    div.appendChild(label);
    return div;
}

function updateOptionUI() {
    domCache.optionsContainer.querySelectorAll('.ssa-option').forEach(el => {
        const input = el.querySelector('input');
        el.classList.toggle('ssa-option--selected', !!(input && input.checked));
    });
}

function updateProgressBar() {
    const pct = ((currentState.currentQuestion + 1) / TOTAL_QUESTIONS) * 100;
    domCache.progressFill.style.width    = `${pct}%`;
    domCache.progressCurrent.textContent = currentState.currentQuestion + 1;
}

function updateNavigationButtons() {
    domCache.buttonPrev.disabled    = currentState.currentQuestion === 0;
    const isLast                    = currentState.currentQuestion === TOTAL_QUESTIONS - 1;
    domCache.buttonNext.textContent = isLast ? 'Complete' : 'Next';
}

function completeAssessment() {
    currentState.assessmentInProgress = false;
    saveAssessment();
    renderResults();
    showSection('results');
    showToast('Assessment completed successfully!', 'success');
}

function renderResults() {
    const scores  = calculateScores();
    const overall = calculateOverallScore(scores);

    domCache.employeeNameDisplay.textContent = `${currentState.employeeData.name} - ${currentState.employeeData.role}`;
    domCache.scoresContainer.innerHTML = '';
    Object.entries(scores).forEach(([cat, score]) => {
        domCache.scoresContainer.appendChild(createScoreCard(cat, score));
    });
    domCache.overallPercentage.textContent = Math.round(overall);
}

function createScoreCard(category, score) {
    const card  = document.createElement('div');
    card.className = 'ssa-score-card';

    const title = document.createElement('div');
    title.className   = 'ssa-score-card__title';
    title.textContent = category;

    const value = document.createElement('div');
    value.className   = 'ssa-score-card__value';
    value.textContent = score;

    const suffix = document.createElement('span');
    suffix.className   = 'ssa-score-card__suffix';
    suffix.textContent = '%';

    value.appendChild(suffix);
    card.appendChild(title);
    card.appendChild(value);
    return card;
}

function calculateScores() {
    const scores = { Communication: 0, Leadership: 0, Confidence: 0, Teamwork: 0 };
    const counts = { Communication: 0, Leadership: 0, Confidence: 0, Teamwork: 0 };

    assessmentQuestions.forEach((q, i) => {
        const ans = currentState.answers[i];
        if (ans !== null) { scores[q.category] += ans; counts[q.category]++; }
    });

    Object.keys(scores).forEach(cat => {
        if (counts[cat] > 0) {
            scores[cat] = Math.round((scores[cat] / counts[cat] / 4) * 100);
        }
    });
    return scores;
}

function calculateOverallScore(scores) {
    const vals = Object.values(scores);
    return vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0;
}

function showSection(id) {
    domCache.sections.forEach(s => s.classList.remove('ssa-section--active'));
    const el = document.getElementById(`ssa-${id}`);
    if (el) el.classList.add('ssa-section--active');
}

function showToast(message, type = 'info') {
    if (activeToast !== null) { clearTimeout(activeToast); domCache.toast.classList.remove('show'); }
    domCache.toast.textContent = message;
    domCache.toast.className   = `ssa-toast ${type}`;
    domCache.toast.classList.add('show');
    activeToast = setTimeout(() => { domCache.toast.classList.remove('show'); activeToast = null; }, 4000);
}

function clearInputErrors() {
    document.getElementById('error-name').textContent = '';
    document.getElementById('error-role').textContent = '';
    domCache.employeeNameInput.classList.remove('error');
    domCache.employeeRoleInput.classList.remove('error');
}

function saveAssessment() {
    try {
        let data = { version: 1, data: [], settings: {} };
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const p = JSON.parse(stored);
                if (p && 'version' in p && 'data' in p) data = p;
            } catch (_) { /* use default */ }
        }
        const scores = calculateScores();
        data.data.push({
            id: Date.now(),
            employee:  currentState.employeeData,
            timestamp: new Date().toISOString(),
            scores,
            overall:   calculateOverallScore(scores),
            answers:   currentState.answers
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (_) {
        showToast('Could not save assessment to local storage.', 'warning');
    }
}

function initializeApp() {
    cacheDOM();
    bindEvents();
    showSection('welcome');
}

document.addEventListener('DOMContentLoaded', initializeApp);