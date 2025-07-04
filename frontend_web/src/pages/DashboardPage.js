import React, { useContext } from "react";
import styled, { keyframes, css } from "styled-components";
import { DrawingContext } from "../context/DrawingContext";
import DrawingCard from "../components/DrawingCard";
import FeaturedCard from "../components/FeaturedCard";

const Masonry = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(245px, 1fr));
  gap: 1.33em;
  margin: 0 1.7rem 3.3em 1.7rem;
`;

const Title = styled.h2`
  text-align: left;
  font-size: 1.67rem;
  margin: 2.1rem 0 1.4rem 1.3rem;
  color: #232864;
  font-family: "Fredoka", "Nunito", "Poppins", sans-serif;
  letter-spacing: .03em;
`;

function DashboardPage() {
  const { drawings, topDrawing } = useContext(DrawingContext);
  // Featured (top guesses) at top
  return (
    <>
      <Title>Top Drawing Today 🏅</Title>
      <FeaturedCard drawing={topDrawing} />
      <Title>All Drawings</Title>
      <Masonry>
        {drawings?.map(d => (
          <DrawingCard drawing={d} key={d.id} />
        ))}
      </Masonry>
    </>
  );
}
export default DashboardPage;
