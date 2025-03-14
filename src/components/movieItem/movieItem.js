import React from "react";
import { Rate, Tag } from "antd";

import MovieDB from "../api/movieDB";

import "./movieItem.css";

function MovieItem({
  id,
  title,
  releaseData,
  genresIds,
  description,
  rate,
  posterUrl,
  genresList,
  sessionId,
  saveRatedMovie,
  deleteRatedMovie,
}) {
  const movieDB = new MovieDB();
  const reductionDescription = (text, maxLength = 150) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, text.lastIndexOf(" ", maxLength)) + "...";
  };
  const descriptionCropped = reductionDescription(description);

  const genres = genresList.filter((item) => genresIds.includes(item.id));

  const changeRatedMovie = (rate) => {
    movieDB.addRatingMovie(id, rate, sessionId);
    saveRatedMovie(id, rate);
  };

  const deleteRated = (rate) => {
    movieDB.deleteRatingMovie(id, sessionId);
    deleteRatedMovie(id);
    rate = 0;
  };

  let classNameRate = "movie-card__estimation";
  if (rate < 3) {
    classNameRate += " bad";
  } else if (rate < 5) {
    classNameRate += " middle";
  } else if (rate < 7) {
    classNameRate += " good";
  } else if (rate >= 7) {
    classNameRate += " perfect";
  }

  return (
    <li className="movie-card" key={id}>
      <img className="movie-card__image" src={posterUrl} alt="Movie poster" />
      <div className="movie-card__info">
        <div className="movie-card__title">
          <h2 className="movie-card__name">{title}</h2>
          <div className={classNameRate}>{rate}</div>
        </div>
        <p className="movie-card__date">{releaseData}</p>
        <p className="movie-card__genres">
          {genres.map((item) => {
            return <Tag key={item.id}>{item.name}</Tag>;
          })}
        </p>
        <p className="movie-card__description">{descriptionCropped}</p>
        <div className="movie-card__rate">
          <Rate count={10} onChange={changeRatedMovie} />
          <button
            className="movie-card__rate-delete"
            onClick={deleteRated}
          ></button>
        </div>
      </div>
    </li>
  );
}

export default MovieItem;
