import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { ChoicesProvider } from "./ChoicesContext";
import { NotificationsProvider } from "./NotificationsContext";
import { AnimationProvider } from "./AnimationContext";
import { ModalProvider } from "./ModalContext";
import { ModelProvider } from "./ModelContext";

function GlobalProvider({ children }) {

  return (
    <NotificationsProvider>
      <AnimationProvider>
        <AuthProvider>
          <ChoicesProvider>
            <CartProvider>
              <ModalProvider>
                <ModelProvider>
                  {children}
                </ModelProvider>
              </ModalProvider>
            </CartProvider>
          </ChoicesProvider>
        </AuthProvider>
      </AnimationProvider>
    </NotificationsProvider>
  );
}

export default GlobalProvider;
