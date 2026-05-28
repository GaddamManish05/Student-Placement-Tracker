import { motion } from "framer-motion";

const DashboardSkeleton = () => {
  return (
    <div className="animate-pulse max-w-[1600px] mx-auto">
      {/* HEADER SKELETON */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
        <div>
          <div className="h-10 w-64 bg-slate-200 rounded-2xl mb-2" />
          <div className="h-5 w-80 bg-slate-200 rounded-xl" />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="h-12 w-[300px] bg-slate-200 rounded-2xl" />
          <div className="h-12 w-36 bg-slate-200 rounded-2xl" />
          <div className="h-12 w-36 bg-slate-200 rounded-2xl" />
        </div>
      </div>

      {/* STATS SKELETON */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-[24px] p-7 h-44 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-slate-100" />
            <div>
              <div className="h-8 w-24 bg-slate-200 rounded-xl mb-2" />
              <div className="h-4 w-32 bg-slate-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS SKELETON */}
      <div className="grid grid-cols-12 gap-6 mb-10">
        <div className="col-span-12 xl:col-span-8 bg-white border border-slate-200 rounded-[28px] p-6 h-[400px] flex flex-col justify-between">
          <div>
            <div className="h-7 w-48 bg-slate-200 rounded-xl mb-2" />
            <div className="h-4 w-64 bg-slate-200 rounded-lg" />
          </div>
          <div className="h-64 bg-slate-100 rounded-2xl w-full" />
        </div>
        <div className="col-span-12 xl:col-span-4 bg-white border border-slate-200 rounded-[28px] p-6 h-[400px] flex flex-col justify-between">
          <div>
            <div className="h-7 w-40 bg-slate-200 rounded-xl mb-2" />
            <div className="h-4 w-52 bg-slate-200 rounded-lg" />
          </div>
          <div className="w-44 h-44 rounded-full border-8 border-slate-100 mx-auto flex items-center justify-center" />
          <div className="space-y-2 mt-4">
            <div className="h-4 bg-slate-100 rounded-lg w-full" />
            <div className="h-4 bg-slate-100 rounded-lg w-5/6" />
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION SKELETON */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8 bg-white border border-slate-200 rounded-[28px] p-6 h-[350px] flex flex-col justify-between">
          <div className="h-7 w-40 bg-slate-200 rounded-xl" />
          <div className="space-y-4 my-6">
            <div className="h-10 bg-slate-100 rounded-xl w-full" />
            <div className="h-10 bg-slate-100 rounded-xl w-full" />
            <div className="h-10 bg-slate-100 rounded-xl w-full" />
          </div>
        </div>
        <div className="col-span-12 xl:col-span-4 bg-white border border-slate-200 rounded-[28px] p-6 h-[350px] flex flex-col justify-between">
          <div className="h-7 w-40 bg-slate-200 rounded-xl" />
          <div className="space-y-4 my-6">
            <div className="h-12 bg-slate-100 rounded-xl w-full" />
            <div className="h-12 bg-slate-100 rounded-xl w-full" />
            <div className="h-12 bg-slate-100 rounded-xl w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
