const API_KEY = "d339604ff999085a6d953ab0fba6c8b9";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovies {
  backdrop_path: string;
  id: number;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovies[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`
  ).then((response) => response.json());
}
