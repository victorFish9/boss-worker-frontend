import React from "react";


const Loader = ({
    size = "medium",
    color = "blue",
    fullscreen = false,
    className = ""
}) => {
    const sizeClass = `loader-spinner ${size}`;
    const colorClass = `loader-spinner ${color}`;

    return (
        <div className={`loader-container ${fullscreen ? 'loader-fullscreen' : ''} ${className}`}>
            <div className={`${sizeClass} ${colorClass}`} aria-label="Loading..."></div>
        </div>
    );
};

export default Loader;