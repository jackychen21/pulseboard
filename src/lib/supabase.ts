import { createClient, type RealtimeChannel, type SupabaseClient } from "@supabase/supabase-js";
import type { Status, Task, TaskDraft } from "../types";

type TaskRow = {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  priority: "low" | "normal" | "high";
  due_date: string | null;
  created_at: string;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let client: SupabaseClient | null = null;

function mapTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    status: row.status,
    priority: row.priority,
    dueDate: row.due_date,
    createdAt: row.created_at,
  };
}

async function ensureGuestSession(supabase: SupabaseClient) {
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    return;
  }

  const { error } = await supabase.auth.signInAnonymously();
  if (error) {
    throw error;
  }
}

export function getSupabaseMode(): "demo" | "supabase" {
  return supabaseUrl && supabaseAnonKey ? "supabase" : "demo";
}

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return client;
}

export const supabaseStore = {
  async listTasks(): Promise<Task[]> {
    const supabase = getSupabaseClient();
    await ensureGuestSession(supabase);

    const { data, error } = await supabase
      .from("tasks")
      .select("id, title, description, status, priority, due_date, created_at")
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? []).map((row) => mapTask(row as TaskRow));
  },

  async createTask(draft: TaskDraft): Promise<Task> {
    const supabase = getSupabaseClient();
    await ensureGuestSession(supabase);

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        title: draft.title,
        description: draft.description,
        priority: draft.priority,
        due_date: draft.dueDate,
        status: "todo",
      })
      .select("id, title, description, status, priority, due_date, created_at")
      .single();

    if (error) {
      throw error;
    }

    return mapTask(data as TaskRow);
  },

  async updateStatus(id: string, status: Status): Promise<void> {
    const supabase = getSupabaseClient();
    await ensureGuestSession(supabase);

    const { error } = await supabase.from("tasks").update({ status }).eq("id", id);
    if (error) {
      throw error;
    }
  },

  subscribe(onChange: () => void): () => void {
    const supabase = getSupabaseClient();
    let channel: RealtimeChannel | null = null;

    ensureGuestSession(supabase)
      .then(() => {
        channel = supabase
          .channel("tasks-live")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "tasks" },
            () => onChange(),
          )
          .subscribe();
      })
      .catch(() => {
        return undefined;
      });

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  },
};

