"use client";



const LoadingOverlay = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className={overlay}>
            <div className={loadingText}>Загрузка...</div>
        </div>
    );
};

export default LoadingOverlay;