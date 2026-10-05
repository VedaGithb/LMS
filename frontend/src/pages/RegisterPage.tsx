import {Link, useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {useAuth} from "../features/auth/hooks/useAuth";

import logo from "../assets/Logo.png";


export const RegisterPage = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [secondPassword, setSecondPassword] = useState<string>("");
    const [registerError, setRegisterError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const auth = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== secondPassword) {
            setRegisterError("Пароли не совпадают");
            return;
        }

        setRegisterError("");
        auth.clearError();

        setIsLoading(true);
        try {
            const success = await auth.register(email, password);

            if (success) {
                navigate("/login");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="
         bg-surface font-body-md text-body-md text-on-surface min-h-screen flex items-center justify-center p-margin antialiased
        ">
            <section className="w-full max-w-md bg-surface-container-lowest p-space-xl rounded-xl
                                shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_1px_2px_-1px_rgba(15,23,42,0.04)]
            ">
                <div className="flex flex-col items-center text-center">
                    <img src={logo} alt="VedaLearn" />

                    <p className="mt-2 text-body-sm text-secondary">
                        Продолжи обучение с того места, где остановился.
                    </p>
                </div>
                <div>
                    <h2 className="mt-8 text-headline-lg font-semibold tracking-tight">
                        Создать аккаунт
                    </h2>

                    <p className="mt-2 text-body-md text-secondary">
                        Создай аккаунт и начни обучение.
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
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='mt-4'>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-label-md"
                        >
                            Пароль
                        </label>
                        <input
                            className="w-full rounded-lg border border-outline-variant bg-surface
                                       px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            id="password"
                            type="password"
                            name="password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className='mt-4'>
                        <label
                            htmlFor="password2"
                            className="mb-2 block text-label-md"
                        >
                            Подтвердить пароль
                        </label>
                        <input
                            className="w-full rounded-lg border border-outline-variant bg-surface
                                       px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            id="password2"
                            type="password"
                            name="password2"
                            required
                            onChange={(e) => setSecondPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-6 w-full rounded-lg bg-primary py-3 text-white
                                   font-semibold transition-colors hover:bg-primary-container active:scale-[0.99]"
                    >
                        {isLoading ? "Подождите..." : "Зарегистрироваться"}</button>
                    {(registerError || auth.error) && (
                        <p className="mt-4 text-body-sm text-error">
                            {registerError || auth.error}
                        </p>
                    )}
                </form>

                <div className="my-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-outline-variant" />
                    <span className="text-label-sm text-secondary">или</span>
                    <div className="h-px flex-1 bg-outline-variant" />
                </div>

                <p className="text-center text-body-sm text-secondary">
                    Уже есть аккаунт?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-primary hover:underline"
                    >
                        Войти
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