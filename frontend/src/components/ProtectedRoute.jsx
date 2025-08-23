import React from "react";
import { Navigate } from "react-router-dom";
import useStore from "../store/useStore";

export const ProtectedRoutes = ({ children }) => {
    const { user } = useStore();

    if (!user) {
        return <Navigate to="/" replace />; // ✅ user না থাকলে login page এ redirect
    }

    return children;
};
export const PublicRoutes = ({ children }) => {
    const { user } = useStore();

    if (user) {
        return <Navigate to="/dashboard" replace />; // ✅ user থাকলে dashboard এ redirect
    }

    return children;
};

// export default PublicRoutes;



