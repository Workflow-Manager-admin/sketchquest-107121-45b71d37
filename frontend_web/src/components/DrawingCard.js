import React, { useState, useContext } from "react";
import styled, { keyframes, css } from "styled-components";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";

const shake = keyframes`
  0% { transform: translateX(0);}
  9% { transform: translateX(-8px);}
  20% { transform: translateX(9px);}
  32% { transform: translateX(-8px);}
  41% { transform: translateX(6px);}
  68% { transform: translateX(-2px);}
  90% { transform: translateX(1px);}
  100% { transform: translateX(0);}
`;

const Card = styled.div`
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 4px 18px #6366f12b;
  padding: 1.25rem 1.2rem 1rem 1.2rem;
  transition: box-shadow 0.16s;
  min-height: 240px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: relative;
  cursor: pointer;
  &:hover {
    box-shadow: 0 7px 28px #6366f1aa;
  }
`;
const Thumb = styled.img`
  width: 100%;
  max-height: 148px;
  object-fit: contain;
  border-radius: 1rem;
  margin-bottom: 1em;
  background: #f6fff9;
`;

const GuessInput = styled.input`
  flex: 1;
  padding: .45em .77em;
  border-radius: 1em;
  border: 2px solid #ececff;
  font-size: 1em;
  margin-right: .37em;
  outline: none;
  background: #f8f8fc;
  transition: border .14s;
  &:focus { border-color: #4e73df; }
  ${({ result }) =>
    result === "wrong" &&
    css`
      animation: ${shake} .40s;
      border-color: #ff6b81;
      background: #fff5fa;
    `}
  ${({ result }) =>
    result === "right" &&
    css`
      border-color: #10b981;
      background: #eaf8ef;
    `}
`;

const GuessBar = styled.form`
  display: flex;
  align-items: center;
  margin-top: .7em;
`;

const GuessesBox = styled.div`
  color: #6366f1;
  font-size: .98rem;
  opacity: .8;
  margin-top: .8em;
  min-height: 22px;
`;

function DrawingCard({ drawing }) {
  const nav = useNavigate();
  const { user } = useContext(AuthContext);
  const [guess, setGuess] = useState("");
  const [guessResult, setGuessResult] = useState("");
  const [guessed, setGuessed] = useState(
    drawing.guessedBy?.includes(user?.uid) || false
  );
  if (!drawing) return null;

  async function handleGuess(e) {
    e.preventDefault();
    if (!guess.trim()) return;
    if (guessed) return;
    const normalized = guess.toLowerCase().replace(/[^a-z]/gi, "");
    const promptAns = drawing.prompt?.toLowerCase().replace(/[^a-z]/gi, "");
    if (normalized === promptAns) {
      setGuessResult("right");
      // mark as guessed correct
      setGuessed(true);
      await updateDoc(doc(db, "drawings", drawing.id), {
        correctGuesses: increment(1),
        guessedBy: arrayUnion(user.uid),
        guesses: arrayUnion({
          uid: user.uid,
          username: user.displayName,
          guess,
          correct: true,
        }),
      });
    } else {
      setGuessResult("wrong");
      await updateDoc(doc(db, "drawings", drawing.id), {
        guesses: arrayUnion({
          uid: user.uid,
          username: user.displayName,
          guess,
          correct: false,
        }),
      });
      setTimeout(() => setGuessResult(""), 1100);
    }
    setGuess("");
  }

  return (
    <Card
      title="See drawing details"
      onClick={e => {
        if (e.target.tagName !== "INPUT" && e.target.tagName !== "BUTTON") {
          nav(`/drawing/${drawing.id}`);
        }
      }}
    >
      <Thumb src={drawing.imageUrl} alt={drawing.prompt || "Drawing"} />
      <div style={{ fontWeight: 600, color: "#6366f1", fontSize: "1.1em" }}>
        {drawing.author || "anon"}
      </div>
      <GuessesBox>
        {drawing.guesses && drawing.guesses.length > 0 ? (
          <>
            <b>Guesses:</b>{" "}
            {drawing.guesses.slice(-3).map((g, i) => (
              <span key={i} style={{ color: g.correct ? "#10b981" : "#ff6b81" }}>
                {g.guess}
                {g.correct ? "✅" : "❌"}
                {i < drawing.guesses.length - 1 ? ", " : ""}
              </span>
            ))}
          </>
        ) : (
          <span>No guesses yet</span>
        )}
      </GuessesBox>
      <GuessBar onSubmit={handleGuess}>
        <GuessInput
          value={guess}
          disabled={guessed}
          onChange={e => setGuess(e.target.value)}
          placeholder={guessed ? "Already guessed!" : "Guess..."}
          result={guessResult}
          minLength={2}
          aria-label="Guess"
          maxLength={30}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={guessed || !guess}
          style={{
            background: guessed ? "#f3f3f3" : "var(--primary)",
            color: guessed ? "#aaa" : "#fff",
            fontWeight: "bold",
            borderRadius: "1em",
            padding: ".42em 1em",
            border: "none",
            fontSize: "1em",
            cursor: guessed ? "not-allowed" : "pointer",
            transition: "filter .18s",
          }}
        >
          Guess
        </button>
      </GuessBar>
      {guessed && <div style={{ color: "#10b981", fontWeight: 700, marginTop: ".43em" }}>Correct! 🎉</div>}
    </Card>
  );
}
export default DrawingCard;
