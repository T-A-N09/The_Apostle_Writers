import { useState, useEffect } from "react";
import "../index.css";

import { Link } from "react-router-dom";

function Matthew() {
    
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/user" , {
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                    console.log("Matthew page user data:", data),
                    setUser(data.user || null)
                })
            .catch(() => setUser(null));
    }, []);

    return (
        <div>
        <Link to = "/Home">
            <button>Homepage</button>
        </Link>
        <button className = "apostle">Matthew</button>
        <Link to = "/John">
            <button>John</button>
        </Link>
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
                Apostle: Matthew
            </h1>
        </div>
        <div>
            <h2>
                Brief description
            </h2>
            <h4>
                Matthew (also known as Levi) is one of the most fascinating figures in the New Testament because he represents a "total 180" in life direction. While the Bible provides a clear picture of his career and character, it’s important to note that the New Testament rarely describes anyone's physical appearance—so for that, we have to look at history and tradition.
            </h4>
        </div>
        <div className = "Right_align">
            <h2>
                Who he was
            </h2>
            <section className = "row">
                <div className = "image">

                </div>
                <h4>
                    Matthew was a Tax Collector (a "Publican") in Capernaum. In 1st-century Judea, this made him one of the most hated men in town for two reasons:
                    <ul>
                        <li>
                            A "Traitor": He worked for the Roman Empire, the occupying force.
                        </li>
                        <li>
                            An Extortionist: Tax collectors were paid by collecting more than what was owed and pocketing the difference.
                        </li>
                    </ul>
                    He was likely literate in multiple languages (Aramaic, Greek, and possibly Latin) and highly skilled in shorthand and record-keeping—skills he later used to document Jesus’ teachings.
                </h4>
            </section>
        </div>
        <div>
            <h2>
                How he was
            </h2>
            <h4>
                While we don't have a diary, we can "read" his personality through the style of his writing:
                <ul>
                        <li>
                            Methodical & Organized: His Gospel isn't just a story; it's a structured manual. He organizes Jesus' teachings into five distinct blocks (mirroring the five books of the Torah).
                        </li>
                        <li>
                            Detail-Oriented: He is the only Gospel writer to mention specific financial details, like the temple tax or the exact amount of silver given to Judas.
                        </li>
                        <li>
                            Decisive: When Jesus said, "Follow me," Matthew didn't ask questions. He left his lucrative booth—a job he couldn't just "go back to" like the fishermen could—and walked away.
                        </li>
                        <li>
                            Quietly Devoted: Unlike Peter (the loud one) or Thomas (the skeptical one), Matthew is rarely recorded speaking. He was a "listener" and a "recorder."
                        </li>
                    </ul>
            </h4>
        </div>
        <div className = "Right_align">
            <h2>
                How he looked
            </h2>
            <h4>
                The Bible provides zero physical descriptions of Matthew. However, based on his profession and the time period, we can make educated guesses:
                <ul>
                        <li>
                            Clothing: As a tax collector, he would have been wealthier than the fishermen. He likely wore higher-quality tunics and cloaks, though he would have adopted the simpler attire of a traveling disciple after his call.
                        </li>
                        <li>
                            Physical Features: Like other 1st-century Galileans, he likely had olive skin, dark hair, and brown eyes.
                        </li>
                        <li>
                            Artistic Tradition: In Christian art, he is traditionally depicted as an older man with a grey beard, often carrying a book (his Gospel) or a pen. Sometimes he is shown with a money bag at his feet to symbolize the life he left behind.
                        </li>
                    </ul>
            </h4>
        </div>
        <div>
            <h2>
                His Journey with Jesus
            </h2>
            <h4>
                Jesus walks up to Matthew’s tax booth in Capernaum and says, "Follow me." Matthew stands up and leaves his career instantly. Immediately after following Jesus, Matthew throws a massive banquet at his house. He invites all his "sinner" and tax collector friends to meet Jesus. He traveled across Galilee and Judea. He was present for the Sermon on the Mount, the feeding of the 5,000, and the Transfiguration (as one of the Twelve). Like most of the Twelve, he fled during Jesus' arrest. However, he was a witness to the Resurrection and was present for the Great Commission. After Pentecost, tradition says he preached in Judea for several years before traveling to Ethiopia or Persia. Most traditions hold that he died a martyr. 
            </h4>
        </div>
        <div className = "interesting">
            <h2>
                Interesting Fact 
            </h2>
            <h4>
                The ultimate "wink" from history is that the man whose job was to take money from people ended up writing the book that famously warns: "You cannot serve both God and money" (Matthew 6:24). He practiced exactly what he preached.
            </h4>
        </div>

        </div>
    )
}

export default Matthew