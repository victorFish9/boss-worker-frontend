"use client";

import { useState, useEffect } from "react";
import config from "../../config";

export default function StoragePage() {
    const [files, setFiles] = useState([]); // Состояние для хранения списка файлов
    const [error, setError] = useState(""); // Состояние для хранения ошибок

    // Получение списка файлов
    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch(`${config.API_BASE_URL}/list/boss-worker-bucket`);
                const data = await response.json();
                setFiles(data.files);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchFiles();
    }, []);

    return (
        <div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <h1>List of Files</h1>
            <ul>
                {files.map((file, index) => (
                    <li key={index}>
                        <div>
                            <strong>{file.name}</strong> -{" "}
                            <a href={`${config.API_BASE_URL}/download/boss-worker-bucket/${file.name}`}>Download</a>
                        </div>
                        <div>
                            <strong>Tags:</strong>
                            {file.tags.length > 0 ? (
                                <ul>
                                    {file.tags.map((tag, tagIndex) => (
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
                ))}
            </ul>
        </div>
    );
}