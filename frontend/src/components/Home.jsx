
import React from "react";
import Featured from "./Featured";
import Footer from "./Footer";
import PublicEvents from "./PublicEvents";

const HomePage = () => {
  return (
    <>
      <Featured />
      <br />
      <div className="flex flex-col items-center">
      </div>
      <PublicEvents />
      <Footer />  
    </>
  );
};

export default HomePage;