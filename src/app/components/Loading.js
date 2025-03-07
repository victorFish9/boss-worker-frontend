import { useState, useEffect } from "react";

const LoadingOverlay = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="overlay">
            <div className="loadingText">Загрузка...</div>
        </div>
    );
};

export default LoadingOverlay;
