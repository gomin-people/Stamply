'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { generatePalette } from '@/utils';

type EventTheme = {
    primaryColor: string;
    setPrimaryColor: (color: string) => void;
};

const EventThemeContext = createContext<EventTheme | null>(null);

export function EventThemeProvider({ children }: { children: ReactNode}) {
   const [primaryColor, setPrimaryColor] = useState('#5435EB');

   const palette = (() => {
     try {
       return generatePalette(primaryColor);
     } catch {
       return generatePalette('#5435EB');
     }
   })();

   return (
    <EventThemeContext.Provider value={{ primaryColor, setPrimaryColor }}>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --primary-100: ${palette['100']};
            --primary-200: ${palette['200']};
            --primary-300: ${palette['300']};
            --primary-400: ${palette['400']};
            --primary-500: ${palette['500']};
            --primary-600: ${palette['600']};
            --primary-700: ${palette['700']};
            --primary-color: ${palette['700']};
          }
        ` }} />
        {children}
    </EventThemeContext.Provider>
   );
}

export function useEventTheme() {
  const context = useContext(EventThemeContext);
  if (!context) throw new Error('useEventTheme must be used within EventThemeProvider');
  return context;
}