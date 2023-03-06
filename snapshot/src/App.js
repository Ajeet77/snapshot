import "./App.css";
import { useEffect, useRef, useState } from "react";
import { Container, Navbar, Nav, Form } from "react-bootstrap";
import axios from "axios";

function App() {
  const searchData = useRef(null);
  const [searchText, setSearchText] = useState("mountains");
  const [imageData, setImageData] = useState([]);
  useEffect(() => {
    //method key cat/mountain/ sort per_page:40 format xml/json
    const params = {
      method: "flickr.photos.search",
      api_key: "ce0dcd91841d5929b585b53d173b7952",
      text: searchText,
      sort: "",
      per_page: 40,
      license: "4",
      extras: "owner_name, license",
      format: "json",
      nojsoncallback: 1,
    };
    //farm id secret server
    const parameters = new URLSearchParams(params);
    //?per_page=24&
    const url = `https://api.flickr.com/services/rest/?${parameters}`;
    axios
      .get(url)
      .then((resp) => {
        console.log(resp.data);
        const arr = resp.data.photos.photo.map((imgData) => {
          return fetchFlickrImageUrl(imgData, "q");
        });
        setImageData(arr);
      })
      .catch(() => {})
      .finally(() => {});
  }, [searchText]);
  const fetchFlickrImageUrl = (photo, size) => {
    //farm66.staticflickr.com/server/id_
    let url = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}`;
    if (size) {
      url += `_${size}`;
    }
    url += ".jpg";
    return url;
  };
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand className="fs-2">SnapShot</Navbar.Brand>
          <Nav className="me-auto">{/* <Nav.Link>Home</Nav.Link> */}</Nav>
        </Container>
      </Navbar>
      <Container className="my-3 d-flex justify-content-center search">
        <Form.Control
          type="search"
          id="inputfield"
          onChange={(e) => {
            searchData.current = e.target.value;
          }}
        />
        <button
          varients="success"
          onClick={() => {
            setSearchText(searchData.current);
          }}
        >
          Search
        </button>
      </Container>
      <section className="container my-3 d-flex justify-content-center gap-2 filter">
        <button
          onClick={() => {
            setSearchText("mountains");
          }}
        >
          Mountains
        </button>
        <button
          onClick={() => {
            setSearchText("beaches");
          }}
        >
          Beaches
        </button>
        <button
          onClick={() => {
            setSearchText("birds");
          }}
        >
          Birds
        </button>
        <button
          onClick={() => {
            setSearchText("food");
          }}
        >
          Food
        </button>
      </section>
      <section className="container image-container">
        {imageData.map((imageurl, key) => {
          return (
            <article className="flickr-image">
              <img src={imageurl} key={key} alt="pics" />
            </article>
          );
        })}
      </section>
    </>
  );
}

export default App;
