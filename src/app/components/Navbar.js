"use client"

import Link from "next/link"


const Navbar = () => {
    return (
        <div className="nav">
            <div className="container_navbar">
                <Link href="/" className="btn">Home</Link>
                <Link href="/contact" className="btn">Contact</Link>
                <Link href="/about" className="btn">About</Link>
                <Link href="/faq" className="btn">FAQ</Link>
                <svg
                    className="outline"
                    overflow="visible"
                    width="400"
                    height="60"
                    viewBox="0 0 400 60"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect
                        className="rect"
                        pathLength="100"
                        x="0"
                        y="0"
                        width="400"
                        height="60"
                        fill="transparent"
                        strokeWidth="5"
                    ></rect>
                </svg>
            </div>
        </div>
    )
}

export default Navbar;