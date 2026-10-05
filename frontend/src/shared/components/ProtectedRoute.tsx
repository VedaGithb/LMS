import {useAuth} from "../../features/auth/hooks/useAuth";
import {Navigate, Outlet, useLocation} from "react-router-dom";

export const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} />
    }
    return <Outlet />
}