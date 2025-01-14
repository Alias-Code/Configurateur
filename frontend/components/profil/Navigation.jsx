import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

const NavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding: 2rem;
  background-color: #1a1a1a;
  color: white;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  width: 20%;
  height: 100%;
  text-transform: capitalize;

  .navigation {
    display: flex;
    flex-direction: column;

    hr {
      margin: 1rem 0;
      border: 0.1px solid lightgray;
      opacity: 0.7;
    }

    img {
      width: 1.2rem;
      height: 1.2rem;
      transform: translateY(-1px);
      fill: white;
    }

    div {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      width: 100%;
      transition: all 0.5s ease;
      cursor: pointer;
    }

    .logout:hover {
      color: #dc3545;
      transition: color 0.5s ease;

      p::after {
        background-color: #dc3545;
      }
    }
  }
`;

const NavButton = styled.button`
  background-color: ${({ type }) => (type === "white" ? "white" : "#1a1a1a")};
  color: ${({ type }) => (type === "white" ? "black" : "white")};
  padding: 4px 8px;
  border: none;
  border-radius: 7px;
  font-size: 0.7rem;
  border: 2px solid black;
  display: flex;
  justify-content: ceanter;
  align-items: center;
  gap: 0.4rem;
  text-transform: capitalize;
  cursor: pointer;

  img {
    width: 1rem;
    height: 1rem;
  }
`;

const NavItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  p {
    position: relative;
    display: inline-block;
    padding-bottom: 4px;

    &::after {
      content: "";
      position: absolute;
      bottom: 15%;
      left: 0;
      width: 0;
      height: 1px;
      background-color: white;
      transition: width 0.5s ease;
    }

    &:hover::after {
      width: 100%;
    }
  }
`;

export default function Navigation() {
  const { logout } = useAuthContext();

  return (
    <NavigationContainer>
      {/* NAVIGATION */}
      <div className="navigation">
        <Link to="tableau-de-bord">
          <NavItem>
            <img src="/dashboard.svg" alt="" />
            <p>Tableau de bord</p>
          </NavItem>
        </Link>
        <hr />
        <Link to="commandes">
          <NavItem>
            <img src="/order.svg" alt="" />
            <p>Commandes</p>
          </NavItem>
        </Link>
        <hr />
        <Link to="devis">
          <NavItem>
            <img src="/invoice.svg" alt="" />
            <p>Devis</p>
          </NavItem>
        </Link>
        <hr />
        <Link to="details-du-compte">
          <NavItem>
            <img src="/profil.svg" alt="" />
            <p>Détails du compte</p>
          </NavItem>
        </Link>
        <hr />
        <Link to="adresses">
          <NavItem>
            <img src="/address.svg" alt="" />
            <p>Adresses</p>
          </NavItem>
        </Link>
        <hr />
        <NavItem className="logout" onClick={logout}>
          <img src="/logout.svg" alt="" />
          <p>Déconnexion</p>
        </NavItem>
        <hr />
      </div>
      {/* RETOUR */}
      <Link to="/configuration">
        <NavButton type="white">
          <img src="/arrow_left.svg" alt="Icône de retour en arrière" />
          Retour au configurateur
        </NavButton>
      </Link>
    </NavigationContainer>
  );
}
