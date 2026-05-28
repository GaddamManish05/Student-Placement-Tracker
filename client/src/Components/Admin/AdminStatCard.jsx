import { motion }
from "framer-motion";

const AdminStatCard = ({

  title="",

  value = 0,

  icon,

  badge,

  color="blue",
}) => {

  const styles = {

    blue:
      "bg-blue-50 text-blue-600 border-blue-100",

    emerald:
      "bg-emerald-50 text-emerald-600 border-emerald-100",

    amber:
      "bg-amber-50 text-amber-600 border-amber-100",

    purple:
      "bg-purple-50 text-purple-600 border-purple-100",

    red:
      "bg-red-50 text-red-600 border-red-100",
  };

  return (

    <motion.div

      whileHover={{
        y: -3,
      }}

      className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
    >

      {/* TOP */}
      <div className="flex items-start justify-between">

        {/* ICON */}
        <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-2xl ${styles[color]}`}>

          {icon}

        </div>

        {/* BADGE */}
        {
          badge && (

            <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold">

              {badge}

            </span>
          )
        }

      </div>

      {/* CONTENT */}
      <div className="mt-6">

        <p className="text-sm text-slate-500 font-semibold">

          {title}

        </p>

        <h2 className="text-4xl font-black text-slate-900 mt-2 tracking-tight">

          {value}

        </h2>

      </div>

    </motion.div>
  );
};

export default
AdminStatCard;