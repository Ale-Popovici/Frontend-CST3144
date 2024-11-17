// src/services/api.js

// Set the API URL dynamically based on the environment
const API_URL =
  process.env.VUE_APP_API_URL ||
  (window.location.hostname === "ale-popovici.github.io"
    ? "http://3.253.62.183:5001/api"
    : "http://localhost:5001/api");

console.log("API URL:", API_URL); // Debug log

// Fetch lessons
const getLessons = async () => {
  try {
    console.log("Fetching from:", `${API_URL}/lessons`); // Debug log
    const response = await fetch(`${API_URL}/lessons`);
    if (!response.ok) throw new Error("Failed to fetch lessons");
    const data = await response.json();
    return data.map((lesson) => ({
      id: lesson._id,
      subject: lesson.topic,
      location: lesson.location,
      price: lesson.price,
      spaces: lesson.space,
      icon: getDefaultIcon(lesson.topic),
    }));
  } catch (error) {
    console.error("Error fetching lessons:", error);
    throw error;
  }
};

// Search lessons
const searchLessons = async (searchTerm) => {
  try {
    const response = await fetch(
      `${API_URL}/lessons/search?q=${encodeURIComponent(searchTerm)}`
    );
    if (!response.ok) throw new Error("Failed to search lessons");
    const data = await response.json();
    return data.map((lesson) => ({
      id: lesson._id,
      subject: lesson.topic,
      location: lesson.location,
      price: lesson.price,
      spaces: lesson.space,
      icon: getDefaultIcon(lesson.topic),
    }));
  } catch (error) {
    console.error("Error searching lessons:", error);
    throw error;
  }
};

// Create order
const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create order");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Update lesson space
const updateLessonSpace = async (lessonId, newSpace) => {
  try {
    const response = await fetch(`${API_URL}/lessons/${lessonId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ space: newSpace }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update lesson space");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating lesson space:", error);
    throw error;
  }
};

// Helper function for icons
const getDefaultIcon = (subject) => {
  const iconMap = {
    Mathematics: "fa-square-root-variable",
    Physics: "fa-atom",
    Chemistry: "fa-flask",
    Biology: "fa-dna",
    "Computer Science": "fa-laptop-code",
    "English Literature": "fa-book",
    History: "fa-landmark",
    Geography: "fa-earth-americas",
    Art: "fa-palette",
    Music: "fa-music",
  };
  return iconMap[subject] || "fa-book";
};

export const api = {
  getLessons,
  createOrder,
  updateLessonSpace,
  searchLessons,
};
