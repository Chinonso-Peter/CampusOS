import { Router, type IRouter } from "express";
import {
  CreateAssignmentBody,
  CreateAssignmentResponse,
  CreateFinanceEventBody,
  CreateFinanceEventResponse,
  CreateMoodCheckInBody,
  CreateMoodCheckInResponse,
  CreateScholarshipBody,
  CreateScholarshipResponse,
  GetAssignmentsResponse,
  GetDashboardResponse,
  GetFinanceEventsResponse,
  GetMoodCheckInsResponse,
  GetSignalsResponse,
  GetSleepLogsResponse,
  GetWorkHoursResponse,
  GetScholarshipsResponse,
  GetStressImpactResponse,
  GetWorkloadResponse,
  GetConflictsResponse,
  GetStudyPlanResponse,
  GetTimetableResponse,
  SendChatMessageBody,
  SendChatMessageResponse,
  UpdateAssignmentBody,
  UpdateFinanceEventBody,
  UpdateFinanceEventResponse,
  UpdateScholarshipBody,
  UpdateScholarshipResponse,
  UpdateTimetableBody,
  UpdateTimetableResponse,
  type User,
} from "@workspace/api-zod";
import { resolveSession } from "../lib/auth";

const router: IRouter = Router();

const DEMO_USER: User = {
  id: 1,
  name: "Amara Okafor",
  email: "amara@campus.test",
  school: "University of Lagos",
  program: "Computer Science",
  year: "300 level",
};

function currentUser(req: import("express").Request): User {
  return resolveSession(req.cookies?.["campusos_session"]) ?? DEMO_USER;
}

type Assignment = {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  status: "pending" | "late" | "submitted";
  priority: "low" | "medium" | "high";
};

type MoodCheckIn = {
  id: number;
  date: string;
  moodScore: number;
  note: string | null;
};

type FinanceEvent = {
  id: number;
  type: "deadline" | "expense" | "income";
  label: string;
  date: string;
  amount: number | null;
  category: string;
  done: boolean;
};

type WorkHours = { id: number; week: string; hoursWorked: number };
type SleepLog = { id: number; date: string; hoursSlept: number };

type Signal = {
  id: number;
  category: "mind" | "money" | "grind";
  title: string;
  description: string;
  action: string;
  severity: "watch" | "attention" | "urgent";
  createdAt: string;
};

type ChatTurn = { role: "user" | "bot"; text: string };

type TimetableBlock = {
  id: number;
  day: string;
  startHour: number;
  endHour: number;
  activity: string;
  energyFit: "high" | "medium" | "low";
};

type ScholarshipItem = {
  id: number;
  name: string;
  provider: string;
  deadline: string;
  amount: number;
  category: string;
  eligible: boolean;
  matchScore: number;
  matchReason: string;
  applied: boolean;
  userAdded: boolean;
};

type UserData = {
  moodCheckIns: MoodCheckIn[];
  assignments: Assignment[];
  financeEvents: FinanceEvent[];
  workHours: WorkHours[];
  sleepLogs: SleepLog[];
  chatHistory: ChatTurn[];
  timetable: TimetableBlock[];
  scholarships: ScholarshipItem[];
  nextId: number;
};

const today = () => new Date().toISOString().slice(0, 10);
const daysAgo = (n: number) => {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date.toISOString().slice(0, 10);
};

