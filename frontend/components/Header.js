export default function Header() {
    return (
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
            <div style={{
                fontSize: "24px",
                cursor: "pointer",
                position: "absolute",
                right: "20px",
            }}>
                ☰
            </div>
        </header>
    );
}
