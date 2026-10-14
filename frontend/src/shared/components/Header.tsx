import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";

import logo from "../../assets/Logo.png"

import { useAuth } from "../../features/auth/hooks/useAuth";

import { SettingModal } from "../../features/settings/components/SettingsModal";

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSettingOpen, setIsSettingOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const auth = useAuth();

    useEffect(() => {
        if (!isMenuOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current?.contains(event.target as Node)) {
                return;
            }

            setIsMenuOpen(false);
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsMenuOpen(false);
            }

        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isMenuOpen]);


    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const toggleSetting = () => {
        setIsSettingOpen(!isSettingOpen)
    }

    return (
        <header className="bg-white border-b border-slate-200 px-8 py-3 flex items-center gap-8 justify-between">
            <div>
                <img src={logo} alt="Logo" className="h-10" />
            </div>
            <nav className="flex gap-12 items-center">
                <NavLink to="/" className={({ isActive }) =>
                    `transition-colors ${isActive
                        ? 'bg-indigo-100 text-indigo-600 rounded-lg px-3 py-2'
                        : 'text-slate-600 hover:bg-slate-100 rounded-lg px-3 py-2 transition-colors'

                    }`
                }>Главная</NavLink>
                <NavLink to="/courses" className={({ isActive }) =>
                    `transition-colors ${isActive
                        ? 'bg-indigo-100 text-indigo-600 rounded-lg px-3 py-2'
                        : 'text-slate-600 hover:bg-slate-100 rounded-lg px-3 py-2 transition-colors'

                    }`
                }>Все курсы</NavLink>

                {auth.user && (
                    <NavLink to="/my-learning" className={({ isActive }) =>
                        `transition-colors ${isActive
                            ? 'bg-indigo-100 text-indigo-600 rounded-lg px-3 py-2'
                            : 'text-slate-600 hover:bg-slate-100 rounded-lg px-3 py-2'

                        }`
                    }>Мои курсы</NavLink>
                )}
            </nav>
            <div className="relative" ref={menuRef}>
                {auth.user
                    ? <button type="button" onClick={toggleMenu} className="
                    text-slate-700 font-medium hover:text-indigo-600 transition-colors
                    cursor-pointer bg-transparent border-0 p-0
                    ">{auth.user.email} {isMenuOpen ? "▴" : "▾"}</button>
                    : <Link to="/login" className="text-slate-600 hover:text-indigo-600 transition-colors" >Войти</Link>
                }
                {isMenuOpen && (
                    <div className="
                     absolute right-0 top-full mt-2 w-54 rounded-lg border border-slate-200
                     bg-white shadow-lg py-2 z-50
                    ">
                        <div className="px-4 border-b border-slate-200 py-1 bg-slate-50 rounded-md">
                            <p className="text-sm text-slate-700">Вы вошли как</p>
                            <p className="text-base text-slate-700 truncate">{auth.user!.email}</p>
                        </div>
                        <Link to="/profile" className="block px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-md">Профиль</Link>
                        <button onClick={toggleSetting} className="w-full text-left block px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-md">Настройки</button>
                        <button className="block px-4 py-2 hover:bg-slate-100 rounded-md w-full text-left text-red-500 border-t border-slate-200" onClick={() => { auth.logout(); setIsMenuOpen(false); }}>Выйти</button>
                    </div>
                )}
            </div>

            {isSettingOpen && <SettingModal onClose={toggleSetting} />}
        </header>
    )
}