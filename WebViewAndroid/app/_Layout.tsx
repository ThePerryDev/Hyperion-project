import { Slot } from "expo-router";
import AuthProvider from "./_lib/context/AuthProvider";

export default function Layout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
