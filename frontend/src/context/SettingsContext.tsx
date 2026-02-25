import React, { createContext, useContext, useEffect, useState } from 'react';
import API from '../utils/api';
import { Settings } from '../types';

interface SettingsContextType {
    settings: Settings;
    refreshSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType>({ settings: {}, refreshSettings: () => {} });

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>({});

    const fetchSettings = () => {
        API.get('/settings').then(res => setSettings(res.data.settings || {})).catch(err => {
            console.error('Failed to load settings:', err);
        });
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, refreshSettings: fetchSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
