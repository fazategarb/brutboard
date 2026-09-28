import { useEffect, useCallback, useRef } from 'react';

interface UseKeyboardProps {
  onKeyDown: (key: string) => void;
  onKeyUp: (key: string) => void;
  disabled?: boolean;
}

export function useKeyboard({ onKeyDown, onKeyUp, disabled = false }: UseKeyboardProps) {
  const heldKeys = useRef<Set<string>>(new Set());

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (disabled) return;
    if (e.repeat) return; // Prevent key repeat spam
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    const key = e.key.toLowerCase();
    if (heldKeys.current.has(key)) return;
    heldKeys.current.add(key);
    onKeyDown(key);
  }, [onKeyDown, disabled]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (disabled) return;
    const key = e.key.toLowerCase();
    heldKeys.current.delete(key);
    onKeyUp(key);
  }, [onKeyUp, disabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
}
