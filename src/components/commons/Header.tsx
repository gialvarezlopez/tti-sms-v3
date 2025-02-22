import React from "react";
//import logoExpertel from "@/assets/images/expertel.svg";
//import logoCustomer from "@/assets/images/logo-top.png";
import Image from "next/image";

const Header = () => {
  return (
    <div className="shadow-custom py-8">
      <div className="justify-between  custom-container flex gap-3 ">
        {/*
        <Image alt="" src={logoCustomer} />
        <Image alt="" src={logoExpertel} />
        */}
      </div>
    </div>
  );
};

export default Header;
