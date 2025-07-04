import React from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

const pulse = keyframes`
  0% {box-shadow: 0 0 0 0 #4e73df33;}
  60% {box-shadow: 0 0 0 14px #4e73df00;}
  100%{box-shadow: 0 0 0 0 #4e73df33;}
`;

const Card = styled.div`
  background: #f6fff9;
  border-radius: 1.4rem;
  box-shadow: 0 8px 28px #4e73df17;
  margin: 1.4rem 1.7rem 2.9rem 1.7rem;
  min-height: 200px;
  display: flex;
  align-items: stretch;
  position: relative;
  overflow: hidden;
  animation: ${pulse} 2.4s infinite cubic-bezier(.43,.3,.66,1.01);
  border: 4px solid #6366f1;
`;

const Thumb = styled.img`
  width: 144px;
  height: 144px;
  object-fit: contain;
  margin: 1.6rem 1rem 1.6rem 2rem;
  background: #e4f0ff;
  border-radius: 1rem;
  border: 2.6px solid #ff6b8122;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  min-width: 0;
`;

const BigName = styled.div`
  font-family: 'Fredoka', 'Poppins', sans-serif;
  font-size: 1.24em;
  font-weight: bold;
  color: #4e73df;
  margin-bottom: .6em;
`;

const Ribbon = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(91deg, #ffde77, #fbbf24);
  color: #fff;
  font-family: 'Poppins', cursive;
  font-size: 1em;
  padding: 0.47em 1.7em 0.47em 1.03em;
  border-radius: 0 2em 2em 0;
  letter-spacing: .07em;
  box-shadow: 0 2px 14px #fbbf2466;
  z-index: 1;
  font-weight: 600;
`;

function FeaturedCard({ drawing }) {
  const nav = useNavigate();
  if (!drawing) return null;
  return (
    <Card onClick={() => nav(`/drawing/${drawing.id}`)} title="See details">
      <Ribbon>
        🥇 Most Correct Guesses
      </Ribbon>
      <Thumb src={drawing.imageUrl} alt={drawing.prompt || "Drawing"} />
      <Info>
        <BigName>{drawing.prompt || "?"}</BigName>
        <div>
          By <b>{drawing.author || "anon"}</b> · {drawing.correctGuesses || 0} correct!
        </div>
      </Info>
    </Card>
  );
}
export default FeaturedCard;
