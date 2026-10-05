import { useEffect, useMemo, useState } from "react";
import "./App.css";

const starterMovies = [
  {
    id: 1,
    title: "Interstellar",
    category: "Sci-Fi",
    rating: 4.8,
    status: "Watched",
    year: 2014,
    poster:
      "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  },
  {
    id: 2,
    title: "Inception",
    category: "Thriller",
    rating: 4.7,
    status: "Watched",
    year: 2010,
    poster:
      "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
  },
  {
    id: 3,
    title: "Spider-Man: No Way Home",
    category: "Action",
    rating: 4.5,
    status: "Watchlist",
    year: 2021,
    poster:
      "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
  },
  {
    id: 4,
    title: "The Dark Knight",
    category: "Action",
    rating: 4.9,
    status: "Watched",
    year: 2008,
    poster:
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  },
];

const categories = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Sci-Fi",
  "Thriller",
  "Romance",
];

const emptyForm = {
  title: "",
  category: "Action",
  rating: "4.0",
  status: "Watchlist",
  year: new Date().getFullYear(),
  poster: "",
};

function App() {
  const [movies, setMovies] = useState(() => {
    const saved = localStorage.getItem("cinevault_movies");
    return saved ? JSON.parse(saved) : starterMovies;
  });

  const [page, setPage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("cinevault_movies", JSON.stringify(movies));
  }, [movies]);

  const stats = useMemo(() => {
    const watched = movies.filter((m) => m.status === "Watched").length;
    const watching = movies.filter((m) => m.status === "Watching").length;
    const watchlist = movies.filter((m) => m.status === "Watchlist").length;

    const average =
      movies.length > 0
        ? (
            movies.reduce((sum, movie) => sum + Number(movie.rating), 0) /
            movies.length
          ).toFixed(1)
        : "0.0";

    return {
      total: movies.length,
      watched,
      watching,
      watchlist,
      average,
    };
  }, [movies]);

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || movie.status === statusFilter;

    const matchesCategory =
      categoryFilter === "All" || movie.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveMovie = (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter a movie title.");
      return;
    }

    if (editingId) {
      setMovies(
        movies.map((movie) =>
          movie.id === editingId
            ? {
                ...movie,
                title: form.title.trim(),
                category: form.category,
                rating: Number(form.rating),
                status: form.status,
                year: Number(form.year),
                poster:
                  form.poster ||
                  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80",
              }
            : movie
        )
      );

      setEditingId(null);
    } else {
      const newMovie = {
        id: Date.now(),
        title: form.title.trim(),
        category: form.category,
        rating: Number(form.rating),
        status: form.status,
        year: Number(form.year),
        poster:
          form.poster ||
          "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80",
      };

      setMovies([newMovie, ...movies]);
    }

    setForm(emptyForm);
    setPage("My Movies");
  };

  const startEdit = (movie) => {
    setForm({
      title: movie.title,
      category: movie.category,
      rating: String(movie.rating),
      status: movie.status,
      year: movie.year,
      poster: movie.poster,
    });

    setEditingId(movie.id);
    setPage("Add Movie");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setPage("Dashboard");
  };

  const deleteMovie = (id) => {
    setMovies(movies.filter((movie) => movie.id !== id));
  };

  const updateStatus = (id, status) => {
    setMovies(
      movies.map((movie) =>
        movie.id === id ? { ...movie, status } : movie
      )
    );
  };

  const renderStars = (rating) => {
    const rounded = Math.round(rating);

    return (
      <span className="stars">
        {"★★★★★".split("").map((star, index) => (
          <span
            key={index}
            className={index < rounded ? "active-star" : ""}
          >
            {star}
          </span>
        ))}
      </span>
    );
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand" onClick={() => setPage("Dashboard")}>
          <span className="brand-icon">🎬</span>
          <span>CineVault</span>
        </div>

        <nav>
          <button
            className={page === "Dashboard" ? "nav-active" : ""}
            onClick={() => setPage("Dashboard")}
          >
            Dashboard
          </button>

          <button
            className={page === "My Movies" ? "nav-active" : ""}
            onClick={() => setPage("My Movies")}
          >
            My Movies
          </button>

          <button
            className={page === "Add Movie" ? "nav-active" : ""}
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
              setPage("Add Movie");
            }}
          >
            + Add Movie
          </button>
        </nav>
      </header>

      <main>
        {page === "Dashboard" && (
          <>
            <section className="hero">
              <div className="hero-content">
                <p className="eyebrow">YOUR PERSONAL MOVIE HUB</p>

                <h1>
                  Welcome to <span>CineVault</span>
                </h1>

                <p className="hero-text">
                  Organize your favorite movies, rate what you watch,
                  and build your ultimate watchlist.
                </p>

                <button
                  className="primary-btn"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                    setPage("Add Movie");
                  }}
                >
                  + Add Your First Movie
                </button>
              </div>

              <div className="hero-icon">🎞️</div>
            </section>

            <section className="section-heading">
              <div>
                <h2>Your Movie Collection</h2>
                <p>Keep track of your cinematic journey.</p>
              </div>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🎬</div>
                <div>
                  <span>Total Movies</span>
                  <strong>{stats.total}</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✓</div>
                <div>
                  <span>Watched</span>
                  <strong>{stats.watched}</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">▶</div>
                <div>
                  <span>Watching</span>
                  <strong>{stats.watching}</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🔖</div>
                <div>
                  <span>Watchlist</span>
                  <strong>{stats.watchlist}</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div>
                  <span>Average Rating</span>
                  <strong>{stats.average}</strong>
                </div>
              </div>
            </section>

            <section className="movie-section">
              <div className="section-heading">
                <div>
                  <h2>Recently Added</h2>
                  <p>Your latest movies.</p>
                </div>

                <button
                  className="secondary-btn"
                  onClick={() => setPage("My Movies")}
                >
                  View All →
                </button>
              </div>

              <div className="movie-grid">
                {movies.slice(0, 4).map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    renderStars={renderStars}
                    deleteMovie={deleteMovie}
                    updateStatus={updateStatus}
                    startEdit={startEdit}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {page === "My Movies" && (
          <section className="movies-page">
            <div className="page-title">
              <div>
                <p className="eyebrow">YOUR COLLECTION</p>
                <h1>My Movies</h1>
                <p>Search, filter and manage your movie collection.</p>
              </div>

              <button
                className="primary-btn"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                  setPage("Add Movie");
                }}
              >
                + Add Movie
              </button>
            </div>

            <div className="filters">
              <input
                type="text"
                placeholder="🔍 Search movies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Watched">Watched</option>
                <option value="Watching">Watching</option>
                <option value="Watchlist">Watchlist</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {filteredMovies.length > 0 ? (
              <div className="movie-grid">
                {filteredMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    renderStars={renderStars}
                    deleteMovie={deleteMovie}
                    updateStatus={updateStatus}
                    startEdit={startEdit}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span>🎬</span>
                <h2>No movies found</h2>
                <p>Try changing your search or filters.</p>
              </div>
            )}
          </section>
        )}

        {page === "Add Movie" && (
          <section className="add-page">
            <div className="page-title">
              <div>
                <p className="eyebrow">
                  {editingId ? "UPDATE COLLECTION" : "MOVIE COLLECTION"}
                </p>

                <h1>{editingId ? "Edit Movie" : "Add a Movie"}</h1>

                <p>
                  {editingId
                    ? "Update the details of your movie."
                    : "Add a movie to your personal CineVault."}
                </p>
              </div>
            </div>

            <form className="movie-form" onSubmit={saveMovie}>
              <div className="form-group full">
                <label>Movie Title</label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleInput}
                  placeholder="Enter movie title"
                />
              </div>

              <div className="form-group">
                <label>Category</label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleInput}
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Rating</label>

                <select
                  name="rating"
                  value={form.rating}
                  onChange={handleInput}
                >
                  {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1].map(
                    (rating) => (
                      <option key={rating} value={rating}>
                        ⭐ {rating}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Viewing Status</label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleInput}
                >
                  <option>Watchlist</option>
                  <option>Watching</option>
                  <option>Watched</option>
                </select>
              </div>

              <div className="form-group">
                <label>Release Year</label>

                <input
                  type="number"
                  name="year"
                  value={form.year}
                  onChange={handleInput}
                  min="1900"
                  max="2100"
                />
              </div>

              <div className="form-group full">
                <label>
                  Poster URL <span>(optional)</span>
                </label>

                <input
                  name="poster"
                  value={form.poster}
                  onChange={handleInput}
                  placeholder="https://..."
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-btn">
                  {editingId ? "✓ Update Movie" : "+ Add Movie"}
                </button>
              </div>
            </form>
          </section>
        )}
      </main>

      <footer>
        <p>© 2026 CineVault • Your personal movie collection</p>
      </footer>
    </div>
  );
}

