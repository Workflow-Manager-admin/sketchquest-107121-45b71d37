import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import App from "./App";

// Mock Firebase and AuthContext logic for testing
jest.mock("./firebase", () => ({
  auth: {
    app: {
      options: {
        apiKey: "test",
        projectId: "test",
        authDomain: "localhost"
      }
    },
    signOut: jest.fn(),
    currentUser: null,
  },
}));

// Bypass actual anonymous signIn for AuthContext
jest.mock("firebase/auth", () => ({
  signInAnonymously: jest.fn(async () => ({
    user: { uid: "abc123", displayName: "Tester" }
  })),
  onAuthStateChanged: (auth, cb) => {
    setTimeout(() =>
      cb({ uid: "abc123", displayName: "Tester" }), 10);
    return () => {};
  },
  updateProfile: jest.fn(),
}));

test("renders login page and performs anonymous login", async () => {
  render(<App />);
  // Wait for Login UI
  expect(await screen.findByPlaceholderText(/nickname/i)).toBeInTheDocument();

  // Simulate user entering name and logging in
  fireEvent.change(screen.getByPlaceholderText(/nickname/i), {
    target: { value: "Player42" },
  });
  fireEvent.click(screen.getByText(/play/i));

  // Dashboard loads after login
  await waitFor(() =>
    expect(screen.getByText(/Top Drawing Today/i)).toBeInTheDocument()
  );
});

test("animal prompt picker only chooses from curated list", async () => {
  // The prompt list is in DrawingPage.js
  const { prompts } = await import("./pages/DrawingPage.js");
  expect(prompts).toBeDefined();
  expect(Array.isArray(prompts)).toBe(true);

  // All prompts are animal-ish, no random words
  for (const animal of prompts) {
    expect(typeof animal).toBe("string");
    // Example of curated: must not be silly placeholder text
    expect(/cat|dog|lion|sparrow|crab|monkey|bear|penguin|shark|dolphin|rabbit/i.test(animal)).toBe(true);
  }
});

test("user authentication context provides user and logout", async () => {
  render(<App />);
  // Login UI
  expect(await screen.findByPlaceholderText(/nickname/i)).toBeInTheDocument();
  // Simulate login
  fireEvent.change(screen.getByPlaceholderText(/nickname/i), {
    target: { value: "Player42" },
  });
  fireEvent.click(screen.getByText(/play/i));
  // After redirect, check header bar for nickname
  await waitFor(() =>
    expect(screen.getByText(/player42/i)).toBeInTheDocument()
  );
  // There should be a Logout button as well
  expect(screen.getByText(/logout/i)).toBeInTheDocument();
});
