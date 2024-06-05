import {Globe} from "@openglobus/og";
import * as React from "react";
import {createContext, useContext, useState} from "react";

export interface GlobusContextProps {
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