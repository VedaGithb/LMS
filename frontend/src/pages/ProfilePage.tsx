import { useState } from "react";
import { AlertCircle, CircleUser, KeyRound, Loader2, LogOut, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useMyEnroll } from "../features/enrollments/hooks/useMyEnroll";

export const ProfilePage = () => {
    const auth = useAuth();
    const { data, isLoading, isError, refetch } = useMyEnroll();

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!passwordData.currentPassword || !passwordData.newPassword) {
            setMessage({ type: "error", text: "Заполните все поля пароля" });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: "error", text: "Новый пароль должен содержать минимум 6 символов" });
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: "error", text: "Новые пароли не совпадают" });
            return;
        }

        setIsLoad(true)
        try {
            const success = await auth.changePassword(passwordData.currentPassword, passwordData.newPassword);

            if (success) {
                setMessage({ type: "success", text: "Пароль успешно обновлен!" });
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
            } else {
                setMessage({ type: "error", text: "Не удалось изменить пароль" });
            }
        } finally {
            setIsLoad(false)
        }
    };

    if (isLoading) return (
        <div className="bg-[radial-gradient(circle_at_center,_#dbe4ff_0%,_#eef2ff_45%,_#f8fafc_100%)] min-h-screen flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={24} />
            Загрузка профиля...
        </div>
    );

    if (isError || !data) return (
        <div className="bg-[radial-gradient(circle_at_center,_#dbe4ff_0%,_#eef2ff_45%,_#f8fafc_100%)] min-h-screen flex flex-col items-center justify-center gap-2">
            Не удалось загрузить данные обучения
            <button onClick={() => refetch()} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mt-2">
                Попробовать снова <AlertCircle className="text-red-300" size={20} />
            </button>
        </div>
    );

    return (
        <main className="bg-[radial-gradient(circle_at_center,_#dbe4ff_0%,_#eef2ff_45%,_#f8fafc_100%)] min-h-screen py-8">
            <div className="max-w-[1200px] mx-auto px-6">

                {/* 1. Карточка студента */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start bg-white w-full rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80 gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white flex items-center justify-center shadow-md text-2xl font-bold uppercase shrink-0">
                        {auth.user?.email?.slice(0, 2) || <CircleUser className="w-12 h-12" />}
                    </div>
                    <div className="flex-1 min-w-0 w-full text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3">
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 break-all max-w-full">
                                {auth.user?.email}
                            </h1>
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-semibold shrink-0">
                                Студент платформы
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">ID аккаунта: #USR-{String(auth.user?.id || 0).padStart(4, '0')}</p>
                    </div>
                </div>

                {/* 2. Метрики обучения */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                        <p className="text-sm font-medium text-slate-500 mb-1">Активных курсов</p>
                        <p className="text-2xl font-bold text-slate-900">
                            {data.stats.activeCourses} <span className="text-base font-normal text-slate-500">из {data.courses.length}</span>
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                        <p className="text-sm font-medium text-slate-500 mb-1">Завершено уроков</p>
                        <p className="text-2xl font-bold text-slate-900">
                            {data.stats.completedLessons} <span className="text-emerald-600 text-sm font-medium">уроков</span>
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                        <p className="text-sm font-medium text-slate-500 mb-1">Средний прогресс</p>
                        <p className="text-2xl font-bold text-indigo-600">{data.stats.averageProgress}%</p>
                    </div>
                </div>

                {/* 3. Форма редактирования и безопасность */}
                <div className="bg-white w-full rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80 mt-6">
                    <div className="border-b border-slate-200 pb-4 mb-6">
                        <h2 className="text-xl font-bold text-slate-900">Управление аккаунтом</h2>
                        <p className="text-sm text-slate-500">Личные данные и параметры безопасности</p>
                    </div>

                    {/* Личные данные (Email) */}
                    <div className="max-w-xl mb-8">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email учетной записи</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Mail className="w-5 h-5" />
                            </span>
                            <input
                                type="email"
                                disabled
                                value={auth.user?.email || ""}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 cursor-not-allowed text-sm truncate"
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-1.5">Email используется для входа в систему и не подлежит изменению</p>
                    </div>

                    {/* Смена пароля */}
                    <form onSubmit={handlePasswordChange} className="max-w-xl border-t border-slate-100 pt-6">
                        <div className="flex items-center gap-2 mb-4">
                            <KeyRound className="w-5 h-5 text-indigo-600" />
                            <h3 className="font-semibold text-slate-900">Смена пароля</h3>
                        </div>

                        {message && (
                            <div className={`p-3 rounded-xl text-sm mb-4 flex items-center gap-2 ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
                                }`}>
                                {message.type === "success" ? <ShieldCheck className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                                {message.text}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Текущий пароль</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    placeholder="Введите текущий пароль"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Новый пароль</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    placeholder="Минимум 6 символов"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Подтвердите новый пароль</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    placeholder="Повторите новый пароль"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={isLoad}
                                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition-colors shadow-sm"
                            >
                                {isLoad ? "Подождите..." : "Сохранить изменения"}
                            </button>

                            <button
                                type="button"
                                onClick={() => auth.logout()}
                                disabled={isLoad}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 border border-red-200 font-medium rounded-xl text-sm transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                {isLoad ? "Подождите..." : "Выйти из аккаунта"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};