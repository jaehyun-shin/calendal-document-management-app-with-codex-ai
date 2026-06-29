import { BrowserRouter } from "react-router-dom";
import { AppDataProvider } from "./providers/AppDataProvider";
import { AppRoutes } from "./routes";

export default function App() {
  return (
    <AppDataProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppDataProvider>
  );
}