function freshUserData(): UserData {
  return {
    moodCheckIns: [
      { id: 1, date: today(), moodScore: 2, note: "A lot on my mind" },
      { id: 2, date: daysAgo(1), moodScore: 2, note: null },
      { id: 3, date: daysAgo(2), moodScore: 3, note: "Tired but okay" },
      { id: 4, date: daysAgo(3), moodScore: 3, note: null },
      { id: 5, date: daysAgo(4), moodScore: 4, note: "Good study session" },
      { id: 6, date: daysAgo(5), moodScore: 4, note: null },
      { id: 7, date: daysAgo(6), moodScore: 3, note: null },
    ],
    assignments: [
      { id: 1, title: "Distributed Systems report", course: "CSC 405", dueDate: daysAgo(-2), status: "pending", priority: "high" },
      { id: 2, title: "Statistical methods problem set", course: "STA 302", dueDate: daysAgo(-3), status: "pending", priority: "medium" },
      { id: 3, title: "UX research critique", course: "CIT 304", dueDate: daysAgo(3), status: "late", priority: "high" },
      { id: 4, title: "Database normalization quiz", course: "CSC 308", dueDate: daysAgo(-4), status: "pending", priority: "low" },
      { id: 5, title: "Operating systems lab", course: "CSC 402", dueDate: daysAgo(7), status: "late", priority: "high" },
      { id: 6, title: "Algorithms take-home", course: "CSC 312", dueDate: daysAgo(5), status: "late", priority: "high" },
    ],
    financeEvents: [
      { id: 1, type: "deadline", label: "FAFSA renewal", date: daysAgo(-9), amount: null, category: "Financial aid", done: false },
      { id: 2, type: "deadline", label: "Faculty scholarship application", date: daysAgo(-14), amount: null, category: "Scholarships", done: false },
      { id: 3, type: "expense", label: "Rent + utilities", date: daysAgo(12), amount: 82000, category: "Housing", done: false },
      { id: 4, type: "expense", label: "Transport", date: daysAgo(9), amount: 12000, category: "Daily life", done: false },
      { id: 5, type: "income", label: "Campus job", date: daysAgo(10), amount: 145000, category: "Income", done: false },
    ],
    workHours: [
      { id: 1, week: "Sep 15", hoursWorked: 28 },
      { id: 2, week: "Sep 8", hoursWorked: 26 },
      { id: 3, week: "Sep 1", hoursWorked: 24 },
      { id: 4, week: "Aug 25", hoursWorked: 21 },
    ],
    sleepLogs: [
      { id: 1, date: today(), hoursSlept: 5.1 },
      { id: 2, date: daysAgo(1), hoursSlept: 5.4 },
      { id: 3, date: daysAgo(2), hoursSlept: 5.8 },
      { id: 4, date: daysAgo(3), hoursSlept: 6.1 },
      { id: 5, date: daysAgo(4), hoursSlept: 5.2 },
    ],
    chatHistory: [],
    timetable: [
      { id: 1, day: "Monday", startHour: 9, endHour: 11, activity: "CSC 405 – Distributed Systems", energyFit: "high" },
      { id: 2, day: "Monday", startHour: 14, endHour: 16, activity: "STA 302 – Statistical Methods", energyFit: "medium" },
      { id: 3, day: "Tuesday", startHour: 10, endHour: 12, activity: "CIT 304 – UX Research", energyFit: "high" },
      { id: 4, day: "Wednesday", startHour: 9, endHour: 11, activity: "CSC 402 – Operating Systems", energyFit: "high" },
      { id: 5, day: "Wednesday", startHour: 13, endHour: 15, activity: "CSC 312 – Algorithms", energyFit: "medium" },
      { id: 6, day: "Thursday", startHour: 10, endHour: 12, activity: "CSC 308 – Database Systems", energyFit: "high" },
      { id: 7, day: "Friday", startHour: 10, endHour: 12, activity: "Deep Work – Assignment Block", energyFit: "medium" },
      { id: 8, day: "Friday", startHour: 14, endHour: 16, activity: "Light Review & Catch-up", energyFit: "low" },
    ],
    scholarships: [],
    nextId: 20,
  };
}

const stores = new Map<number, UserData>();

function getUserData(user: User): UserData {
  let data = stores.get(user.id);
  if (!data) {
    data = freshUserData();
    stores.set(user.id, data);
  }
  return data;
}

function buildSignals(data: UserData): Signal[] {
  const latest = data.moodCheckIns.slice(0, 3);
  const moodDeclining = latest.length >= 3 && latest[0].moodScore < latest[2].moodScore;
  const lateCount = data.assignments.filter((item) => item.status === "late").length;
  const averageSleep =
    data.sleepLogs.reduce((sum, item) => sum + item.hoursSlept, 0) / Math.max(data.sleepLogs.length, 1);
  const weeklyHours = data.workHours[0]?.hoursWorked ?? 0;
  const fafsa = data.financeEvents.find((item) => item.label.toLowerCase().includes("fafsa"));

  const signals: Signal[] = [];
  if (lateCount >= 3 && moodDeclining) {
    signals.push({
      id: 1,
      category: "grind",
      title: "Your workload is starting to compound",
      description: `${lateCount} late submissions line up with a declining mood trend this week.`,
      action: "Rebalance this week",
      severity: "urgent",
      createdAt: "Today",
    });
  }
  if (fafsa && latest[0]?.moodScore <= 2) {
    signals.push({
      id: 2,
      category: "money",
      title: "Money stress may be affecting your focus",
      description: "Your FAFSA renewal is due soon, right as your check-ins have dipped.",
      action: "See aid support",
      severity: "attention",
      createdAt: "Today",
    });
  }
  if (weeklyHours >= 25 && averageSleep < 6) {
    signals.push({
      id: 3,
      category: "mind",
      title: "You may be running on empty",
      description: `${weeklyHours} work hours and ${averageSleep.toFixed(1)} hours of sleep average is a burnout pattern.`,
      action: "Protect your sleep",
      severity: "attention",
      createdAt: "Yesterday",
    });
  }
  return signals;
}

