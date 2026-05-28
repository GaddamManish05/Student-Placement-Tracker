import { Navigate }
from "react-router-dom";

import useAuthStore
from "../../store/authStore";

const ProtectedRoute = ({
  children,
  adminOnly = false,
}) => {

  const {

    isAuthenticated,

    currentUser,

    authLoading,

  } = useAuthStore();

  // ====================================
  // LOADING
  // ====================================
  if(authLoading){

    return (

      <div className="min-h-screen flex items-center justify-center bg-slate-50">

        <div className="text-center">

          <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-5" />

          <p className="text-slate-500 font-medium">

            Restoring session...

          </p>

        </div>
      </div>
    );
  }

  // ====================================
  // NOT AUTHENTICATED
  // ====================================
  if(!isAuthenticated){

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ====================================
  // ADMIN CHECK
  // ====================================
  if(

    adminOnly &&

    currentUser?.role !== "admin"

  ){

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;