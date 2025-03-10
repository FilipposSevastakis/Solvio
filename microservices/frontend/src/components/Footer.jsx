import React from "react";
import Logo from "../images/logo2.png";

const Footer = () => {
  return (
    <footer className="flex w-screen text-center justify-center items-center footer footer-center p-6 bg-orange-100 text-primary-content">
      <img alt="" src={Logo} className="mr-20 w-16 h-20" />
      <aside>
        <p className="font-bold">
          SOLVIO <br />
        </p>
        <p>Copyright © 2024 - All rights reserved</p>
      </aside>
      <nav></nav>
    </footer>
  );
};

export default Footer;
