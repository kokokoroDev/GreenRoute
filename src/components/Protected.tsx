import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";

interface ProtectedProps {
  children: React.ReactNode;
}

const Protected = ({ children }: ProtectedProps) => {
  const { isAuthenticated, loading } = useApp();
  const location = useLocation();

  if (loading) {
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    // Save the attempted URL
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default Protected;