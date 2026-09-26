import React, { createContext, useState, useContext } from 'react';

export const LIGHT_THEME = {
    background: '#F8F9FA',
    card: '#FFFFFF',
    sectionBg: '#FFFFFF',
    text: '#1C1C1E',
    textSecondary: '#8E8E93',
    border: '#F2F2F7',
    primary: '#007AFF',
    infoValue: '#007AFF',
    inputBg: '#F2F2F7',
};

export const DARK_THEME = {
    background: '#000000',
    card: '#1C1C1E',
    sectionBg: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#2C2C2E',
    primary: '#0A84FF',
    infoValue: '#0A84FF',
    inputBg: '#2C2C2E',
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(false);
    const theme = isDark ? DARK_THEME : LIGHT_THEME;

    return (
        <ThemeContext.Provider value={{ theme, isDark, setIsDark }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);