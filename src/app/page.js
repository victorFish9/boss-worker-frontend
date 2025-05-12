"use client";

import { useState, useEffect } from "react";
import config from "../config";
import { parseCookies } from "nookies";

import Loader from "./components/Loader"

export default function StoragePage() {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        const cookies = parseCookies()
        const token = cookies.accessToken

        if (!token) {
            setError("Token is missing")
            setIsLoading(false)
            return
        }



        const fetchFiles = async () => {

            try {
                setIsLoading(true)
                const response = await fetch(`${config.API_BASE_URL}/files/google/list`, {
                    headers: {
                        Authorization: token,
                    }
                });

                const data = await response.json();
                setFiles(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false)
            }
        };

        fetchFiles();
    }, []);

    function formatBytes(bytes) {
        if (!bytes) return 'Unknown'
        const size = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        const i = Math.floor(Math.log(bytes) / Math.log(1024))
        return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + size[i]
    }

    return (
        <div className="p-4 mt-6 border rounded-lg shadow bg-gray-50">
            {error && <p className="text-red-500">{error}</p>}
            <h1 className="text-lg font-semibold mb-3">Files available for download</h1>


            {isLoading ? (
                <div className="loader-box">
                    {/* <div className="loader-spinner"></div> */}
                    <Loader size="large" />
                </div>
            ) : (
                <div className="card_storage">
                    {files.length > 0 ? (
                        <ul className="card_storage_ul">
                            {files.map((file, index) => (
                                <li key={index} className="card_storage_li list-item">
                                    <div className="download_div">
                                        <a
                                            href={config.API_BASE_URL + file.apiDownloadLink}
                                            className="download-link"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Download
                                        </a>
                                        <h3 className="card__title font-medium">{file.name}</h3>
                                    </div>
                                    <div className="card__content text-sm text-gray-500">
                                        <strong>Type:</strong> {file.type}
                                    </div>
                                    <div>
                                        Uploaded Date: {new Date(file.createdAt).toLocaleDateString()}
                                    </div>
                                    <div>Size: {formatBytes(file.size)}</div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No files available.</p>
                    )}
                </div>
            )}
        </div>
    );



}

