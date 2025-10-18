import { Stack } from "expo-router"

const RootLayout = () => {
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: '#ddd' },
      headerTintColor: '#333',
    }}>
      <Stack.Screen name="index" options={{ title: "Watchlist" }} />
      <Stack.Screen name="alerts" options={{ title: "Alerts" }} />
    </Stack>
  )
}

export default RootLayout;