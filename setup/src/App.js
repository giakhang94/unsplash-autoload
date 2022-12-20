import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;
function App() {
  const [loadng, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const fetchImages = async () => {
    setLoading(true);
    let url = "";
    url = `${mainUrl}${clientID}`;
    try {
      const resp = await axios.get(url, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          accept: "application/json",
        },
      });
      if (resp) {
        setLoading(false);
        setPhotos(resp.data);
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchImages();
  }, []);
  return (
    <div className="App">
      <h2>App stock photos</h2>
    </div>
  );
}

export default App;
