"use client";

import { useState, useEffect } from "react";
import config from "../../config";
import { parseCookies } from "nookies";
import FileHistory from "../components/FileHistory";


export default function StoragePage() {
    const [files, setFiles] = useState([]); // Состояние для хранения списка файлов
    const [error, setError] = useState(""); // Состояние для хранения ошибок

    // Получение списка файлов
    useEffect(() => {
        const cookies = parseCookies()
        const token = cookies.accessToken
        if (!token) {
            setError("Token is missing")
            return
        }

        console.log("Token from localStorage: ", token)

        const fetchFiles = async () => {

            try {
                const response = await fetch(`${config.API_BASE_URL}/files/list/boss-worker-bucket`, {
                    headers: {
                        Authorization: token,
                    }
                });

                const data = await response.json();
                setFiles(data.files);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchFiles();
    }, []);

    return (
        <div className="container">
            {error && <p style={{ color: "red" }}>{error}</p>}
            <h1>Files available for download</h1>
            <ul>
                {files.map((file, index) => {
                    let parsedTags = [];

                    try {
                        parsedTags = JSON.parse(file.tags); // Парсим строку в массив объектов
                    } catch (e) {
                        console.error("Ошибка парсинга tags:", e);
                    }

                    return (
                        <li key={index}>
                            <div>
                                <strong>{file.name}</strong> -{" "}
                                <a href={`${config.API_BASE_URL}/files/download/${file.bucket}/${file.name}`}>Download</a>
                            </div>
                            <div>
                                <strong>Description:</strong>
                                {parsedTags.length > 0 ? (
                                    <ul>
                                        {parsedTags.map((tag, tagIndex) => (
                                            <li key={tagIndex}>
                                                {tag.Key}: {tag.Value}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span> No tags</span>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>

            <FileHistory />
        </div>
    );

}

