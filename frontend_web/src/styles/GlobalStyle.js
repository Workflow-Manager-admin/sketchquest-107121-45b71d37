import { createGlobalStyle } from "styled-components";

// PUBLIC_INTERFACE
const GlobalStyle = createGlobalStyle`
  :root {
    --color-bg: #f8f8fc;
    --gradient-light: linear-gradient(120deg, #f6fff9 0%, #e4f0ff 100%);
    --primary: #4e73df;
    --yellow: #fbbf24;
    --pink: #ff6b81;
    --green: #10b981;
    --indigo: #6366f1;
    --featured: #4e73df;
    --pastel-bg: #f8f8fc;
  }
  html {
    font-size: 18px;
    background: var(--pastel-bg);
    font-family: "Inter", "Open Sans", "Quicksand", sans-serif;
  }
  body {
    margin: 0;
    background: var(--gradient-light);
    color: #23272f;
    min-height: 100vh;
  }
  h1, h2, h3, h4, h5 {
    font-family: "Poppins", "Nunito", "Fredoka", sans-serif;
    letter-spacing: 0.02em;
    margin: 0;
  }
  .fun-title {
    font-family: 'Bungee', 'Press Start 2P', cursive;
    font-size: 2.5rem;
    color: var(--primary);
    margin-bottom: 1rem;
    letter-spacing: 0.05em;
    text-shadow: 1px 2px 0 #fff8, 0 2px 8px #4e73df22;
  }
  button, input {
    font-family: inherit;
    font-size: 1rem;
    outline: none;
  }
  .centered_loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    color: var(--indigo);
    font-weight: 600;
    font-size: 1.3rem;
  }
`;

export default GlobalStyle;
