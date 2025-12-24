function SpinnerLoading() {
  return (
    <div className="spinner-card bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg flex flex-col items-center space-y-4">
      <div class="dots-container">
        <div class="dot bg-purple-500 dark:bg-purple-400"></div>
        <div class="dot bg-purple-500 dark:bg-purple-400"></div>
        <div class="dot bg-purple-500 dark:bg-purple-400"></div>
      </div>
      <button class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">
        Загрузка...
      </button>
    </div>
  );
}

export default SpinnerLoading;
