import {Link, useLocation, useNavigate} from "react-router-dom";
import React, {useState} from "react";

import {useAuth} from "../features/auth/hooks/useAuth";
import logo from "../assets/Logo.png";

export const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const auth = useAuth();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const success = await auth.login(email, password);

        if (success) {
            const from = location.state?.from?.pathname || "/my-learning";
            navigate(from, { replace: true });
        }
    }

    return (
        <main className="bg-surface font-body-md text-body-md text-on-surface min-h-screen
                         flex items-center justify-center p-margin antialiased"
        >
            <section className="w-full max-w-md bg-surface-container-lowest p-space-xl rounded-xl
                                shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_1px_2px_-1px_rgba(15,23,42,0.04)]"
            >
                <div className="flex flex-col items-center text-center">
                    <img src={logo} alt="Logo"/>

                    <p className="mt-1 text-body-sm text-secondary">
                        Продолжи обучение с того места, где остановился.
                    </p>
                </div>

                <div>
                    <h2 className="mt-8 text-headline-lg font-semibold tracking-tight">
                        Вход в аккаунт
                    </h2>

                    <p className="mt-2 text-body-md text-secondary">
                        Введите ваши данные для продолжения обучения
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mt-6">
                        <label
                            htmlFor="email"
                            className="mb-2 block text-label-md"
                        >
                            Электронная почта
                        </label>

                        <input
                            className="w-full rounded-lg border border-outline-variant bg-surface
                                       px-4 py-3 outline-none focus:border-primary focus:ring-2
                                       focus:ring-primary/20"
                            id="email"
                            type="email"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mt-4">
                        <div className="mb-2 flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="text-label-md"
                            >
                                Пароль
                            </label>

                            <button
                                type="button"
                                className="text-label-sm text-primary hover:underline"
                            >
                                Забыли пароль?
                            </button>
                        </div>

                        <input
                            className="w-full rounded-lg border border-outline-variant bg-surface
                                       px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            id="password"
                            type="password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <input
                            id="remember"
                            type="checkbox"
                            className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                        />

                        <label
                            htmlFor="remember"
                            className="text-body-sm text-secondary"
                        >
                            Запомнить меня
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="mt-6 w-full rounded-lg bg-primary py-3 text-white
                                   font-semibold transition-colors hover:bg-primary-container active:scale-[0.99]"
                    >
                        Войти
                    </button>
                    {auth.error && (
                        <p className="mt-4 text-body-sm text-error">
                            {auth.error}
                        </p>
                    )}
                </form>

                <div className="my-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-outline-variant" />
                    <span className="text-label-sm text-secondary">или</span>
                    <div className="h-px flex-1 bg-outline-variant" />
                </div>

                <p className="text-center text-body-sm text-secondary">
                    Нет аккаунта?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-primary hover:underline"
                    >
                        Зарегистрироваться
                    </Link>
                </p>

                <div className="mt-6 flex items-start gap-3 rounded-lg bg-surface-container-low p-3">
                    <span className="text-primary">
                        ✓
                    </span>

                    <p className="text-body-sm text-secondary">
                        Платформа для системного обучения техническим дисциплинам
                    </p>
                </div>
            </section>
        </main>
    )
}