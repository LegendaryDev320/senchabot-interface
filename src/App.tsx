import "./App.css";
import { appStyle, buttonStyle } from "./styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { Theme } from "./utils/theme.class";

import { useEffect, useMemo, useState } from "react";

import { RunContext } from "./contexts/RunContext";
import { IInfoBox, InfoBoxContext } from "./contexts/InfoBoxContext";
import { ResponseProvider } from "./contexts/ResponseContext";
import { useResponseContext } from "./contexts/ResponseContext";

import { InfoBox } from "./components/ui/InfoBox";

import { InputManager } from "./components/InputManager";

import BootLine from "./components/ui/BootLine";
import LineText from "./components/ui/LineText";
import OutputCorner from "./components/ui/OutputCorner";
import { IMainColor } from "./types";
import { ConfigMenu } from "./components/ConfigMenu";
import { ModeContext } from "./contexts/ModeContext";

let muiTheme = createTheme({
  palette: {
    primary: {
      main: "#FFF",
    },
    background: {
      default: "#000",
    },
  },
});

const updateColors = (data: IMainColor) => {
  muiTheme = createTheme({
    palette: {
      primary: {
        main: data.foreground ?? "#FFF",
      },
      background: {
        default: data.background ?? "#000",
      },
    },
  });
};

function App() {
  const theme = new Theme(useResponseContext);
  const themeColors = theme.getColors();

  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  const [infoBox, setInfoBox] = useState<IInfoBox>({
    infoBoxType: 0,
    infoBoxText: "",
  });

  const [isInputOpen, setIsInputOpen] = useState(true);
  const [doubleClick, setDoubleClick] = useState(false);

  const runContext = useMemo(() => ({ isRunning, setIsRunning }), [isRunning]);
  const modeContext = useMemo(() => ({ mode, setMode }), [mode]);
  const infoBoxContext = useMemo(() => ({ infoBox, setInfoBox }), [infoBox]);

  useEffect(() => {
    updateColors(themeColors);

    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, [themeColors]);

  const handleKeyDown = (e: any) => {
    console.log("handleKeyDown e.code", e.code);
    if (e.code === "Escape") setIsInputOpen(true);
    if (e.altKey && e.code === "KeyI") setIsInputOpen((prev) => !prev);
  };

  const handleDoubleClick = (e: any) => {
    setDoubleClick(true);
    setMode(1);
  };

  return (
    <>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {isLoading ? (
          <div style={appStyle.body}>
            <BootLine />
          </div>
        ) : (
          <ModeContext.Provider value={modeContext}>
            <RunContext.Provider value={runContext}>
              <ResponseProvider>
                <InfoBoxContext.Provider value={infoBoxContext}>
                  <OutputCorner />
                  {doubleClick && mode === 1 ? (
                    <ConfigMenu />
                  ) : (
                    <>
                      <div
                        style={appStyle.body}
                        onKeyDown={handleKeyDown}
                        onDoubleClick={handleDoubleClick}
                        tabIndex={-1}
                      >
                        <InfoBox />
                        <LineText />
                      </div>
                      <InputManager isInputOpen={isInputOpen} />
                    </>
                  )}
                </InfoBoxContext.Provider>
              </ResponseProvider>
            </RunContext.Provider>
          </ModeContext.Provider>
        )}
      </ThemeProvider>
    </>
  );
}

export default App;
