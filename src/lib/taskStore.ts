import { localStore } from "./localStore";
import { getSupabaseMode, supabaseStore } from "./supabase";
import type { DataMode } from "../types";

export function getTaskStore() {
  const mode: DataMode = getSupabaseMode();

  return {
    mode,
    store: mode === "supabase" ? supabaseStore : localStore,
  };
}

