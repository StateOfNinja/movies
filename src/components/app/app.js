import { Component } from 'react';
import { format } from 'date-fns';
import { LoadingOutlined } from '@ant-design/icons';
import { Pagination, Flex, Spin, Alert, Empty } from 'antd';

import './app.css';

import { Provider } from '../context/context';
import SearchInput from '../searchInput/searchInput';
import MovieList from '../moviesList/moviesList';
import Tabs from '../tabs/tabs';
import MovieDB from '../../api/movieDB';

import noImg from './no-image.jpg';

export default class App extends Component {
  state = {
    currentPages: 1,
    totalPages: 0,
    queryValue: '',
    movies: [],
    loading: false,
    error: false,
    found: false,
    tab: 'search',
    genresList: [],
    sessionId: '',
    moviesRated: [],
  };

  movieDB = new MovieDB();

  componentDidMount = () => {
    if (!this.mounted) {
      this.mounted = true;
      this.createSessionId();
      this.getGenres();
      this.getPopularMovies(this.state.currentPages);
    }
  };

  createSessionId = () => {
    this.movieDB
      .createGuestSession()
      .then((sessionId) => {
        this.setState({ sessionId: sessionId });
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  saveRatedMovie = (id, rate) => {
    const newRateMovie = { id, rate };

    this.setState(({ moviesRated }) => {
      const newMoviesRated = moviesRated.filter((movie) => movie.id !== id).concat(newRateMovie);

      return {
        moviesRated: newMoviesRated,
      };
    });
  };

  deleteRatedMovie = (id) => {
    this.setState(({ moviesRated }) => {
      const newMoviesRated = moviesRated.filter((movie) => movie.id !== id);

      return {
        moviesRated: newMoviesRated,
      };
    });
  };

  getGenres = () => {
    this.movieDB
      .getGenres()
      .then((genres) => {
        this.setState({ genresList: genres });
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  searchQuery = (query) => {
    this.setState({ queryValue: query, currentPages: 1 }, () => this.searchMoviesQuery());
  };

  searchMoviesQuery = () => {
    const { currentPages, queryValue } = this.state;

    this.setState({
      movies: [],
      loading: true,
      totalPages: 0,
    });

    if (queryValue.length === 0) {
      this.getPopularMovies(currentPages);
    } else {
      this.movieDB
        .searchMovies(queryValue, currentPages)
        .then((movies) => {
          this.setState({
            loading: false,
            totalPages: movies.total_pages,
          });

          const movieList = movies.results;
          if (movies.results.length === 0) {
            this.setState({ found: true });
          }
          movieList.forEach((movie) => {
            this.addItem(movie);
            this.setState({ found: false });
          });
        })
        .catch((e) => {
          console.log(e.message);
        });
    }
  };

  addItem = (item) => {
    const newItem = this.createItem(item);
    this.setState(({ movies }) => {
      const newMovies = [...movies, newItem];
      return {
        movies: newMovies,
      };
    });
  };

  createItem = (movie) => {
    const movieId = movie.id;
    const title = movie.original_title || 'ZOV';
    const releaseData = movie.release_date ? format(new Date(movie.release_date), 'MMMM d, y') : 'ZOV';
    const genresIds = movie.genre_ids;
    const description = movie.overview || 'ZOV';
    const rate = movie.vote_average.toFixed(1);
    let posterUrl = `${noImg}`;

    let stars = 0;

    this.state.moviesRated.map((item) => {
      if (item.id === movie.id) {
        stars = item.rate;
      }
    });

    if (movie.poster_path) {
      posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    }

    return {
      id: movieId,
      title,
      releaseData,
      genresIds,
      description,
      rate,
      posterUrl,
      stars,
    };
  };

  getPopularMovies = (pages) => {
    this.movieDB
      .getPopularMovies(pages)
      .then((movies) => {
        this.setState({
          loading: false,
          totalPages: movies.total_pages,
        });
        const movieList = movies.results;
        movieList.forEach((movie) => {
          this.addItem(movie);
        });
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  getRatedMovies = () => {
    const { currentPages, sessionId } = this.state;
    this.setState({ loading: true, totalPages: 0, movies: [] });
    this.movieDB
      .getRatedMovies(currentPages, sessionId)
      .then((movies) => {
        this.setState({ loading: false, totalPages: movies.total_pages });

        const movieList = movies.results;

        if (movieList.length === 0) {
          this.setState({ loading: false, found: true });
        }

        movieList.forEach((movie) => {
          this.addItem(movie);
        });
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  changeTabs = (key) => {
    if (key === 'search') {
      this.setState(
        {
          tab: 'search',
          currentPages: 1,
          found: false,
          movies: [],
        },
        () => this.getPopularMovies()
      );
    } else if (key === 'rated') {
      this.setState(
        {
          tab: 'rated',
          currentPages: 1,
          found: false,
          movies: [],
        },
        () => this.getRatedMovies()
      );
    }
  };

  changePages = (page) => {
    this.setState({ currentPages: page }, () => {
      this.searchMoviesQuery();
    });
  };

  render() {
    const { movies, loading, error, currentPages, totalPages, tab, found, sessionId } = this.state;
    const searchInput = tab === 'search' ? <SearchInput searchQuery={this.searchQuery} /> : null;

    const hasData = !(loading || error || found);

    const spinner = loading ? <Spin indicator={<LoadingOutlined spin />} size="large" /> : null;

    const errorMessage = error ? (
      <Alert
        message="Error Text"
        description="Error Description Error Description Error Description Error Description"
        type="error"
      />
    ) : null;

    const content = hasData ? (
      <MovieList
        moviesData={movies}
        sessionId={sessionId}
        saveRatedMovie={this.saveRatedMovie}
        deleteRatedMovie={this.deleteRatedMovie}
      />
    ) : (
      <Empty description="Ничего не найдено" />
    );

    const pagination =
      totalPages > 0 && hasData ? (
        <Pagination
          defaultCurrent={1}
          current={currentPages}
          showSizeChanger={false}
          total={totalPages * 10}
          onChange={this.changePages}
        />
      ) : null;

    return (
      <div className="container">
        <Flex vertical align="center">
          <Tabs changeTabs={this.changeTabs} />
          {searchInput}
          {spinner}
          {errorMessage}
          <Provider value={{ genresList: this.state.genresList }}>{content}</Provider>
          {pagination}
        </Flex>
      </div>
    );
  }
}
