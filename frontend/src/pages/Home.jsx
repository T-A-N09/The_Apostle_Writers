import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../index.css";

import { Link } from "react-router-dom";

function Home() {
    const [user, setUser] = useState(null)
    const location = useLocation()

    const handleLogout = async () => {
        await fetch("http://localhost:5000/api/logout", {
            credentials: "include"
        })
        setUser(null)
    }

    useEffect(() => {
    fetch("http://localhost:5000/api/user", {
        credentials: "include"
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Not authenticated");
        }
        return res.json();
    })
    .then(data => {
        console.log("API response:", data);
        setUser(data.user || null); 
    })
    .catch(err => {
        console.error("Fetch error:", err);
        setUser(null);
    });
}, [location])

    return (
    <div>
        <div className = "header fade-in">
            <h1>The Apostle Writers</h1>
        </div>

        <div className="container fade-in">

            {user && user.name ? (
              <h2 className = "greeting">Hi { user.name }</h2> 
            ) : (
                <h2>
                    I am here to give way for those curious of the apostles that wrote a number of books in our Christian bible
                </h2>
            )}
            <h3>
                What we provide is a description of who these people were, how they looked and how they behaved before Jesus. Something that can help us understand them more and possibly relate with them as they had the privilege to be besides our Lord and Saviour, Jesus Christ.
            </h3>
        </div>

        <div className = "container fade-in">
            <h3>
                Which apostle are you most curious about?
            </h3>

            <Link to ="/Matthew" className="apostle_link">
            <button>Matthew</button>
            </Link>
            <Link to = "/John" className="apostle_link">
                <button>John</button>
            </Link>
            <Link to = "/Peter" className="apostle_link">
                <button>Peter</button>
            </Link>
            <Link to = "/Paul" className="apostle_link">
                <button>Paul</button>
            </Link>
            
        </div>

        <div className = "header fade-in">
            { user && user.name ? (
                <>
                    <h3>Welcome back! Enjoy this week's Bible verse.</h3>
                     <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <h3>If you wish for weekly bible verses, feel free to sign up</h3>
                    <Link to = "/Signup" className="apostle_link">
                        <button>Signup</button>
                    </Link>
                </>
            )}

        </div>

        </div>
    )
}

export default Home