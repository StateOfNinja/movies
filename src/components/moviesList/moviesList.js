import { Component } from 'react';

import './moviesList.css';

import { Consumer } from '../context/context';
import MovieItem from '../movieItem/movieItem';

export default class MoviesList extends Component {
  render() {
    const { moviesData, sessionId, saveRatedMovie, deleteRatedMovie } = this.props;

    return (
      <ul className="movie-list">
        <Consumer>
          {({ genresList }) => {
            return moviesData.map((item) => {
              return (
                <MovieItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  releaseData={item.releaseData}
                  genresIds={item.genresIds}
                  description={item.description}
                  rate={item.rate}
                  posterUrl={item.posterUrl}
                  genresList={genresList}
                  sessionId={sessionId}
                  saveRatedMovie={saveRatedMovie}
                  stars={item.stars}
                  deleteRatedMovie={deleteRatedMovie}
                />
              );
            });
          }}
        </Consumer>
      </ul>
    );
  }
}
