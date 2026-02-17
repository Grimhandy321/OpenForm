import './App.css'
import {AppShell, Burger, createTheme, Group, MantineProvider, Text, Title} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";


function App() {
    const [opened, { toggle }] = useDisclosure();

    const theme = createTheme({
        /** Put your mantine theme override here */
    })

  return (
      <MantineProvider theme={theme}>
          <AppShell
              header={{ height: 60, }}
              footer={{ height: 60 }}
              navbar={{ width: 150, breakpoint: 'sm', collapsed: { mobile: !opened } }}
              aside={{ width: 0, breakpoint: 'md', collapsed: { desktop: false, mobile: true } }}
              padding="md"
          >
              <AppShell.Header bg = "blue">
                  <Group h="100%" px="md">
                      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                      <Title c={"white"}>OpenForm</Title>
                  </Group>
              </AppShell.Header>
              <AppShell.Navbar p="md">Navbar</AppShell.Navbar>
              <AppShell.Main>
                  <Text>This is the main section, your app content here.</Text>
                  <Text>AppShell example with all elements: Navbar, Header, Aside, Footer.</Text>
                  <Text>All elements except AppShell.Main have fixed position.</Text>
                  <Text>Aside is hidden on on md breakpoint and cannot be opened when it is collapsed</Text>
              </AppShell.Main>
              <AppShell.Footer bg={'dark'} p="md">Footer</AppShell.Footer>
          </AppShell>
      </MantineProvider>
  )
}

export default App
