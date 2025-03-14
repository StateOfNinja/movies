export default class MovieDB {
  baseUrl = "https://api.themoviedb.org/3";
  apiKey = "acf4c9b3ac2e0b6f9f95e7e9721b3d23";
  apiToken =
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhY2Y0YzliM2FjMmUwYjZmOWY5NWU3ZTk3MjFiM2QyMyIsIm5iZiI6MTc0MDg0Nzk3OS43Mjg5OTk5LCJzdWIiOiI2N2MzM2I2YjU3M2JlYjE1MmY2NmMzMGIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.mFfwEHTkCHP9am9c3EdChysCXYARAKF8CYllTloScgQ";

  options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: this.apiToken,
    },
  };

  async getResponse(request) {
    try {
      const response = await fetch(`${this.baseUrl}${request}`, this.options);
      if (!response.ok) {
        throw new Error(response.status);
      }
      return await response.json();
    } catch (e) {
      console.log(e.message);
      return e.message;
    }
  }

  async searchMovies(query, numberPage = 1) {
    const url = `/search/movie?query=${query}&include_adult=false&language=en-US&page=${numberPage}`;
    return await this.getResponse(url);
  }

  async createGuestSession() {
    const url = "/authentication/guest_session/new";
    const body = await this.getResponse(url);
    return body.guest_session_id;
  }

  async addRatingMovie(movieId, rate, sessionId) {
    const url = `${this.baseUrl}/movie/${movieId}/rating?guest_session_id=${sessionId}`;
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json;charset=utf-8",
        Authorization: this.apiToken,
      },
      body: JSON.stringify({ value: rate }),
    };

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(response.status);
      }
      return await response.json();
    } catch (e) {
      console.log(e.message);
      return e.message;
    }
  }

  async deleteRatingMovie(movieId, sessionId) {
    const url = `${this.baseUrl}/movie/${movieId}/rating?guest_session_id=${sessionId}`;

    const options = {
      method: "DELETE",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json;charset=utf-8",
        Authorization: this.apiToken,
      },
    };

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(response.status);
      }
      return await response.json();
    } catch (e) {
      console.log(e.message);
      return e.message;
    }
  }

  async getRatedMovies(numberPage = 1, sessionId) {
    const url = `/guest_session/${sessionId}/rated/movies?language=en-US&page=${numberPage}&sort_by=created_at.asc`;
    return await this.getResponse(url);
  }

  async getPopularMovies(numberPage = 1) {
    const url = `/movie/popular?language=en-US&page=${numberPage}`;
    return await this.getResponse(url);
  }

  async getGenres() {
    const url = `/genre/movie/list?language=en`;
    const genresList = await this.getResponse(url);
    return genresList.genres;
  }
}
