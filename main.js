// TMDB API 설정
const API_BASE_URL = "https://api.themoviedb.org/3/movie/now_playing";
const API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMTExZWNkYTk5Y2I2MTM4ZTQ3NGE2OTY2MTlhN2ZmMiIsIm5iZiI6MTc2MjA3MzU3OC4yODQsInN1YiI6IjY5MDcxYmVhNDJkM2Q3YjczM2RkODQ4ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cNAirLvBLmz8bi6GLo1ua7F44nZs1wgkT3EUMIZyylc";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// DOM 요소
const moviesGrid = document.getElementById("moviesGrid");
const loading = document.getElementById("loading");
const error = document.getElementById("error");

// 영화 데이터 가져오기
async function fetchMovies() {
  try {
    loading.style.display = "block";
    error.style.display = "none";
    moviesGrid.innerHTML = "";

    const response = await fetch(`${API_BASE_URL}?language=ko-KR&page=1`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    displayMovies(data.results);
  } catch (err) {
    console.error("영화 데이터를 가져오는 중 오류 발생:", err);
    loading.style.display = "none";
    error.style.display = "block";
  }
}

// 영화 카드 렌더링
function displayMovies(movies) {
  loading.style.display = "none";

  if (!movies || movies.length === 0) {
    moviesGrid.innerHTML = `
      <div class="error" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
        <p>현재 상영 중인 영화가 없습니다.</p>
      </div>
    `;
    return;
  }

  moviesGrid.innerHTML = movies
    .map((movie) => {
      const posterPath = movie.poster_path
        ? `${IMAGE_BASE_URL}${movie.poster_path}`
        : null;
      const title = movie.title || "제목 없음";
      const releaseDate = movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : "";

      return `
        <div class="movie-card" data-movie-id="${movie.id}">
          <div class="movie-card__poster-wrapper">
            ${
              posterPath
                ? `<img src="${posterPath}" alt="${title}" class="movie-card__poster" loading="lazy" />`
                : `<div class="movie-card__poster--placeholder">포스터 없음</div>`
            }
          </div>
          <div class="movie-card__info">
            <h3 class="movie-card__title">${title} ${
        releaseDate ? `(${releaseDate})` : ""
      }</h3>
          </div>
        </div>
      `;
    })
    .join("");

  // 카드 클릭 이벤트 추가 (선택사항)
  const cards = document.querySelectorAll(".movie-card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const movieId = card.getAttribute("data-movie-id");
      console.log("영화 ID:", movieId);
      // 여기에 상세 페이지로 이동하는 로직을 추가할 수 있습니다
    });
  });
}

// 페이지 로드 시 영화 데이터 가져오기
document.addEventListener("DOMContentLoaded", () => {
  fetchMovies();
});
