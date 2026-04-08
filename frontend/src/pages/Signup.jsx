import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

import { Link } from "react-router-dom";

function Signup() {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("")
    const [email, setEmail] = useState("")

     const [toast, setToast] = useState("")

    const navigate = useNavigate()

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 3000);  // disappears after 3s
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setToast("");

    try{
    const response = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }, 
        credentials: "include",
        body: JSON.stringify({
            name,
            surname,
            email
        })
    })
    
    const data = await response.json()

    if (!response.ok) {
        showToast(data.error || "Signup failed")  // ← triggers toast
        return
    }

    navigate("/")
    
    } catch(err) {
        console.error(err)
        setToast("Something went wrong. Please try again")
    }
    };

    return (
        <div>

            <div className = "center-page">
                <form onSubmit={handleSubmit} className = "middle">
                    <h2>
                        Sign Up Form
                    </h2>
                    <div>
                        First Name
                    </div>
                    <input 
                        type = "text" value={name}
                        onChange={(e) => setName(e.target.value)}
                        />
                    <div>
                        Last Name
                    </div>
                    <input
                        type="text"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                    />
                    <div>
                        Email
                    </div>
                    <input type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}/>

                    <button type = "submit">Sign up</button>

                    <div>If you already have an account</div>
                    <div>
                        <Link to = "/Login">
                            <button>Login</button>
                        </Link>
                    </div>
                </form>

                {toast && (
                <div style={{
                    position: "fixed",
                    bottom: "24px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#2C2C2A",
                    color: "#D3D1C7",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    zIndex: 1000,
                }}>
                    {toast}
                </div>
                )}

            </div>

        </div>
    )
}

export default Signup