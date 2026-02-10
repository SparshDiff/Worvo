import { createRoot } from "react-dom/client";
import { NuqsAdapter } from "nuqs/adapters/react";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import QueryProvider from "./context/query-provider.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import ThemeProvider  from "./context/theme-provider.tsx";

createRoot(document.getElementById("root")!).render(

  <BrowserRouter>
    <ThemeProvider>
      <QueryProvider>
        <NuqsAdapter>
          <App />
        </NuqsAdapter>
        <Toaster />
      </QueryProvider>
    </ThemeProvider>
  </BrowserRouter>

);
