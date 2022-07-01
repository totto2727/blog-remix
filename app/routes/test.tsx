import { Text, Button, List, Title, Group, AppShell } from "@mantine/core";

export default function Test() {
  const switchMode = () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = (() => {
      switch (current) {
        case "light":
          return "dark";
        case "dark":
          return "light";
        default:
          return "dark";
      }
    })();
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <>
      <AppShell
        header={
          <header>
            <Group>
              <Button variant="default" onClick={switchMode}>
                Mode
              </Button>
              <Button variant="outline" loading>
                abc
              </Button>
              <Button>abc</Button>
              <Button>abc</Button>
            </Group>
          </header>
        }
        footer={
          <footer>
            <Text>あいうえお</Text>
          </footer>
        }
      >
        <main>
          <Title order={1}>H1</Title>
          <Title order={2}>H2</Title>
          <Title order={3}>H3</Title>
          <Title order={4}>H4</Title>
          <List type="ordered">
            <List.Item>1</List.Item>
            <List.Item>2</List.Item>
            <List.Item>3</List.Item>
            <List.Item>4</List.Item>
          </List>
          <List type="unordered">
            <List.Item>1</List.Item>
            <List.Item>2</List.Item>
            <List.Item>3</List.Item>
            <List.Item>4</List.Item>
          </List>
        </main>
      </AppShell>
    </>
  );
}
