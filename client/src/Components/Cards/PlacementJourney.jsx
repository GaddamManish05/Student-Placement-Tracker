import {
  FiCheck,
  FiBriefcase,
  FiAward,
  FiBookOpen,
  FiUserCheck,
} from "react-icons/fi";

import { motion } from "framer-motion";

import useApplicationStore
from "../../store/applicationStore";

const PlacementJourney = () => {

  // ====================================
  // APPLICATIONS
  // ====================================
  const {
    studentApplications,
  } = useApplicationStore();

  // ====================================
  // ANALYTICS
  // ====================================
  const totalApplications =
  studentApplications?.length || 0;

  const hasRound1 =
  studentApplications?.some(
    (app) =>
      app.status === "Round 1"
  );

  const hasRound2 =
  studentApplications?.some(
    (app) =>
      app.status === "Round 2"
  );

  const hasHRRound =
  studentApplications?.some(
    (app) =>
      app.status === "HR Round"
  );

  const isSelected =
  studentApplications?.some(
    (app) =>
      app.status === "Selected"
  );

  // ====================================
  // CURRENT STEP
  // ====================================
  let currentStep = 1;

  if(totalApplications > 0){

    currentStep = 2;
  }

  if(
    hasRound1 ||
    hasRound2 ||
    hasHRRound
  ){

    currentStep = 3;
  }

  if(isSelected){

    currentStep = 4;
  }

  // ====================================
  // STEPS
  // ====================================
  const steps = [

    {
      title: "Registration",

      icon:
      <FiUserCheck />,
    },

    {
      title: "Applications",

      icon:
      <FiBookOpen />,
    },

    {
      title: "Interview Rounds",

      icon:
      <FiBriefcase />,
    },

    {
      title: "Offer Letter",

      icon:
      <FiAward />,
    },
  ];

  // ====================================
  // PROGRESS %
  // ====================================
  const progressWidth =

    currentStep === 1
    ? "0%"

    : currentStep === 2
    ? "33%"

    : currentStep === 3
    ? "68%"

    : "100%";

  return (

    <motion.div

      initial={{
        opacity: 0,
        y: 20,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      transition={{
        duration: 0.4,
      }}

      className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm"
    >

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}
      <div className="flex items-start justify-between mb-12">

        <div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">

            Placement Journey

          </h2>

          <p className="text-sm text-slate-500 mt-2 font-medium">

            Your current placement progress

          </p>

        </div>

        <div className="bg-blue-50 text-blue-600 text-sm font-black px-4 py-2 rounded-2xl">

          Step {currentStep} / 4

        </div>

      </div>

      {/* ================================= */}
      {/* TIMELINE */}
      {/* ================================= */}
      <div className="relative">

        {/* BASE LINE */}
        <div className="absolute top-6 left-0 w-full h-[5px] bg-slate-200 rounded-full" />

        {/* ACTIVE LINE */}
        <motion.div

          initial={{
            width: 0,
          }}

          animate={{
            width: progressWidth,
          }}

          transition={{
            duration: 0.8,
          }}

          className="absolute top-6 left-0 h-[5px] bg-blue-600 rounded-full"
        />

        {/* ================================= */}
        {/* STEPS */}
        {/* ================================= */}
        <div className="relative flex justify-between">

          {
            steps.map(
              (
                step,
                index
              ) => {

                const stepNumber =
                index + 1;

                const completed =
                stepNumber < currentStep;

                const active =
                stepNumber === currentStep;

                return (

                  <div
                    key={index}
                    className="flex flex-col items-center text-center"
                  >

                    {/* CIRCLE */}
                    <motion.div

                      whileHover={{
                        scale: 1.08,
                      }}

                      className={`w-12 h-12 rounded-full border-[4px] flex items-center justify-center transition-all duration-300 z-10 ${
                        completed

                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100"

                        : active

                        ? "bg-white border-blue-600 text-blue-600 shadow-xl shadow-blue-100"

                        : "bg-white border-slate-300 text-slate-400"
                      }`}
                    >

                      {
                        completed

                        ? <FiCheck size={18} />

                        : step.icon
                      }

                    </motion.div>

                    {/* LABEL */}
                    <div className="mt-4">

                      <p className={`text-sm font-black ${
                        completed || active
                        ? "text-slate-900"
                        : "text-slate-400"
                      }`}>

                        {step.title}

                      </p>

                      <p className={`text-xs mt-1 ${
                        completed || active
                        ? "text-slate-500"
                        : "text-slate-300"
                      }`}>

                        {
                          completed
                          ? "Completed"

                          : active
                          ? "In Progress"

                          : "Pending"
                        }

                      </p>

                    </div>

                  </div>
                );
              }
            )
          }

        </div>

      </div>

      {/* ================================= */}
      {/* FOOTER STATS */}
      {/* ================================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">

        <StatCard
          title="Applications"
          value={totalApplications}
        />

        <StatCard
          title="Round 1"
          value={
            studentApplications.filter(
              (app) =>
                app.status ===
                "Round 1"
            ).length
          }
        />

        <StatCard
          title="HR Rounds"
          value={
            studentApplications.filter(
              (app) =>
                app.status ===
                "HR Round"
            ).length
          }
        />

        <StatCard
          title="Offers"
          value={
            studentApplications.filter(
              (app) =>
                app.status ===
                "Selected"
            ).length
          }
        />

      </div>

    </motion.div>
  );
};

// ======================================
// STAT CARD
// ======================================
const StatCard = ({
  title,
  value,
}) => (

  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">

    <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">

      {title}

    </p>

    <h3 className="text-2xl font-black text-slate-900 mt-2">

      {value}

    </h3>

  </div>
);

export default PlacementJourney;