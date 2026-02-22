import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import SpinnerLoading from "./components/SpinnerLoading.jsx";

const App = lazy(() => import("./App.jsx"));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense key="app" fallback={<SpinnerLoading />}>
      <App />
    </Suspense>
  </StrictMode>
);
