import { useEffect } from "react";
import type { RefObject } from "react";

/* The PDF iframe is left out on purpose: once focus is inside it, the
   iframe's own document receives the keys and the trap can't see them. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * While `active`, Tab and Shift+Tab cycle within `ref` (a modal dialog).
 * When it deactivates, focus returns to whatever was focused before —
 * unless an action already moved focus elsewhere (e.g. "Go to Skills").
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const previous = document.activeElement as HTMLElement | null;

    const onKeyDown = (e: KeyboardEvent) => {
      const container = ref.current;
      if (e.key !== "Tab" || !container) return;
      const items = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.getClientRects().length > 0,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      const outside = !container.contains(current);

      if (e.shiftKey && (current === first || outside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (current === last || outside)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      const current = document.activeElement;
      const focusStayedInDialog =
        !current || current === document.body || ref.current?.contains(current);
      if (focusStayedInDialog) previous?.focus?.({ preventScroll: true });
    };
  }, [ref, active]);
}