function greetingFor(user: User): string {
  const hour = new Date().getHours();
  const part = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const first = user.name.split(" ")[0] ?? user.name;
  return `${part}, ${first}.`;
}

function dashboardPayload(user: User) {
  const data = getUserData(user);
  const signals = buildSignals(data);
  const averageMood =
    data.moodCheckIns.slice(0, 7).reduce((sum, item) => sum + item.moodScore, 0) /
    Math.max(data.moodCheckIns.length, 1);
  const income = data.financeEvents
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + (item.amount ?? 0), 0);
  const expenses = data.financeEvents
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + (item.amount ?? 0), 0);
  return GetDashboardResponse.parse({
    user,
    greeting: greetingFor(user),
    patternInsight: "You're 3× more likely to crash after midterms when a money worry lands in the same week.",
    pillars: [
      { label: "Mind", value: `${averageMood.toFixed(1)} / 5`, detail: "Your mood is asking for a little more room today.", tone: "mind" },
      { label: "Money", value: `₦${Math.round(income - expenses).toLocaleString()}`, detail: "Available after this month's tracked expenses.", tone: "money" },
      { label: "Grind", value: `${data.assignments.filter((item) => item.status === "pending").length} due`, detail: "One high-priority assignment is due this week.", tone: "grind" },
    ],
    assignments: data.assignments.slice(0, 4),
    signals,
    mood: data.moodCheckIns,
  });
}

router.get("/dashboard", (req, res) => res.json(dashboardPayload(currentUser(req))));
router.get("/signals", (req, res) => res.json(GetSignalsResponse.parse(buildSignals(getUserData(currentUser(req))))));
router.get("/mood-checkins", (req, res) => res.json(GetMoodCheckInsResponse.parse(getUserData(currentUser(req)).moodCheckIns)));
router.get("/assignments", (req, res) => res.json(GetAssignmentsResponse.parse(getUserData(currentUser(req)).assignments)));
router.get("/finance-events", (req, res) => res.json(GetFinanceEventsResponse.parse(getUserData(currentUser(req)).financeEvents)));
router.get("/work-hours", (req, res) => res.json(GetWorkHoursResponse.parse(getUserData(currentUser(req)).workHours)));
router.get("/sleep-logs", (req, res) => res.json(GetSleepLogsResponse.parse(getUserData(currentUser(req)).sleepLogs)));

router.post("/mood-checkins", (req, res) => {
  const user = currentUser(req);
  const data = getUserData(user);
  const input = CreateMoodCheckInBody.parse(req.body);
  const item = { id: data.nextId++, date: today(), moodScore: input.moodScore, note: input.note ?? null };
  data.moodCheckIns = [item, ...data.moodCheckIns];
  res.status(201).json(CreateMoodCheckInResponse.parse(item));
});

router.post("/assignments", (req, res) => {
  const user = currentUser(req);
  const data = getUserData(user);
  const input = CreateAssignmentBody.parse(req.body);
  const item: Assignment = { id: data.nextId++, title: input.title, course: input.course, dueDate: input.dueDate, status: "pending", priority: input.priority ?? "medium" };
  data.assignments = [item, ...data.assignments];
  res.status(201).json(CreateAssignmentResponse.parse(item));
});

router.patch("/assignments/:id", (req, res) => {
  const user = currentUser(req);
  const data = getUserData(user);
  const id = Number(req.params.id);
  const assignment = data.assignments.find((item) => item.id === id);
  if (!assignment) {
    res.status(404).json({ error: "Assignment not found." });
    return;
  }
  const { status } = UpdateAssignmentBody.parse(req.body);
  assignment.status = status ?? assignment.status;
  res.json(GetAssignmentsResponse.parse([assignment])[0] ?? assignment);
});

