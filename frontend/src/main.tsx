import React from "react";
import ReactDOM from "react-dom/client";

import App from "./app/App";

import { QueryProvider } from "./app/provider/QueryProvider";
import { AuthProvider } from "./features/auth/context/AuthProvider";
import { SettingsProvider } from "./features/settings/context/SettingsProvider";


import "./styles/global.css";


ReactDOM.createRoot(
    document.getElementById("root")!
).render(
    <React.StrictMode>
        <QueryProvider>
            <AuthProvider>
                <SettingsProvider>
                    <App />
                </SettingsProvider>
            </AuthProvider>
        </QueryProvider>
    </React.StrictMode>
);  