import {Globe} from "@openglobus/og";
import * as React from "react";
import {createContext, useContext, useState} from "react";

export interface GlobeContextProps {
    globe: Globe | null;
    setGlobe: React.Dispatch<React.SetStateAction<Globe | null>>;
}

const GlobeContext = createContext<GlobeContextProps>({
    globe: null,
    setGlobe: () => {
    },
});

export const GlobeContextProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [globe, setGlobe] = useState<Globe | null>(null);

    return <GlobeContext.Provider value={{globe, setGlobe}}>{children}</GlobeContext.Provider>;
};

export const useGlobeContext = (): GlobeContextProps => useContext(GlobeContext);