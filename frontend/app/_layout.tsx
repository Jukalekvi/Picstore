import { Tabs } from 'expo-router';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

function TabRoot() {
    const { colors } = useTheme();
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textMain,
        }}>
            <Tabs.Screen name="camera" options={{ title: 'Camera' }} />
            <Tabs.Screen name="gallery" options={{ title: 'Gallery' }} />
            <Tabs.Screen name="index" options={{ title: 'Home' }} />
            <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
        </Tabs>
    );
}

export default function TabLayout() {
    return (
        <ThemeProvider>
            <TabRoot />
        </ThemeProvider>
    );
}