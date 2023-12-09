import CatalogGenre from "./CatalogGenre";
import { useContext, useEffect, useState } from "react";
import * as firebaseServices from "../../services/firebaseServices";

export default function Catalog() {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    firebaseServices
      .getAllGenres()
      .then((genresData) => setGenres(genresData))
      .catch((error) => {
        console.error("Error fetching genres:", error);
      });
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="row row--grid">
          {genres.length > 0 ? (
            genres.map((genre) => <CatalogGenre key={genre.id} genre={genre} />)
          ) : (
            <img src="src/img/favicon.png" className="loading-image" />
          )}
        </div>
      </div>
    </section>
  );
}
