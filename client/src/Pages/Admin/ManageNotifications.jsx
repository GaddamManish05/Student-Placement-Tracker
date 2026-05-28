import {
  useEffect,
  useState,
} from "react";

import {
  FiBell,
  FiSend,
} from "react-icons/fi";

import AdminLayout from "../../Components/Layouts/AdminLayout";

import useNotificationStore
from "../../store/notificationStore";

const ManageNotifications = () => {

  // ====================================
  // STATES
  // ====================================
  const [
    formData,
    setFormData,
  ] = useState({

    title: "",

    message: "",

    type: "GENERAL",
  });

  // ====================================
  // STORE
  // ====================================
  const {

    notifications,

    loading,

    fetchNotifications,

    createBroadcastNotification,

  } = useNotificationStore();

  // ====================================
  // FETCH
  // ====================================
  useEffect(() => {

    fetchNotifications();

  }, []);

  // ====================================
  // HANDLE CHANGE
  // ====================================
  const handleChange =
  (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value,
    });
  };

  // ====================================
  // SUBMIT
  // ====================================
  const handleSubmit =
  async (e) => {

    e.preventDefault();

    await createBroadcastNotification(
      formData
    );

    setFormData({

      title: "",

      message: "",

      type: "GENERAL",
    });

    fetchNotifications();
  };

  return (

    <AdminLayout>

      <div className="max-w-7xl mx-auto">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}
        <div className="mb-10">

          <h1 className="text-4xl font-black text-slate-900">

            Notifications

          </h1>

          <p className="text-slate-500 mt-2">

            Broadcast updates and placement alerts

          </p>

        </div>

        {/* ================================= */}
        {/* GRID */}
        {/* ================================= */}
        <div className="grid grid-cols-12 gap-8">

          {/* ================================= */}
          {/* LEFT */}
          {/* ================================= */}
          <div className="col-span-12 lg:col-span-5">

            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">

              <div className="flex items-center gap-3 mb-8">

                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">

                  <FiBell />

                </div>

                <div>

                  <h3 className="text-2xl font-black text-slate-900">

                    Send Notification

                  </h3>

                  <p className="text-sm text-slate-500 mt-1">

                    Broadcast to all students

                  </p>

                </div>

              </div>

              {/* FORM */}
              <form
                onSubmit={
                  handleSubmit
                }
                className="space-y-6"
              >

                {/* TITLE */}
                <div>

                  <label className="block text-sm font-bold text-slate-700 mb-2">

                    Title

                  </label>

                  <input
                    type="text"
                    name="title"
                    value={
                      formData.title
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="Enter notification title"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/10"
                  />

                </div>

                {/* MESSAGE */}
                <div>

                  <label className="block text-sm font-bold text-slate-700 mb-2">

                    Message

                  </label>

                  <textarea
                    rows={6}
                    name="message"
                    value={
                      formData.message
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="Enter notification message"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/10 resize-none"
                  />

                </div>

                {/* TYPE */}
                <div>

                  <label className="block text-sm font-bold text-slate-700 mb-2">

                    Type

                  </label>

                  <select
                    name="type"
                    value={
                      formData.type
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none"
                  >

                    <option>
                      GENERAL
                    </option>

                    <option>
                      PLACEMENT
                    </option>

                    <option>
                      ALERT
                    </option>

                    <option>
                      SUCCESS
                    </option>

                  </select>

                </div>

                {/* BUTTON */}
                <button

                  type="submit"

                  disabled={loading}

                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all disabled:opacity-60"
                >

                  <FiSend />

                  {
                    loading

                    ? "Sending..."

                    : "Broadcast Notification"
                  }

                </button>

              </form>

            </div>

          </div>

          {/* ================================= */}
          {/* RIGHT */}
          {/* ================================= */}
          <div className="col-span-12 lg:col-span-7">

            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

              {/* HEADER */}
              <div className="p-7 border-b border-slate-100">

                <h3 className="text-2xl font-black text-slate-900">

                  Recent Notifications

                </h3>

                <p className="text-sm text-slate-500 mt-1">

                  Latest admin broadcasts

                </p>

              </div>

              {/* LIST */}
              <div className="divide-y divide-slate-100">

                {
                  notifications.length === 0
                  ? (

                    <div className="p-16 text-center">

                      <FiBell
                        size={48}
                        className="mx-auto text-slate-300 mb-5"
                      />

                      <h3 className="text-xl font-black text-slate-800">

                        No Notifications

                      </h3>

                      <p className="text-slate-500 mt-2">

                        Broadcast notifications will appear here.

                      </p>

                    </div>
                  )

                  : (

                    notifications.map(
                      (item) => (

                        <div
                          key={item._id}
                          className="p-6 hover:bg-slate-50 transition-all"
                        >

                          <div className="flex items-start justify-between gap-4">

                            <div>

                              <div className="flex items-center gap-3 mb-2">

                                <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-600 text-xs font-black">

                                  {item.type}

                                </span>

                              </div>

                              <h4 className="text-lg font-black text-slate-900">

                                {item.title}

                              </h4>

                              <p className="text-sm text-slate-600 mt-2 leading-relaxed">

                                {item.message}

                              </p>

                            </div>

                            <p className="text-xs text-slate-400 whitespace-nowrap">

                              {
                                new Date(
                                  item.createdAt
                                ).toLocaleDateString()
                              }

                            </p>

                          </div>

                        </div>
                      )
                    )
                  )
                }

              </div>

            </div>

          </div>

        </div>

      </div>

    </AdminLayout>
  );
};

export default ManageNotifications;