// ─── COBRO DENTRO DE LA APP (App Store y Google Play) ─────────────────────
//
// Apple y Google EXIGEN su propio sistema de cobro para todo lo que
// desbloquee funciones digitales dentro de la app. El Plan Pro abre las
// herramientas de IA y la prioridad en búsquedas, así que cae ahí de lleno:
// cobrarlo por Mercado Pago dentro de la app es motivo de rechazo.
//
// La web sigue cobrando por Mercado Pago, que no paga comisión de tienda.
// Esta capa decide cuál de los dos usar según dónde se esté ejecutando.
//
// Se apoya en RevenueCat, que envuelve StoreKit (iOS) y Play Billing
// (Android) y manda un webhook al backend cuando alguien compra, renueva o
// cancela. Sin él habría que mantener dos integraciones nativas distintas
// más la validación de recibos de cada tienda.
import { Capacitor } from "@capacitor/core";
import { REVENUECAT_APPLE_KEY, REVENUECAT_GOOGLE_KEY, ENTITLEMENT_PRO } from "./config.js";

// `true` solo dentro de la app compilada. En el navegador —incluido el
// navegador de un teléfono— sigue mandando Mercado Pago.
export function enApp() {
  return Capacitor.isNativePlatform();
}

export function tiendaDelDispositivo() {
  if (!enApp()) return null;
  return Capacitor.getPlatform() === "ios" ? "App Store" : "Google Play";
}

// El SDK pesa y solo hace falta dentro de la app: se carga cuando se
// necesita para no meterlo en el paquete de la web.
let purchases = null;
async function sdk() {
  if (purchases) return purchases;
  const { Purchases } = await import("@revenuecat/purchases-capacitor");
  const apiKey = Capacitor.getPlatform() === "ios" ? REVENUECAT_APPLE_KEY : REVENUECAT_GOOGLE_KEY;
  if (!apiKey) throw new Error("Falta configurar la clave de la tienda.");
  await Purchases.configure({ apiKey });
  purchases = Purchases;
  return purchases;
}

// El identificador del usuario de Habilis se le pasa a RevenueCat para que
// el webhook diga a QUIÉN activarle el plan. Sin esto la compra llega al
// backend sin dueño.
export async function identificar(uid) {
  if (!enApp() || !uid) return;
  const Purchases = await sdk();
  await Purchases.logIn({ appUserID: uid });
}

// Devuelve el precio tal y como lo muestra la tienda, ya en la moneda y con
// los impuestos del país del usuario. NUNCA se escribe el precio a mano:
// Apple y Google rechazan las apps cuyo precio anunciado no coincide.
export async function precioPro() {
  const Purchases = await sdk();
  const { current } = await Purchases.getOfferings();
  const paquete = current?.availablePackages?.[0];
  if (!paquete) throw new Error("El Plan Pro no está disponible en esta tienda ahora mismo.");
  return { paquete, precio: paquete.product.priceString };
}

export async function comprarPro() {
  const Purchases = await sdk();
  const { paquete } = await precioPro();
  const { customerInfo } = await Purchases.purchasePackage({ aPackage: paquete });
  return !!customerInfo?.entitlements?.active?.[ENTITLEMENT_PRO];
}

// Restaurar es OBLIGATORIO en App Store: quien ya pagó y reinstala, o entra
// desde otro dispositivo, tiene que poder recuperar su suscripción sin
// pagar otra vez.
export async function restaurarCompras() {
  const Purchases = await sdk();
  const { customerInfo } = await Purchases.restorePurchases();
  return !!customerInfo?.entitlements?.active?.[ENTITLEMENT_PRO];
}

export async function tieneProEnTienda() {
  if (!enApp()) return false;
  try {
    const Purchases = await sdk();
    const { customerInfo } = await Purchases.getCustomerInfo();
    return !!customerInfo?.entitlements?.active?.[ENTITLEMENT_PRO];
  } catch { return false; }
}

// Ni Apple ni Google permiten cancelar desde la app: es una pantalla del
// sistema. Intentar hacerlo por nuestra cuenta es motivo de rechazo.
export function urlCancelacion() {
  return Capacitor.getPlatform() === "ios"
    ? "https://apps.apple.com/account/subscriptions"
    : "https://play.google.com/store/account/subscriptions";
}
