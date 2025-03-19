
// import { useState, useEffect } from "react";
// import UploadFile from "../components/UploadFile";
// import config from "../../config";


// export default function StoragePage() {
//     const [files, setFiles] = useState([]);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         const fetchFiles = async () => {
//             // const token = localStorage.getItem("access_token");

//             // if (!token) {
//             //     setError("You have to log in");
//             //     return;
//             // }



//             // try {
//             //     const response = await fetch(`${config.API_BASE_URL}`, {
//             //         headers: {
//             //             Authorization: `Bearer ${token}`,
//             //         },
//             //     });

//             //     if (!response.ok) {
//             //         throw new Error("Error to get a data");
//             //     }

//             const data = await response.json();
//             setFiles(data.files);
//             // } catch (err) {
//             //     setError(err.message);
//             // }
//         };

//         fetchFiles();
//     }, []);

//     const handleLogout = () => {
//         localStorage.removeItem("access_token"); // Удаляем токен
//         window.location.href = "/login"; // Перенаправляем на страницу входа
//     };


//     return (
//         <div>

//             <UploadFile />
//             {error && <p style={{ color: "red" }}>{error}</p>}
//             <h1>List of Files</h1>
//             <ul>
//                 {files.map((file) => (
//                     <li key={file.filename}>
//                         {file.filename} - <a href={file.download_url}>Download</a>
//                     </li>
//                 ))}
//             </ul>
//             <button onClick={handleLogout}>Log out</button>
//         </div>
//     );
// }

"use client";

import { useState, useEffect } from "react";
import UploadFile from "../components/UploadFile";
import config from "../../config";

export default function StoragePage() {
    const [files, setFiles] = useState([]); // Состояние для хранения списка файлов
    const [error, setError] = useState(""); // Состояние для хранения ошибок

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                // Запрос к бэкенду для получения списка файлов
                const response = await fetch(`${config.API_BASE_URL}/list/boss-worker-bucket`);

                if (!response.ok) {
                    throw new Error("Ошибка при получении данных");
                }

                const data = await response.json(); // Парсим JSON-ответ
                setFiles(data.files); // Устанавливаем список файлов в состояние
            } catch (err) {
                setError(err.message); // Устанавливаем ошибку, если что-то пошло не так
            }
        };

        fetchFiles(); // Вызываем функцию для получения файлов
    }, []);

    return (
        <div>
            <UploadFile />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <h1>List of Files</h1>
            <ul>
                {files.map((file, index) => (
                    <li key={index}>
                        {file} - <a href={`${config.API_BASE_URL}/download/boss-worker-bucket/${file}`}>Download</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
