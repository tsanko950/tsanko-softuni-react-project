import Slider from "react-slick";

import { useEffect, useState } from "react";
import * as firebaseServices from "../../services/firebaseServices";
import Carousel from "../Carousel/Carousel";
import HomeMovie from "./HomeMovie";
import Select from "react-select";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(-1);

  useEffect(() => {
    firebaseServices
      .getAllMovies()
      .then((result) => setMovies(result))
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  }, []);

  useEffect(() => {
    firebaseServices
      .getAllGenres()
      .then((genresData) => setGenres(genresData))
      .catch((error) => {
        console.error("Error fetching genres:", error);
      });
  }, []);

  const getMovieGenres = (movie) => {
    return genres.filter((genre) => movie.genre.includes(parseInt(genre.id)));
  };
  const onChangeGenreHandler = (e) => {
    console.log(e.target.value);
    setSelectedGenre(e.target.value);
    console.log(selectedGenre);
  };

  const genreOptions = genres.map((genre) => ({
    value: genre.id,
    label: genre.description,
  }));
  return (
    <>
      <div className="home">
        <Carousel movies={movies} genres={genres} />
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
                    onChange={setSelectedGenre}
                    options={genreOptions}
                  ></Select>
                  <select className="catalog__select" name="years">
                    <option value="All the years">All the years</option>
                    <option value={1}>'50s</option>
                    <option value={2}>'60s</option>
                    <option value={3}>'70s</option>
                    <option value={4}>'80s</option>
                    <option value={5}>'90s</option>
                    <option value={6}>2000-10</option>
                    <option value={7}>2010-20</option>
                    <option value={8}>2021</option>
                  </select>
                </div>
                <div className="slider-radio">
                  <input
                    type="radio"
                    name="grade"
                    id="featured"
                    defaultChecked="checked"
                  />
                  <label htmlFor="featured">Featured</label>
                  <input type="radio" name="grade" id="popular" />
                  <label htmlFor="popular">Popular</label>
                  <input type="radio" name="grade" id="newest" />
                  <label htmlFor="newest">Newest</label>
                </div>
              </div>
              <div className="row row--grid">
                {movies.map((movie) => (
                  <HomeMovie
                    key={movie.id}
                    movie={movie}
                    genres={getMovieGenres(movie)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="catalog__paginator-wrap">
                <span className="catalog__pages">12 from 144</span>
                <ul className="catalog__paginator">
                  <li>
                    <a href="#">
                      <svg
                        width={14}
                        height={11}
                        viewBox="0 0 14 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.75 5.36475L13.1992 5.36475"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5.771 10.1271L0.749878 5.36496L5.771 0.602051"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </li>
                  <li className="active">
                    <a href="#">1</a>
                  </li>
                  <li>
                    <a href="#">2</a>
                  </li>
                  <li>
                    <a href="#">3</a>
                  </li>
                  <li>
                    <a href="#">4</a>
                  </li>
                  <li>
                    <a href="#">
                      <svg
                        width={14}
                        height={11}
                        viewBox="0 0 14 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.1992 5.3645L0.75 5.3645"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8.17822 0.602051L13.1993 5.36417L8.17822 10.1271"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </li>
                </ul>
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
