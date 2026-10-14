import { useEffect, useState, type ReactNode } from "react";
import { SettingsContext } from "./SettingsContext";

import type { Setting, TextSize, Theme } from "../types";

export const SettingsProvider = ({ children }: { children: ReactNode }) => {

    const [settings, setSettings] = useState<Setting>(() => {
        const savedSettings = localStorage.getItem("app_settings");

        return savedSettings
            ? JSON.parse(savedSettings)
            : {
                theme: "light",
                textSize: "standard",
                autoNextLesson: true,
                rememberLessonPosition: true,
                codeFontSize: "medium"
            }
    })

    const updateSetting = <K extends keyof Setting>(key: K, value: Setting[K]) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            [key]: value
        }))
    }

    useEffect(() => {
        localStorage.setItem("app_settings", JSON.stringify(settings));

        if (settings.theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        document.documentElement.style.fontSize = settings.textSize === "large" ? "18px" : "16px"
    }, [settings])

    return (
        <SettingsContext.Provider
            value={{
                setting: settings,
                setTheme: (theme: Theme) => updateSetting("theme", theme),
                setTextSize: (textSize: TextSize) => updateSetting("textSize", textSize),
                updateSetting
            }}
        >
            {children}
        </SettingsContext.Provider>
    )
}
