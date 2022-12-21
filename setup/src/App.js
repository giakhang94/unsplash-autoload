import "./App.scss";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos`;
function App() {
  const inputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [input, setInput] = useState("");
  const fetchImages = async () => {
    setLoading(true);

    let url = "";
    let pageUrl = `&page=${page}`;
    let query = `&query=${input}`;
    if (input === "") {
      url = `${mainUrl}${clientID}${pageUrl}`;
    } else {
      url = `${searchUrl}${clientID}${pageUrl}${query}`;
    }
    try {
      console.log(url);
      const resp = await axios.get(url, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          accept: "application/json",
        },
      });
      if (resp) {
        setLoading(false);
        setPhotos((prev) => {
          if (input && page === 1) {
            return resp.data.results;
          }
          if (input) {
            console.log(resp.data);
            return [...prev, ...resp.data.results];
          } else return [...prev, ...resp.data];
        });
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchImages();
  }, [page]);

  //useEffect catch scroll event
  useEffect(() => {
    const event = window.addEventListener("scroll", () => {
      if (
        !loading &&
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2
      ) {
        setPage((prev) => prev + 1);
      }
    });
    return () => window.removeEventListener("scroll", event);
  }, []);
  return (
    <div className="App">
      <form className="search" action="">
        <div className="search__input">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          <button
            className="search__btn"
            onClick={(e) => {
              e.preventDefault();
              if (input === "") {
                return;
              } else {
                if (page === 1) {
                  fetchImages();
                }
              }
              setPage(1);
            }}
          >
            Search
          </button>
        </div>
      </form>
      <div className="photolist">
        {photos.map((photo) => {
          return (
            <div className="photo" key={photo.id + Math.random()}>
              <div className="photo__img">
                <img src={photo.urls.regular} alt="" />
              </div>
              <div className="photo__info">
                <div className="info__user">
                  <span className="info__userName">{photo.user.name}</span>
                  <span className="info__likes">{photo.likes} likess</span>
                </div>
                <div>
                  <img
                    className="info__userThumb"
                    src={photo.user.profile_image.medium}
                    alt=""
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {loading && <p className="loading">Loading...</p>}
    </div>
  );
}

export default App;
