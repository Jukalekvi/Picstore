import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIGHT_COLORS, DARK_COLORS } from '@/styles/theme';

type ThemeMode = 'light' | 'dark' | 'device';

interface ThemeContextType {
    themeMode: ThemeMode;
    colors: typeof LIGHT_COLORS;
    setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const deviceScheme = useColorScheme();
    const [themeMode, setThemeModeState] = useState<ThemeMode>('device');

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('userTheme');
                if (savedTheme) setThemeModeState(savedTheme as ThemeMode);
            } catch (error) {
                console.error('Failed to load theme:', error);
            }
        };
        void loadTheme();
    }, []);
    const setThemeMode = async (mode: ThemeMode) => {
        setThemeModeState(mode);
        await AsyncStorage.setItem('userTheme', mode);
    };

    const activeColors = themeMode === 'device'
        ? (deviceScheme === 'dark' ? DARK_COLORS : LIGHT_COLORS)
        : (themeMode === 'dark' ? DARK_COLORS : LIGHT_COLORS);

    return (
        <ThemeContext.Provider value={{ themeMode, colors: activeColors, setThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};