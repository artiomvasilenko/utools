import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./components/Layout";

const Home = lazy(() => import("./modules/Home"));
const Calculator = lazy(() => import("./modules/Calculator"));
const Timer = lazy(() => import("./modules/Timer"));
const RandomNumberGenerator = lazy(() =>
  import("./modules/RandomNumberGenerator")
);
const PasswordGenerator = lazy(() => import("./modules/PasswordGenerator"));
const CreditCalculator = lazy(() => import("./modules/CreditCalculator"));
const InvestmentCalculator = lazy(() =>
  import("./modules/InvestmentCalculator")
);
const TraderCalculator = lazy(() => import("./modules/TraderCalculator"));
const Calendar = lazy(() => import("./modules/Calendar"));
const CarSaleContractGenerator = lazy(() =>
  import("./modules/CarSaleContractGenerator")
);
const NotFound = lazy(() => import("./components/NotFound"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      { path: "calculator", element: <Calculator /> },
      { path: "timer", element: <Timer /> },
      {
        path: "number_random_generator",
        element: <RandomNumberGenerator />,
      },
      {
        path: "password_generator",
        element: <PasswordGenerator />,
      },
      {
        path: "credit_calculator",
        element: <CreditCalculator />,
      },
      {
        path: "investment_calculator",
        element: <InvestmentCalculator />,
      },
      {
        path: "trader_calculator",
        element: <TraderCalculator />,
      },
      { path: "calendar", element: <Calendar /> },
      { path: "calendar/:year", element: <Calendar /> },
      { path: "dkp", element: <CarSaleContractGenerator /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
