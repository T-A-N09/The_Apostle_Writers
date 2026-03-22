import { useState, useEffect } from "react";
import "../index.css";

import { Link } from "react-router-dom";

function Intro() {
    return (
        <div className="header fade-in">
            <div>
            <h1>
                The Apostle Writers
            </h1>
            <h5>
                by Tiyane Nobel
            </h5>
        </div>
        <div className="body">
            <h3>
                GitHub: T-A-N09
            </h3>
            <h3>
                edx username: tiyanenobel
            </h3>
            <h3>
                Country: South Africa          
            </h3>
            <h3>
                City: Benoni
            </h3>
            <h3>
                Date: 22 March 2026
            </h3>
        </div>

        <Link to = "/Home">
            <button>Start Project</button>
        </Link>

        </div>

    )
}

export default Intro