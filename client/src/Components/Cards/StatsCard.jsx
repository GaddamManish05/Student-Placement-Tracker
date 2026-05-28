import { motion } from "framer-motion";

const StatCard = ({
  icon,
  label,
  value,
  badge,
  color,
}) => {

  return (

    <motion.div

      initial={{
        opacity: 0,
        y: 20
      }}

      animate={{
        opacity: 1,
        y: 0
      }}

      whileHover={{
        y: -3
      }}

      transition={{
        duration: 0.2
      }}

      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
    >

      {/* TOP */}
      <div className="flex items-start justify-between mb-5">

        {/* ICON */}
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}
        >

          {icon}

        </div>

        {/* BADGE */}
        <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-500">

          {badge}

        </span>
      </div>

      {/* LABEL */}
      <p className="text-sm text-slate-500 font-medium">

        {label}

      </p>

      {/* VALUE */}
      <h3 className="text-4xl font-black text-slate-900 mt-2 tracking-tight">

        {value}

      </h3>
    </motion.div>
  );
};

export default StatCard;