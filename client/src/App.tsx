import { createTheme, MantineProvider,} from "@mantine/core";
import {Routes,Route, BrowserRouter} from "react-router-dom";
import {BasicDemo} from "./pages/BasicDemo.tsx";
import {Layout} from "./pages/Layout.tsx";
import {StepDemo} from "./pages/StepDemo.tsx";


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
