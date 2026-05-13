import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
      <Tabs
          screenOptions={{
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="camera"
            options={{title: 'Camera'}}
          />
        <Tabs.Screen
            name="gallery"
            options={{ title: 'Gallery' }}
        />
        <Tabs.Screen
            name="index"
            options={{ title: 'Home' }}
        />
        <Tabs.Screen
            name="settings"
            options={{ title: 'Settings' }}
        />
      </Tabs>
  );
}