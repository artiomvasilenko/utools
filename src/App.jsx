import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./modules/Home";
import Calculator from "./modules/Calculator";
import Timer from "./modules/Timer";
import RandomNumberGenerator from "./modules/RandomNumberGenerator";
import PasswordGenerator from "./modules/PasswordGenerator";
import CreditCalculator from "./modules/CreditCalcilator";
import InvestmentCalculator from "./modules/InvestmentCalculator";
import TraderCalculator from "./modules/TraderCalculator";
import Calendar from "./modules/Calendar";
import CarSaleContractGenerator from "./modules/CarSaleContractGenerator";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "calculator", element: <Calculator /> },
      { path: "timer", element: <Timer /> },
      { path: "number_random_generator", element: <RandomNumberGenerator /> },
      { path: "password_generator", element: <PasswordGenerator /> },
      { path: "credit_calculator", element: <CreditCalculator /> },
      { path: "investment_calculator", element: <InvestmentCalculator /> },
      { path: "trader_calculator", element: <TraderCalculator /> },
      { path: "calendar", element: <Calendar /> },
      { path: "calendar/:year", element: <Calendar /> },
      { path: "dkp", element: <CarSaleContractGenerator /> },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
