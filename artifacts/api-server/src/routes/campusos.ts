import { Router, type IRouter } from "express";
import {
  CreateAssignmentBody,
  CreateAssignmentResponse,
  CreateFinanceEventBody,
  CreateFinanceEventResponse,
  CreateMoodCheckInBody,
  CreateMoodCheckInResponse,
  GetAssignmentsResponse,
  GetDashboardResponse,
  GetFinanceEventsResponse,
  GetMoodCheckInsResponse,
  GetSignalsResponse,
  GetSleepLogsResponse,
  GetWorkHoursResponse,
  SendChatMessageBody,
  SendChatMessageResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

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
};

type Signal = {
  id: number;
  category: "mind" | "money" | "grind";
  title: string;
  description: string;
  action: string;
  severity: "watch" | "attention" | "urgent";
  createdAt: string;
};

const user = {
  id: 1,
  name: "Amara Okafor",
  school: "University of Lagos",
  program: "Computer Science",
  year: "300 level",
};

let nextId = 20;

let moodCheckIns: MoodCheckIn[] = [
  { id: 1, date: "2026-09-15", moodScore: 2, note: "A lot on my mind" },
  { id: 2, date: "2026-09-14", moodScore: 2, note: null },
  { id: 3, date: "2026-09-13", moodScore: 3, note: "Tired but okay" },
  { id: 4, date: "2026-09-12", moodScore: 3, note: null },
  { id: 5, date: "2026-09-11", moodScore: 4, note: "Good study session" },
  { id: 6, date: "2026-09-10", moodScore: 4, note: null },
  { id: 7, date: "2026-09-09", moodScore: 3, note: null },
];

let assignments: Assignment[] = [
  { id: 1, title: "Distributed Systems report", course: "CSC 405", dueDate: "2026-09-17", status: "pending", priority: "high" },
  { id: 2, title: "Statistical methods problem set", course: "STA 302", dueDate: "2026-09-18", status: "pending", priority: "medium" },
  { id: 3, title: "UX research critique", course: "CIT 304", dueDate: "2026-09-12", status: "late", priority: "high" },
  { id: 4, title: "Database normalization quiz", course: "CSC 308", dueDate: "2026-09-19", status: "pending", priority: "low" },
  { id: 5, title: "Operating systems lab", course: "CSC 402", dueDate: "2026-09-08", status: "late", priority: "high" },
  { id: 6, title: "Algorithms take-home", course: "CSC 312", dueDate: "2026-09-10", status: "late", priority: "high" },
];

let financeEvents: FinanceEvent[] = [
  { id: 1, type: "deadline", label: "FAFSA renewal", date: "2026-09-24", amount: null, category: "Financial aid" },
  { id: 2, type: "deadline", label: "Faculty scholarship application", date: "2026-09-29", amount: null, category: "Scholarships" },
  { id: 3, type: "expense", label: "Rent + utilities", date: "2026-09-03", amount: 82000, category: "Housing" },
  { id: 4, type: "expense", label: "Transport", date: "2026-09-06", amount: 12000, category: "Daily life" },
  { id: 5, type: "income", label: "Campus job", date: "2026-09-05", amount: 145000, category: "Income" },
];

const workHours = [
  { id: 1, week: "Sep 15", hoursWorked: 28 },
  { id: 2, week: "Sep 8", hoursWorked: 26 },
  { id: 3, week: "Sep 1", hoursWorked: 24 },
  { id: 4, week: "Aug 25", hoursWorked: 21 },
];

const sleepLogs = [
  { id: 1, date: "2026-09-15", hoursSlept: 5.1 },
  { id: 2, date: "2026-09-14", hoursSlept: 5.4 },
  { id: 3, date: "2026-09-13", hoursSlept: 5.8 },
  { id: 4, date: "2026-09-12", hoursSlept: 6.1 },
  { id: 5, date: "2026-09-11", hoursSlept: 5.2 },
];

