import Sidebar
from "./Sidebar";

import Navbar
from "./Navbar";

const DashboardLayout = ({
  children,
}) => {

  return (

    <div className="min-h-screen bg-slate-50">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="ml-[250px]">

        {/* NAVBAR */}
        <Navbar />

        {/* CONTENT */}
        <main className="p-6">

          {children}

        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;