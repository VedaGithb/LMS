import { useEffect } from "react";
import { CaseSensitive, Moon, Settings, Sun, X } from "lucide-react";
import { useSettings } from "../hooks/useSettings";


interface SettingModalProps {
    onClose: () => void;
}

export const SettingModal = ({ onClose }: SettingModalProps) => {
    const { setting, setTheme, setTextSize, updateSetting } = useSettings();

    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", handleKeydown)
        return () => {
            window.removeEventListener("keydown", handleKeydown)
        }
    }, [onClose])

    useEffect(() => {
        document.body.style.overflow = "hidden"
        return () => {
            document.body.style.overflow = ""
        }
    }, [])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
            <div className="w-full max-w-[620px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[92vh]" onClick={e => e.stopPropagation()}>
                <div className="p-6 flex items-center justify-between border-b border-slate-300 mb-1">
                    <div className="flex items-center gap-3">
                        <Settings className="bg-indigo-100 p-1 w-10 h-10 rounded-xl text-indigo-600" />
                        <h2 className="text-2xl font-bold">Настройки</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1 text-slate-400 transition-colors 
                                    hover:bg-slate-100 hover:text-slate-600 
                                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6">
                    <h3 className="uppercase text-slate-400 font-bold">01/внешний вид</h3>
                    <p className="text-slate-600 text-sm mt-3">Тема оформления</p>
                    <div className="grid grid-cols-2 bg-slate-100 p-1.5 rounded-xl gap-4 mt-1">
                        <button type="button" onClick={() => setTheme("light")} className={`flex items-center justify-center gap-3 rounded-xl px-2 py-1 ${setting.theme === "light" ? `bg-white text-indigo-600 shadow-sm` : `hover:bg-slate-200`}`}><Sun className="w-6 h-6" />Светлая</button>
                        <button type="button" onClick={() => setTheme("dark")} className={`flex items-center justify-center gap-3 rounded-xl px-2 py-1 ${setting.theme === "dark" ? `bg-white text-indigo-600 shadow-sm` : `hover:bg-slate-200`}`}><Moon className="w-6 h-6" />Темная</button>
                    </div>
                    <p className="text-slate-600 text-sm mt-3">Размер текста интерфейса</p>
                    <div className="grid grid-cols-2 gap-2 mt-1 ">
                        <label className={`rounded-xl p-3 flex items-center justify-between transition-colors cursor-pointer ${setting.textSize === "standard"
                            ? "border-2 border-indigo-600 bg-indigo-50/40"
                            : "border border-slate-300 bg-white hover:border-slate-400"
                            }`}>
                            <div className="flex items-center gap-3">
                                <CaseSensitive className={`bg-slate-200 p-1 w-8 h-8 rounded-lg text-slate-600`} />
                                <div>
                                    <p className="text-sm">Стандартный</p>
                                    <p className="text-xs text-slate-500">14-16px (базовый)</p>
                                </div>
                            </div>
                            <input
                                type="radio"
                                name="textSize"
                                value="standard"
                                checked={setting.textSize === "standard"}
                                onChange={() => setTextSize("standard")}
                                className="w-4 h-4"
                            />
                        </label>
                        <label className={`rounded-xl p-3 flex items-center justify-between transition-colors cursor-pointer ${setting.textSize === "large"
                            ? "border-2 border-indigo-600 bg-indigo-50/40"
                            : "border border-slate-300 bg-white hover:border-slate-400"
                            }`}>
                            <div className="flex items-center gap-3">
                                <CaseSensitive className={`bg-slate-200 p-1 w-8 h-8 rounded-lg text-slate-600`} />
                                <div>
                                    <p className="text-sm">Увеличенный</p>
                                    <p className="text-xs text-slate-500">16-18px (комфортный)</p>
                                </div>
                            </div>
                            <input
                                type="radio"
                                name="textSize"
                                value="large"
                                checked={setting.textSize === "large"}
                                onChange={() => setTextSize("large")}
                                className="w-4 h-4"
                            />
                        </label>
                    </div>
                </div>
                <div className="p-6">
                    <h3 className="uppercase text-slate-400 font-bold mb-2">02/процесс обучения</h3>
                    <div className="grid grid-rows-2 gap-2 bg-slate-100 rounded-lg border border-slate-300">
                        <div className="flex items-center justify-between border-b border-slate-300 px-4 py-3">
                            <div>
                                <p className="text-slate-700 font-bold text-sm">Автоматически переходить к следующему уроку</p>
                                <p className="text-slate-500 text-xs">Открывать следующий урок после завершения текущего</p>
                            </div>
                            <button
                                type="button"
                                role="switch"
                                aria-checked={setting.autoNextLesson}
                                onClick={() => updateSetting("autoNextLesson", !setting.autoNextLesson)}
                                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${setting.autoNextLesson ? "bg-indigo-600" : "bg-slate-300"
                                    }`}
                            >
                                <div
                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${setting.autoNextLesson ? "translate-x-5" : "translate-x-0"
                                        }`}
                                />
                            </button>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3">
                            <div>
                                <p className="text-slate-700 font-bold text-sm">Запоминать место в уроке</p>
                                <p className="text-slate-500 text-xs">При повторном открытии возвращаться к последнему месту изучения</p>
                            </div>
                            <button
                                type="button"
                                role="switch"
                                aria-checked={setting.rememberLessonPosition}
                                onClick={() => updateSetting("rememberLessonPosition", !setting.rememberLessonPosition)}
                                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${setting.rememberLessonPosition ? "bg-indigo-600" : "bg-slate-300"
                                    }`}
                            >
                                <div
                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${setting.rememberLessonPosition ? "translate-x-5" : "translate-x-0"
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}