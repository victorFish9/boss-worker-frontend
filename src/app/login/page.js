// eslint-disable-next-line @typescript-eslint/no-unused-vars

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import config from "../../config";
import { setCookie } from "nookies";


export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)
    const [currentSlide, setCurrentSlide] = useState(0)
    const router = useRouter();

    const images = [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMopW-mYcbgg5N759gGD96shk3KtYC39jwKg&s",
        "https://images.prismic.io/doge/c8f63200-9fd6-4fbb-ae72-4ddc8418375c_maltipu-15.jpg?auto=compress,format&rect=0,0,1080,1080&w=456&h=456",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmi5RtC9Oa_qgjFP3ROldlwj4c9ohoEZTmUg&s"
    ]

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % images.length)
            }, 2000);
            return () => clearInterval(interval)
        }
    }, [loading])

    const handleLogin = async (event) => {
        event.preventDefault()
        setLoading(true)
        setError("")
        try {
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
                router.push("/storage");
            } else {
                throw new Error(data.detail || "Try again")
            }
        } catch (err) {

            setError("Ошибка входа: " + (data.detail || "Попробуйте снова"));
        } finally {
            setLoading(false)
        }
    };


    return (
        <div className="container">
            {loading ? (
                <div className="slideshow">
                    <img src={images[currentSlide]} alt="Loading..." className="slide" />
                    <p>Пожалуйста, подождите...(ради мальтипу)</p>
                </div>
            ) : (

                <div className="form">
                    <div className="title">Welcome,<br /><span>sign in to continue</span></div>
                    <input className="input" name="email" placeholder="Username" type="email" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input className="input" name="password" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />


                    <button className="button-confirm" onClick={handleLogin}>Let`s go →</button>
                    {error && <p className="error-message">{error}</p>}
                </div>
            )}
        </div>

    );
}
