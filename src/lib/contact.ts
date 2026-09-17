import { isTouchDevice } from "./device";

export const EMAIL = "shaik.luqman28@gmail.com";

const GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`;

/**
 * Link props for "email me" actions. Desktop gets Gmail web compose, because
 * mailto: silently does nothing without a configured desktop mail client.
 * Phones get mailto:, which reliably opens the mail app — Gmail's web
 * compose URL doesn't open a compose screen on mobile. The build-time
 * prerender gets the desktop link; the browser re-renders it per device.
 */
export function emailLinkProps() {
  return isTouchDevice()
    ? { href: `mailto:${EMAIL}` }
    : { href: GMAIL_COMPOSE, target: "_blank", rel: "noopener" };
}

/** Imperative version of emailLinkProps, for command-style actions. */
export function openEmail() {
  const { href, target } = emailLinkProps();
  if (target) window.open(href, target, "noopener");
  else window.location.href = href;
}
