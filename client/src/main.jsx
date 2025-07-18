import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UserContextProvider from "./context/UserContextProvider.jsx";
import { Auth0Provider } from "@auth0/auth0-react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{ redirect_uri: "http://localhost:5173/home" }}
    >
      <BrowserRouter>
        <UserContextProvider>
          <App />
        </UserContextProvider>
      </BrowserRouter>
    </Auth0Provider>
  </StrictMode>
);
