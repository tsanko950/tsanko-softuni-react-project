import { Link } from "react-router-dom";
import Path from "../../paths";
import { getDuration } from "../../utils/utils";

export default function HomeMovie({ movie, genres, userId }) {
  return (
    <div className="col-12 col-md-6 col-xl-4">
      <div className="card card--big">
        <Link
          to={`${Path.MovieDetails.replace(":movieId", movie.id)}`}
          className="card__cover"
        >
          <img src={movie.imageUrl} alt={movie.title} />
          <svg
            width={22}
            height={22}
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11 1C16.5228 1 21 5.47716 21 11C21 16.5228 16.5228 21 11 21C5.47716 21 1 16.5228 1 11C1 5.47716 5.47716 1 11 1Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.0501 11.4669C13.3211 12.2529 11.3371 13.5829 10.3221 14.0099C10.1601 14.0779 9.74711 14.2219 9.65811 14.2239C9.46911 14.2299 9.28711 14.1239 9.19911 13.9539C9.16511 13.8879 9.06511 13.4569 9.03311 13.2649C8.93811 12.6809 8.88911 11.7739 8.89011 10.8619C8.88911 9.90489 8.94211 8.95489 9.04811 8.37689C9.07611 8.22089 9.15811 7.86189 9.18211 7.80389C9.22711 7.69589 9.30911 7.61089 9.40811 7.55789C9.48411 7.51689 9.57111 7.49489 9.65811 7.49789C9.74711 7.49989 10.1091 7.62689 10.2331 7.67589C11.2111 8.05589 13.2801 9.43389 14.0401 10.2439C14.1081 10.3169 14.2951 10.5129 14.3261 10.5529C14.3971 10.6429 14.4321 10.7519 14.4321 10.8619C14.4321 10.9639 14.4011 11.0679 14.3371 11.1549C14.3041 11.1999 14.1131 11.3999 14.0501 11.4669Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        {movie.creator == userId && (
          <Link
            to={`${Path.CreateEditMovie.replace(":movieId", movie.id)}`}
            className="card__add"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
            </svg>
          </Link>
        )}

        <div className="card__content">
          <h3 className="card__title">
            <Link to={`${Path.MovieDetails.replace(":movieId", movie.id)}`}>
              {movie.title} {"("}
              {movie.year}
              {")"}
            </Link>
          </h3>
          <ul className="card__list">
            {genres.map((genre) => (
              <li key={genre.id} className="hover-effect">
                {genre.description}
              </li>
            ))}
          </ul>
          <ul className="card__info">
            <li>
              <span>Director:</span>
              <span className="hover-effect">{movie.director}</span>
            </li>
          </ul>
          <ul className="card__info">
            <li>
              <span>Duration:</span>
              <span className="hover-effect">
                {getDuration(movie.duration)}
              </span>
            </li>
          </ul>
          <p className="card__tagline">
            {movie.plot.length > 150
              ? movie.plot.substring(0, 150) + "..."
              : movie.plot}
          </p>
        </div>
      </div>
    </div>
  );
}
