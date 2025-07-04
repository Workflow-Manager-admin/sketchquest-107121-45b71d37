import React, { createContext, useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

// PUBLIC_INTERFACE
export const DrawingContext = createContext();

export function DrawingProvider({ children }) {
  const [drawings, setDrawings] = useState([]);
  const [topDrawing, setTopDrawing] = useState();

  useEffect(() => {
    const q = query(collection(db, "drawings"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const items = [];
      let best = null;
      let maxCorrect = -1;
      snapshot.forEach(doc => {
        const data = { id: doc.id, ...doc.data() };
        items.push(data);
        if ((data.correctGuesses || 0) > maxCorrect) {
          best = data;
          maxCorrect = data.correctGuesses;
        }
      });
      setDrawings(items);
      setTopDrawing(best);
    });
    return () => unsub();
  }, []);

  return (
    <DrawingContext.Provider value={{ drawings, topDrawing }}>
      {children}
    </DrawingContext.Provider>
  );
}
