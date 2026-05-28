import {
  FiUpload,
  FiFileText,
  FiExternalLink,
} from "react-icons/fi";

import {
  useState,
} from "react";

import {
  toast,
} from "sonner";

import api
from "../../config/axios";

import useAuthStore
from "../../store/authStore";

const ResumeUploadCard = () => {

  const [loading,
  setLoading] =
  useState(false);

  const {
    currentUser,
    updateCurrentUser
  } = useAuthStore();

  // ====================================
  // UPLOAD
  // ====================================
  const handleUpload =
  async (e) => {

    const file =
    e.target.files[0];

    if (!file) return;

    const formData =
    new FormData();

    formData.append(
      "resume",
      file
    );

    try {

      setLoading(true);

      const response =
      await api.post(

        "/common-api/upload-resume",

        formData,

        {
          headers: {

            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      toast.success(
        response.data.message
      );
      updateCurrentUser(
  response.data.payload
);
    } catch (error) {

      toast.error(

        error.response?.data
          ?.message ||

        "Upload failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

      {/* HEADER */}
      <div className="mb-5">

        <h3 className="text-xl font-black text-slate-900">

          Resume

        </h3>

        <p className="text-sm text-slate-500 mt-1">

          Upload your latest resume

        </p>

      </div>

      {/* RESUME EXISTS */}
      {
        currentUser?.resume
        ? (

          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-4">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">

                <FiFileText size={20} />

              </div>

              <div>

                <h4 className="text-sm font-bold text-slate-900">

                  Resume Uploaded

                </h4>

                <p className="text-xs text-slate-500 mt-1">

                  PDF Document
                </p>
              </div>
            </div>

           <a
  href={`${currentUser.resume}#toolbar=0`}

  target="_blank"

  rel="noreferrer"

  className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all"
>

  <FiExternalLink />

</a>
          </div>
        )
        : (

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl py-10 cursor-pointer hover:border-blue-500 hover:bg-blue-50/40 transition-all">

            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">

              <FiUpload size={24} />

            </div>

            <h4 className="text-sm font-bold text-slate-900">

              {
                loading
                ? "Uploading..."
                : "Upload Resume"
              }

            </h4>

            <p className="text-xs text-slate-500 mt-1">

              PDF files only
            </p>

            <input
              type="file"
              accept=".pdf"
              hidden
              onChange={
                handleUpload
              }
            />
          </label>
        )
      }
    </section>
  );
};

export default ResumeUploadCard;