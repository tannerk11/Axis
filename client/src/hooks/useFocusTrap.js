import { useEffect, useRef } from 'react';

/**
 * Traps keyboard focus within a container element.
 * On mount, moves focus to the first focusable element.
 * On unmount, restores focus to the previously focused element.
 *
 * @returns {import('react').RefObject<HTMLElement>} ref to attach to the container element
 */
export default function useFocusTrap() {
  const containerRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Save the element that had focus before the trap activated
    previousFocusRef.current = document.activeElement;

    const FOCUSABLE_SELECTOR =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const getFocusableElements = () =>
      Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));

    // Focus the first focusable element (usually the close button)
    const focusables = getFocusableElements();
    if (focusables.length > 0) {
      focusables[0].focus();
    }

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      const elements = getFocusableElements();
      if (elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      // Restore focus to the element that was focused before the trap
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, []);

  return containerRef;
}
