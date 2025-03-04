"use client";

import { useState, useEffect } from "react";
import UploadFile from "../components/UploadFile";
import config from "../../config";

export default function StoragePage() {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFiles = async () => {
            const token = localStorage.getItem("access_token");

            if (!token) {
                setError("Вы не авторизованы");
                return;
            }



            try {
                const response = await fetch(`${config.API_BASE_URL}/storage/storage/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Ошибка при получении данных");
                }

                const data = await response.json();
                setFiles(data.files);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchFiles();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("access_token"); // Удаляем токен
        window.location.href = "/login"; // Перенаправляем на страницу входа
    };


    return (
        <div>

            <UploadFile />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <h1>Список файлов</h1>
            <ul>
                {files.map((file) => (
                    <li key={file.filename}>
                        {file.filename} - <a href={file.download_url}>Скачать</a>
                    </li>
                ))}
            </ul>
            <button onClick={handleLogout}>Выйти</button>
        </div>
    );
}
