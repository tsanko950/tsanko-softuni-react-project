import { useEffect, useState } from "react";
import * as firebaseServices from "../../services/firebaseServices";
import MovieListItem from "./MovieListItem";

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);

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
    console.log(movie.genre);
    return genres.filter((genre) => movie.genre.includes(parseInt(genre.id)));
  };

  return (
    <div className="catalog catalog--page">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="row row--grid">
              {movies.map((movie) => (
                <MovieListItem
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
            <button className="catalog__more" type="button">
              Load more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviesList;
