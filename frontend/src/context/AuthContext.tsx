import React, { createContext, useContext, useState } from 'react';

// ── Demo user (auto-logged-in, no backend needed) ─────────────
const DEMO_USER = {
    _id: 'demo_admin',
    name: 'School Admin',
    email: 'demo@oxford.school',
    role: 'owner' as const,
};

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'owner' | 'admin' | 'staff' | 'student';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<User>;
    logout: () => void;
    isAdmin: boolean;
    isOwner: boolean;
    isStudent: boolean;
    isStaff: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Always start logged in as demo admin – no network call needed
    const [user] = useState<User | null>(DEMO_USER);
    const [loading] = useState(false);

    // These are no-ops in demo mode
    const login = async (_email: string, _password: string): Promise<User> => DEMO_USER;
    const logout = () => { /* no-op in demo */ };

    const value: AuthContextType = {
        user,
        loading,
        login,
        logout,
        isAdmin: true,
        isOwner: true,
        isStudent: false,
        isStaff: false,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
