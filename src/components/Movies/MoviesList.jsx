import { useContext, useEffect, useState } from "react";
import * as firebaseServices from "../../services/firebaseServices";
import MovieListItem from "./MovieListItem";
import AuthContext from "../../contexts/autoContext";
import { useParams } from "react-router-dom";

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [genreDescription, setGenreDescription] = useState("");
  const { searchMovie, userId } = useContext(AuthContext);
  const { category } = useParams();

  useEffect(() => {
    firebaseServices
      .getAllGenres()
      .then((genresData) => {
        setGenres(genresData);
        if (category) {
          const foundGenre = genresData.find(
            (genre) => genre.id == parseInt(category)
          );
          if (foundGenre) {
            setGenreDescription(foundGenre.description);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching genres:", error);
      });
  }, []);

  useEffect(() => {
    if (category) {
      firebaseServices
        .getMoviesByGenre([parseInt(category)])
        .then((result) => {
          const filteredMovies = result.filter((movie) =>
            movie.genre.includes(parseInt(category))
          );
          setMovies(filteredMovies);
        })
        .catch((error) => {
          console.error("Error fetching movies:", error);
        });
    } else {
      firebaseServices
        .searchMovies(searchMovie)
        .then((result) => {
          setMovies(result);
        })
        .catch((error) => {
          console.error("Error fetching movies:", error);
        });
    }
  }, [category, searchMovie]);

  const getMovieGenres = (movie) => {
    return genres.filter((genre) => movie.genre.includes(parseInt(genre.id)));
  };

  return (
    <>
      <div className="catalog catalog--page">
        {category && (
          <div className="container">
            <div className="row">
              <div className="col-12 col-xl-6">
                <h1 className="section__title section__title--head">
                  {genreDescription}
                </h1>
              </div>
            </div>
          </div>
        )}
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="row row--grid">
                {movies.length == 0 && !searchMovie ? (
                  <img src="/src/img/favicon.png" className="loading-image" />
                ) : movies.length > 0 ? (
                  movies.map((movie) => (
                    <MovieListItem
                      key={movie.id}
                      movie={movie}
                      genres={getMovieGenres(movie)}
                      userId={userId}
                    />
                  ))
                ) : (
                  <div className="col-12">
                    <div className="no-movies-found">
                      No movies found searching for '{searchMovie}'
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MoviesList;
