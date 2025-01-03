import "./App.css";
import { useState, useEffect } from "react";
import Home from "./Home/Home";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

const loadGoogleMaps = () => {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
};

function App() {
  useEffect(() => {
    loadGoogleMaps();
  }, []);

  return (
    <>
      <Header />
      <Home />
      <Footer />
    </>
  );
}

export default App;
