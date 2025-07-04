import React, { useState, useContext } from "react";
import styled, { keyframes } from "styled-components";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Mascot: simple SVG doodle (could be replaced with asset)
function Mascot() {
  return (
    <svg width="105" height="105" viewBox="0 0 128 128" fill="none">
      <ellipse cx="64" cy="64" rx="48" ry="47" fill="#e4f0ff"/>
      <ellipse cx="43" cy="68" rx="9" ry="14" fill="#fbbf24"/>
      <ellipse cx="85" cy="68" rx="9" ry="14" fill="#10b981"/>
      <ellipse cx="63" cy="83" rx="28" ry="10" fill="#fff8fc"/>
      <ellipse cx="66" cy="60" rx="8" ry="9" fill="#4e73df"/>
      <ellipse cx="87" cy="46" rx="8" ry="3" fill="#ff6b81"/>
      <circle cx="53" cy="52" r="3.5" fill="#ff6b81"/>
      <ellipse cx="70" cy="48" rx="2" ry="1.2" fill="#fff"/>
      <rect x="58" y="88" width="24" height="5" rx="2.5" fill="#6366f1" opacity=".15"/>
    </svg>
  );
}

const float = keyframes`
  0% { transform: translateY(0);}
  50% { transform: translateY(7px);}
  100% { transform: translateY(0);}
`;
const doodleFade = keyframes`
  0%, 100% { opacity: .85;transform: rotate(-4deg);}
  40% { opacity: 1;}
  50% { opacity: .93;transform: rotate(7deg);}
`;
// Styled components
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 70vh;
  justify-content: center;
  background: var(--gradient-light);
  position: relative;
`;
const MascotBox = styled.div`
  animation: ${float} 3.4s infinite cubic-bezier(.81,-0.38,.59,1.36);
  margin-bottom: 1.2em;
  z-index: 2;
`;

const Doodle = styled.div`
  position: absolute;
  left: 7vw;
  top: 25vh;
  pointer-events: none;
  opacity: .65;
  font-size: 3.2rem;
  animation: ${doodleFade} 6s infinite;
`;

const Card = styled.div`
  background: #fff6;
  border-radius: 1.7rem;
  box-shadow: 0 6px 38px #4e73df27;
  padding: 2.3rem 2.6rem;
  min-width: 280px;
  margin-top: 2.3rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: relative;
  z-index: 3;
`;

const Input = styled.input`
  padding: 0.77em 1.1em;
  border-radius: 1.2em;
  border: 2px solid #ececff;
  font-size: 1.13em;
  margin-bottom: 1rem;
  outline: none;
  background: #f8f8fc;
  font-family: inherit;
  transition: border .18s;
  &:focus {
    border-color: #4e73df;
  }
  animation: ${doodleFade} 0.7s;
`;

const Button = styled.button`
  padding: 0.66em 1em;
  border-radius: 1.2em;
  border: none;
  font-size: 1.12em;
  font-weight: bold;
  background: var(--primary);
  color: #fff;
  cursor: pointer;
  box-shadow: 0 2px 12px #6366f133;
  margin-bottom: 0.2em;
  letter-spacing: 0.01em;
  animation: ${float} 2.2s infinite;
  &:hover {
    filter: brightness(1.11) saturate(1.2);
  }
`;

const Error = styled.div`
  color: #ff6b81;
  margin-top: 0.7em;
`;

function LoginPage() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    if (!username.match(/^\w{3,18}$/)) {
      setError("Use 3-18 letters/numbers.");
      return;
    }
    setPending(true);
    setError("");
    try {
      await login(username.replace(/\s+/g, '_'));
      nav("/");
    } catch (e) {
      if (e.message && e.message.includes("Firebase not configured")) {
        setError("Login failed – Firebase is not configured. Ask the site admin to check the setup.");
      } else {
        setError("Couldn't login... try again?");
      }
    } finally {
      setPending(false);
    }
  }
  return (
    <Wrap>
      <Doodle style={{ top: '6vh', left: '21vw', fontSize: "2.6rem" }}>🎨</Doodle>
      <Doodle style={{ top: '16vh', right: '12vw', left: "auto", fontSize: "2.9rem" }}>🐦</Doodle>
      <Doodle style={{ bottom: '12vh', right: '9vw', left: "auto", fontSize: "2.7rem" }}>🦎</Doodle>
      <MascotBox><Mascot /></MascotBox>
      <div className="fun-title">SketchQuest!</div>
      <Card>
        <form onSubmit={handleLogin}>
          <Input
            type="text"
            placeholder="Pick your nickname"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={pending}
            minLength="3"
            maxLength="18"
            autoFocus
            required
            aria-label="Username"
            autoComplete="off"
          />
          <Button type="submit" disabled={pending}>
            {pending ? "Logging in..." : "Play!"}
          </Button>
        </form>
        {error && <Error>{error}</Error>}
      </Card>
    </Wrap>
  );
}
export default LoginPage;
