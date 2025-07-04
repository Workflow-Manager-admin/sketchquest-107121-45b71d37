import React, { useContext } from "react";
import styled from "styled-components";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Bar = styled.header`
  width: 100%;
  background: #fff9;
  box-shadow: 0 2px 6px #ececff44;
  height: 70px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 110;
  padding: 0 2.5rem;
  justify-content: space-between;
  backdrop-filter: blur(3px);
`;

const LogoTxt = styled.span`
  font-family: 'Bungee', 'Press Start 2P', cursive;
  color: var(--primary);
  font-size: 1.7rem;
  letter-spacing: 0.04em;
  user-select: none;
  line-height: 1;
  display: inline-block;
  text-shadow: 0px 2px 0 #fff9, 0 3px 10px #ffcbe877;
  cursor: pointer;
`;

const RightBox = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  font-size: 1rem;
`;

const UserBadge = styled.div`
  display: flex;
  align-items: center;
  color: #444;
  background: #f6fff9;
  border-radius: 1.4rem;
  padding: 0.28rem 1.1rem;
  box-shadow: 0 2px 8px #10b98118;
  font-weight: 600;
  letter-spacing: 0.03em;
  font-size: 1rem;
  margin-right: 0.3rem;
`;

const LogoutBtn = styled.button`
  border: none;
  background: var(--pink);
  color: #fff;
  border-radius: 1.4rem;
  font-size: 1.05rem;
  font-weight: 700;
  padding: 0.33rem 1.1rem;
  cursor: pointer;
  margin-left: 0.2rem;
  transition: filter 0.15s;
  &:hover { filter: brightness(1.08) saturate(1.2); }
`;

function HeaderBar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();
  const location = useLocation();
  const onLogo = () => {
    if (location.pathname !== "/") nav("/");
  }
  return (
    <Bar>
      <LogoTxt onClick={onLogo}>🐾 SketchQuest</LogoTxt>
      <RightBox>
        {user ? (
          <>
            <UserBadge>
              <span style={{marginRight:'0.5em'}}>👤</span>
              {user.displayName || "Anonymous"}
            </UserBadge>
            <LogoutBtn onClick={logout}>Logout</LogoutBtn>
          </>
        ) : null}
      </RightBox>
    </Bar>
  );
}
export default HeaderBar;
