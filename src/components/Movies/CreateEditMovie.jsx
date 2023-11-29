import { useEffect, useState } from "react";
import * as firebaseServices from "../../services/firebaseServices";
import styles from "./CreateEditMovie.module.css";

const movieInitialState = {
  cast: "",
  director: "",
  duration: 0,
  genre: "",
  imageUrl: "",
  plot: "",
  title: "",
  trailerUrl: "",
  year: 0,
};

const CreateEditMovie = ({ onEdit, movieId }) => {
  const [movieValues, setMovieValues] = useState(movieInitialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    //firebaseServices.getMovieByID(movieId).then((result) => setMovie(result));
  }, [movieId]);

  const changeHandler = (e) => {
    let value = "";

    switch (e.target.type) {
      case "number":
        value = Number(e.target.value);
        break;
      case "chackbox":
        value = e.target.checked;
        break;
      default:
        value = e.target.value;
        break;
    }

    setMovieValues((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  const resetFormHandler = () => {
    // setMovieValues(movieInitialState);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    try {
      console.log(movieValues);
      const result = firebaseServices.addMovie(movieValues);
      navigate("/games");
    } catch (err) {
      // Error notification
      console.log(err);
    }
    // resetFormHandler();
  };

  const yearValidator = () => {
    if (!isNaN(movieValues.year)) {
      if (
        movieValues.year < 1900 ||
        movieValues.year > new Date().getFullYear() + 1
      ) {
        setErrors((state) => ({
          ...state,
          year:
            "Year should be between 1900 and " + (new Date().getFullYear() + 1),
        }));
      } else {
        if (errors.year) {
          setErrors((state) => ({
            ...state,
            year: "",
          }));
        }
      }
    } else {
      setErrors((state) => ({
        ...state,
        year: "Year should be a number",
      }));
    }
  };

  const durationValidator = () => {
    if (!isNaN(movieValues.duration)) {
      if (movieValues.duration < 1 || movieValues.duration > 240) {
        setErrors((state) => ({
          ...state,
          duration: "Duration should be between 1 and " + 240 + " min",
        }));
      } else {
        if (errors.duration) {
          setErrors((state) => ({
            ...state,
            duration: "",
          }));
        }
      }
    } else {
      setErrors((state) => ({
        ...state,
        duration: "Duration should be a number",
      }));
    }
  };

  return (
    <div className="tab-content" id="myTabContent">
      <div
        className="tab-pane fade active show"
        id="tab-1"
        role="tabpanel"
        aria-labelledby="1-tab"
      >
        <div className="col-12">
          <div className="sign__wrap">
            <div className="row">
              <div className="col-12 col-lg-12">
                <form
                  action="#"
                  className="sign__form sign__form--profile sign__form--first"
                  data-select2-id={9}
                >
                  <div className="row" data-select2-id={8}>
                    <div className="col-12">
                      <h4 className="sign__title">Movie details</h4>
                    </div>
                    <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                      <div className="sign__group">
                        <label className="sign__label" htmlFor="title">
                          Title
                        </label>
                        <input
                          id="title"
                          type="text"
                          name="title"
                          className="sign__input"
                          placeholder="The Godfather"
                          value={movieValues.title}
                          onChange={changeHandler}
                          onBlur={() => console.log("onBlur")}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                      <div className="sign__group">
                        <label className="sign__label" htmlFor="director">
                          Director
                        </label>
                        <input
                          id="director"
                          type="text"
                          name="director"
                          className="sign__input"
                          placeholder="Francis Ford Coppola"
                          value={movieValues.director}
                          onChange={changeHandler}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                      <div className="sign__group">
                        <label className="sign__label" htmlFor="cast">
                          Cast
                        </label>
                        <input
                          id="cast"
                          type="text"
                          name="cast"
                          className="sign__input"
                          placeholder="Marlon Brando, Al Pacino, Andy Garcia"
                          value={movieValues.cast}
                          onChange={changeHandler}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                      <div className="sign__group">
                        <label className="sign__label" htmlFor="duration">
                          Duration (min)
                        </label>
                        <input
                          id="duration"
                          type="text"
                          name="duration"
                          className={
                            "sign__input" +
                            (errors.duration ? ` ${styles.inputError}` : "")
                          }
                          placeholder="105"
                          onBlur={durationValidator}
                          value={movieValues.duration}
                          onChange={changeHandler}
                        />
                        {errors.duration && (
                          <p className={styles.errorMessage}>
                            {errors.duration}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                      <div className="sign__group">
                        <label className="sign__label" htmlFor="imageURL">
                          Image URL
                        </label>
                        <input
                          id="imageURL"
                          type="text"
                          name="imageURL"
                          className="sign__input"
                          placeholder="https://..."
                          value={movieValues.imageUrl}
                          onChange={changeHandler}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                      <div className="sign__group">
                        <label className="sign__label" htmlFor="trailerURL">
                          Trailer URL
                        </label>
                        <input
                          id="trailerURL"
                          type="text"
                          name="trailerURL"
                          className="sign__input"
                          placeholder="https://..."
                          value={movieValues.trailerUrl}
                          onChange={changeHandler}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                      <div className="sign__group">
                        <label className="sign__label" htmlFor="year">
                          Release year
                        </label>
                        <input
                          id="year"
                          type="text"
                          name="year"
                          className={
                            "sign__input" +
                            (errors.year ? ` ${styles.inputError}` : "")
                          }
                          placeholder="1972"
                          value={movieValues.year}
                          onBlur={yearValidator}
                          onChange={changeHandler}
                        />
                        {errors.year && (
                          <p className={styles.errorMessage}>{errors.year}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                      <div className="sign__group">
                        <label className="sign__label" htmlFor="plot">
                          Plot
                        </label>
                        <textarea
                          id="plot"
                          name="plot"
                          className="sign__textarea"
                          placeholder="In 1945, the New York City Corleone family don, Vito Corleone, listens to requests during his daughter Connie's wedding to Carlo. Vito's youngest son Michael, a forme.."
                          value={movieValues.plot}
                          onChange={changeHandler}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <button
                        className="sign__btn"
                        disabled={Object.values(errors).some((x) => x)}
                        onClick={submitHandler}
                        type="button"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEditMovie;
