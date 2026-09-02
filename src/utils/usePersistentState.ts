import { useState, useCallback, Dispatch, SetStateAction } from 'react';

/**
 * Data Retention & Persistence Strategy:
 * 
 * To ensure seamless user experience when navigating between portal sections (e.g. Dashboard,
 * Knowledge Center, AI Assistant, Reports, Approval Queue, Audit Trail), MineMind employs a
 * dual-layer state retention architecture:
 * 
 * 1. IN-MEMORY KEEP-MOUNTED PORTAL LAYOUT:
 *    Portal section views in App.tsx are preserved in memory using a visibility-toggled layout
 *    container. This ensures complex state (multi-step report wizards, AI intent logs, active
 *    chats, in-flight document processing, OCR diff states, and DOM scroll positions) remains
 *    instantly accessible and intact when switching tabs.
 * 
 * 2. LIGHTWEIGHT SESSION STATE (useSessionState hook):
 *    Lightweight UI parameters (e.g. form inputs, search filters, category selectors, active tabs)
 *    are backed by browser sessionStorage via this hook.
 * 
 * SECURITY & DATA INTEGRITY CONSTRAINTS:
 * - Sensitive credentials, large binary blobs (PDF files), and deep datasets are kept in-memory
 *   or in secure encrypted storage and are NEVER dumped into unencrypted persistent storage.
 * - sessionStorage automatically clears when the user closes their browser session or logs out,
 *   preventing cross-user state contamination on shared terminals.
 */
export function useSessionState<T>(
  key: string,
  initialValue: T | (() => T)
): [T, Dispatch<SetStateAction<T>>, () => void] {
  const [state, setState] = useState<T>(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedItem = sessionStorage.getItem(`minemind_${key}`);
        if (storedItem !== null && storedItem !== 'undefined') {
          return JSON.parse(storedItem) as T;
        }
      }
    } catch (e) {
      console.warn(`[useSessionState] Failed reading key "${key}":`, e);
    }
    return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
  });

  const setPersistentState: Dispatch<SetStateAction<T>> = useCallback((value) => {
    setState((prevState) => {
      const nextState = typeof value === 'function' ? (value as (prev: T) => T)(prevState) : value;
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(`minemind_${key}`, JSON.stringify(nextState));
        }
      } catch (e) {
        console.warn(`[useSessionState] Failed writing key "${key}":`, e);
      }
      return nextState;
    });
  }, [key]);

  const clearPersistentState = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(`minemind_${key}`);
      }
    } catch (e) {}
    const defaultVal = typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
    setState(defaultVal);
  }, [key, initialValue]);

  return [state, setPersistentState, clearPersistentState];
}
