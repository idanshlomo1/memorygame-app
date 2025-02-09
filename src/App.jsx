import { useState, useEffect } from 'react'
import { SlShuffle } from 'react-icons/sl'

const DIFFICULTIES = {
  EASY: 5,
  HARD: 10,
}

const EMOJIS = ['🐶', '🐱', '🐭', '🐸 ', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯']

export default function MemoryGame() {
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [difficulty, setDifficulty] = useState(DIFFICULTIES.EASY)

  // Define initializeGame
  const initializeGame = (diff) => {
    // Select the first "diff" emojis without shuffling them
    const selectedEmojis = EMOJIS.slice(0, diff)
    const newCards = []

    // Create a pair of cards for each emoji
    selectedEmojis.forEach((emoji, index) => {
      newCards.push({ id: index * 2, content: emoji, isFlipped: false, isMatched: false })
      newCards.push({ id: index * 2 + 1, content: emoji, isFlipped: false, isMatched: false })
    })

    // Shuffle the cards once and reset game state
    newCards.sort(() => Math.random() - 0.5)
    setCards(newCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setAttempts(0)
  }

  // Call initializeGame on mount and whenever difficulty changes.
  useEffect(() => {
    initializeGame(difficulty)
  }, [difficulty])

  const handleCardClick = (id) => {
    // Prevent flipping more than two cards at a time.
    if (flippedCards.length === 2) return

    // Flip the clicked card.
    setCards((prevCards) => prevCards.map((card) => (card.id === id ? { ...card, isFlipped: true } : card)))
    setFlippedCards((prevFlipped) => [...prevFlipped, id])

    // When two cards are flipped, check for a match.
    if (flippedCards.length === 1) {
      setAttempts((prev) => prev + 1)

      const firstCard = cards.find((card) => card.id === flippedCards[0])
      const secondCard = cards.find((card) => card.id === id)

      if (firstCard && secondCard && firstCard.content === secondCard.content) {
        // It's a match.
        setMatchedPairs((prev) => prev + 1)
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, isMatched: true, isFlipped: true }
              : card,
          ),
        )
        setFlippedCards([])
      } else {
        // Not a match: flip back after a delay.
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              flippedCards.includes(card.id) || card.id === id ? { ...card, isFlipped: false } : card,
            ),
          )
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const isGameWon = matchedPairs === difficulty

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 p-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Memory Card Game</h1>

      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => setDifficulty(DIFFICULTIES.EASY)}
          className={`px-4 py-2 rounded-md ${
            difficulty === DIFFICULTIES.EASY ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Easy
        </button>
        <button
          onClick={() => setDifficulty(DIFFICULTIES.HARD)}
          className={`px-4 py-2 rounded-md ${
            difficulty === DIFFICULTIES.HARD ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Hard
        </button>
      </div>

      <div
        className={`grid gap-4 ${
          difficulty === DIFFICULTIES.EASY
            ? 'grid-cols-4 sm:grid-cols-5'
            : 'grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8'
        } mb-6`}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-2xl cursor-pointer transition-all duration-300 rounded-lg shadow-md ${
              card.isFlipped ? 'bg-white text-black' : 'bg-blue-500 text-transparent'
            } ${card.isMatched ? 'opacity-50' : ''}`}
            onClick={() => !card.isFlipped && !card.isMatched && handleCardClick(card.id)}
          >
            {card.isFlipped ? card.content : '❓'}
          </div>
        ))}
      </div>

      <div className="text-lg mb-4">Attempts: {attempts}</div>

      <button
        onClick={() => initializeGame(difficulty)}
        className="px-4 py-2 bg-red-500 text-white rounded-md flex items-center gap-2"
      >
        <SlShuffle size={20} /> Reset Game
      </button>

      {isGameWon && (
        <div className="text-2xl font-bold text-green-600 mt-4">
          🎉 Congratulations! You won in {attempts} attempts! 🎉
        </div>
      )}
    </div>
  )
}
