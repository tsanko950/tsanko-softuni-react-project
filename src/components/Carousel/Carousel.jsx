import Slider from "react-slick";

import { useEffect, useState } from "react";
import * as firebaseServices from "../../services/firebaseServices";
import CarouselMovie from "./CarouselMovie";

const Carousel = ({ movies, genres }) => {
  var settings = {
    dots: true,
    infinite: true,
    lazyLoad: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    dotsClass: "slick-dots slick-thumb",
  };
  const getMovieGenres = (movie) => {
    return genres.filter((genre) => movie.genre.includes(parseInt(genre.id)));
  };
  return (
    <div className="home home--static">
      <Slider {...settings}>
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
