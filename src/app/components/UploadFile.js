/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useState } from "react";
import config from "../../config";

export default function UploadPage() {
    const [files, setFiles] = useState([]);
    const [description, setDescription] = useState("")
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (event) => {
        setFiles(event.target.files);
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setMessage("Выберите файлы");
            return;
        }

        setUploading(true);
        const formData = new FormData();

        // Добавляем все файлы в FormData
        for (const file of files) {
            formData.append("files", file);
        }

        if (description.trim()) {
            formData.append("description", description)
        }

        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${config.API_BASE_URL}/storage/upload/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Файлы загружены: " + data.filename);
                setDescription("");
                setFiles([])
            } else {
                setMessage("Ошибка: " + data.error);
            }
        } catch {
            setMessage("Ошибка загрузки");
        }

        setUploading(false);
    };

    return (
        <div>
            <h1>Загрузка файлов</h1>
            <input type="file" multiple onChange={handleFileChange} />

            {/* 👇 Добавили поле ввода описания */}
            <input
                type="text"
                placeholder="Введите описание (необязательно)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Загрузка..." : "Загрузить"}
            </button>
            <p>{message}</p>
        </div>
    );
}
