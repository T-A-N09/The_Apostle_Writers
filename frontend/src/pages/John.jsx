import { useState, useEffect } from "react";
import "../index.css";

import { Link } from "react-router-dom";

function John() {

    const [user, setUser] = useState(null);
    
        useEffect(() => {
            fetch("http://localhost:5000/api/user", {
                credentials: "include"
            })
                .then(res => res.json())
                .then(data => {
                    console.log("John page user data:", data),
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
            <button className = "apostle">John</button>
            <Link to = "/Peter">
                <button>Peter</button>
            </Link>
            <Link to = "/Paul">
                <button>Paul</button>
            </Link>
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
                    Apostle: John
                </h1>
            </div>
            <div>
                <h2>
                    Brief description
                </h2>
                <h4>
                    John is often considered the "heart" of the early Church. John was the "Beloved Disciple"—the one who had the most intimate proximity to Jesus.
                </h4>
            </div>
            <div className = "Right_align">
                <h2>
                    Who he was
                </h2>
                <section className = "row">
                    <h4>
                        John was the son of Zebedee and the younger brother of James.
                        The Family Business: He was a successful fisherman in Galilee. His family was likely well-off, as they owned their own boat and employed hired servants (Mark 1:20).
                        The "Inner Circle": Along with Peter and his brother James, John was part of the "Inner Three" who were allowed to see things the other nine apostles weren't (like the Transfiguration and the raising of Jairus’ daughter).

                    </h4>
                </section>
            </div>
            <div>
                <h2>
                    How he was
                </h2>
                <h4>
                    John underwent the most dramatic character arc of all the disciples.
                    <ul>
                        <li>
                            The "Son of Thunder": Jesus gave him and James the nickname Boanerges (Sons of Thunder). This wasn't a compliment about their voices; it was about their tempers. They once asked Jesus if they should call down fire from heaven to burn up a village that rejected them.
                        </li>
                        <li>
                            Ambitious & Competitive: He and his brother famously asked Jesus for the "top seats" in Heaven, which annoyed the other ten disciples.
                        </li>
                        <li>
                            Transformed by Love: By the end of his life, his "thunder" had turned into "light." His letters (1, 2, and 3 John) are so focused on the concept of love that tradition says in his old age, he would only preach one sentence: "Little children, love one another."
                        </li>
                    </ul>
                </h4>
            </div>
            <div className = "Right_align">
                <h2>
                    How he looked
                </h2>
                <h4>
                    Because the Bible doesn't describe his face, we rely on historical context and artistic tradition:
                    <ul>
                        <li>
                            The Youngest: John is widely believed to have been the youngest of the Twelve—likely in his late teens or early twenties when he started following Jesus.
                        </li>
                        <li>
                            Artistic Representation: Because he was the youngest, he is almost always depicted in art without a beard during the time of the Gospels, with long hair and a more sensitive or "poetic" expression.
                        </li>
                        <li>
                            The "Eagle": In Christian symbolism, John is represented by the Eagle because his writing "soars" to the highest theological heights.
                        </li>
                    </ul>
                </h4>
            </div>
            <div>
                <h2>
                    His Journey with Jesus
                </h2>
                <h4>
                    John was originally a disciple of John the Baptist. When the Baptist pointed to Jesus and said, "Behold the Lamb of God," John immediately switched and followed Jesus. He was one of the three who saw Jesus in His "glowing" divine form on the mountain. He sat right next to Jesus, leaning his head back against Jesus' chest—a sign of extreme closeness and trust. The only male apostle who didn't run away. He stood at the foot of the Cross. Jesus looked down and told John to take care of His mother, Mary, as if she were his own. After Mary Magdalene told them the tomb was empty, John outran Peter to get there first (a detail he made sure to include in his Gospel!). Unlike the other apostles who were killed relatively young, John lived to be an old man. He was exiled to the island of Patmos, where he received the visions for the Book of Revelation.           
                </h4>
            </div>
            <div className = "interesting">
                <h2>
                    Interesting Fact 
                </h2>
                <h4>
                    John is the only apostle to die of natural causes (old age) rather than martyrdom. He outlived all his friends, becoming a "living bridge" between the time of Jesus and the growing early Church of the 2nd century.
                </h4>
            </div>

        </div>
    )
}

export default John