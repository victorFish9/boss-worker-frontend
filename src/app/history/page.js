"use client";

import { useState, useEffect, useRef } from "react";
import { parseCookies } from "nookies";


import ProgressBarChart from "../components/ProgresBarChart";
import config from "../../config";
import Loader from "../components/Loader"

export default function PageHistory() {
    const [files, setFiles] = useState([])
    const [error, setError] = useState("")
    const [updatingIds, setUpdatingIds] = useState(new Set())
    const intervalRef = useRef(null)
    const [isLoading, setIsLoading] = useState(true)



    const fetchFiles = async () => {
        const cookies = parseCookies()
        const token = cookies.accessToken

        if (!token) {
            setError("Token is missing")
            return
        }

        try {
            const response = await fetch(`${config.API_BASE_URL}/files/history`, {
                headers: { Authorization: token },
            })

            if (!response.ok) {
                throw new Error("Failed to fetch file history:(")
            }

            const data = await response.json()
            const sortedFiles = data.files.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
            setFiles(sortedFiles)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchFiles()

        intervalRef.current = setInterval(fetchFiles, 1000)

        return () => {
            clearInterval(intervalRef.current)
        }
    }, [])


    const handleStatusChange = async (fileId, completed) => {
        const token = parseCookies().accessToken;

        try {
            setUpdatingIds(prev => new Set(prev).add(fileId));


            setFiles(prevFiles =>
                prevFiles.map(file =>
                    file.id === fileId ? { ...file, completed } : file
                )
            );

            const response = await fetch(`${config.API_BASE_URL}/files/history/${fileId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify({ completed }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update status');
            }

            const result = await response.json();


            setFiles(prevFiles =>
                prevFiles.map(file =>
                    file.id === fileId ? { ...file, ...result.file } : file
                )
            );
        } catch (err) {
            console.error("Error updating status:", err);
            setError(err.message || "Failed to update task status");


            setFiles(prevFiles =>
                prevFiles.map(file =>
                    file.id === fileId ? { ...file, completed: !completed } : file
                )
            );
        } finally {
            setUpdatingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(fileId);
                return newSet;
            });
        }
    };

    return (
        <div className="p-4 mt-6 border rounded-lg shadow bg-gray-50">
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-lg font-semibold">Task History</h1>
                <div className="text-sm text-gray-500">
                    Completed: {files.filter(f => f.completed).length}/{files.length}
                </div>
            </div>
            <ProgressBarChart files={files} />

            {/* Добавляем Loader при загрузке данных */}
            {isLoading ? (
                <div className="flex justify-center items-center py-8">
                    <Loader size="lg" />
                </div>
            ) : (
                <ul className="card_history_ul">
                    {files.map((file) => (
                        <li key={file.id} className={`p-2 border rounded ${file.completed ? 'bg-gray-100' : ''}`}>
                            <div className="card">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start space-x-3">
                                        <div>
                                            <h3 className={`card__title ${file.completed ? 'line-through' : ''}`}>
                                                {file.name}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`text-xs px-2 py-1 rounded ${file.completed
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {updatingIds.has(file.id) ? (
                                                // Добавляем мини-лоадер при обновлении статуса
                                                <span className="flex items-center">
                                                    <Loader size="sm" className="mr-1" />
                                                    Updating...
                                                </span>
                                            ) : file.completed ? 'Completed' : 'Pending'}
                                        </span>
                                        <div className="card__arrow">
                                            <label className="container_checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={file.completed}
                                                    onChange={(e) => handleStatusChange(file.id, e.target.checked)}
                                                    disabled={updatingIds.has(file.id)}
                                                />
                                                <svg viewBox="0 0 64 64" height="2em" width="2em">
                                                    <path
                                                        d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                                        className="path"
                                                    ></path>
                                                </svg>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="card__date">
                                    {new Date(file.created_at).toLocaleString()}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}