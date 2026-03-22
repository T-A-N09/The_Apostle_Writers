import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../index.css";



//   - question: the text shown to the user
//   - options: 4 possible answers to choose from
//   - answer: the exact string that is the correct option
const questions = [
    {
        question: "What was Matthew's job before following Jesus?",
        options: ["Fisherman", "Tax Collector", "Carpenter", "Pharisee"],
        answer: "Tax Collector"
    },
    {
        question: "What nickname did Jesus give John and his brother James?",
        options: ["Sons of Light", "Sons of Thunder", "Sons of Peace", "Sons of David"],
        answer: "Sons of Thunder"
    },
    {
        question: "What was Peter's original name?",
        options: ["Andrew", "Simon", "Levi", "Saul"],
        answer: "Simon"
    },
    {
        question: "How many times did Peter deny knowing Jesus?",
        options: ["Once", "Twice", "Three times", "Four times"],
        answer: "Three times"
    },
    {
        question: "Paul was trained under which famous Jewish teacher?",
        options: ["Gamaliel", "Caiaphas", "Nicodemus", "Annas"],
        answer: "Gamaliel"
    },
    {
        question: "Which apostle is the only one believed to have died of natural causes?",
        options: ["Peter", "Matthew", "Paul", "John"],
        answer: "John"
    },
    {
        question: "What symbol represents John in Christian tradition?",
        options: ["Lion", "Ox", "Eagle", "Angel"],
        answer: "Eagle"
    },
    {
        question: "In which city was Paul born?",
        options: ["Jerusalem", "Tarsus", "Corinth", "Antioch"],
        answer: "Tarsus"
    },
    {
        question: "What did Matthew leave behind to follow Jesus?",
        options: ["A fishing boat", "A tax booth", "A carpenter's shop", "A synagogue"],
        answer: "A tax booth"
    },
    {
        question: "Where was Peter when Jesus told him to cast his nets before calling him?",
        options: ["The Jordan River", "The Sea of Galilee", "The Dead Sea", "The Red Sea"],
        answer: "The Sea of Galilee"
    }
];

function Trivia() {


    //   currentQuestion - tracks which question index (0-9) we are on
    //   selectedAnswer  - stores what the user clicked on
    //   score           - counts how many correct answers the user got
    //   showResult      - true/false: whether to show the final score screen
    //   answered        - true/false: whether the user has clicked an answer yet
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [answered, setAnswered] = useState(false);



    // Runs once when the page opens. Fetches their saved progress from Flask. If they completed it before, jump to results.
    // If mid-quiz, restore their question index and score.
    // If not logged in (401 response), just start from scratch.
    useEffect(() => {
        fetch("http://localhost:5000/api/trivia/progress", {
            credentials: "include"
        })
        .then(res => {
            if (!res.ok) return null;
            return res.json();
        })
        .then(data => {
            if (!data) return;
            if (data.completed) {
                setScore(data.score);
                setShowResult(true);
            } else {
                setCurrentQuestion(data.current_question);
                setScore(data.score);
            }
        })
        .catch(() => {});
    }, []);
 


    // Called after every answer and on quiz completion.
    // Takes values as arguments because React state is async — the updated state value isn't available immediately after calling setState, so we pass the new value directly instead.
    const saveProgress = (questionIndex, currentScore, completed = false) => {
        fetch("http://localhost:5000/api/trivia/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                current_question: questionIndex,
                score: currentScore,
                completed
            })
        }).catch(() => {});
    };



    //   - We first check if they already answered (to prevent double clicks)
    //   - We save their choice with setSelectedAnswer()
    //   - We mark the question as answered with setAnswered()
    //   - If their choice matches the correct answer, we add 1 to the score
    const handleAnswer = (option) => {
        if (answered) return;

        setSelectedAnswer(option);
        setAnswered(true);

        if (option === questions[currentQuestion].answer) {
            setScore(score + 1);
        }
    };



    //   - If there are more questions, move to the next one and reset selectedAnswer and answered back to their default values
    //   - If we've reached the last question, show the results screen by setting showResult to true
    const handleNext = () => {
        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setAnswered(false);
        } else {
            setShowResult(true);
        }
    };


    // Resets every state variable back to its starting value so the user can play again from the beginning.
    const handleRestart = () => {
        fetch("http://localhost:5000/api/trivia/reset", {
            method: "POST",
            credentials: "include"
        }).catch(() => {});

        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setScore(0);
        setShowResult(false);
        setAnswered(false);
    };

    //   - The correct answer always turns green
    //   - The wrong answer the user picked turns red
    //   - All other buttons stay neutral (default style)
    const getButtonStyle = (option) => {
        if (!answered) return "trivia-option";

        if (option === questions[currentQuestion].answer) {
            return "trivia-option correct";
        }

        if (option === selectedAnswer) {
            return "trivia-option incorrect";
        }

        return "trivia-option";
    };

    // This is what actually renders on screen. We use conditional rendering ({ showResult ? ... : ... }) to switch between the results screen and the question screen.
    return (
        <div>

            <Link to="/Home"><button>Homepage</button></Link>
            <Link to="/Games"><button>Games</button></Link>

            <div className="header fade-in">
                <h1>Apostle Trivia</h1>
                <h2>How well do you know the apostles?</h2>
            </div>

            {showResult ? (


                <div className="container fade-in">
                    <h2>Quiz Complete!</h2>
                    <h3>You scored {score} out of {questions.length}</h3>

                    {score === questions.length && <p>Perfect score! You really know your apostles!</p>}
                    {score >= 7 && score < questions.length && <p>Great work! You know your apostles well.</p>}
                    {score >= 4 && score < 7 && <p>Not bad! Try reading the apostle pages again.</p>}
                    {score < 4 && <p>Keep studying — the apostle pages are a great place to start!</p>}

                    <button onClick={handleRestart}>Play Again</button>
                </div>



            ) : (
                // This block shows during the quiz
                <div className="container fade-in">



                    {/* Progress indicator: e.g. "Question 1 of 10" */}
                    <h4>Question {currentQuestion + 1} of {questions.length}</h4>

                    {/* Score tracker shown during quiz */}
                    <h4>Score: {score}</h4>

                    {/* The current question text */}
                    <h2>{questions[currentQuestion].question}</h2>




                    {/* 
                        Render all 4 answer buttons.
                        .map() loops over the options array and creates a button for each one.
                        Each button calls handleAnswer(option) when clicked.
                        getButtonStyle(option) dynamically sets the correct/incorrect colour.
                    */}
                    <div className="trivia-options">
                        {questions[currentQuestion].options.map((option) => (
                            <button
                                key={option}
                                className={getButtonStyle(option)}
                                onClick={() => handleAnswer(option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>



                    {/* 
                        Only show the Next button AFTER the user has picked an answer.
                        We use {answered && ...} — if answered is false, nothing renders.
                    */}
                    {answered && (
                        <button onClick={handleNext}>
                            {/* Change button label on the last question */}
                            {currentQuestion + 1 === questions.length ? "See Results" : "Next Question"}
                        </button>
                    )}

                </div>
            )}

        </div>
    );
}

export default Trivia;