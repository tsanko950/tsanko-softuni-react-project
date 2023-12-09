import Slider from "react-slick";

import { useContext, useEffect, useState } from "react";
import * as firebaseServices from "../../services/firebaseServices";
import Carousel from "../Carousel/Carousel";
import HomeMovie from "./HomeMovie";
import Select from "react-select";
import AuthContext from "../../contexts/autoContext";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [newestMovies, setNewestMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(-1);
  const [sortingOption, setSortingOption] = useState("newest");
  const { isAuthenticated, userId } = useContext(AuthContext);

  const handleSortingChange = (event) => {
    setSortingOption(event.target.id);
  };

  useEffect(() => {
    switch (sortingOption) {
      case "newest":
        movies.sort((a, b) => parseInt(b.year) - parseInt(a.year));
        break;
      case "duration":
        movies.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
        break;
      case "title":
        movies.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    setMovies([...movies]);
  }, [sortingOption]);

  useEffect(() => {
    firebaseServices
      .getAllGenres()
      .then((genresData) => setGenres(genresData))
      .catch((error) => {
        console.error("Error fetching genres:", error);
      });

    firebaseServices
      .getAllMovies()
      .then((result) => {
        setMovies(result);
        setFilteredMovies(result);

        const sortedAndSlicedMovies = result
          .sort((a, b) => parseInt(b.year) - parseInt(a.year))
          .slice(0, 6);

        setNewestMovies(sortedAndSlicedMovies);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedGenre && selectedGenre != "-1") {
      const filteredMovies = movies.filter((movie) =>
        movie.genre.includes(parseInt(selectedGenre))
      );
      setFilteredMovies(filteredMovies);
    } else {
      setFilteredMovies(movies);
    }
  }, [selectedGenre, movies]);

  const onChangeGenreHandler = (e) => {
    setSelectedGenre(e.value);
  };

  const getMovieGenres = (movie) => {
    return genres.filter((genre) => movie.genre.includes(parseInt(genre.id)));
  };

  const genreOptions = genres.map((genre) => ({
    value: genre.id,
    label: genre.description,
  }));

  genreOptions.unshift({
    value: "-1",
    label: "All genres",
  });

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "40px",
      width: "200px",
      backgroundColor: "#151f30",
      border: "none",
      fontFamily: "Inter, sans-serif",
      "&:hover": {
        border: "none",
      },
      "&:focus": {
        border: "none",
      },
      "&:active": {
        border: "none",
      },
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "#fff",
      width: "200px",
      border: "none",
      fontFamily: "Inter, sans-serif",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#151f30" : null,
      color: state.isFocused ? "#2f80ed" : "#e0e0e0",
      width: "200px",
      border: "none",
      cursor: "pointer",
      fontFamily: "Inter, sans-serif",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#151f30",
      zIndex: 2,
      fontSize: "14px",
      fontFamily: "Inter, sans-serif",
      width: "220px",
      border: "none",
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "200px",
      width: "220px",
      fontFamily: "Inter, sans-serif",
      overflowY: "auto",
      border: "none",
    }),
  };

  return (
    <>
      <div className="home">
        <Carousel movies={newestMovies} genres={genres} />
      </div>

      {/* catalog */}
      <div className="catalog catalog--list">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="catalog__nav">
                <div className="catalog__select-wrap">
                  <Select
                    className="catalog__select"
                    defaultValue={selectedGenre}
                    onChange={onChangeGenreHandler}
                    options={genreOptions}
                    styles={customStyles}
                  ></Select>
                </div>
                <div className="slider-radio" onChange={handleSortingChange}>
                  <input type="radio" name="order" id="newest" />
                  <label htmlFor="newest">Newest</label>

                  <input type="radio" name="order" id="duration" />
                  <label htmlFor="duration">Duration</label>

                  <input
                    type="radio"
                    name="order"
                    id="title"
                    defaultChecked="checked"
                  />
                  <label htmlFor="title">Title</label>
                </div>
              </div>
              <div className="row row--grid">
                {filteredMovies.length > 0 ? (
                  filteredMovies.map((movie) => (
                    <HomeMovie
                      key={movie.id}
                      movie={movie}
                      genres={getMovieGenres(movie)}
                      userId={userId}
                    />
                  ))
                ) : (
                  <div className="col-12">
                    <img src="src/img/favicon.png" className="loading-image" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* end catalog */}
    </>
  );
};

export default Home;
