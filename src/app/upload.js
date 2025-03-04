import { useState } from "react";
import axios from "axios";

export default async function UploadPage() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    }

    const uploadFile = async () => {
        if (!file) {
            setMessage("Choose a file");
            return;
        }
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await axios.post("http://127.0.0.1:8000/api/upload/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        setMessage(res.data.message || "File is uploaded!");
    } catch (error) {
        setMessage("Error");
    } finally {
        setUploading(false);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Загрузить ZIP-файл</h1>
            <input type="file" onChange={handleFileChange} className="mb-4" />
            <button
                onClick={uploadFile}
                disabled={uploading}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                {uploading ? "Загрузка..." : "Загрузить"}
            </button>
            {message && <p className="mt-4 text-gray-700">{message}</p>}
        </div>
    );
}