function buildSignals(): Signal[] {
  const latest = moodCheckIns.slice(0, 3);
  const moodDeclining = latest.length >= 3 && latest[0].moodScore < latest[2].moodScore;
  const lateCount = assignments.filter((item) => item.status === "late").length;
  const averageSleep = sleepLogs.reduce((sum, item) => sum + item.hoursSlept, 0) / sleepLogs.length;
  const weeklyHours = workHours[0]?.hoursWorked ?? 0;
  const fafsa = financeEvents.find((item) => item.label.toLowerCase().includes("fafsa"));

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

function dashboardPayload() {
  const signals = buildSignals();
  const averageMood = moodCheckIns.slice(0, 7).reduce((sum, item) => sum + item.moodScore, 0) / Math.max(moodCheckIns.length, 1);
  const income = financeEvents.filter((item) => item.type === "income").reduce((sum, item) => sum + (item.amount ?? 0), 0);
  const expenses = financeEvents.filter((item) => item.type === "expense").reduce((sum, item) => sum + (item.amount ?? 0), 0);
  return GetDashboardResponse.parse({
    user,
    greeting: "Good morning, Amara.",
    patternInsight: "You're 3× more likely to crash after midterms when a money worry lands in the same week.",
    pillars: [
      { label: "Mind", value: `${averageMood.toFixed(1)} / 5`, detail: "Your mood is asking for a little more room today.", tone: "mind" },
      { label: "Money", value: `₦${Math.round(income - expenses).toLocaleString()}`, detail: "Available after this month's tracked expenses.", tone: "money" },
      { label: "Grind", value: `${assignments.filter((item) => item.status === "pending").length} due`, detail: "One high-priority assignment is due this week.", tone: "grind" },
    ],
    assignments: assignments.slice(0, 4),
    signals,
    mood: moodCheckIns,
  });
}

router.get("/dashboard", (_req, res) => res.json(dashboardPayload()));
router.get("/signals", (_req, res) => res.json(GetSignalsResponse.parse(buildSignals())));
router.get("/mood-checkins", (_req, res) => res.json(GetMoodCheckInsResponse.parse(moodCheckIns)));
router.get("/assignments", (_req, res) => res.json(GetAssignmentsResponse.parse(assignments)));
router.get("/finance-events", (_req, res) => res.json(GetFinanceEventsResponse.parse(financeEvents)));
router.get("/work-hours", (_req, res) => res.json(GetWorkHoursResponse.parse(workHours)));
router.get("/sleep-logs", (_req, res) => res.json(GetSleepLogsResponse.parse(sleepLogs)));

router.post("/mood-checkins", (req, res) => {
  const input = CreateMoodCheckInBody.parse(req.body);
  const item = { id: nextId++, date: new Date().toISOString().slice(0, 10), moodScore: input.moodScore, note: input.note ?? null };
  moodCheckIns = [item, ...moodCheckIns];
  res.status(201).json(CreateMoodCheckInResponse.parse(item));
});

router.post("/assignments", (req, res) => {
  const input = CreateAssignmentBody.parse(req.body);
  const item: Assignment = { id: nextId++, title: input.title, course: input.course, dueDate: input.dueDate, status: "pending", priority: input.priority ?? "medium" };
  assignments = [item, ...assignments];
  res.status(201).json(CreateAssignmentResponse.parse(item));
});

router.post("/finance-events", (req, res) => {
  const input = CreateFinanceEventBody.parse(req.body);
  const item: FinanceEvent = { id: nextId++, type: input.type, label: input.label, date: input.date, amount: input.amount ?? null, category: input.category };
  financeEvents = [item, ...financeEvents];
  res.status(201).json(CreateFinanceEventResponse.parse(item));
});

router.post("/chat", (req, res) => {
  const { message } = SendChatMessageBody.parse(req.body);
  const normalized = message.toLowerCase();
  const crisis = ["suicide", "kill myself", "self-harm", "end my life", "hurt myself"].some((phrase) => normalized.includes(phrase));
  const response = crisis
    ? {
        message: "I’m really glad you said something. You deserve immediate support from a real person. Please contact campus counseling now or go to the nearest emergency service. If you may act soon, call your local emergency number.",
        crisis: true,
        resource: "Campus counseling: Student Affairs building, room 12 · 0800 000 0000",
      }
    : {
        message: "That sounds like a lot to carry at once. Let’s make the next step smaller: choose one thing you can finish in the next 20 minutes, then give yourself a real break. I’m here to help you think through it.",
        crisis: false,
        resource: null,
      };
  res.json(SendChatMessageResponse.parse(response));
});

export default router;