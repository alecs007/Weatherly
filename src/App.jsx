import "./App.css";
import { useState, useEffect } from "react";
import Home from "./Home/Home";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

const loadGoogleMaps = (onLoad) => {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
  script.async = true;
  script.defer = true;
  script.onload = onLoad;
  document.body.appendChild(script);
};

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>Loading Weatherly...</p>
    </div>
  );
};
function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGoogleMaps(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Header />
      <Home />
      <Footer />
    </>
  );
}

export default App;
