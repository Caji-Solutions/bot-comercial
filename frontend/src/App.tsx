import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { SocketProvider } from "@/contexts/SocketContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LiaVolumeProvider } from "@/contexts/LiaVolumeContext";
import { IntegrationsProvider } from "@/contexts/IntegrationsContext";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Payment = lazy(() => import("./pages/Payment"));
const CheckEmail = lazy(() => import("./pages/CheckEmail"));
const SetupPassword = lazy(() => import("./pages/SetupPassword"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const InstagramCallback = lazy(() => import("./pages/InstagramCallback"));
const GoogleCalendarCallback = lazy(() => import("./pages/GoogleCalendarCallback"));
const MeuPrompt = lazy(() => import("./pages/MeuPrompt"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Lgpd = lazy(() => import("./pages/Lgpd"));
const Trafego = lazy(() => import("./pages/Trafego"));
const Saude = lazy(() => import("./pages/Saude"));
const Beleza = lazy(() => import("./pages/Beleza"));
const Varejo = lazy(() => import("./pages/Varejo"));
import EmailRestrictedRoute from "./components/EmailRestrictedRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
const YourExperiencePage = lazy(() => import("./pages/YourExperiencePage"));
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import { CookieConsentBanner } from "@/components/ui/CookieConsentBanner";

const queryClient = new QueryClient();

/**
 * Layout que fornece Socket e Integrations apenas para rotas autenticadas.
 * Evita conexoes WebSocket e chamadas de API desnecessarias nas paginas publicas.
 */
const AuthenticatedLayout = () => (
  <SocketProvider>
    <IntegrationsProvider>
      <Outlet />
    </IntegrationsProvider>
  </SocketProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <CookieConsentProvider>
          <CookieConsentBanner />
          <LiaVolumeProvider>
            <BrowserRouter>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50">Carregando...</div>}>
                <Routes>
                  {/* Rotas publicas - sem Socket/Integrations */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
                  <Route path="/termos-de-servico" element={<TermsOfService />} />
                  <Route path="/lgpd" element={<Lgpd />} />
                  <Route path="/login" element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/check-email" element={<CheckEmail />} />
                  <Route path="/setup-password" element={<SetupPassword />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/checkout/success" element={<CheckoutSuccess />} />
                  <Route path="/sua-experiencia" element={<YourExperiencePage />} />
                  <Route path="/trafego" element={
                    <EmailRestrictedRoute allowedEmail="portob162@gmail.com">
                      <Trafego />
                    </EmailRestrictedRoute>
                  } />
                  <Route path="/saude" element={
                    <EmailRestrictedRoute allowedEmail="portob162@gmail.com">
                      <Saude />
                    </EmailRestrictedRoute>
                  } />
                  <Route path="/beleza" element={
                    <EmailRestrictedRoute allowedEmail="portob162@gmail.com">
                      <Beleza />
                    </EmailRestrictedRoute>
                  } />
                  <Route path="/varejo" element={
                    <EmailRestrictedRoute allowedEmail="portob162@gmail.com">
                      <Varejo />
                    </EmailRestrictedRoute>
                  } />

                  {/* Rotas autenticadas - com Socket e Integrations */}
                  <Route element={<AuthenticatedLayout />}>
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    } />
                    <Route path="/meu-prompt" element={
                      <ProtectedRoute>
                        <MeuPrompt />
                      </ProtectedRoute>
                    } />
                    <Route path="/instagram-callback" element={<InstagramCallback />} />
                    <Route path="/calendar-callback" element={<GoogleCalendarCallback />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </LiaVolumeProvider>
        </CookieConsentProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
