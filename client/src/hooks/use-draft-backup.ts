import { useEffect, useCallback, useRef } from "react";
import { useDebounce } from "./use-debounce";

interface DraftBackup {
  contentId: string | null;
  contentType: string;
  title: string;
  data: Record<string, unknown>;
  timestamp: number;
}

const BACKUP_KEY = "content-draft-backup";
const BACKUP_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Hook to backup draft content to localStorage for crash recovery
 * Automatically saves drafts every 10 seconds when content changes
 */
export function useDraftBackup(
  contentId: string | null,
  contentType: string,
  title: string,
  data: Record<string, unknown>,
  isDirty: boolean
) {
  const debouncedData = useDebounce(data, 10000); // 10 second debounce
  const lastSavedRef = useRef<string>("");

  // Save backup to localStorage
  const saveBackup = useCallback(() => {
    if (!isDirty || !title) return;

    const backup: DraftBackup = {
      contentId,
      contentType,
      title,
      data,
      timestamp: Date.now(),
    };

    const serialized = JSON.stringify(backup);
    if (serialized === lastSavedRef.current) return; // Skip if unchanged

    try {
      localStorage.setItem(BACKUP_KEY, serialized);
      lastSavedRef.current = serialized;
    } catch (e) {
      // localStorage might be full or unavailable
      console.warn("Failed to save draft backup:", e);
    }
  }, [contentId, contentType, title, data, isDirty]);

  // Auto-save on data changes (debounced)
  useEffect(() => {
    if (isDirty) {
      saveBackup();
    }
  }, [debouncedData, isDirty, saveBackup]);

  // Clear backup when content is saved successfully
  const clearBackup = useCallback(() => {
    localStorage.removeItem(BACKUP_KEY);
    lastSavedRef.current = "";
  }, []);

  // Save backup before page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        saveBackup();
        e.preventDefault();
        e.returnValue = ""; // Show browser's default unsaved changes warning
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, saveBackup]);

  return { clearBackup };
}

/**
 * Check if there's a recoverable draft backup
 */
export function getRecoverableDraft(
  currentContentId: string | null,
  contentType: string
): DraftBackup | null {
  try {
    const stored = localStorage.getItem(BACKUP_KEY);
    if (!stored) return null;

    const backup: DraftBackup = JSON.parse(stored);

    // Check if backup is for this content type
    if (backup.contentType !== contentType) return null;

    // For existing content, only recover if it matches the contentId
    if (currentContentId && backup.contentId !== currentContentId) return null;

    // For new content, only recover if backup was also for new content
    if (!currentContentId && backup.contentId) return null;

    // Check if backup is expired
    if (Date.now() - backup.timestamp > BACKUP_EXPIRY_MS) {
      localStorage.removeItem(BACKUP_KEY);
      return null;
    }

    return backup;
  } catch {
    return null;
  }
}

/**
 * Clear any stored draft backup
 */
export function clearDraftBackup(): void {
  localStorage.removeItem(BACKUP_KEY);
}
