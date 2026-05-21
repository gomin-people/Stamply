'use client';

import { useEffect } from 'react';
import { useEventTheme } from '@/contexts/EventThemeProvider';

type EventThemeInitializerProps = {
    primaryColor: string | null;
}

const EventThemeInitializer = ({ primaryColor }: EventThemeInitializerProps) => {
    const { setPrimaryColor } = useEventTheme();

    useEffect(() => {
        if (primaryColor) {
            setPrimaryColor(primaryColor);
        }
    }, [primaryColor, setPrimaryColor]);

    return null;
}

export default EventThemeInitializer
