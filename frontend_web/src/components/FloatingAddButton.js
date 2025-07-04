import React from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";

const pop = keyframes`
  0% { transform: scale(1);}
  12% { transform: scale(1.1);}
  24% { transform: scale(1);}
  100% {transform: scale(1);}
`;

// PUBLIC_INTERFACE
const AddBtn = styled.button`
  position: fixed;
  right: 2.2rem;
  bottom: 2.6rem;
  background: var(--primary);
  color: #fff;
  font-weight: 700;
  font-size: 1.8rem;
  width: 3.6rem;
  height: 3.6rem;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 22px #6366f188;
  cursor: pointer;
  z-index: 120;
  animation: ${pop} 2.5s infinite cubic-bezier(.24,.93,.42,1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: filter 0.18s;
  &:hover {
    filter: brightness(1.07) saturate(1.1);
    box-shadow: 0 8px 32px #6366f1bf;
  }
`;

function FloatingAddButton() {
  const nav = useNavigate();
  const location = useLocation();
  // On draw page, button hides
  if (location.pathname === "/draw") return null;
  return (
    <AddBtn
      aria-label="Add your drawing"
      title="Add your drawing"
      onClick={() => nav("/draw")}
    >
      +
    </AddBtn>
  );
}
export default FloatingAddButton;
