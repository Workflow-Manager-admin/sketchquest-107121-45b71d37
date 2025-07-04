import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import DrawingCard from "../components/DrawingCard";

const CenterBox = styled.div`
  max-width: 470px;
  margin: 3.4em auto 2em auto;
  background: #fff9;
  border-radius: 1.2em;
  box-shadow: 0 10px 32px #6366f1a3;
  padding: 2.2rem;
`;

function DrawingViewPage() {
  const { id } = useParams();
  const [drawing, setDrawing] = useState(null);
  useEffect(() => {
    async function load() {
      const docRef = doc(db, "drawings", id);
      const snap = await getDoc(docRef);
      setDrawing({ id: snap.id, ...snap.data() });
    }
    load();
  }, [id]);
  if (!drawing) return <div className="centered_loader">Loading...</div>;
  return (
    <CenterBox>
      <DrawingCard drawing={drawing} />
    </CenterBox>
  );
}
export default DrawingViewPage;
