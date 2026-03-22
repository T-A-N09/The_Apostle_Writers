import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

import { Link } from "react-router-dom";

function Signup() {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("")
    const [email, setEmail] = useState("")

    const [error, setError] = useState("")

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try{
    const response = await fetch("http://localhost:5000/signup", {
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
    console.log(data)

    if(!response.ok) {
        setError(data.error || "Signup failed")
        return
    }

    navigate("/Home")
    
    } catch(err) {
        console.error(err)
        setError("Something went wrong. Please try again")
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
                </form>
            </div>

        </div>
    )
}

export default Signup