import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer>
          <Drawer.Screen
              name="index"
              options={{
                drawerLabel: 'Connection test',
                title: 'Picstore',
              }}
          />
          <Drawer.Screen
              name="camera"
              options={{
                drawerLabel: 'Camera',
                title: 'Camera',
              }}
          />
        </Drawer>
      </GestureHandlerRootView>
  );
}