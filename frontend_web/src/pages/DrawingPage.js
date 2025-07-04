import React, { useRef, useState, useEffect, useContext } from "react";
import styled, { keyframes, css } from "styled-components";
import { db, storage } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

/**
 * PROMPTS
 * Curated animal (and bird/reptile/insect) prompt list as clues for drawing game.
 * Only animals/nature: e.g. "monkey", "sparrow", "crab", etc.
 */
const prompts = [
  "Monkey", "Sparrow", "Crab",
  "Lion", "Tiger", "Crocodile", "Frog", "Elephant", "Rabbit",
  "Alligator", "Octopus", "Bear", "Penguin", "Giraffe", "Hippo",
  "Dolphin", "Wolf", "Parrot", "Goose", "Duck", "Snail",
  "Swan", "Panther", "Otter", "Panda", "Gorilla", "Peacock",
  "Turtle", "Hawk", "Shark", "Eagle", "Zebra", "Moose", "Camel",
  "Pelican", "Toad", "Buffalo", "Chameleon", "Orangutan", "Antelope",
  "Bat", "Crow", "Swan", "Cricket", "Lizard",
  "Beetle", "Seahorse", "Mole", "Pigeon", "Jellyfish", "Koala", "Kangaroo",
  "Shrew", "Seal", "Ostrich", "Kookaburra", "Owl", "Vulture", 
  "Butterfly", "Caterpillar", "Raccoon", "Hedgehog", "Armadillo"
];

// --- Canvas Drawing Logic ---
function setUpCanvas(ctx) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 5.3;
  ctx.strokeStyle = "#151514";
}

const paperGrid = css`
  background:
    linear-gradient(0deg, #e8eafc 1px, transparent 1px 24px),
    linear-gradient(90deg, #e8eafc 1px, transparent 1px 24px),
    #fff;
  background-size: 24px 24px;
`;
const fadeIn = keyframes`
  from{opacity:0;}
  to {opacity:1;}
`;

const TimerRing = styled.div`
  width: 58px; height: 58px;
  border-radius: 50%;
  border: 3.6px solid #ff6b81;
  outline: 2.6px solid #ff9bbb2c;
  box-shadow: 0 2px 14px #ff6b81aa;
  display:flex; align-items:center; justify-content:center;
  font-weight: bold; font-size: 1.3em; color: #ff6b81;
  margin-bottom: 1.2em;
  animation: ${fadeIn} 1.2s;
`;

const SpinBtn = styled.button`
  background: linear-gradient(91deg, #4e73df 30%, #fbbf24 80%);
  color: #fff;
  font-size: 1.1em;
  padding: .7em 1.1em;
  border-radius: 0.9em;
  border: none;
  font-weight: bold;
  cursor: pointer;
  margin: 1.1em 0;
  box-shadow: 0 2px 12px #6366f133;
  transition: filter .15s;
  &:hover { filter: brightness(1.13);}
`;

const Sheet = styled.div`
  max-width: 640px;
  margin: 2em auto 2em auto;
  background: #fff9;
  border-radius: 1.2em;
  box-shadow: 0 6px 42px #4e73df11;
  padding: 2.1rem;
  display: flex; flex-direction: column; align-items: center;
  ${paperGrid};
`;

const CanvasWrap = styled.div`
  position: relative;
`;

const Canvas = styled.canvas`
  border: 2px solid #4e73df35;
  border-radius: 0.7em;
  background: #fff;
  width: 370px;
  height: 340px;
  cursor: crosshair;
  box-shadow: 0 4px 22px #6366f12a;
`;

const BtnBar = styled.div`
  display: flex;
  gap: 1.3em;
  margin-top: .5em;
`;

const UiButton = styled.button`
  font-family: inherit;
  padding: .55em 1.3em;
  border-radius: 1em;
  font-size: 1.07em;
  font-weight: 600;
  border: none;
  background: ${props => props.green ? "var(--green)" : "var(--indigo)"};
  color: #fff;
  margin: .2em .1em;
  cursor: pointer;
  box-shadow: 0 2px 14px #6366f151;
  transition: filter .15s;
  &:hover { filter: brightness(1.13);}
`;

const PromptText = styled.div`
  font-family: 'Bungee', cursive;
  font-size: 1.4em;
  color: var(--primary);
  text-shadow: 0 2px 0 #e4f0ff;
  margin-bottom: 1.23em;
  animation: ${fadeIn} .8s;
`;
const Msg = styled.div`
  color: #10b981;
  font-weight: bold;
  margin: 1em 0 0 0;
`;

