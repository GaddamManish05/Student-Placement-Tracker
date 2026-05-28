import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiFileText,
  FiMic,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import QuickActionsModal from "../Modals/QuickActionsModal";

const QuickActionsCard = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("interview");

  const actions = [
    {
      title: "Build Resume",
      icon: <FiFileText />,
      onClick: () => navigate("/resume-builder")
    },
    {
      title: "Mock Interview",
      icon: <FiMic />,
      onClick: () => {
        setSelectedAction("interview");
        setModalOpen(true);
      }
    },
    {
      title: "Skill Test",
      icon: <FiTarget />,
      onClick: () => {
        setSelectedAction("skill");
        setModalOpen(true);
      }
    },
    {
      title: "Roadmap",
      icon: <FiTrendingUp />,
      onClick: () => {
        setSelectedAction("roadmap");
        setModalOpen(true);
      }
    },
  ];

  return (
    <>
      <motion.section
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="bg-gradient-to-br from-[#0b4141] to-[#0b4141]/85 rounded-2xl p-5 text-white shadow-xl shadow-[#0b4141]/10 overflow-hidden relative"
      >
        {/* BACKGROUND EFFECT */}
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/5" />

        {/* HEADER */}
        <div className="relative z-10 mb-5">
          <h3 className="text-2xl font-black tracking-tight text-white">
            Quick Actions
          </h3>
          <p className="text-[#faf0dc]/70 text-xs mt-1 font-medium">
            Boost your placement preparation
          </p>
        </div>

        {/* ACTIONS GRID */}
        <div className="grid grid-cols-2 gap-3 relative z-10">
          {actions.map((action, index) => (
            <motion.button
              key={index}
              whileHover={{
                y: -2,
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={action.onClick}
              className="bg-white/10 border border-white/10 rounded-xl p-4 hover:bg-white/20 transition-all backdrop-blur-sm text-left cursor-pointer flex flex-col justify-between"
            >
              {/* ICON */}
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3 text-lg text-white">
                {action.icon}
              </div>

              {/* TITLE */}
              <p className="text-xs font-bold text-[#faf0dc]">
                {action.title}
              </p>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Preparation Modal */}
      <AnimatePresence>
        {modalOpen && (
          <QuickActionsModal
            actionType={selectedAction}
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default QuickActionsCard;