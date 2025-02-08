import { useState, useEffect } from "react";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(true);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [menuOpen]);

    return (
        <>
            <header style={{
                backgroundColor: "#7A0019",
                color: "white",
                padding: "15px 20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "Helvetica, Arial, sans-serif",
                width: "100%",
                position: "fixed",
                top: 0,
                left: 0,
                height: "60px",
                zIndex: 1000
            }}>
                <img 
                    src="/gopherpark-logo.png" 
                    alt="GopherPark Logo"
                    style={{ height: "100px", maxWidth: "100%", objectFit: "contain" }} 
                />
                <div 
                    style={{
                        fontSize: "24px",
                        cursor: "pointer",
                        position: "absolute",
                        right: "20px",
                        transition: "opacity 0.3s ease",
                        opacity: menuOpen ? 0 : 1
                    }}
                    onClick={toggleMenu}
                >
                    ☰
                </div>
            </header>

            {menuOpen && (
                <div 
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(3px)",
                        zIndex: 999,
                        transition: "opacity 0.3s ease-in-out"
                    }}
                    onClick={closeMenu}
                />
            )}

            <div 
                style={{
                    position: "fixed",
                    top: menuOpen ? "0px" : "-100%",
                    right: "20px",
                    backgroundColor: "white",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    padding: "20px",
                    borderRadius: "8px",
                    width: "200px",
                    textAlign: "left",
                    transition: "top 0.3s ease-in-out",
                    zIndex: 1001
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                    <FaLinkedin size={20} color="#0077B5" style={{ marginRight: "10px" }} />
                    <a href="https://www.linkedin.com/in/adam-cotton-537887233/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#0077B5", fontSize: "18px" }}>
                        LinkedIn
                    </a>
                </div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                    <FaGithub size={20} color="#333" style={{ marginRight: "10px" }} />
                    <a href="https://github.com/AdamCottonUMN" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#333", fontSize: "18px" }}>
                        GitHub
                    </a>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <FaEnvelope size={20} color="#D44638" style={{ marginRight: "5px" }} />
                    <span style={{ color: "#D44638", fontSize: "18px" }}>cotto150@umn.edu</span>
                </div>
            </div>
        </>
    );
}
