import { Link } from "react-router-dom";
import Path from "../../paths";
const CatalogGenre = ({ genre }) => {
  const imageSrc = `src/img/category/${genre.id}.jpg`; // Construir la ruta de la imagen dinámicamente
  return (
    <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
      <Link
        to={Path.MoviesListGenre.replace(":category", genre.id)}
        className="category"
      >
        <div className="category__cover">
          <img src={imageSrc} alt="" />
        </div>
        <h3 className="category__title">{genre.description}</h3>
      </Link>
    </div>
  );
};

export default CatalogGenre;
