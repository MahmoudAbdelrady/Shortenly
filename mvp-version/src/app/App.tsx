import { RouterProvider } from "react-router";
import { router } from "./routes";
import { UrlProvider } from "./context/UrlContext";

export default function App() {
  return (
    <UrlProvider>
      <RouterProvider router={router} />
    </UrlProvider>
  );
}
