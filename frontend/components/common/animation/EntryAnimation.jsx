import styled from "@emotion/styled";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { useAnimationContext } from "../../../context/AnimationContext";

// --- STYLE ---

const VideoContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: ${({ entryAnimation }) => (entryAnimation ? "block" : "none")};
  z-index: 9999999999999;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    animation: videoIn 0.5s ease-in-out forwards, videoOut 0.5s ease-in-out 4.5s forwards;
  }

  @keyframes videoIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes videoOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

// --- ENTRY ANIMATION ---

export default function EntryAnimation() {
  // --- ÉTATS ET RÉFÉRENCES ---
  const { entryAnimation, setEntryAnimation } = useAnimationContext();
  const { setIsAuthenticated, setSkipHome } = useAuthContext();

  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (entryAnimation) {
      // --- PENDANT LA VIDÉO ---

      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play();
        }

        setTimeout(() => {
          const [type, url] = entryAnimation.split("_");

          if (type === "login") {
            setIsAuthenticated(true);
          } else if (type === "logout") {
            setIsAuthenticated(false);
          } else if (type === "skip" && url === "/configuration") {
            setSkipHome(true);
          } else if (type === "skip" && url === "/accueil") {
            setSkipHome(false);
          }
        }, 2000);

        navigate(url);
      }, 600);

      // --- APRES LA VIDÉO ---

      const cleanup = setTimeout(() => {
        setEntryAnimation("");
      }, 5000);

      return () => {
        clearTimeout(timer);
        clearTimeout(cleanup);
      };
    }
  }, [entryAnimation, setEntryAnimation]);

  // --- RENDU ---

  return (
    <VideoContainer entryAnimation={entryAnimation}>
      <video ref={videoRef} src="/intro.mp4" />
    </VideoContainer>
  );
}
