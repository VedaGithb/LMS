import { createContext } from "react";
import type { Setting, TextSize, Theme } from "../types";

export type SettingsContextValue = {
    setting: Setting;
    setTheme: (theme: Theme) => void;
    setTextSize: (textSize: TextSize) => void;
    updateSetting: <K extends keyof Setting>(key: K, value: Setting[K]) => void;
};

export const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);