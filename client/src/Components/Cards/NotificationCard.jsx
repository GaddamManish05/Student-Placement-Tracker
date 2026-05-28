import {
  FiBell,
  FiCheckCircle,
  FiBriefcase,
  FiClock,
} from "react-icons/fi";

import { motion } from "framer-motion";

const notifications = [

  {
    title: "TCS shortlisted you",
    time: "2 min ago",
    icon: <FiCheckCircle />,
    color: "text-emerald-600 bg-emerald-50",
  },

  {
    title: "Amazon drive tomorrow",
    time: "1 hour ago",
    icon: <FiBriefcase />,
    color: "text-blue-600 bg-blue-50",
  },

  {
    title: "Resume score updated",
    time: "3 hours ago",
    icon: <FiBell />,
    color: "text-indigo-600 bg-indigo-50",
  },

  {
    title: "Application deadline today",
    time: "5 hours ago",
    icon: <FiClock />,
    color: "text-amber-600 bg-amber-50",
  },
];

const NotificationCard = () => {

  return (

    <motion.section

      initial={{
        opacity: 0,
        y: 15,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
    >

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">

        <div>

          <h3 className="text-xl font-black text-slate-900">

            Notifications

          </h3>

          <p className="text-sm text-slate-500 mt-1">

            Latest placement updates

          </p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">

          <FiBell size={18} />

        </div>
      </div>

      {/* LIST */}
      <div className="space-y-4">

        {
          notifications.map(
            (item, index) => (

              <motion.div

                key={index}

                whileHover={{
                  x: 2,
                }}

                className="flex gap-3 items-start p-3 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
              >

                {/* ICON */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}
                >

                  {item.icon}

                </div>

                {/* CONTENT */}
                <div className="flex-1 min-w-0">

                  <h4 className="text-sm font-bold text-slate-900 truncate">

                    {item.title}

                  </h4>

                  <p className="text-xs text-slate-500 mt-1">

                    {item.time}

                  </p>
                </div>
              </motion.div>
            )
          )
        }
      </div>
    </motion.section>
  );
};

export default NotificationCard;