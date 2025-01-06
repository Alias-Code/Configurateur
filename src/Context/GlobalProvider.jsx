import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { ChoicesProvider } from "./ChoicesContext";
import { NotificationsProvider } from "./NotificationsContext";
import { AnimationProvider } from "./AnimationContext";

function GlobalProvider({ children }) {
  return (
    <NotificationsProvider>
      <AnimationProvider>
        <AuthProvider>
          <ChoicesProvider>
            <CartProvider>{children}</CartProvider>
          </ChoicesProvider>
        </AuthProvider>
      </AnimationProvider>
    </NotificationsProvider>
  );
}

export default GlobalProvider;
