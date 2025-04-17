const mainFileData = `import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./src/styles.css";
import App from "./src/App.tsx";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)`;

const appFileData = `import "./styles.css";

const App = () => {
  return (
    <h1 className="App">
      Hello world!
    </h1>
  );
}

export default App;`;

const stylesFileData = ` body {
  height: 100%;
  width: 100%;
 }
 
 .App {
  display: flex;
  justify-content: center;
  align-items: center;
 }`;

const initialFileData = {
    files: {
        '/main.tsx': mainFileData,
        '/src/App.tsx': appFileData,
        '/src/styles.css': stylesFileData,
    },
    folders: new Set(['/src']),
};

export { initialFileData };
