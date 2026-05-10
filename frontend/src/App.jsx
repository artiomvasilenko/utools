import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./components/Layout";
import { User } from "lucide-react";

const Home = lazy(() => import("./modules/Home"));
const Calculator = lazy(() => import("./modules/Calculator"));
const Timer = lazy(() => import("./modules/Timer"));
const RandomNumberGenerator = lazy(
  () => import("./modules/RandomNumberGenerator"),
);
const PasswordGenerator = lazy(() => import("./modules/PasswordGenerator"));
const CreditCalculator = lazy(() => import("./modules/CreditCalculator"));
const InvestmentCalculator = lazy(
  () => import("./modules/InvestmentCalculator"),
);
const TraderCalculator = lazy(() => import("./modules/TraderCalculator"));
const Calendar = lazy(() => import("./modules/Calendar"));
const CarSaleContractGenerator = lazy(
  () => import("./modules/CarSaleContractGenerator"),
);
const NotFound = lazy(() => import("./components/NotFound"));

const PollCreator = lazy(() => import("./modules/poll/PollCreator"));
const PollVote = lazy(() => import("./modules/poll/PollVote"));
const PollResults = lazy(() => import("./modules/poll/PollResult"));
const UserAgreement = lazy(() => import("./modules/UserAgreement"));
const Cookies = lazy(() => import("./modules/Cookies"));
const RealInterestRate = lazy(() => import("./modules/RealInterestRate"));
const TicTacToe = lazy(() => import("./modules/TicTacToe"));
const PdfMerger = lazy(() => import("./modules/PdfMerger"));
const CoinFlip = lazy(() => import("./modules/CoinFlip"));
const NicknameGenerator = lazy(() => import("./modules/NicknameGenerator"));
const HeicToJpg = lazy(() => import("./modules/HeicToJpg"));

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
      { path: "poll/create", element: <PollCreator /> },
      { path: "poll/:slug", element: <PollVote /> },
      { path: "poll/:slug/results", element: <PollResults /> },
      { path: "useragreement", element: <UserAgreement /> },
      { path: "cookies", element: <Cookies /> },
      { path: "real_interest_rate", element: <RealInterestRate /> },
      { path: "tictactoe", element: <TicTacToe /> },
      { path: "pdfmerger", element: <PdfMerger /> },
      { path: "coinflip", element: <CoinFlip /> },
      { path: "nickname_generator", element: <NicknameGenerator /> },
      { path: "heictojpg", element: <HeicToJpg /> },

      { path: "*", element: <NotFound /> },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
