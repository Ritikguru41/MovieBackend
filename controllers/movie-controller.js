import mongoose from "mongoose";
import jwt from "jsonwebtoken"; // Ensure you import jwt
import Admin from "../modules/Admin.js";
import Movie from "../modules/Movie.js";


export const addMovie = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const extractedToken = authHeader.split(" ")[1];

  if (!extractedToken || extractedToken.trim() === "") {
    return res.status(401).json({ message: "Token not found" });
  }

  try {
    const decrypted = jwt.verify(extractedToken, process.env.SECRET_KEY);
    const adminId = decrypted.id;

    const { title, description, releaseDate, genre, duration, posterUrl, trailerId } = req.body;

    // Validate required fields
    if (!title || !description || !releaseDate || !genre || !duration || !posterUrl || !trailerId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const movie = new Movie({
      title,
      description,
      releaseDate,
      genre,
      duration,
      posterUrl,
      trailerId,
      admin: adminId,
    });

    await movie.save();
    return res.status(201).json({ movie });
  } catch (err) {
    return res.status(500).json({ message: "Could not add movie", error: err.message });
  }
};


export const getMovieById = async (req, res, next) => {
  const movieId = req.params.id;

  try {
    const movie = await Movie.findById(movieId).populate("admin", "name email"); // Include admin details

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    return res.status(200).json(movie);
  } catch (err) {
    return res.status(500).json({ message: "Could not fetch movie", error: err.message });
  }
};


export const getAllMovies = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 movies per page

  try {
    const movies = await Movie.find()
      .skip((page - 1) * limit)
      .limit(limit);

    if (!movies || movies.length === 0) {
      return res.status(404).json({ message: "No movies found" });
    }

    const updatedMovies = movies.map(movie => ({
      ...movie.toObject(),
      trailerUrl: `https://www.youtube.com/embed/${movie.trailerId}`,
    }));

    return res.status(200).json({ movies: updatedMovies, page, limit });
  } catch (err) {
    return res.status(500).json({ message: "Could not fetch movies", error: err.message });
  }
};

export const deleteMovie = async (req, res, next) => {
  const movieId = req.params.id;

  if (!movieId) {
    return res.status(400).json({ message: "Movie ID is required" });
  }

  try {
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Check if the logged-in admin is the one who added the movie
    const authHeader = req.headers.authorization;
    const extractedToken = authHeader.split(" ")[1];
    const decrypted = jwt.verify(extractedToken, process.env.SECRET_KEY);
    const adminId = decrypted.id;

    if (movie.admin.toString() !== adminId) {
      return res.status(403).json({ message: "You are not authorized to delete this movie" });
    }

    await Movie.findByIdAndDelete(movieId);
    return res.status(200).json({ message: "Movie deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Could not delete movie", error: err.message });
  }
};