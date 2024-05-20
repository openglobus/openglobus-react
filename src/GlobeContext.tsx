import {Globe} from "@openglobus/og";
import React, {createContext, useContext, useState} from "react";

interface GlobusContextProps {
    globus: Globe | null;
    setGlobus: React.Dispatch<React.SetStateAction<Globe | null>>;
}

const GlobusContext = createContext<GlobusContextProps>({
    globus: null,
    setGlobus: () => {
    },
});

export const GlobusContextProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [globus, setGlobus] = useState<Globe | null>(null);

    return <GlobusContext.Provider value={{globus: globus, setGlobus: setGlobus}}>{children}</GlobusContext.Provider>;
};

export const useGlobusContext = (): GlobusContextProps => useContext(GlobusContext);