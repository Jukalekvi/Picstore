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
            <Drawer.Screen
                name="gallery"
                options={{
                    drawerLabel: 'Gallery',
                    title: 'gallery',
                }}
            />
            <Drawer.Screen
                name="achievements"
                options={{
                    drawerLabel: 'Achievements',
                    title: 'Achievements',
                }}
            />
        </Drawer>
      </GestureHandlerRootView>
  );
}