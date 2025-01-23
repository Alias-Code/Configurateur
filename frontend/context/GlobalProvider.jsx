import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { ChoicesProvider } from "./ChoicesContext";
import { NotificationsProvider } from "./NotificationsContext";
import { AnimationProvider } from "./AnimationContext";
import { ModalProvider } from "./ModalContext";
import { ModelProvider } from "./ModelContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

function GlobalProvider({ children }) {
  return (
    <GoogleOAuthProvider clientId="172052439601-dkqnbasm5ouddo44abnjs0c3qepoqcc6.apps.googleusercontent.com">
      <NotificationsProvider>
        <AnimationProvider>
          <AuthProvider>
            <ChoicesProvider>
              <CartProvider>
                <ModalProvider>
                  <ModelProvider>{children}</ModelProvider>
                </ModalProvider>
              </CartProvider>
            </ChoicesProvider>
          </AuthProvider>
        </AnimationProvider>
      </NotificationsProvider>
    </GoogleOAuthProvider>
  );
}

export default GlobalProvider;
