import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../index.css";

// Each entry has:
//   - word: the word to guess (always uppercase — makes comparisons easier)
//   - hint: a clue shown to the player so they have some direction
const wordBank = [
    { word: "MATTHEW", hint: "The tax collector turned apostle" },
    { word: "JOHN", hint: "The beloved disciple, youngest of the twelve" },
    { word: "PETER", hint: "The rock — originally named Simon" },
    { word: "PAUL", hint: "The apostle to the Gentiles, formerly called Saul" },
    { word: "TARSUS", hint: "The city where Paul was born" },
    { word: "ZEBEDEE", hint: "The father of James and John" },
    { word: "CAPERNAUM", hint: "The city where Matthew collected taxes" },
    { word: "GAMALIEL", hint: "The famous teacher who trained Paul" },
    { word: "REVELATION", hint: "The book John wrote on the island of Patmos" },
    { word: "PENTECOST", hint: "The day the Holy Spirit came upon the apostles" },
    { word: "GALILEE", hint: "The region where most apostles were from" },
    { word: "Damascus", hint: "The road where Paul was struck blind by a light" },
    { word: "PATMOS", hint: "The island where John was exiled" },
    { word: "FISHERMAN", hint: "The profession of Peter, James, and John" },
    { word: "BOANERGES", hint: "The nickname meaning Sons of Thunder" },
];

// So that words are prompted randomly
const getRandomWord = () => wordBank[Math.floor(Math.random() * wordBank.length)];

// SVG is a way to draw shapes with code. We draw the hangman piece by piece — each element in this array is one body part.
// We reveal them one at a time as the player makes wrong guesses.
// wrongGuesses goes from 0 to 6, so we show parts[0] through parts[5].
const HangmanDrawing = ({ wrongGuesses }) => (
    <svg height="200" width="200" className="hangman-svg">

        {/* ── GALLOWS (always visible) ── */}
        {/* Base */}
        <line x1="20" y1="190" x2="180" y2="190" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        {/* Vertical pole */}
        <line x1="60" y1="190" x2="60" y2="20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        {/* Horizontal beam */}
        <line x1="60" y1="20" x2="130" y2="20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        {/* Rope */}
        <line x1="130" y1="20" x2="130" y2="50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />

        {/* ── BODY PARTS (revealed one per wrong guess) ── */}

        {/* Wrong guess 1: Head */}
        {wrongGuesses >= 1 && (
            <circle cx="130" cy="65" r="15" stroke="currentColor" strokeWidth="3" fill="none" />
        )}

        {/* Wrong guess 2: Body */}
        {wrongGuesses >= 2 && (
            <line x1="130" y1="80" x2="130" y2="130" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        )}

        {/* Wrong guess 3: Left arm */}
        {wrongGuesses >= 3 && (
            <line x1="130" y1="90" x2="105" y2="115" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        )}

        {/* Wrong guess 4: Right arm */}
        {wrongGuesses >= 4 && (
            <line x1="130" y1="90" x2="155" y2="115" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        )}

        {/* Wrong guess 5: Left leg */}
        {wrongGuesses >= 5 && (
            <line x1="130" y1="130" x2="105" y2="160" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        )}

        {/* Wrong guess 6: Right leg — game over */}
        {wrongGuesses >= 6 && (
            <line x1="130" y1="130" x2="155" y2="160" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        )}
    </svg>
);

// Renders A–Z as clickable buttons.
// Each button is disabled once clicked (whether right or wrong).
// Correct guesses turn green, wrong guesses turn red.
const Keyboard = ({ onGuess, guessedLetters, word }) => {
    // Array.from creates an array of all 26 letters A–Z
    const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

    return (
        <div className="hangman-keyboard">
            {letters.map((letter) => {
                const isGuessed = guessedLetters.includes(letter);
                const isCorrect = word.includes(letter);

                return (
                    <button
                        key={letter}
                        onClick={() => onGuess(letter)}
                        disabled={isGuessed}
                        className={
                            isGuessed
                                ? isCorrect
                                    ? "key-btn correct"  
                                    : "key-btn incorrect" 
                                : "key-btn"          
                        }
                    >
                        {letter}
                    </button>
                );
            })}
        </div>
    );
};

