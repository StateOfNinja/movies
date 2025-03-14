import React from "react";
import { createRoot } from "react-dom/client";
import { Offline, Online } from "react-detect-offline";
import { Alert } from "antd";

import App from "./components/app/app";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.Fragment>
    <App />

    {/* <Offline>
      <Alert
        message="Warning Text"
        description="Warning Description Warning Description Warning Description Warning Description"
        type="warning"
      />
    </Offline> */}
  </React.Fragment>
);
