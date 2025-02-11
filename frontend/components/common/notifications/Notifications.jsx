import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useNotificationsContext } from "../../../context/NotificationsContext";
import { SmallIcon } from "../../utils/SharedStyle";

// --- STYLE ---

const Error = styled.div`
  background-color: ${({ status }) => (status === "error" ? "#a82633" : status === "success" ? "#245e24" : "#00000")};
  font-weight: bold;
  border-radius: 10px;
  position: fixed;
  z-index: 9999999999999999;
  bottom: 80%;
  left: 1%;
  padding: clamp(0.3rem, 0.8vw, 0.5rem);
  display: flex;
  align-items: center;
  transform: translateX(${({ animation }) => (animation ? "0" : "-100%")});
  opacity: ${({ animation }) => (animation ? "1" : "0")};
  transition: transform 0.5s ease, opacity 0.5s ease;

  div {
    display: flex;
    align-items: center;
  }

  img {
    filter: invert(1);
    width: clamp(12px, 3vw, 20px);
    height: clamp(12px, 3vw, 20px);
  }

  ul {
    margin: 0;
    list-style: none;
    flex-direction: row;
  }

  li {
    display: flex;
    align-items: center;
    margin-bottom: clamp(0.1rem, 0.5vw, 0.2rem);
  }

  p,
  a {
    padding-left: clamp(0.2rem, 0.6vw, 0.3rem);
    font-size: clamp(8px, 1.5vw, 12px);
    color: white;
  }

  a {
    text-decoration: underline;
  }
`;

// --- NOTIFICATIONS ---

export default function Notifications({ notifications }) {
  // --- ÉTATS ET RÉFÉRENCES ---

  const { setNotifications } = useNotificationsContext();
  const [animation, setAnimation] = useState(false);

  const isArray = Array.isArray(notifications.content);
  const hasNotification = notifications.content.length > 0;
  const status = notifications.type;

  // --- REINITIALISATION DU MESSAGE ---

  useEffect(() => {
    if (hasNotification) {
      setAnimation(true);

      const hideTimeout = setTimeout(() => {
        setAnimation(false);
        setTimeout(() => {
          setNotifications((prev) => ({ ...prev, content: [] }));
        }, 750);
      }, 4000);

      return () => {
        clearTimeout(hideTimeout);
        setAnimation(false);
      };
    }
  }, [notifications]);

  // --- RENDU ---

  return (
    <Error status={status} animation={animation}>
      {isArray ? (
        // IF MULTIPLE ERRORS
        <ul>
          {notifications.content.map((msg, index) => (
            <li key={index}>
              <SmallIcon
                src={status === "error" ? "/error.svg" : status === "success" ? "/informations.svg" : ""}
                alt="Icône d'erreur ou d'information"
              />
              <p>{msg}</p>
            </li>
          ))}
        </ul>
      ) : (
        // IF SINGLE ERROR
        <div>
          <SmallIcon
            src={status === "error" ? "/error.svg" : status === "success" ? "/informations.svg" : ""}
            alt="Icône d'erreur ou d'information"
          />
          <p>{notifications.content}</p>
          {notifications.link && <a href={notifications.link.href}>{notifications.link.text}</a>}
        </div>
      )}
    </Error>
  );
}
