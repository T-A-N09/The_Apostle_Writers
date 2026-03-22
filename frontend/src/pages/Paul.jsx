import { useState, useEffect } from "react";
import "../index.css";

import { Link } from "react-router-dom";

function Paul() { 
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/user", {
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                    console.log("Paul page user data:", data),
                    setUser(data.user || null)
                })
            .catch(() => setUser(null));
    }, []);
    
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
        <button class = "apostle">Paul</button>
        {user && user.name ? (
            <>
                <Link to = "/Games">
                    <button>Games</button>
                </Link>
            </>
        ) : (
        <>
        </>
        )}
        
        <div className = "header fade-in">
            <h1>
                Apostle: Paul
            </h1>
        </div>
        <div>
            <h2>
                Brief description
            </h2>
            <h4>
                Paul is the "wildcard" of the Apostles. Paul never walked with Jesus during His earthly ministry. In fact, for the first few years of the early Church, Paul (then known as Saul) was its #1 most wanted enemy. He didn't just join the journey; he crashed into it.
            </h4>
        </div>
        <div className = "Right_align text">
            <h2>
                Who he was
            </h2>
            <section className = "row">
                    <h4>
                        Paul was a man of two worlds, which made him uniquely qualified to spread a global message:
                        <ul>
                            <li>
                                The Pharisee: He was a high-ranking, elite Jewish scholar trained under Gamaliel (the Harvard of the 1st century). He knew the Hebrew Scriptures inside and out.
                            </li>
                            <li>
                                The Roman Citizen: He was born in Tarsus (modern-day Turkey), giving him Roman citizenship—a "golden ticket" that allowed him to travel freely and demand legal rights that the other Apostles didn't have.
                            </li>
                            <li>
                                The Tentmaker: To support his travels, he worked a trade. He wasn't a fisherman; he was a craftsman.
                            </li>
                        </ul>
                    </h4>
            </section>
        </div>
        <div>
            <h2>
                How he was
            </h2>
            <h4>
                <ul>
                    <li>
                        Zealot Turned Advocate: Before his conversion, he was a "bounty hunter" for the religious elite, arresting Christians. After his conversion, he applied that same terrifying intensity to spreading the Gospel.
                    </li>
                    <li>
                        Brilliantly Argumentative: Paul didn't just tell stories; he built logical cases. His letters (like Romans) read like legal briefs.
                    </li>
                    <li>
                        Physically Resilient: He was arguably the toughest human in the New Testament. He survived being stoned, shipwrecked three times, whipped five times, and bitten by a viper—and he just kept walking.
                    </li>
                </ul>
            </h4>
        </div>
        <div className = "Right_align">
            <h2>
                How he looked
            </h2>
            <h4>
                Interestingly, we have more historical clues about Paul’s appearance than almost anyone else, thanks to a 2nd-century text called The Acts of Paul and Thecla.
                <ul>
                    <li>
                        The Description: He is described as "a man of small stature, with a bald head and crooked legs, in a good state of body, with eyebrows meeting and nose somewhat hooked."
                    </li>
                    <li>
                        Artistic Tradition: In historical icons, Paul is almost always shown with a high, balding forehead and a long, pointed brown/grey beard.
                    </li>
                    <li>
                        The Sword: In art, he is usually holding a sword—partly because he wrote about the "Sword of the Spirit," but also because he was eventually executed by one.
                    </li>
                </ul>
            </h4>
        </div>
        <div>
            <h2>
                His Journey with Jesus
            </h2>
            <h4>
                Saul was present at the stoning of Stephen (the first Christian martyr), holding the coats of the executioners. While traveling to Damascus to arrest more Christians, a light from heaven blinded him. He heard Jesus ask, "Saul, Saul, why do you persecute me?" After being healed of blindness, he spent years in the desert of Arabia, being "taught" directly by Christ through revelation. He traveled over 10,000 miles on foot and by boat across the Roman Empire, starting churches in cities like Philippi, Corinth, and Ephesus. He spent a significant portion of his later life in prison, which is where he wrote many of the letters that make up the New Testament. 
            </h4>
        </div>
        <div className = "interesting">
            <h2>
                Interesting Fact 
            </h2>
            <h4>
                While Peter focused on the Jewish people, Paul was the "Apostle to the Gentiles" (non-Jews). He is the reason Christianity moved out of the Middle East and into Europe and the rest of the world. He eventually arrived in Rome—not as a conqueror, but as a prisoner.
            </h4>
        </div>

        </div>
    )
}

export default Paul