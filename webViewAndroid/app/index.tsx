import React, { useEffect } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import { setBackgroundColorAsync } from "expo-system-ui";

export default function HomeScreen() {
  const IP = Constants.expoConfig?.extra?.IP ?? "127.0.0.1";
  const WEBPORT = Constants.expoConfig?.extra?.WEBPORT ?? "3000";

  useEffect(() => {
    setBackgroundColorAsync("#121212");
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", backgroundColor: "#121212" }}
    >
      <StatusBar backgroundColor="#121212" barStyle="light-content" />
      <WebView
        source={{ uri: `http://${IP}:${WEBPORT}` }}
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
}
