import {AppShell, Burger, Group, NavLink, Text, Title} from "@mantine/core";
import {Link, Outlet, useLocation} from "react-router-dom";
import {useDisclosure} from "@mantine/hooks";

export const Layout = () => {
    const [opened, { toggle }] = useDisclosure();
    const location = useLocation();

    return (  <AppShell
        header={{ height: 60 }}
        footer={{ height: 60 }}
        navbar={{ width: 180, breakpoint: "sm", collapsed: { mobile: !opened } }}
        padding="xl"
    >
        {/* HEADER */}
        <AppShell.Header bg="blue">
            <Group h="100%" mx="md">
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                <Title c="white">OpenForm</Title>
            </Group>
        </AppShell.Header>

        {/* NAVBAR */}
        <AppShell.Navbar>
            <NavLink
                label="Home"
                component={Link}
                to="/"
                active={location.pathname === "/"}
            />
            <NavLink
                label="Basic demo"
                component={Link}
                to="/demo"
                active={location.pathname === "/demo"}
            />
            <NavLink
                label="Step demo"
                component={Link}
                to="/stepdemo"
                active={location.pathname === "/stepdemo"}
            />
        </AppShell.Navbar>

        <AppShell.Main w={"100em"} >
            <Outlet />
        </AppShell.Main>

        <AppShell.Footer bg="dark" p="md">
            <Text c="white">Footer</Text>
        </AppShell.Footer>
    </AppShell>);
}
