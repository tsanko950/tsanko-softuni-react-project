import Slider from "react-slick";
import styles from "./Carousel.module.css";

import CarouselMovie from "./CarouselMovie";

const Carousel = ({ movies, genres }) => {
  var settings = {
    dots: true,
    infinite: false,
    lazyLoad: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    swipeToSlide: true,
    dotsClass: "slick-dots slick-thumb",
  };
  const getMovieGenres = (movie) => {
    return genres.filter((genre) => movie.genre.includes(parseInt(genre.id)));
  };
  return (
    <div className="home home--static">
      <Slider {...settings} className={styles["slick-list"]}>
        {movies.map((movie) => (
          <CarouselMovie
            key={movie.id}
            movie={movie}
            genres={getMovieGenres(movie)}
          />
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
