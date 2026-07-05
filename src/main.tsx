import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

/* Self-hosted fonts — no external CDN. */
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/caveat/600.css";

import "./index.css";
import App from "./App";

/* A hello for engineers who open DevTools. */
console.log(
  "%cshaik.luqman_ ▍",
  "color:#f5a623; background:#101013; padding:10px 16px; border-radius:8px; font-family:monospace; font-size:14px; font-weight:bold;",
);
console.log(
  "%cYou opened the console — my kind of person.\n\n→ shaik.luqman28@gmail.com\n→ github.com/LuckyLuck786\n→ linkedin.com/in/luqman-shaik",
  "color:#6e6e76; font-family:monospace; font-size:12px; line-height:1.7;",
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
