import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { useChoicesContext } from "../../context/ChoicesContext";
import { useCartContext } from "../../context/CartContext";
import { useAnimationContext } from "../../context/AnimationContext";

const BottomBarContainer = styled.div`
  position: fixed;
  z-index: 9999999999999;
  bottom: ${(props) => (props.$visible ? "0" : "-70px")};
  width: 100%;
  height: 55px;
  background-color: black;
  transition: all 0.75s ease-in-out;
`;

const NavList = styled.ul`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  position: relative;
`;

const Indicator = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 3px;
  width: 60px;
  background-color: #cfaa60;
  transition: transform 0.3s ease;
  transform: translateX(${(props) => props.$position}px);
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60px;
  color: ${(props) => (props.$isActive ? "#cfaa60" : "white")};
  transition: all 0.3s ease;
  transform: translateY(2.5px);
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
    margin-bottom: 4px;
  }

  span {
    font-size: 11px;
    font-weight: 500;
  }
`;

const RenderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff">
    <g transform="scale(0.24)">
      <path d="M31.414,36.6,52.62,48.848V73.33A2.5,2.5,0,0,0,56.37,75.5L78.825,62.537a2.5,2.5,0,0,0,1.251-2.166V34.438h0a2.5,2.5,0,0,0-1.251-2.165L56.37,19.314a2.5,2.5,0,0,0-2.5,0L31.415,32.273a2.5,2.5,0,0,0,0,4.331ZM75.076,58.927,57.62,69V48.848L75.076,38.769ZM55.12,24.366,72.575,34.439l-8.042,4.644L55.12,44.518,37.665,34.439Z" />
      <path d="M21.155,38.531a2.5,2.5,0,0,0-1.25,2.165v25.93a2.5,2.5,0,0,0,1.25,2.165L43.611,81.752a2.5,2.5,0,0,0,3.749-2.165V65.965c0-.034-.008-.065-.01-.1a2.961,2.961,0,0,0-.07-.5c-.019-.076-.044-.15-.07-.224a2.409,2.409,0,0,0-.093-.236c-.032-.068-.069-.131-.106-.2s-.089-.148-.14-.218-.091-.114-.14-.17a2.6,2.6,0,0,0-.186-.193c-.05-.046-.1-.088-.158-.131a2.435,2.435,0,0,0-.246-.169c-.026-.016-.047-.036-.073-.051L35.079,57.724V46.571c0-.035-.009-.067-.01-.1,0-.073-.013-.145-.022-.217A2.486,2.486,0,0,0,35,45.979c-.015-.064-.037-.125-.058-.187a2.658,2.658,0,0,0-.1-.267c-.029-.062-.065-.12-.1-.181a2.521,2.521,0,0,0-.139-.228c-.044-.061-.095-.117-.144-.174a2.364,2.364,0,0,0-.173-.187c-.055-.052-.116-.1-.176-.145a2.516,2.516,0,0,0-.216-.156c-.025-.015-.045-.036-.07-.05L23.655,38.531A2.5,2.5,0,0,0,21.155,38.531Zm3.75,19.3,5.174,2.85v7.49l-5.174-2.986ZM42.36,67.445v7.813l-7.281-4.2V63.434ZM30.079,48.014V54.97l-5.174-2.85V45.026Z" />
      <path d="M49.989,5.048a2.5,2.5,0,0,0,0,5,39.952,39.952,0,1,1,0,79.9,2.488,2.488,0,0,0-.974.2,2.5,2.5,0,0,0-.963-.243,39.954,39.954,0,0,1-9.258-1.543,2.5,2.5,0,1,0-1.4,4.8A44.951,44.951,0,0,0,47.814,94.9c.04,0,.081,0,.121,0a2.468,2.468,0,0,0,.979-.2,2.468,2.468,0,0,0,1.075.253,44.952,44.952,0,1,0,0-89.9Z" />
      <path d="M28.549,83.718a40.22,40.22,0,0,1-7.273-5.939,2.5,2.5,0,0,0-3.593,3.477,45.277,45.277,0,0,0,8.178,6.678,2.5,2.5,0,0,0,2.688-4.216Z" />
      <path d="M7.56,51.15a2.5,2.5,0,0,0,2.5-2.422,39.95,39.95,0,0,1,1.389-9.285,2.5,2.5,0,1,0-4.823-1.318A45.027,45.027,0,0,0,5.06,48.572a2.5,2.5,0,0,0,2.421,2.576Z" />
      <path d="M21.739,18.214a2.5,2.5,0,0,0-3.535,0A45.157,45.157,0,0,0,11.66,26.5a2.5,2.5,0,1,0,4.261,2.617,40.168,40.168,0,0,1,5.818-7.372A2.5,2.5,0,0,0,21.739,18.214Z" />
      <path d="M11.278,59.917a2.5,2.5,0,0,0-4.845,1.238,44.763,44.763,0,0,0,3.809,9.858,2.5,2.5,0,1,0,4.418-2.341A39.734,39.734,0,0,1,11.278,59.917Z" />
    </g>
  </svg>
);

const HomeIcon = () => (
  <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
    <g id="SVGRepo_bgCarrier" stroke-width="0" />

    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />

    <g id="SVGRepo_iconCarrier">
      <path
        d="M3.99999 10L12 3L20 10L20 20H15V16C15 15.2044 14.6839 14.4413 14.1213 13.8787C13.5587 13.3161 12.7956 13 12 13C11.2043 13 10.4413 13.3161 9.87868 13.8787C9.31607 14.4413 9 15.2043 9 16V20H4L3.99999 10Z"
        stroke="#ffffff"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
  </svg>
);

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 24 26">
    <path
      fill="#ffffff"
      fill-rule="evenodd"
      d="M20.653 22.642H1.346V6.793h4.94V8.83h1.346V6.793h6.735V8.83h1.347V6.793h4.939v15.849zM7.632 4.755c0-1.873 1.511-3.396 3.368-3.396 1.856 0 3.367 1.523 3.367 3.396v.679H7.632v-.679zm13.544.679h-5.462v-.679C15.714 2.133 13.599 0 11 0 8.4 0 6.286 2.133 6.286 4.755v.679H.823c-.454 0-.823.373-.823.831V23.17c0 .458.369.83.823.83h20.353c.455 0 .824-.372.824-.83V6.265c0-.458-.369-.831-.824-.831z"
    />
  </svg>
);

const ProfileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64px"
    height="64px"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ffffff"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round">
    <g id="SVGRepo_bgCarrier" stroke-width="0" />

    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />

    <g id="SVGRepo_iconCarrier">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /> <circle cx="12" cy="7" r="4" />
    </g>
  </svg>
);

const BottomBar = () => {
  const { activeTab, setActiveTab } = useAnimationContext();
  const [y, setY] = useState(window.scrollY);
  const [visible, setVisible] = useState(true);
  const { menu, setMenu } = useChoicesContext();
  const { showCart, setShowCart } = useCartContext();

  // Add these refs
  const navItemsRef = useRef([]);
  const indicatorRef = useRef(null);

  const navigate = useNavigate();

  // New positioning calculation method
  const calculatePosition = useCallback(() => {
    if (navItemsRef.current[activeTab]) {
      const activeElement = navItemsRef.current[activeTab];
      const containerElement = activeElement.parentElement;

      const elementRect = activeElement.getBoundingClientRect();
      const containerRect = containerElement.getBoundingClientRect();

      return elementRect.left - containerRect.left;
    }
    return 0;
  }, [activeTab]);

  const handleNavigationVisibility = useCallback(
    (e) => {
      const window = e.currentTarget;
      const currentScrollY = window.scrollY;

      const scrollThreshold = 5;

      if (Math.abs(y - currentScrollY) > scrollThreshold) {
        if (y > currentScrollY) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }

      setY(currentScrollY);
    },
    [y]
  );

  useEffect(() => {
    setY(window.scrollY);
    window.addEventListener("scroll", handleNavigationVisibility);

    return () => {
      window.removeEventListener("scroll", handleNavigationVisibility);
    };
  }, [handleNavigationVisibility]);

  function handleNavigation(index) {
    setActiveTab(index);

    switch (index) {
      case 0:
        menu && setMenu(false);
        showCart && setShowCart(false);
        navigate("/configurateur");
        break;
      case 1:
        setMenu(true);
        setVisible(false);
        break;
      case 2:
        setShowCart(true);
        setVisible(false);
        break;
      case 3:
        navigate("/profil");
        break;
      default:
        navigate("/accueil");
    }
  }

  const items = [
    { icon: <HomeIcon />, label: "Accueil" },
    { icon: <RenderIcon />, label: "Rendu" },
    { icon: <CartIcon />, label: "Panier" },
    { icon: <ProfileIcon />, label: "Profile" },
  ];

  return (
    <BottomBarContainer $visible={visible}>
      <NavList>
        <Indicator ref={indicatorRef} $position={calculatePosition()} />
        {items.map((item, index) => (
          <NavItem
            key={index}
            ref={(el) => (navItemsRef.current[index] = el)}
            $isActive={activeTab === index}
            onClick={() => handleNavigation(index)}>
            {item.icon}
            <span>{item.label}</span>
          </NavItem>
        ))}
      </NavList>
    </BottomBarContainer>
  );
};
export default BottomBar;
