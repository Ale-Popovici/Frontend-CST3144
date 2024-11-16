// src/services/api.js

const API_URL = "http://localhost:5001/api";

// GET Lessons Function (Requirement A)
const getLessons = async () => {
  try {
    const response = await fetch(`${API_URL}/lessons`);
    if (!response.ok) throw new Error("Failed to fetch lessons");
    const data = await response.json();

    // Transform the data to match frontend structure
    return data.map((lesson) => ({
      id: lesson.id,
      subject: lesson.subject,
      location: lesson.location,
      price: lesson.price,
      spaces: lesson.spaces,
      icon: getDefaultIcon(lesson.subject),
    }));
  } catch (error) {
    console.error("Error fetching lessons:", error);
    throw error;
  }
};

// POST Order Function (Requirement B)
const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: orderData.name,
        phoneNumber: orderData.phone,
        lessonIds: orderData.lessonIds,
        numberOfSpace: orderData.numberOfSpace,
      }),
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

// PUT Update Lesson Space Function (Requirement C)
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
};
