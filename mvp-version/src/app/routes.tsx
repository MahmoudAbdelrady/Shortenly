import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import ShortenPage from "./pages/ShortenPage";
import HistoryPage from "./pages/HistoryPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: ShortenPage },
      { path: "history", Component: HistoryPage },
    ],
  },
]);