function Hangman() { 

    //   currentEntry   - the current { word, hint } object from the word bank
    //   guessedLetters - array of letters the player has clicked so far

    // We use a function inside useState(() => ...) so that getRandomWord() only runs once when the component first loads, not on every re-render.
    const [currentEntry, setCurrentEntry]       = useState(null)
    const [guessedLetters, setGuessedLetters]   = useState([])
    const [loading, setLoading]                 = useState(true)

    // When the page opens, we ask Flask for any saved word and guessed letters for this user.

    // Three outcomes:
    //   1. Logged in + has saved progress → restore that word and letters
    //   2. Logged in + no saved progress  → pick a fresh random word
    //   3. Not logged in (401)            → pick a fresh random word
    
    // setLoading(false) at the end removes the loading screen and lets the game render.
    useEffect(() => {
        fetch("http://localhost:5000/api/hangman/progress", {
            credentials: "include"
        })
        .then(res => {
            if (!res.ok) return null
            return res.json()
        })
        .then(data => {
            if (data && data.current_word) {
                const savedEntry = wordBank.find(e => e.word === data.current_word)
                if (savedEntry) {
                    setCurrentEntry(savedEntry);
                    setGuessedLetters(data.guessed_letters)
                } else {
                    setCurrentEntry(getRandomWord())
                }
            } else {
                setCurrentEntry(getRandomWord())
            }
        })
        .catch(() => {
            setCurrentEntry(getRandomWord())
        })
        .finally(() => setLoading(false))
    }, [])
 
    // Called after every letter guess and on new game.
    // Sends the current word and full guessed letters array to Flask.
    const saveProgress = (word, letters) => {
        fetch("http://localhost:5000/api/hangman/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                current_word: word,
                guessed_letters: letters
            })
        }).catch(() => {})
    };
 
    // Calculated from state. We use optional chaining (?.) so these don't crash when currentEntry is still null during loading.
    const word = currentEntry?.word || ""
    const hint = currentEntry?.hint || ""
    const wrongGuesses = guessedLetters.filter(l => !word.includes(l)).length
    const isWon = word.length > 0 && word.split("").every(l => guessedLetters.includes(l))
    const isLost = wrongGuesses >= 6
    const isGameOver = isWon || isLost

    const handleGuess = (letter) => {
        if (guessedLetters.includes(letter) || isGameOver) return;
        const newLetters = [...guessedLetters, letter]
        setGuessedLetters(newLetters)
        saveProgress(word, newLetters)
    }


    const handleNewGame = () => {
        const newEntry = getRandomWord()
        setCurrentEntry(newEntry);
        setGuessedLetters([]);
        saveProgress(newEntry.word, [])
    }

    // This useEffect MUST stay above the early return guard —
    // React requires all hooks to be called on every render
    useEffect(() => {
        const handleKeyDown = (e) => {
            const letter = e.key.toUpperCase();
            if (/^[A-Z]$/.test(letter)) {
                handleGuess(letter)
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [guessedLetters, isGameOver])


    if (loading || !currentEntry) {
        return (
            <div>
                <div className="header fade-in"><h1>Hangman</h1></div>
                <div className="container"><p>Loading your game...</p></div>
            </div>
        )
    }







    return (
        <div>

            {/* Navigation */}
            <Link to="/Home"><button>Homepage</button></Link>
            <Link to="/Games"><button>Games</button></Link>

            <div className="header fade-in">
                <h1>Hangman</h1>
                <h2>Guess the apostle-related word</h2>
            </div>

            <div className="container fade-in">

                {/* Wrong guess counter */}
                <p className="hangman-counter">
                    Wrong guesses: {wrongGuesses} / 6
                </p>

                {/* The SVG drawing — receives wrongGuesses to know how many parts to draw */}
                <HangmanDrawing wrongGuesses={wrongGuesses} />

                {/* The hint */}
                <p className="hangman-hint"><strong>Hint:</strong> {hint}</p>

                {/* 
                    If the letter has been guessed, show it. Otherwise show nothing (a blank).
                    The underscore line is always visible so the player knows the word length.
                */}
                <div className="hangman-word">
                    {word.split("").map((letter, index) => (
                        <div key={index} className="hangman-letter-box">
                            <span className="hangman-letter">
                                {guessedLetters.includes(letter) ? letter : ""}
                            </span>
                            <span className="hangman-underline">_</span>
                        </div>
                    ))}
                </div>

                {/* 
                    GAME OVER MESSAGES
                    Only show when isWon or isLost is true.
                    On loss we reveal the full word so the player learns.
                */}
                {isWon && (
                    <div className="hangman-result win">
                        <h3>Well done! You got it!</h3>
                    </div>
                )}
                {isLost && (
                    <div className="hangman-result lose">
                        <h3>Out of guesses! The word was: <strong>{word}</strong></h3>
                    </div>
                )}

                {/* New game button — always visible */}
                <button onClick={handleNewGame} className="hangman-new-game">
                    New Word
                </button>

                {/* 
                      - onGuess: the function to call when a letter is clicked
                      - guessedLetters: so it knows which buttons to disable
                      - word: so it knows which guessed letters were correct (green) vs wrong (red)
                */}
                <Keyboard
                    onGuess={handleGuess}
                    guessedLetters={guessedLetters}
                    word={word}
                />

            </div>
        </div>
    )
}

export default Hangman