import { useState, createContext } from "react";

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);
  return (
    <DarkModeContext.Provider value={[darkMode, setDarkMode]}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const DarkModeContext = createContext(DarkModeProvider);
