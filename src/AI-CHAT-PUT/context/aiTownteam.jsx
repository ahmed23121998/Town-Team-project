import { createContext } from "react";
import runChat from "../twonTeamAi.js";

export const AIContext = createContext();

export default function AIContextProvider(props) {
  const onsentMessage = async (message) => {
    const response = await runChat(message);
    return response;
  };

  const contextData = {
    onsentMessage,
  };

  return (
    <AIContext.Provider value={contextData}>
      {props.children}
    </AIContext.Provider>
  );
} 