// Live Edit System - Main exports

// Providers
export { LiveEditProvider } from "./providers/LiveEditProvider";

// Core Components
export { LiveEditToggle } from "./core/LiveEditToggle";
export { EditableWrapper } from "./core/EditableWrapper";

// Editors
export { InlineTextEditor } from "./editors/InlineTextEditor";

// Store and Hooks
export {
  useLiveEditStore,
  useIsEditMode,
  useIsPreviewMode,
  useSelectedComponent,
  useHasUnsavedChanges,
  useCanUndo,
  useCanRedo,
} from "@/stores/liveEditStore";

// Types
export type {
  LiveEditStore,
  ComponentState,
  ComponentChange,
  HistoryEntry,
  Position,
  SidebarTab,
  DevicePreview,
  DialogType,
  User,
  ComponentConfig,
  ComponentRegistry,
  EditableField,
  ComponentCategory,
} from "@/types/liveEdit";
