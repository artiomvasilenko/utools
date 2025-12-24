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

const lazyLoad = (key, component) => (
  <Suspense key={key} fallback={<SpinnerLoading />}>
    {component}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: lazyLoad("home", <Home />),
      },
      { path: "calculator", element: lazyLoad("calculator", <Calculator />) },
      { path: "timer", element: lazyLoad("timer", <Timer />) },
      {
        path: "number_random_generator",
        element: lazyLoad("number_random_generator", <RandomNumberGenerator />),
      },
      {
        path: "password_generator",
        element: lazyLoad("password_generator", <PasswordGenerator />),
      },
      {
        path: "credit_calculator",
        element: lazyLoad("credit_calculator", <CreditCalculator />),
      },
      {
        path: "investment_calculator",
        element: lazyLoad("investment_calculator", <InvestmentCalculator />),
      },
      {
        path: "trader_calculator",
        element: lazyLoad("trader_calculator", <TraderCalculator />),
      },
      { path: "calendar", element: lazyLoad("calendar", <Calendar />) },
      { path: "calendar/:year", element: lazyLoad("calendar", <Calendar />) },
      { path: "dkp", element: lazyLoad("dkp", <CarSaleContractGenerator />) },
      { path: "*", element: lazyLoad("*", <NotFound />) },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
