import { createContext, ReactNode, useContext, useState } from 'react';

type EventTheme = {
    primaryColor: string;
    setPrimaryColor: (color: string) => void;
};

const EventThemeContext = createContext<EventTheme | null>(null);

export function EventThemeProvider({ children }: { children: ReactNode}) {
   const [primaryColor, setPrimaryColor] = useState('#5435EB');

   return (
    <EventThemeContext.Provider value={{ primaryColor, setPrimaryColor }}>
        {children}
    </EventThemeContext.Provider>
   );
}