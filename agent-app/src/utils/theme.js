export const COLORS = {
    primary: '#10b981',       // Emerald 500
    primaryHover: '#059669',  // Emerald 600
    secondary: '#8b5cf6',     // Violet 500
    bgDark: '#0f172a',        // Slate 900
    bgCard: '#1e293b',        // Slate 800
    textLight: '#f8fafc',
    textMuted: '#94a3b8',
    textDark: '#0f172a',
    danger: '#ef4444',
    warning: '#eab308',
    success: '#22c55e',
    border: 'rgba(255, 255, 255, 0.1)',
};

export const SIZES = {
    base: 8,
    small: 12,
    font: 14,
    medium: 16,
    large: 18,
    xl: 24,
    xxl: 32,
    radius: 12,
    padding: 20,
};

export const FONTS = {
    // Assuming standard system fonts for non-expo-fonts setup,
    // Add custom font logic if expo-fonts is added.
    regular: { fontSize: SIZES.font, fontWeight: '400' },
    medium: { fontSize: SIZES.medium, fontWeight: '500' },
    bold: { fontSize: SIZES.large, fontWeight: '700' },
    h1: { fontSize: SIZES.xxl, fontWeight: '800' },
    h2: { fontSize: SIZES.xl, fontWeight: '700' },
};
