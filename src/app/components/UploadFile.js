/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

// import { useState } from "react";
// import config from "../../config";

// export default function UploadPage() {
//     const [files, setFiles] = useState([]);
//     const [description, setDescription] = useState("")
//     const [uploading, setUploading] = useState(false);
//     const [message, setMessage] = useState("");

//     const handleFileChange = (event) => {
//         setFiles(event.target.files);
//     };

//     const handleUpload = async () => {
//         if (files.length === 0) {
//             setMessage("Выберите файлы");
//             return;
//         }

//         setUploading(true);
//         const formData = new FormData();

//         // Добавляем все файлы в FormData
//         for (const file of files) {
//             formData.append("files", file);
//         }

//         if (description.trim()) {
//             formData.append("description", description)
//         }

//         try {
//             const token = localStorage.getItem("access_token");
//             const response = await fetch(`${config.API_BASE_URL}/storage/upload/`, {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//                 body: formData,
//             });

//             const data = await response.json();
//             if (response.ok) {
//                 setMessage("Файлы загружены: " + data.filename);
//                 setDescription("");
//                 setFiles([])
//             } else {
//                 setMessage("Ошибка: " + data.error);
//             }
//         } catch {
//             setMessage("Ошибка загрузки");
//         }

//         setUploading(false);
//     };

//     return (
//         <div>
//             <h1>Загрузка файлов</h1>
//             <input type="file" multiple onChange={handleFileChange} />

//             {/* 👇 Добавили поле ввода описания */}
//             <input
//                 type="text"
//                 placeholder="Введите описание (необязательно)"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//             />

//             <button onClick={handleUpload} disabled={uploading}>
//                 {uploading ? "Загрузка..." : "Загрузить"}
//             </button>
//             <p>{message}</p>
//         </div>
//     );
// }


// import { useState } from "react";
// import JSZip from "jszip"; // Нужно установить: npm install jszip
// import config from "../../config";

// export default function UploadPage() {
//     const [files, setFiles] = useState([]);
//     const [description, setDescription] = useState("");
//     const [uploading, setUploading] = useState(false);
//     const [message, setMessage] = useState("");

//     const handleFileChange = (event) => {
//         setFiles(event.target.files);
//     };

//     const handleUpload = async () => {
//         if (files.length === 0) {
//             setMessage("Выберите файлы");
//             return;
//         }

//         setUploading(true);
//         setMessage("Архивирование файлов...");

//         const zip = new JSZip();
//         for (const file of files) {
//             zip.file(file.name, file);
//         }

//         const zipBlob = await zip.generateAsync({ type: "blob" });
//         const formData = new FormData();
//         formData.append("files", zipBlob, "upload.zip");

//         if (description.trim()) {
//             formData.append("description", description);
//         }

//         try {
//             const token = localStorage.getItem("access_token");
//             const response = await fetch(`${config.API_BASE_URL}/storage/upload/`, {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//                 body: formData,
//             });

//             const data = await response.json();
//             if (response.ok) {
//                 setMessage("Архив загружен: " + data.filename);
//                 setDescription("");
//                 setFiles([]);
//             } else {
//                 setMessage("Ошибка: " + data.error);
//             }
//         } catch {
//             setMessage("Ошибка загрузки");
//         }

//         setUploading(false);
//     };

//     return (
//         <div>
//             <h1>Загрузка файлов</h1>
//             <input type="file" multiple onChange={handleFileChange} />
//             <input
//                 type="text"
//                 placeholder="Введите описание (необязательно)"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//             />
//             <button onClick={handleUpload} disabled={uploading}>
//                 {uploading ? "Загрузка..." : "Загрузить"}
//             </button>
//             <p>{message}</p>
//         </div>
//     );
// }




import { useState } from "react";
import JSZip from "jszip"; // Нужно установить: npm install jszip
import config from "../../config";

export default function UploadPage() {
    const [files, setFiles] = useState([]);
    const [description, setDescription] = useState("");
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
        setMessage("Запрос Presigned URL...");

        try {
            const token = localStorage.getItem("access_token");

            // 1. Запрашиваем presigned URL
            const presignedResponse = await fetch(`${config.API_BASE_URL}/storage/get-upload-url/`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            const presignedData = await presignedResponse.json();
            if (!presignedResponse.ok) {
                setMessage("Ошибка получения URL: " + presignedData.error);
                setUploading(false);
                return;
            }

            const { upload_url, filename } = presignedData;

            setMessage("Архивирование файлов...");

            // 2. Создаём ZIP-файл в памяти
            const zip = new JSZip();
            for (const file of files) {
                zip.file(file.name, file);
            }
            const zipBlob = await zip.generateAsync({ type: "blob" });

            setMessage("Загрузка архива в MinIO...");

            // 3. Отправляем ZIP напрямую в MinIO
            const uploadResponse = await fetch(upload_url, {
                method: "PUT",
                body: zipBlob,
                headers: {
                    "Content-Type": "application/zip",
                },
            });

            if (!uploadResponse.ok) {
                setMessage("Ошибка загрузки в MinIO");
                setUploading(false);
                return;
            }

            setMessage("Архив успешно загружен!");
            setDescription("");
            setFiles([]);
        } catch (error) {
            setMessage("Ошибка загрузки");
        }

        setUploading(false);
    };

    return (
        <div>
            <h1>Загрузка файлов</h1>
            <input type="file" multiple onChange={handleFileChange} />
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