router.post("/finance-events", (req, res) => {
  const user = currentUser(req);
  const data = getUserData(user);
  const input = CreateFinanceEventBody.parse(req.body);
  const item: FinanceEvent = { id: data.nextId++, type: input.type, label: input.label, date: input.date, amount: input.amount ?? null, category: input.category, done: false };
  data.financeEvents = [item, ...data.financeEvents];
  res.status(201).json(CreateFinanceEventResponse.parse(item));
});

router.patch("/finance-events/:id", (req, res) => {
  const user = currentUser(req);
  const data = getUserData(user);
  const id = Number(req.params.id);
  const event = data.financeEvents.find((e) => e.id === id);
  if (!event) {
    res.status(404).json({ error: "Finance event not found." });
    return;
  }
  const { done } = UpdateFinanceEventBody.parse(req.body);
  event.done = done;
  res.json(UpdateFinanceEventResponse.parse(event));
});

// ---------------------------------------------------------------------------
// Supportive chat: keyword intent detection + context-aware replies
// ---------------------------------------------------------------------------

const CRISIS_PHRASES = [
  "suicide",
  "kill myself",
  "self-harm",
  "end my life",
  "end it all",
  "end this life",
  "hurt myself",
  "don't want to be here",
  "don't want to live",
  "don't want to wake up",
  "better off dead",
  "want to disappear",
  "want to die",
  "want out",
  "cant go on",
  "can't go on",
  "can't take it anymore",
  "cant take it anymore",
  "give up on life",
  "no reason to live",
  "no point in living",
  "nobody would care if i died",
  "world better off without me",
  "hopeless",
  "no hope",
  "hate myself",
  "worthless",
  "nobody cares about me",
  "i'm done with everything",
  "im done with everything",
  "over everything",
  "slit my wrists",
  "overdose",
  "hang myself",
];

const INTENTS: Array<{ id: string; keywords: string[]; openers: string[]; bodies: string[]; clossers: string[] }> = [
  {
    id: "money",
    keywords: ["money", "broke", "rent", "fee", "debt", "fafsa", "scholarship", "loan", "budget", "afford", "cash", "bills", "school fees", "tuition", "financial"],
    openers: [],
    bodies: [],
    clossers: [],
  },
  {
    id: "workload",
    keywords: ["assignment", "deadline", "overwhelmed", "overwhelm", "workload", "procrastinat", "behind", "exam", "test", "quiz", "project", "submission", "study", "cram", "too much", "stressed"],
    openers: [],
    bodies: [],
    clossers: [],
  },
  {
    id: "sleep",
    keywords: ["sleep", "slept", "tired", "exhausted", "insomnia", "night", "awake", "fatigue", "rest", "drowsy", "can't focus", "cant focus", "no energy"],
    openers: [],
    bodies: [],
    clossers: [],
  },
  {
    id: "lonely",
    keywords: ["alone", "lonely", "isolated", "no friend", "no friends", "friends", "miss home", "homesick", "no one", "left out", "nobody", "don't belong", "cant talk", "no one talks"],
    openers: [],
    bodies: [],
    clossers: [],
  },
  {
    id: "future",
    keywords: ["future", "what next", "career", "after graduation", "uncertain", "lost", "scared", "gpa", "grades dropped", "grades dropping", "what am i doing"],
    openers: [],
    bodies: [],
    clossers: [],
  },
  {
    id: "gratitude",
    keywords: ["thank", "thanks", "appreciate", "helpful", "great", "amazing", "you helped"],
    openers: [],
    bodies: [],
    clossers: [],
  },
];

type IntentId = "money" | "workload" | "sleep" | "lonely" | "future" | "gratitude" | "crisis" | "general";

