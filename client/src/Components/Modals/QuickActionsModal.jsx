import { useState, useEffect } from "react";
import { 
  FiX, FiAward, FiBookOpen, FiClock, 
  FiMessageSquare, FiTrendingUp, FiActivity, 
  FiCheck, FiChevronRight, FiCheckCircle, FiPlay
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import useAuthStore from "../../store/authStore";

const MOCK_QUESTIONS = [
  {
    skill: "React",
    question: "Explain the virtual DOM reconciliation process in React. How does the diffing algorithm work?",
    keywords: ["reconciliation", "diff", "virtual", "render", "keys", "tree"],
    bestPoints: "Explain state changes trigger Virtual DOM tree creation, which is compared with the previous tree to compute minimal updates."
  },
  {
    skill: "Node",
    question: "What is the event loop in Node.js? How does it handle asynchronous I/O operations despite being single-threaded?",
    keywords: ["event loop", "single-threaded", "callback", "phases", "libuv", "poll", "queue"],
    bestPoints: "Describe libuv thread pool, callback queues (microtask/macrotask), and execution phases (timers, poll, check)."
  },
  {
    skill: "Database",
    question: "Explain the difference between Clustered and Non-Clustered indexes. When should you use each?",
    keywords: ["clustered", "non-clustered", "physical", "pointer", "leaf", "index", "speed"],
    bestPoints: "Clustered index defines the physical order of storage (one per table), while Non-Clustered index creates a separate pointer structure to rows."
  },
  {
    skill: "JavaScript",
    question: "What are closures in JavaScript? Provide a real-world use case for using closures in clean code writing.",
    keywords: ["closure", "lexical", "scope", "encapsulation", "private", "state"],
    bestPoints: "A closure is a function that remembers its lexical scope even when executed outside that scope. Ideal for private data variables."
  },
  {
    skill: "System Design",
    question: "How would you design a rate limiter for a high-traffic microservice architecture? What algorithms would you choose?",
    keywords: ["rate", "limiter", "token bucket", "leaky bucket", "sliding window", "redis"],
    bestPoints: "Discuss Token Bucket or Leaky Bucket algorithms, and state caching mechanism using Redis to store IP window counts."
  }
];

const QUIZ_QUESTIONS = [
  {
    question: "Which data structure uses LIFO (Last In First Out) ordering rules?",
    options: ["Queue", "Stack", "Min-Heap", "Linked List"],
    correctIndex: 1,
    explanation: "Stacks process data using Last-In-First-Out (LIFO), whereas Queues use First-In-First-Out (FIFO)."
  },
  {
    question: "What is the worst-case time complexity of searching in a balanced Binary Search Tree (BST)?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correctIndex: 2,
    explanation: "A balanced BST splits search domains in half with each branch step, guaranteeing logarithmic O(log n) time complexity."
  },
  {
    question: "Which HTTP status code represents an 'Unauthorized' resource access?",
    options: ["400 Bad Request", "401 Unauthorized", "403 Forbidden", "404 Not Found"],
    correctIndex: 1,
    explanation: "401 specifically indicates a credential authentication failure, while 403 means authenticated but lacked permissions."
  }
];

const QuickActionsModal = ({ actionType, isOpen, onClose }) => {
  const { currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState(actionType);

  // Sync tab when prop changes
  useEffect(() => {
    if (actionType) {
      setActiveTab(actionType);
    }
  }, [actionType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b4141]/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-[#faf0dc] border border-[#0b4141]/20 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative flex flex-col"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100/50 transition-colors cursor-pointer"
        >
          <FiX size={20} />
        </button>

        {/* Tab Headers */}
        <div className="flex border-b border-slate-200/50 pb-4 mb-6">
          <TabButton 
            active={activeTab === "interview"} 
            onClick={() => setActiveTab("interview")}
            label="Mock Interview"
          />
          <TabButton 
            active={activeTab === "skill"} 
            onClick={() => setActiveTab("skill")}
            label="Skill Quiz"
          />
          <TabButton 
            active={activeTab === "roadmap"} 
            onClick={() => setActiveTab("roadmap")}
            label="Prep Roadmap"
          />
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === "interview" && <InterviewView user={currentUser} />}
          {activeTab === "skill" && <QuizView />}
          {activeTab === "roadmap" && <RoadmapView user={currentUser} />}
        </div>
      </motion.div>
    </div>
  );
};

// ==========================================
// MOCK INTERVIEW SUB-VIEW
// ==========================================
const InterviewView = ({ user }) => {
  const [questionObj, setQuestionObj] = useState(MOCK_QUESTIONS[0]);
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Pick question based on user profile skills or random
  useEffect(() => {
    if (user?.skills && user.skills.length > 0) {
      const matched = MOCK_QUESTIONS.find(q => 
        user.skills.some(skill => skill.toLowerCase().includes(q.skill.toLowerCase()))
      );
      if (matched) {
        setQuestionObj(matched);
        return;
      }
    }
    // Fallback to random
    const idx = Math.floor(Math.random() * MOCK_QUESTIONS.length);
    setQuestionObj(MOCK_QUESTIONS[idx]);
  }, [user]);

  const loadNewQuestion = () => {
    const currentIdx = MOCK_QUESTIONS.indexOf(questionObj);
    const nextIdx = (currentIdx + 1) % MOCK_QUESTIONS.length;
    setQuestionObj(MOCK_QUESTIONS[nextIdx]);
    setAnswer("");
    setFeedback(null);
  };

  const handleSubmit = () => {
    if (!answer.trim()) {
      toast.warning("Please type your response before submitting.");
      return;
    }
    if (answer.trim().length < 20) {
      toast.warning("Please provide a more comprehensive answer (at least 20 characters).");
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    // Simulate AI grading
    setTimeout(() => {
      const lowerAns = answer.toLowerCase();
      // Count matching keywords
      const matchedKeywords = questionObj.keywords.filter(keyword => 
        lowerAns.includes(keyword)
      );

      // Score calculation
      const keywordRatio = matchedKeywords.length / questionObj.keywords.length;
      let rawScore = 4.0 + (keywordRatio * 5.0) + (Math.min(answer.length, 300) / 300 * 1.0);
      rawScore = Math.min(10, Math.max(1, Math.round(rawScore * 10) / 10));

      let remarks = "Excellent conceptual alignment. You successfully touched upon key structural variables.";
      if (rawScore < 6.0) {
        remarks = "Needs refinement. Review core systems architectures and try explaining with structured definitions.";
      } else if (rawScore < 8.0) {
        remarks = "Solid foundational explanation. To reach 9+, discuss execution lifecycle timelines and state order parameters.";
      }

      setFeedback({
        score: rawScore,
        remarks,
        matched: matchedKeywords,
        bestPoints: questionObj.bestPoints
      });
      setIsSubmitting(false);
      toast.success("Response evaluated successfully!");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#0b4141] text-white flex items-center justify-center">
          <FiMessageSquare size={18} />
        </div>
        <div>
          <h4 className="text-lg font-black text-[#0b4141]">AI Technical Mock Interview</h4>
          <p className="text-xs text-slate-500">Practice core concepts, get graded instantly</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <span className="px-2 py-0.5 bg-[#faf0dc] text-[#0b4141] text-[9px] font-black uppercase tracking-wider rounded">
          {questionObj.skill} Question
        </span>
        <h5 className="font-bold text-slate-900 text-sm mt-2 leading-relaxed">
          {questionObj.question}
        </h5>
      </div>

      {feedback ? (
        <div className="space-y-5 bg-[#faf0dc]/30 border border-[#0b4141]/10 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h6 className="font-black text-slate-900 text-sm">Evaluation Report</h6>
            <div className="px-4 py-2 bg-gradient-to-r from-[#ff6864] to-[#0b4141] text-white rounded-xl font-black text-base">
              Score: {feedback.score} / 10
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <p className="font-bold text-[#0b4141]">Assessment Verdict:</p>
              <p className="text-slate-600 mt-1 leading-relaxed">{feedback.remarks}</p>
            </div>
            <div>
              <p className="font-bold text-[#0b4141]">Identified Technical Terms ({feedback.matched.length} of {questionObj.keywords.length}):</p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {questionObj.keywords.map(kw => {
                  const wasMatched = feedback.matched.includes(kw);
                  return (
                    <span 
                      key={kw} 
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        wasMatched 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                          : "bg-slate-50 text-slate-400 border-slate-200"
                      }`}
                    >
                      {wasMatched ? "✓ " : "✗ "}{kw}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="pt-3 border-t border-slate-200/50">
              <p className="font-bold text-[#0b4141]">Key Architectural Points to Include:</p>
              <p className="text-slate-600 mt-1 italic leading-relaxed">{feedback.bestPoints}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setFeedback(null)}
              className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
            >
              Retry Answer
            </button>
            <button 
              onClick={loadNewQuestion}
              className="flex-1 py-3 bg-[#0b4141] hover:bg-[#0b4141]/90 rounded-xl text-xs font-bold text-white cursor-pointer"
            >
              Next Question
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <textarea
            rows={5}
            placeholder="Type your structured explanation here (e.g. state order, space/time trade-offs, architecture variables...)"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isSubmitting}
            className="w-full p-4 border border-slate-200 rounded-2xl bg-white text-sm outline-none focus:ring-2 focus:ring-[#ff6864]/20 focus:border-[#ff6864]"
          />

          <div className="flex gap-3">
            <button 
              onClick={loadNewQuestion}
              disabled={isSubmitting}
              className="px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
            >
              Skip / Another Question
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-[#ff6864] hover:bg-[#ff6864]/95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Evaluating...
                </>
              ) : (
                <>
                  <FiPlay size={14} /> Submit Response
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// SKILL TEST / QUIZ SUB-VIEW
// ==========================================
const QuizView = () => {
  const [qIndex, setQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleNext = () => {
    if (selectedOpt === null) {
      toast.warning("Please choose one option to proceed.");
      return;
    }

    const currentQ = QUIZ_QUESTIONS[qIndex];
    const isCorrect = selectedOpt === currentQ.correctIndex;

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    if (!showExplanation) {
      setShowExplanation(true);
      return;
    }

    // Go to next question
    if (qIndex < QUIZ_QUESTIONS.length - 1) {
      setQIndex(prev => prev + 1);
      setSelectedOpt(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setQIndex(0);
    setSelectedOpt(null);
    setScore(0);
    setQuizFinished(false);
    setShowExplanation(false);
  };

  const currentQuestionObj = QUIZ_QUESTIONS[qIndex];

  if (quizFinished) {
    const percent = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    return (
      <div className="text-center py-6 space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#faf0dc] text-[#ff6864] flex items-center justify-center mx-auto shadow-md">
          <FiAward size={36} />
        </div>
        <div>
          <h4 className="text-xl font-black text-[#0b4141]">Quiz Completed!</h4>
          <p className="text-xs text-slate-500 mt-1">Placement readiness test completed</p>
        </div>

        <div className="max-w-xs mx-auto bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-4xl font-black text-[#0b4141]">{score} / {QUIZ_QUESTIONS.length}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{percent}% Correct</p>
          
          <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-[#ff6864] h-full rounded-full" style={{ width: `${percent}%` }}></div>
          </div>
        </div>

        <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
          {percent >= 80 
            ? "Excellent! You demonstrate solid placement engineering fundamentals. Maintain this prep state!" 
            : "Review technical questions and data structures definitions before starting hiring applications."}
        </p>

        <button 
          onClick={restartQuiz}
          className="px-8 py-3 bg-[#0b4141] hover:bg-[#0b4141]/95 text-white font-bold rounded-xl text-xs cursor-pointer active:scale-98 transition-all"
        >
          Retake Skill Test
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0b4141] text-white flex items-center justify-center">
            <FiBookOpen size={18} />
          </div>
          <div>
            <h4 className="text-lg font-black text-[#0b4141]">Placement Skills MCQ Quiz</h4>
            <p className="text-xs text-slate-500">Quick timed logic checks</p>
          </div>
        </div>
        <span className="text-xs font-black text-[#ff6864]">
          Question {qIndex + 1} of {QUIZ_QUESTIONS.length}
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <p className="font-bold text-slate-900 text-sm leading-relaxed">
          {currentQuestionObj.question}
        </p>
      </div>

      <div className="space-y-2.5">
        {currentQuestionObj.options.map((option, idx) => {
          const isSelected = selectedOpt === idx;
          const isCorrect = idx === currentQuestionObj.correctIndex;
          
          let btnStyle = "border-slate-200 bg-white hover:bg-slate-50/50";
          if (showExplanation) {
            if (isCorrect) {
              btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-700";
            } else if (isSelected) {
              btnStyle = "border-red-500 bg-red-50 text-red-700";
            } else {
              btnStyle = "border-slate-100 bg-slate-50/30 opacity-60";
            }
          } else if (isSelected) {
            btnStyle = "border-[#ff6864] bg-[#ff6864]/5 text-[#0b4141] font-bold";
          }

          return (
            <button
              key={idx}
              disabled={showExplanation}
              onClick={() => setSelectedOpt(idx)}
              className={`w-full p-4 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${btnStyle} ${!showExplanation ? "cursor-pointer" : ""}`}
            >
              <span>{option}</span>
              {showExplanation && isCorrect && <FiCheck className="text-emerald-600 shrink-0" size={16} />}
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs">
          <p className="font-bold text-emerald-800 mb-1">Explanation:</p>
          <p className="text-emerald-700 leading-relaxed">{currentQuestionObj.explanation}</p>
        </div>
      )}

      <button 
        onClick={handleNext}
        className="w-full py-4 bg-[#ff6864] hover:bg-[#ff6864]/95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-all"
      >
        {showExplanation 
          ? (qIndex === QUIZ_QUESTIONS.length - 1 ? "Finish Quiz" : "Next Question") 
          : "Verify Answer"}
        <FiChevronRight size={14} />
      </button>
    </div>
  );
};

// ==========================================
// PREPARATION ROADMAP SUB-VIEW
// ==========================================
const RoadmapView = ({ user }) => {
  const steps = [
    {
      title: "Algorithms & DSA Mastery",
      period: "Month 1",
      focus: "Binary Tree, Dynamic Programming, Graphs",
      target: "LeetCode 150 List completed"
    },
    {
      title: "Full-Stack Capstone Build",
      period: "Month 2",
      focus: "REST APIs, Mongoose Indexes, Translucent CSS layouts",
      target: "2 Complete web apps on GitHub"
    },
    {
      title: "Resume Refinement & ATS Alignment",
      period: "Month 3",
      focus: "Auto-save Resume builder, Project score cards",
      target: "ATS Resume score >= 80"
    },
    {
      title: "Active Drive Applications",
      period: "Month 4",
      focus: "SectorDistribution reviews, mock grading loops",
      target: "Apply to at least 5 eligible companies"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#0b4141] text-white flex items-center justify-center">
          <FiTrendingUp size={18} />
        </div>
        <div>
          <h4 className="text-lg font-black text-[#0b4141]">Personalized Prep Roadmap</h4>
          <p className="text-xs text-slate-500">Milestone tasks for {user?.branch || "Engineering"} placement preparation</p>
        </div>
      </div>

      <div className="space-y-5 relative before:absolute before:left-5 before:top-2 before:bottom-6 before:w-[2px] before:bg-slate-200/60">
        {steps.map((step, idx) => (
          <div key={idx} className="flex gap-5 relative group">
            <div className="w-10 h-10 rounded-full bg-[#0b4141] text-white flex items-center justify-center font-bold shadow-lg shadow-[#0b4141]/10 z-10 shrink-0">
              {idx + 1}
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex-1 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-bold text-slate-900 text-xs md:text-sm">{step.title}</h5>
                <span className="px-2 py-0.5 bg-[#faf0dc] text-[#0b4141] text-[9px] font-black uppercase tracking-wider rounded">
                  {step.period}
                </span>
              </div>
              <p className="text-[11px] text-slate-500"><strong className="text-[#ff6864]">Focus:</strong> {step.focus}</p>
              <p className="text-[11px] text-slate-400 mt-1"><strong className="text-slate-500">Target Outcome:</strong> {step.target}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// HELPER TAB BUTTON
// ==========================================
const TabButton = ({ active, onClick, label }) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-3 text-xs font-black uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
      active 
        ? "border-[#ff6864] text-[#0b4141]" 
        : "border-transparent text-slate-400 hover:text-slate-600"
    }`}
  >
    {label}
  </button>
);

export default QuickActionsModal;
