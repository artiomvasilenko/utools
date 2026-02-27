// frontend/src/utils/csrf.js
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export const csrfToken = getCookie("csrftoken");

// Для fetch запросов
export const fetchWithCSRF = (url, options = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      "X-CSRFToken": csrfToken,
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "same-origin", // важно для передачи куки
  });
};
