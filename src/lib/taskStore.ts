import { localStore } from "./localStore";
import { getSupabaseMode, supabaseStore } from "./supabase";
import type { DataMode } from "../types";

// this makes everyone can operate full function even they do not have the Supabase account.
export function getTaskStore() {
  const mode: DataMode = getSupabaseMode(); // check whether have Supabase environmnt variable or not

  return {
    mode,
    store: mode === "supabase" ? supabaseStore : localStore, // if have, use Supabase, no use local
  };
}

