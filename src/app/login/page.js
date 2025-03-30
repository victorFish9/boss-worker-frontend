// eslint-disable-next-line @typescript-eslint/no-unused-vars

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import config from "../../config";
import { setCookie } from "nookies";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (event) => {
        event.preventDefault();

        const response = await fetch(`${config.API_BASE_URL}/auth/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Успешный вход:", data);
            setCookie(null, "accessToken", data.token, {
                maxAge: 60 * 60 * 24,
                path: "/",
            })
            router.push("/storage"); // Перенаправление после входа
        } else {
            console.error("Ошибка входа:", data);
            setError("Ошибка входа: " + (data.detail || "Попробуйте снова"));
        }
    };


    return (
        // <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        //     <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        //         <h2 className="text-2xl font-semibold text-center mb-4">Вход</h2>
        //         {error && <p className="text-red-500">{error}</p>}
        //         <input
        //             type="text"
        //             placeholder="Имя пользователя"
        //             value={username}
        //             onChange={(e) => setUsername(e.target.value)}
        //             className="w-full p-2 border rounded mb-2"
        //         />
        //         <input
        //             type="password"
        //             placeholder="Пароль"
        //             value={password}
        //             onChange={(e) => setPassword(e.target.value)}
        //             className="w-full p-2 border rounded mb-2"
        //         />
        //         <button
        //             onClick={handleLogin}
        //             className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        //         >
        //             Войти
        //         </button>
        //     </div>



        // </div>
        <div className="container">
            <div className="form">
                <div className="title">Welcome,<br /><span>sign in to continue</span></div>
                <input className="input" name="email" placeholder="Username" type="email" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input className="input" name="password" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />


                <button className="button-confirm" onClick={handleLogin}>Let`s go →</button>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>

    );
}
