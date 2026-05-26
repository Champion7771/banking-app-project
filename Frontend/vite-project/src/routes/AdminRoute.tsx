import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

interface Props {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: Props) => {
  const { user, isAuthenticated, isLoadingUser } = useSelector(
    (state: RootState) => state.auth,
  );

  // WAIT FOR USER LOAD
  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // NOT LOGGED IN
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // NOT ADMIN
  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default AdminRoute;
