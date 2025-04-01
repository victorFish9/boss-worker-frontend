"use client";

import { useState, useEffect } from "react";
import config from "../../config";
import { parseCookies } from "nookies";
import FileHistory from "../components/FileHistory";
import NavBar from '../components/Navbar'


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
        <div className="p-4 mt-6 border rounded-lg shadow bg-gray-50">
            <NavBar />
            {error && <p className="text-red-500">{error}</p>}
            <h1 className="text-lg font-semibold mb-3">Files available for download</h1>

            <div className="card_storage">
                {files.length > 0 ? (
                    <ul className="card_storage_ul">
                        {files.map((file, index) => {
                            let parsedTags = [];
                            try {
                                parsedTags = JSON.parse(file.tags);
                            } catch (e) {
                                console.error("Ошибка парсинга tags:", e);
                            }

                            return (
                                <li key={index} className="card_storage_li list-item">
                                    <div className="download_div">
                                        <a
                                            href={`${config.API_BASE_URL}/files/download/${file.bucket}/${file.name}`}
                                            className="download-link"
                                        >
                                            Download
                                        </a>
                                        <h3 className="card__title font-medium">{file.name}</h3>
                                    </div>
                                    <div className="card__content text-sm text-gray-500">
                                        <strong>Description:</strong>
                                        {parsedTags.length > 0 ? (
                                            <ul className="list-disc pl-5">
                                                {parsedTags.map((tag, tagIndex) => (
                                                    <li key={tagIndex}>
                                                        <span className="font-semibold">{tag.Key}:</span> {tag.Value}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span>No tags</span>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                ) : (
                    <p>No files available.</p>
                )}
            </div>

            <FileHistory />
        </div>
    );



}

