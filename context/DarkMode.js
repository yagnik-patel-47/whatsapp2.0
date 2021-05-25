import { useState, createContext } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export const DarkModeProvider = ({ children }) => {
  const preferDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState(preferDark);
  return (
    <DarkModeContext.Provider value={[darkMode, setDarkMode]}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const DarkModeContext = createContext(DarkModeProvider);
