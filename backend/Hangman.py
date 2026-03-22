# Imports the random module
import random

# List of possible words for the game
words = ["fish", "water", "clock", "computer", "teacher"]


# Number of incorrect guesses the player is allowed
attempts = 6

# Welcome message displayed when the game starts
print("WELCOME TO HANGMAN!")

# Function that randomly selects and returns a word from the list
def randomizer(words):
    return random.choice(words)

# Function that displays the word progress
# Correctly guessed letters are shown, others are replaced with "_"
def word_display(correct_word, letter_guessed):
    display = ""
    for letter in correct_word:
        if letter in letter_guessed:
            display += letter # If letter was guessed correctly
        else: 
            display += "_" # If letter was guessed incorrectly
    return display

# Main function that controls the game logic
def main():
    global attempts
    correct_word = randomizer(words)
    letter_guessed = []

    # Ask the player if they want to start the game
    answer = input("\n Are you ready to begin? (Y/N): ").upper()

    # Ensure only one character is entered
    if len(answer) == 1:
        if answer == 'Y':
            # Main game loop runs while attempts remain
            while attempts > 0:
                print("\nWord: " + " ".join(word_display(correct_word, letter_guessed)))
                guess = input("Enter a letter: ").lower()

                # Check if the guessed letter is in the word
                if guess in correct_word:
                    letter_guessed.append(guess)

                    # Check if the full word has been guessed
                    if word_display(correct_word, letter_guessed) == correct_word:
                        print("Congratulations, you have found your word: ", correct_word)
                        return

                else:
                    # Reduce attempts for an incorrect guess
                    attempts -= 1
                    print("Wrong guess!\nAttempts left: ", attempts)

            # Message displayed when the player runs out of attempts
            print("Unfortunately, you have run out of attempts. \nThe word was ", correct_word)
            main() # Restart the game

        elif answer == 'N':
            # Player chooses not to play
            print("Come back some other time...")
            return

        else:
            # Invalid input other than Y or N
            print("Please enter only one Y or N...")
            main()
    else:
        # Input longer than one character
        print("Please enter only one character.")
        main()


main()