import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./components/Layout";
import SpinnerLoading from "./components/SpinnerLoading";

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

const lazyLoad = (component) => (
  <Suspense fallback={<SpinnerLoading />}>{component}</Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: lazyLoad(<Home />),
      },
      { path: "calculator", element: lazyLoad(<Calculator />) },
      { path: "timer", element: lazyLoad(<Timer />) },
      {
        path: "number_random_generator",
        element: lazyLoad(<RandomNumberGenerator />),
      },
      { path: "password_generator", element: lazyLoad(<PasswordGenerator />) },
      { path: "credit_calculator", element: lazyLoad(<CreditCalculator />) },
      {
        path: "investment_calculator",
        element: lazyLoad(<InvestmentCalculator />),
      },
      { path: "trader_calculator", element: lazyLoad(<TraderCalculator />) },
      { path: "calendar", element: lazyLoad(<Calendar />) },
      { path: "calendar/:year", element: lazyLoad(<Calendar />) },
      { path: "dkp", element: lazyLoad(<CarSaleContractGenerator />) },
      { path: "*", element: lazyLoad(<NotFound />) },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
