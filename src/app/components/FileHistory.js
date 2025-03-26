"use client";

import { useState, useEffect } from "react";
import config from "../../config";
import { parseCookies } from "nookies";

export default function FileHistory() {
    const [files, setFiles] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        const cookies = parseCookies()
        const token = cookies.accessToken

        if (!token) {
            setError("Token is missing")
            return
        }

        const fetchFiles = async () => {
            try {
                const response = await fetch(`${config.API_BASE_URL}/files/history`, {
                    headers: { Authorization: token },
                })

                if (!response.ok) {
                    throw new Error("Failed to fetch file history:(")
                }

                const data = await response.json()
                setFiles(data.files)
            } catch (err) {
                setError(err.message)
            }
        }

        fetchFiles()
    }, [])

    return (

        <div className="p-4 mt-6 border rounded-lg shadow bg-gray-50">
            {error && <p className="text-red-500">{error}</p>}
            <h2 className="text-lg font-semibold mb-3">Task History</h2>
            <ul className="text">
                {files.map((file) => (
                    <li key={file.id} className="p-2 border rounded">
                        <div className="card">
                            <h3 className="card__title">{file.name}</h3>
                            <div className="card__content">
                                <strong>Description:</strong>
                                {file.tags.length > 0 ? (
                                    <ul className="list-disc pl-5">
                                        {file.tags.map((tag, index) => {
                                            const urlRegex = /(https?:\/\/[^\s]+)/g;
                                            const parts = tag.Value.split(urlRegex);

                                            return (
                                                <li key={index}>
                                                    {tag.Key}:{" "}
                                                    {parts.map((part, i) =>
                                                        urlRegex.test(part) ? (
                                                            <a key={i} href={part} target="_blank" rel="noopener noreferrer">
                                                                {part}
                                                            </a>
                                                        ) : (
                                                            part
                                                        )
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <span>No tags</span>
                                )}
                            </div>

                            <div className="card__date">
                                {new Date(file.last_modified).toLocaleString()}
                            </div>
                            <div className="card__arrow">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="15" width="15">
                                    <path fill="#fff" d="M13.4697 17.9697C13.1768 18.2626 13.1768 18.7374 13.4697 19.0303C13.7626 19.3232 14.2374 19.3232 14.5303 19.0303L20.3232 13.2374C21.0066 12.554 21.0066 11.446 20.3232 10.7626L14.5303 4.96967C14.2374 4.67678 13.7626 4.67678 13.4697 4.96967C13.1768 5.26256 13.1768 5.73744 13.4697 6.03033L18.6893 11.25H4C3.58579 11.25 3.25 11.5858 3.25 12C3.25 12.4142 3.58579 12.75 4 12.75H18.6893L13.4697 17.9697Z"></path>
                                </svg>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>

    )

}