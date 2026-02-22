import './App.css'
import {AppShell, Burger, createTheme, Group, MantineProvider, NavLink, Text, Title} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {BrowserRouter, Link,Routes,Route} from "react-router-dom";
import {BasicDemo} from "./pages/BasicDemo.tsx";


function App() {
    const [opened, { toggle }] = useDisclosure();

    const theme = createTheme({
        /** Put your mantine theme override here */
    })

  return (
      <BrowserRouter>
          <MantineProvider theme={theme}>
              <AppShell
                  header={{ height: 60 }}
                  footer={{ height: 60 }}
                  navbar={{ width: 150, breakpoint: 'sm', collapsed: { mobile: !opened } }}
                  padding="md"
              >
                  <AppShell.Header bg="blue">
                      <Group h="100%" px="md">
                          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                          <Title c="white">OpenForm</Title>
                      </Group>
                  </AppShell.Header>

                  <AppShell.Navbar p="md">
                      <NavLink label="Home" component={Link} to="/" />
                      <NavLink label="About" component={Link} to="/basicDemo" />
                  </AppShell.Navbar>

                  <AppShell.Main>
                      <Routes>
                          <Route path="/" element={"Home"} />
                          <Route path="/basicDemo" element={<BasicDemo />} />
                      </Routes>
                  </AppShell.Main>

                  {/* FOOTER */}
                  <AppShell.Footer bg="dark" p="md">
                      <Text c="white">Footer</Text>
                  </AppShell.Footer>
              </AppShell>
          </MantineProvider>
      </BrowserRouter>
  )
}

export default App