function MovieCard({
  movie,
  renderStars,
  deleteMovie,
  updateStatus,
  startEdit,
}) {
  return (
    <article className="movie-card">
      <div className="poster-wrapper">
        <img
          src={movie.poster}
          alt={movie.title}
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80";
          }}
        />

        <span className={`status ${movie.status.toLowerCase()}`}>
          {movie.status}
        </span>
      </div>

      <div className="movie-info">
        <div className="movie-top">
          <div>
            <h3>{movie.title}</h3>

            <p>
              {movie.category} • {movie.year}
            </p>
          </div>

          <button
            className="delete-btn"
            title="Delete movie"
            onClick={() => deleteMovie(movie.id)}
          >
            ×
          </button>
        </div>

        <div className="rating-row">
          {renderStars(movie.rating)}
          <span>{Number(movie.rating).toFixed(1)}</span>
        </div>

        <select
          className="status-select"
          value={movie.status}
          onChange={(e) => updateStatus(movie.id, e.target.value)}
        >
          <option>Watchlist</option>
          <option>Watching</option>
          <option>Watched</option>
        </select>

        <button
          className="secondary-btn"
          style={{
            width: "100%",
            marginTop: "9px",
          }}
          onClick={() => startEdit(movie)}
        >
          ✏ Edit Movie
        </button>
      </div>
    </article>
  );
}

export default App;