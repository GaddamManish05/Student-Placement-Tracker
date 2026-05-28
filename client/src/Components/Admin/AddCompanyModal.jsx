import {
  useState,
  useEffect,
} from "react";

import {
  FiX,
} from "react-icons/fi";

import useAdminStore
from "../../store/adminStore";

const AddCompanyModal = ({
  isOpen,
  onClose,
  editCompany = null,
}) => {

  // ====================================
  // STORE
  // ====================================
  const {

    createCompany,

    loading,

    updateCompany

  } = useAdminStore();

  // ====================================
  // STATES
  // ====================================
  const [
    formData,
    setFormData,
  ] = useState({
    companyName: "",
    role: "",
    packageOffered: "",
    location: "",
    minCGPA: "",
    allowedBranches: "",
    lastDate: "",
    driveDate: "",
    description: "",
  });

  // Sync form data on edit / open
  useEffect(() => {
    if (isOpen) {
      if (editCompany) {
        setFormData({
          companyName: editCompany.companyName || "",
          role: editCompany.role || "",
          packageOffered: editCompany.packageOffered || "",
          location: editCompany.location || "",
          minCGPA: editCompany.minCGPA || "",
          allowedBranches: Array.isArray(editCompany.allowedBranches)
            ? editCompany.allowedBranches.join(", ")
            : editCompany.allowedBranches || "",
          lastDate: editCompany.lastDate
            ? new Date(editCompany.lastDate).toISOString().split("T")[0]
            : "",
          driveDate: editCompany.driveDate
            ? new Date(editCompany.driveDate).toISOString().split("T")[0]
            : "",
          description: editCompany.description || "",
        });
      } else {
        setFormData({
          companyName: "",
          role: "",
          packageOffered: "",
          location: "",
          minCGPA: "",
          allowedBranches: "",
          lastDate: "",
          driveDate: "",
          description: "",
        });
      }
    }
  }, [editCompany, isOpen]);

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

    const payload = {

      ...formData,

      packageOffered:
      Number(
        formData.packageOffered
      ),

      minCGPA:
      Number(
        formData.minCGPA
      ),

      allowedBranches:
      formData.allowedBranches
      .split(",")
      .map((item) =>
        item.trim()
      ),
    };

   const result =

  editCompany

  ? await updateCompany(

    editCompany._id,

    payload
  )

: await createCompany(
    payload
  );

    if (result.success) {

      onClose();
    }
  };

  // ====================================
  // CLOSE
  // ====================================
  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

      {/* MODAL */}
      <div className="w-full max-w-4xl bg-white rounded-[28px] shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto border border-slate-200">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}
        <div className="flex items-start justify-between px-8 py-6 border-b border-slate-100 bg-slate-50">

          {/* LEFT */}
          <div>

            <h2 className="text-3xl font-black text-slate-900 tracking-tight">

              {editCompany? "Edit Company": "Add Company"}

            </h2>

            <p className="text-sm text-slate-500 mt-2 font-medium">

              Create a new placement drive for students

            </p>

          </div>

          {/* CLOSE */}
          <button

            onClick={onClose}

            className="w-11 h-11 rounded-2xl hover:bg-slate-200/60 flex items-center justify-center transition-all"
          >

            <FiX size={22} />

          </button>

        </div>

        {/* ================================= */}
        {/* FORM */}
        {/* ================================= */}
        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-8"
        >

          {/* ================================= */}
          {/* BASIC DETAILS */}
          {/* ================================= */}
          <div className="bg-slate-50 rounded-3xl p-6">

            <div className="mb-5">

              <h3 className="text-sm font-black uppercase tracking-wider text-slate-500">

                Basic Details

              </h3>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <Input
                label="Company"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />

              <Input
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              />

              <Input
                label="Package"
                name="packageOffered"
                value={formData.packageOffered}
                onChange={handleChange}
              />

            </div>

          </div>

          {/* ================================= */}
          {/* HIRING DETAILS */}
          {/* ================================= */}
          <div className="bg-slate-50 rounded-3xl p-6">

            <div className="mb-5">

              <h3 className="text-sm font-black uppercase tracking-wider text-slate-500">

                Hiring Details

              </h3>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />

              <Input
                label="Min CGPA"
                name="minCGPA"
                value={formData.minCGPA}
                onChange={handleChange}
              />

              <Input
                label="Branches"
                name="allowedBranches"
                value={formData.allowedBranches}
                onChange={handleChange}
                placeholder="CSE, IT, ECE"
              />

            </div>

          </div>

          {/* ================================= */}
          {/* SCHEDULE */}
          {/* ================================= */}
          <div className="bg-slate-50 rounded-3xl p-6">

            <div className="mb-5">

              <h3 className="text-sm font-black uppercase tracking-wider text-slate-500">

                Schedule

              </h3>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Input
                label="Last Date"
                name="lastDate"
                type="date"
                value={formData.lastDate}
                onChange={handleChange}
              />

              <Input
                label="Drive Date"
                name="driveDate"
                type="date"
                value={formData.driveDate}
                onChange={handleChange}
              />

            </div>

          </div>

          {/* ================================= */}
          {/* DESCRIPTION */}
          {/* ================================= */}
          <div className="bg-slate-50 rounded-3xl p-6">

            <div className="mb-5">

              <h3 className="text-sm font-black uppercase tracking-wider text-slate-500">

                Description

              </h3>

            </div>

            <textarea
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter company details, eligibility criteria, hiring process..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500/10 resize-none transition-all"
            />

          </div>

          {/* ================================= */}
          {/* FOOTER */}
          {/* ================================= */}
          <div className="sticky bottom-0 bg-white pt-5 border-t border-slate-100 flex items-center justify-end gap-4">

            {/* CANCEL */}
            <button

              type="button"

              onClick={onClose}

              className="px-6 py-3 rounded-2xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >

              Cancel

            </button>

            {/* SUBMIT */}
            <button

              type="submit"

              disabled={loading}

              className="px-7 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all disabled:opacity-60 shadow-lg shadow-blue-100"
            >

              { loading ? ( editCompany? "Updating..." : "Creating...") : ( editCompany ? "Update Company" : "Create Company")}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

// ======================================
// INPUT
// ======================================
const Input = ({
  label,
  ...props
}) => (

  <div>

    <label className="block text-xs font-black uppercase tracking-wide text-slate-500 mb-2">

      {label}

    </label>

    <input

      {...props}

      required

      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
    />

  </div>
);

export default
AddCompanyModal;