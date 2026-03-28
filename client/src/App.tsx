import { createTheme, MantineProvider,} from "@mantine/core";
import {Routes,Route, BrowserRouter} from "react-router-dom";
import {BasicDemo} from "./pages/BasicDemo.tsx";
import {Layout} from "./pages/Layout.tsx";
import {StepDemo} from "./pages/StepDemo.tsx";
import i18next from "i18next";
import {initReactI18next} from 'react-i18next';
import {fallbackLanguage} from "./components/openForm/hooks/translator.ts";

i18next
    .use(initReactI18next)
    .init({
        lng: fallbackLanguage,
        debug: false,
        interpolation: {
            escapeValue: false
        },
    }).then(() => {
});


function App() {

    const theme = createTheme({
        /** Put your mantine theme override here */
    })

  return (
      <BrowserRouter>
          <MantineProvider theme={theme}>
              <Routes>
                  <Route element={<Layout />}>
                      <Route path="/" element={"Home"} />
                      <Route path="/demo" element={<BasicDemo/>} />
                      <Route path="/stepdemo" element={<StepDemo/>} />
                  </Route>
                  <Route path="*" element={"Not Found "} />
              </Routes>
          </MantineProvider>
      </BrowserRouter>
  )
}

export default App
