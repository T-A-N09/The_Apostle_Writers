import { useState, useEffect } from "react";
import "../index.css";

import { Link } from "react-router-dom";

function Games() {
    return (
        <div>

            <Link to = "/Home">
            <button>Homepage</button>
            </Link>
            <Link to = "/Matthew">
                <button>Matthew</button>
            </Link>
            <Link to = "/John">
                <button>John</button>
            </Link>
            <Link to = "/Peter">
                <button>Peter</button>
            </Link>
            <Link to = "/Paul">
                <button>Paul</button>
            </Link>
            <button className = "apostle">Games</button>

            <div className = "header fade-in gaming">
                <h1>
                    Games
                </h1>
                <h2>
                    A fun way to learn more
                </h2>
            </div>
            <section className="gaming">
                <h2>
                    Trivia Questions 
                </h2>
                <Link to = "/Trivia">
                    <button>Play</button>
                </Link>
            </section>
            <section className="gaming">
                <h2>
                    Hangman Game 
                </h2>
                <Link to = "/Hangman">
                    <button>Play</button>
                </Link>

            </section>
            
        </div>
    )
}

export default Games