function DrawingPage() {
  const [prompt, setPrompt] = useState("");
  const [drawing, setDrawing] = useState(false);
  const [timer, setTimer] = useState(45);
  const [finished, setFinished] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [msg, setMsg] = useState("");
  const { user } = useContext(AuthContext);
  const nav = useNavigate();

  const canvasRef = useRef(null);
  const offscreenRef = useRef({ lines: [] }); // save lines for reset/undo

  // Spin for random prompt (animal/bird/reptile)
  function spinPrompt() {
    let idx = Math.floor(Math.random() * prompts.length);
    setPrompt(prompts[idx]);
    setTimer(45);
    setFinished(false);
    clearCanvas();
    setMsg("");
  }
  useEffect(() => {
    if (!prompt || finished) return;
    if (timer === 0) {
      setFinished(true);
      setMsg("⏰ Time's up! Submit or reset.");
      return;
    }
    const t = setTimeout(() => setTimer(timer - 1), 990);
    return () => clearTimeout(t);
  }, [timer, prompt, finished]);

  function startDrawing(e) {
    if (finished) return;
    setDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setUpCanvas(ctx);
    const rect = canvas.getBoundingClientRect();
    const x =
      (e.touches ? e.touches[0].clientX : e.nativeEvent.offsetX) -
      canvas.offsetLeft;
    const y =
      (e.touches ? e.touches[0].clientY : e.nativeEvent.offsetY) -
      canvas.offsetTop;
    ctx.beginPath();
    ctx.moveTo(x, y);
    offscreenRef.current.lines.push([[x, y]]);
  }
  function draw(e) {
    if (!drawing || finished) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setUpCanvas(ctx);
    const rect = canvas.getBoundingClientRect();
    const x =
      (e.touches
        ? e.touches[0].clientX - rect.left
        : e.nativeEvent.offsetX);
    const y =
      (e.touches
        ? e.touches[0].clientY - rect.top
        : e.nativeEvent.offsetY);
    ctx.lineTo(x, y);
    ctx.stroke();
    offscreenRef.current.lines[offscreenRef.current.lines.length - 1].push([x, y]);
  }
  function stopDrawing() {
    setDrawing(false);
  }
  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    offscreenRef.current.lines = [];
  }
  function reset() {
    clearCanvas();
    setTimer(45);
    setFinished(false);
    setMsg("");
  }
  async function submitDrawing() {
    if (!prompt || finished || submitted) return;
    const canvas = canvasRef.current;
    // Upload image as dataURL
    const dataUrl = canvas.toDataURL("image/png");
    setMsg("Uploading...");
    try {
      // Upload to firebase storage with unique filename
      const fileName = `${user.uid}_${Date.now()}`;
      const storageRef = ref(storage, `drawings/${fileName}.png`);
      await uploadString(storageRef, dataUrl, "data_url");
      const downloadUrl = await getDownloadURL(storageRef);
      await addDoc(collection(db, "drawings"), {
        author: user.displayName,
        authorUid: user.uid,
        prompt: prompt,
        imageUrl: downloadUrl,
        correctGuesses: 0,
        guessedBy: [],
        guesses: [],
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      setMsg("Submitted! 🎉");
      setTimeout(() => nav("/"), 1100);
    } catch (e) {
      setMsg("Upload failed, try again.");
    }
  }
  return (
    <Sheet>
      {!prompt && (
        <SpinBtn onClick={spinPrompt}>Spin for Prompt 🎯</SpinBtn>
      )}
      {prompt && (
        <PromptText>
          Prompt: <span style={{ color: "#6366f1" }}>{prompt}</span>
        </PromptText>
      )}
      <CanvasWrap>
        <Canvas
          ref={canvasRef}
          width={370}
          height={340}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          tabIndex={0}
        />
        <TimerRing>{prompt ? `${timer}s` : ""}</TimerRing>
      </CanvasWrap>
      <BtnBar>
        <UiButton type="button" onClick={reset} style={{ background: "#ffd562" }}>
          Reset
        </UiButton>
        <UiButton
          green
          type="button"
          onClick={submitDrawing}
          disabled={!prompt || finished || submitted}
        >
          Submit {finished ? "⏰" : "✔️"}
        </UiButton>
      </BtnBar>
      {msg && <Msg>{msg}</Msg>}
    </Sheet>
  );
}
export default DrawingPage;
