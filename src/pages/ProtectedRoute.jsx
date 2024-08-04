<Route
  path="/protected"
  element={
    <ProtectedRoute>
      <ProtectedComponent />
    </ProtectedRoute>
  }
/>

import { useNavigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) {
    navigate("/login", { state: { from: location } });
    return null;
  }

  return children;
};
