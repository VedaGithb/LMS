import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

import logo from "../../assets/Logo.png";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { SettingModal } from "../../features/settings/components/SettingsModal";

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [isSettingOpen, setIsSettingOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const auth = useAuth();
    const location = useLocation();

    useEffect(() => {
        setIsMobileNavOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!isMenuOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current?.contains(event.target as Node)) {
                return;
            }
            setIsMenuOpen(false);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleSetting = () => {
        setIsSettingOpen(!isSettingOpen);
        setIsMenuOpen(false);
    };

    return (
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 md:px-8 py-3 relative z-40">
            <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-4">

                <Link to="/" className="shrink-0 flex items-center">
                    <img src={logo} alt="Logo" className="h-9 sm:h-10 w-auto" />
                </Link>

                <nav className="hidden md:flex gap-6 lg:gap-10 items-center">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `transition-colors text-sm font-medium ${isActive
                                ? "bg-indigo-100 text-indigo-600 rounded-lg px-3 py-2"
                                : "text-slate-600 hover:bg-slate-100 rounded-lg px-3 py-2"
                            }`
                        }
                    >
                        Главная
                    </NavLink>
                    <NavLink
                        to="/courses"
                        className={({ isActive }) =>
                            `transition-colors text-sm font-medium ${isActive
                                ? "bg-indigo-100 text-indigo-600 rounded-lg px-3 py-2"
                                : "text-slate-600 hover:bg-slate-100 rounded-lg px-3 py-2"
                            }`
                        }
                    >
                        Все курсы
                    </NavLink>

                    {auth.user && (
                        <NavLink
                            to="/my-learning"
                            className={({ isActive }) =>
                                `transition-colors text-sm font-medium ${isActive
                                    ? "bg-indigo-100 text-indigo-600 rounded-lg px-3 py-2"
                                    : "text-slate-600 hover:bg-slate-100 rounded-lg px-3 py-2"
                                }`
                            }
                        >
                            Мои курсы
                        </NavLink>
                    )}
                </nav>

                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="relative" ref={menuRef}>
                        {auth.user ? (
                            <button
                                type="button"
                                onClick={toggleMenu}
                                className="flex items-center gap-1.5 text-slate-700 font-medium hover:text-indigo-600 transition-colors cursor-pointer bg-slate-50 hover:bg-slate-100 py-1.5 px-3 rounded-lg border border-slate-200 text-sm"
                            >
                                <span className="max-w-[75px] xs:max-w-[120px] sm:max-w-[180px] md:max-w-[220px] truncate">
                                    {auth.user.email}
                                </span>
                                <span className="text-xs text-slate-400">{isMenuOpen ? "▲" : "▼"}</span>
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="text-sm font-medium text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Войти
                            </Link>
                        )}

                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-xl py-2 z-50">
                                <div className="px-4 border-b border-slate-100 py-2 bg-slate-50/70">
                                    <p className="text-xs text-slate-500">Вы вошли как</p>
                                    <p className="text-sm font-medium text-slate-800 truncate">{auth.user!.email}</p>
                                </div>
                                <div className="p-1">
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        Профиль
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={toggleSetting}
                                        className="w-full text-left block px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        Настройки
                                    </button>
                                    <button
                                        type="button"
                                        className="block px-3 py-2 hover:bg-red-50 rounded-lg w-full text-left text-sm text-red-600 transition-colors mt-1 border-t border-slate-100 pt-2"
                                        onClick={() => {
                                            auth.logout();
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        Выйти
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                        className="md:hidden p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                        aria-label="Мобильное меню"
                    >
                        {isMobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {isMobileNavOpen && (
                <div className="md:hidden border-t border-slate-200 mt-3 pt-3 pb-2 space-y-1">
                    <NavLink
                        to="/"
                        onClick={() => setIsMobileNavOpen(false)}
                        className={({ isActive }) =>
                            `block px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-slate-700 hover:bg-slate-100"
                            }`
                        }
                    >
                        Главная
                    </NavLink>
                    <NavLink
                        to="/courses"
                        onClick={() => setIsMobileNavOpen(false)}
                        className={({ isActive }) =>
                            `block px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-slate-700 hover:bg-slate-100"
                            }`
                        }
                    >
                        Все курсы
                    </NavLink>
                    {auth.user && (
                        <NavLink
                            to="/my-learning"
                            onClick={() => setIsMobileNavOpen(false)}
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "text-slate-700 hover:bg-slate-100"
                                }`
                            }
                        >
                            Мои курсы
                        </NavLink>
                    )}
                </div>
            )}

            {isSettingOpen && <SettingModal onClose={toggleSetting} />}
        </header>
    );
};