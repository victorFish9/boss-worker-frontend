// eslint-disable-next-line @typescript-eslint/no-unused-vars

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "nookies";
import Image from "next/image";
import config from "../../config";


export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)
    const [currentSlide, setCurrentSlide] = useState(0)
    const router = useRouter();

    const images = [
        "/images/maltipoo.png",
        "/images/maltipoo2.jpeg",
        "/images/maltipoo3.jpg",

    ]

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % images.length)
            }, 2000);
            return () => clearInterval(interval)
        }
    }, [loading, images.length])

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
                console.log("Login was successful");
                setCookie(null, "accessToken", data.token, {
                    maxAge: 60 * 60 * 24,
                    path: "/",
                })
                router.push("/");
            } else {
                setError("Error to login: " + (data.detail || "Попробуйте снова"));
            }
        } catch {
            setError("Error to login: Server is not responding");
        }
        finally {
            setLoading(false)
        }
    };


    return (
        <div className="container">
            {loading ? (
                <div className="slideshow">
                    <Image src={images[currentSlide]} alt="Loading..." className="slide" width={200} height={150} priority />
                    <p>Please wait a bit...(for maltipoo)</p>
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