function detectIntent(message: string): IntentId {
  const text = message.toLowerCase();
  if (CRISIS_PHRASES.some((phrase) => text.includes(phrase))) return "crisis";

  const counts = INTENTS.map((intent) => ({
    id: intent.id as IntentId,
    score: intent.keywords.reduce((sum, keyword) => (text.includes(keyword) ? sum + 1 : sum), 0),
  }));
  const best = counts.sort((a, b) => b.score - a.score)[0];
  if (best && best.score > 0) return best.id;

  const greeting = /^(hi|hello|hey|yo|sup|good\s*(morning|afternoon|evening)|how are you|what'?s up)\b/i.test(text);
  if (greeting) return "general";
  return "general";
}

function moodTrendPhrase(data: UserData): string | null {
  const recent = data.moodCheckIns.slice(0, 5);
  if (recent.length < 2) return null;
  const first = recent[recent.length - 1].moodScore;
  const last = recent[0].moodScore;
  if (last <= 2) return "I can see your recent check-ins have been running low.";
  if (last > first) return "I notice your check-ins have been picking up a little.";
  if (last < first) return "Your recent check-ins have dipped a bit.";
  return null;
}

function contextLines(data: UserData): string[] {
  const lines: string[] = [];
  const late = data.assignments.filter((item) => item.status === "late").length;
  const upcoming = data.assignments.filter((item) => item.status === "pending").length;
  if (late > 0) lines.push(`${late} assignment${late === 1 ? " is" : "s are"} sitting past due`);
  else if (upcoming > 0) lines.push(`you have ${upcoming} open assignment${upcoming === 1 ? "" : "s"} coming up`);
  const avgSleep = data.sleepLogs.length
    ? data.sleepLogs.reduce((sum, item) => sum + item.hoursSlept, 0) / data.sleepLogs.length
    : 0;
  const weekly = data.workHours[0]?.hoursWorked ?? 0;
  if (avgSleep > 0 && avgSleep < 6) lines.push(`you've been averaging ${avgSleep.toFixed(1)} hours of sleep`);
  if (weekly >= 20) lines.push(`you've logged ${weekly} study hours this week`);
  const mood = moodTrendPhrase(data);
  if (mood) lines.push(mood.toLowerCase());
  return lines.slice(0, 2);
}

function politeSuggestions(intent: IntentId): string[] {
  switch (intent) {
    case "money":
      return ["Help me find scholarship deadlines", "How do I budget better?", "What counts as financial stress?"];
    case "workload":
      return ["Help me plan this week", "What should I drop?", "How do I stop procrastinating?"];
    case "sleep":
      return ["Give me a wind-down routine", "How much sleep do I need?", "Help me protect my mornings"];
    case "lonely":
      return ["How do I make friends?", "Ways to feel less isolated", "What counts as homesick?"];
    case "future":
      return ["Tell me about support resources", "How do I handle uncertainty?", "What are my options after graduation?"];
    default:
      return ["I'm overwhelmed", "A money worry is stressing me", "I'm not sleeping enough"];
  }
}

function buildReply(message: string, intent: IntentId, data: UserData): { text: string; suggestions: string[] } {
  const context = contextLines(data);
  const contextPhrase = context.length ? ` From what I can see: ${context.join(", ")}.` : "";
  const first = message.trim();

  switch (intent) {
    case "crisis":
      return {
        text: "I'm really glad you said something. You deserve immediate support from a real person. Please contact campus counseling now or go to the nearest emergency service. If you may act soon, call your local emergency number.",
        suggestions: ["I need to talk to someone", "Show me crisis resources"],
      };
    case "money":
      return {
        text: `It sounds like money is taking up real headspace at the moment, and that's a heavy thing to carry alongside everything else.${contextPhrase} Let's make it concrete: pick the single next deadline you can act on this week, and treat everything else as background noise until then. You don't have to solve it all today.`,
        suggestions: politeSuggestions("money"),
      };
    case "workload":
      return {
        text: `That's a lot of plates spinning at once.${contextPhrase} The goal isn't to magically finish everything tonight — it's to choose one small next action and let that be enough. What's one assignment you could make meaningful progress on in the next 20 minutes?`,
        suggestions: politeSuggestions("workload"),
      };
    case "sleep":
      return {
        text: `Running low on sleep makes everything else feel heavier, including things that used to be easy.${contextPhrase} If you can protect even one wind-down hour tonight — screens off, room calm, no assignments — tomorrow starts on a better footing than today did.`,
        suggestions: politeSuggestions("sleep"),
      };
    case "lonely":
      return {
        text: `Feeling alone on campus is more common than it looks from the outside.${contextPhrase} You don't have to become someone's closest friend this week — a low-stakes hello in one class, one club meeting, even a study-group invite, is enough to start reconnecting you to people.`,
        suggestions: politeSuggestions("lonely"),
      };
    case "future":
      return {
        text: `Uncertainty about what comes next can feel like a weight even when there's no urgent reason for it.${contextPhrase} The kinder framing: you don't need the whole map today — just the next step. Is there one person (an advisor, a tutor, a senior) you could talk to about your options this week?`,
        suggestions: politeSuggestions("future"),
      };
    case "gratitude":
      return {
        text: "Of course. I'm here whenever you want to untangle something — the messy version is welcome. What's taking up the most space today?",
        suggestions: politeSuggestions("general"),
      };
    case "general":
    default:
      return {
        text: `That sounds like a lot to carry at once.${contextPhrase} Let's make the next step smaller: choose one thing you can finish in the next 20 minutes, then give yourself a real break. I'm here to help you think through it.`,
        suggestions: politeSuggestions("general"),
      };
  }
}

router.post("/chat", (req, res) => {
  const user = currentUser(req);
  const data = getUserData(user);
  const { message } = SendChatMessageBody.parse(req.body);

  const intent = detectIntent(message);
  const reply = buildReply(message, intent, data);

  data.chatHistory = [
    ...data.chatHistory,
    { role: "user" as const, text: message },
    { role: "bot" as const, text: reply.text },
  ].slice(-20);

  const response =
    intent === "crisis"
      ? {
          message: reply.text,
          crisis: true,
          resource: "Campus counseling: Student Affairs building, room 12 · 0800 000 0000",
          suggestions: reply.suggestions,
          intent,
        }
      : {
          message: reply.text,
          crisis: false,
          resource: null,
          suggestions: reply.suggestions,
          intent,
        };
  res.json(SendChatMessageResponse.parse(response));
});

// ---------------------------------------------------------------------------
// Money · scholarship matching engine
// ---------------------------------------------------------------------------

const SCHOLARSHIPS = [
  { name: "VTU Merit Scholarship", provider: "University of Lagos", deadline: "2026-10-01", amount: 250000, category: "Merit", programs: ["Computer Science", "Engineering"], maxEntries: 5 },
  { name: "NITDA Open Source Fellowship", provider: "NITDA", deadline: "2026-09-30", amount: 400000, category: "Tech", programs: ["Computer Science", "Software Engineering"], maxEntries: 0 },
  { name: "Opay Campus Innovator Grant", provider: "Opay", deadline: "2026-10-15", amount: 500000, category: "Innovation", programs: [], maxEntries: 0 },
  { name: "First Bank Academic Excellence", provider: "First Bank", deadline: "2026-10-08", amount: 300000, category: "Merit", programs: [], maxEntries: 3 },
  { name: "TotalEnergies STEM Scholarship", provider: "TotalEnergies", deadline: "2026-10-20", amount: 450000, category: "STEM", programs: ["Computer Science", "Engineering", "Sciences"], maxEntries: 4 },
  { name: "Women in Tech Grant", provider: "UN Women", deadline: "2026-11-01", amount: 600000, category: "Diversity", programs: [], maxEntries: 0 },
  { name: "MTN Foundation Scholarship", provider: "MTN", deadline: "2026-10-25", amount: 350000, category: "Need-based", programs: [], maxEntries: 0 },
  { name: "CBN Intervention for Undergraduates", provider: "Central Bank", deadline: "2026-10-12", amount: 200000, category: "Need-based", programs: [], maxEntries: 0 },
];

function matchScholarships(user: User): ScholarshipItem[] {
  const programLower = user.program.toLowerCase();
  return SCHOLARSHIPS.map((s, index) => {
    let score = 55;
    if (s.programs.length === 0 || s.programs.some((p) => programLower.includes(p.toLowerCase()))) {
      score += 20;
    }
    if (s.category === "Merit") score += 10;
    if (s.category === "Diversity" || s.category === "Need-based") score += 12;
    const deadlineDays = Math.round((new Date(s.deadline).getTime() - Date.now()) / 86400000);
    if (deadlineDays >= 0 && deadlineDays <= 7) score += 8;
    const eligible = deadlineDays >= 0 || s.maxEntries > 0;
    const matchScore = Math.min(100, score);
    return {
      id: index + 1,
      name: s.name,
      provider: s.provider,
      deadline: s.deadline,
      amount: s.amount,
      category: s.category,
      eligible,
      matchScore,
      matchReason: `Matches your ${s.programs.length ? `${s.programs.join(", ")}` : "academic profile"}${s.category === "Diversity" || s.category === "Need-based" ? " and support criteria" : ""}.`,
      applied: false,
      userAdded: false,
    };
  });
}

router.get("/scholarships", (req, res) => {
  const user = currentUser(req);
  const data = getUserData(user);
  const matches = matchScholarships(user);
  const combined = data.scholarships.length
    ? [...data.scholarships, ...matches.filter((m) => !data.scholarships.some((s) => s.name === m.name))]
    : matches;
  res.json(GetScholarshipsResponse.parse(combined));
});

router.post("/scholarships", (req, res) => {
  const user = currentUser(req);
  const data = getUserData(user);
  const input = CreateScholarshipBody.parse(req.body);
  const item: ScholarshipItem = {
    id: data.nextId++,
    name: input.name,
    provider: input.provider,
    deadline: input.deadline,
    amount: input.amount ?? 0,
    category: input.category ?? "Other",
    eligible: true,
    matchScore: 75,
    matchReason: "Added by you — stay on top of the deadline.",
    applied: false,
    userAdded: true,
  };
  data.scholarships = [item, ...data.scholarships];
  res.status(201).json(CreateScholarshipResponse.parse(item));
});

router.patch("/scholarships/:id", (req, res) => {
  const user = currentUser(req);
  const data = getUserData(user);
  const id = Number(req.params.id);
  const matches = matchScholarships(user);
  const target =
    data.scholarships.find((s) => s.id === id) ??
    matches.find((m) => m.id === id);
  if (!target) {
    res.status(404).json({ error: "Scholarship not found." });
    return;
  }
  const { applied } = UpdateScholarshipBody.parse(req.body);
  target.applied = applied;
  if (target.userAdded) {
    const stored = data.scholarships.find((s) => s.id === id);
    if (stored) stored.applied = applied;
  } else {
    const existing = data.scholarships.find((s) => s.name === target.name);
    if (existing) existing.applied = applied;
    else data.scholarships.push({ ...target, applied });
  }
  res.json(UpdateScholarshipResponse.parse(target));
});

// ---------------------------------------------------------------------------
// Money · stress-impact score (money worries ↔ mood correlation)
// ---------------------------------------------------------------------------

router.get("/money/stress-impact", (req, res) => {
  const data = getUserData(currentUser(req));
  const mood = data.moodCheckIns.slice(0, 14);
  const finance = data.financeEvents.filter((e) => e.type === "expense" || e.type === "deadline");
  const moneyStress = Math.min(100, finance.length * 18 + (data.financeEvents.some((e) => e.label.toLowerCase().includes("fafsa")) ? 15 : 0));
  const averageMood = mood.length ? mood.reduce((s, m) => s + m.moodScore, 0) / mood.length : 0;
  const recentMood = mood.slice(0, 5);
  const recentAvg = recentMood.length ? recentMood.reduce((s, m) => s + m.moodScore, 0) / recentMood.length : 0;
  const correlation = averageMood > 0 ? Math.round(((1 / averageMood) * 40 + (moneyStress / 100) * 60) * 10) / 10 : 0;

  const periods = [
    { label: "Wk -3", moodAvg: 3.4, moneyStress: 35 },
    { label: "Wk -2", moodAvg: 3.1, moneyStress: 45 },
    { label: "Wk -1", moodAvg: 2.6, moneyStress: 62 },
    { label: "This week", moodAvg: Math.round(recentAvg * 10) / 10 || 2.4, moneyStress },
  ];

  const insight =
    correlation > 5
      ? `Your mood dips (${recentAvg.toFixed(1)}/5) line up with financial pressure — even before spending hits, money deadlines appear to weigh on your week.`
      : "Money events and mood look roughly in balance right now. Keep mapping them so small trends become visible.";

  res.json(
    GetStressImpactResponse.parse({
      periods,
      overallCorrelation: correlation,
      insight,
      recommendation: "Put the next FAFSA/scholarship deadline on your calendar as a 20-minute task now — it buffers the uncertainty that feeds stress.",
    }),
  );
});

// ---------------------------------------------------------------------------
// Grind · semester workload visualizer
// ---------------------------------------------------------------------------

function weekLabel(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(d);
}

function intensityOf(count: number, highPriority: number): "light" | "moderate" | "heavy" | "critical" {
  if (count === 0) return "light";
  if (count <= 1 && highPriority === 0) return "light";
  if (count <= 2) return "moderate";
  if (count <= 4) return "heavy";
  return "critical";
}

router.get("/grind/workload", (req, res) => {
  const data = getUserData(currentUser(req));
  const weeks = new Map<string, Assignment[]>();
  for (const assignment of data.assignments) {
    const key = weekLabel(assignment.dueDate);
    const list = weeks.get(key) ?? [];
    list.push(assignment);
    weeks.set(key, list);
  }
  const rows = [...weeks.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([week, assignments]) => {
      const highPriorityCount = assignments.filter((a) => a.priority === "high").length;
      return {
        week,
        assignments,
        highPriorityCount,
        intensity: intensityOf(assignments.length, highPriorityCount),
      };
    });
  res.json(GetWorkloadResponse.parse(rows));
});

// ---------------------------------------------------------------------------
// Grind · deadline conflict detector
// ---------------------------------------------------------------------------

router.get("/grind/conflicts", (req, res) => {
  const data = getUserData(currentUser(req));
  const active = data.assignments.filter((a) => a.status !== "submitted");
  const grouped = new Map<string, Assignment[]>();
  for (const assignment of active) {
    const list = grouped.get(assignment.dueDate) ?? [];
    list.push(assignment);
    grouped.set(assignment.dueDate, list);
  }

  const conflicts = [];
  for (const [date, assignments] of grouped.entries()) {
    if (assignments.length < 2) continue;
    const highPriority = assignments.filter((a) => a.priority === "high").length;
    const severity = assignments.length >= 3 && highPriority >= 2 ? "high" : assignments.length >= 2 ? "medium" : "low";
    conflicts.push({
      assignments,
      message: `${assignments.map((a) => a.title).join(" + ")} all due ${weekLabel(date)}.`,
      severity,
      suggestion:
        severity === "high"
          ? "Push at least one submission earlier — or a day later — to remove the pile-up."
          : "Start the highest-priority one first; the others can be batched after.",
    });
  }

  res.json(GetConflictsResponse.parse(conflicts));
});

// ---------------------------------------------------------------------------
// Grind · AI study planner tuned to energy levels
// ---------------------------------------------------------------------------

function energyLevelFor(data: UserData, day: string): "high" | "medium" | "low" {
  const dayIndex = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(day);
  const sleep = data.sleepLogs[Math.min(dayIndex, data.sleepLogs.length - 1)];
  const mood = data.moodCheckIns[Math.min(dayIndex, data.moodCheckIns.length - 1)];
  const hours = sleep?.hoursSlept ?? 6;
  const score = mood?.moodScore ?? 3;
  if (hours >= 6.5 && score >= 3) return "high";
  if (hours >= 5.5 && score >= 2) return "medium";
  return "low";
}

router.get("/grind/study-plan", (req, res) => {
  const user = currentUser(req);
  const data = getUserData(user);
  const now = new Date();
  const start = now.getDay(); // 0 = Sunday
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const highPriority = data.assignments
    .filter((a) => a.status !== "submitted" && a.priority === "high")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const blocks = highPriority.slice(0, 5).map((assignment, index) => {
    const dayOffset = start + index + 1;
    const day = days[dayOffset % 7];
    const energy = energyLevelFor(data, day);
    return {
      id: index + 1,
      day,
      startHour: energy === "high" ? 9 : 10,
      endHour: energy === "high" ? 12 : 11,
      activity: energy === "high" ? `Deep work: ${assignment.title}` : `Structured review: ${assignment.title}`,
      energyFit: energy,
    };
  });

  const sleepAvg = data.sleepLogs.length
    ? data.sleepLogs.reduce((s, l) => s + l.hoursSlept, 0) / data.sleepLogs.length
    : 0;
  const energyTip =
    sleepAvg >= 6.5
      ? "Your sleep baseline is solid — schedule the hardest work in your peak morning hours."
      : sleepAvg >= 5.5
        ? "Sleep is a little low. Put deep work in short 45-minute bursts and pair it with real breaks."
        : "Sleep is running under 6 hours — this plan deliberately keeps mornings lighter so you can recover, not just push harder.";

  res.json(
    GetStudyPlanResponse.parse({
      blocks,
      summary: `A ${blocks.length}-block plan built around ${user.name.split(" ")[0] ?? "you"}, shaped by your recent sleep and mood.`,
      energyBasedTip: energyTip,
    }),
  );
});

// ---------------------------------------------------------------------------
// Grind · personal study timetable
// ---------------------------------------------------------------------------

router.get("/grind/timetable", (req, res) => {
  res.json(GetTimetableResponse.parse(getUserData(currentUser(req)).timetable));
});

router.post("/grind/timetable", (req, res) => {
  const user = currentUser(req);
  const data = getUserData(user);
  const input = UpdateTimetableBody.parse(req.body);
  const blocks: TimetableBlock[] = input.blocks.map((block, index) => ({
    id: data.nextId + index,
    day: block.day,
    startHour: block.startHour,
    endHour: block.endHour,
    activity: block.activity,
    energyFit: "medium",
  }));
  data.nextId += input.blocks.length;
  data.timetable = blocks;
  res.json(UpdateTimetableResponse.parse(blocks));
});

export default router;