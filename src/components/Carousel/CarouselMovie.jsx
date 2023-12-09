import { Link } from "react-router-dom";
import Path from "../../paths";

export default function CarouselMovie({ movie, genres }) {
  return (
    <div className="home__card">
      <Link
        to={`${Path.MovieDetails.replace(":movieId", movie.id)}`}
        className="details-button"
      >
        <img src={movie.imageUrl} alt={movie.title} />
      </Link>
      <div>
        <h2>{movie.title}</h2>
        <ul className="card__list">
          {genres.map((genre) => (
            <li key={genre.id}>{genre.description}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
