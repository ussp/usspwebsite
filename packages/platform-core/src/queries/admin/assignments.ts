import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  AdminAssignment,
  AssignmentFilters,
  CreateAssignmentInput,
  UpdateAssignmentInput,
} from "../../types/admin.js";

const ASSIGNMENT_COLUMNS =
  "id, site_id, candidate_id, position_id, client_id, end_client_id, role_title, start_date, end_date, bill_rate, pay_rate, status, notes, created_at, updated_at, candidates(full_name), clients(name), end_clients(name)";

export async function getAssignments(
  filters: AssignmentFilters = {}
): Promise<AdminAssignment[]> {
  const supabase = getServiceClient();
  let query = supabase
    .from("employee_assignments")
    .select(ASSIGNMENT_COLUMNS)
    .eq("site_id", getSiteId())
    .order("start_date", { ascending: false });

  if (filters.candidate_id) {
    query = query.eq("candidate_id", filters.candidate_id);
  }
  if (filters.status) {
    query = query.eq("status", filters.status);
  }
  if (filters.end_client_id) {
    query = query.eq("end_client_id", filters.end_client_id);
  }
  if (filters.expiring_within_days) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + filters.expiring_within_days);
    query = query
      .eq("status", "active")
      .not("end_date", "is", null)
      .lte("end_date", futureDate.toISOString());
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((row: Record<string, unknown>) => {
    const candidate = row.candidates as Record<string, unknown> | null;
    const client = row.clients as Record<string, unknown> | null;
    const endClient = row.end_clients as Record<string, unknown> | null;
    return {
      ...row,
      candidate_name: candidate?.full_name as string | undefined,
      client_name: client?.name as string | undefined,
      end_client_name: endClient?.name as string | undefined,
      candidates: undefined,
      clients: undefined,
      end_clients: undefined,
    } as unknown as AdminAssignment;
  });
}

export async function getAssignmentById(
  id: string
): Promise<AdminAssignment | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("employee_assignments")
    .select(ASSIGNMENT_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("id", id)
    .single();

  if (error || !data) return null;

  const row = data as Record<string, unknown>;
  const candidate = row.candidates as Record<string, unknown> | null;
  const client = row.clients as Record<string, unknown> | null;
  const endClient = row.end_clients as Record<string, unknown> | null;
  return {
    ...row,
    candidate_name: candidate?.full_name,
    client_name: client?.name,
    end_client_name: endClient?.name,
    candidates: undefined,
    clients: undefined,
    end_clients: undefined,
  } as unknown as AdminAssignment;
}

export async function createAssignment(
  input: CreateAssignmentInput
): Promise<{ success: boolean; assignment?: AdminAssignment; error?: string }> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("employee_assignments")
    .insert({
      site_id: getSiteId(),
      candidate_id: input.candidate_id,
      position_id: input.position_id || null,
      client_id: input.client_id || null,
      end_client_id: input.end_client_id || null,
      role_title: input.role_title,
      start_date: input.start_date,
      end_date: input.end_date || null,
      bill_rate: input.bill_rate || null,
      pay_rate: input.pay_rate || null,
      status: input.status || "active",
      notes: input.notes || null,
    })
    .select("id, site_id, candidate_id, position_id, client_id, end_client_id, role_title, start_date, end_date, bill_rate, pay_rate, status, notes, created_at, updated_at")
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, assignment: data as unknown as AdminAssignment };
}

export async function updateAssignment(
  id: string,
  input: UpdateAssignmentInput
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (input.position_id !== undefined) updates.position_id = input.position_id;
  if (input.client_id !== undefined) updates.client_id = input.client_id;
  if (input.end_client_id !== undefined) updates.end_client_id = input.end_client_id;
  if (input.role_title !== undefined) updates.role_title = input.role_title;
  if (input.start_date !== undefined) updates.start_date = input.start_date;
  if (input.end_date !== undefined) updates.end_date = input.end_date;
  if (input.bill_rate !== undefined) updates.bill_rate = input.bill_rate;
  if (input.pay_rate !== undefined) updates.pay_rate = input.pay_rate;
  if (input.status !== undefined) updates.status = input.status;
  if (input.notes !== undefined) updates.notes = input.notes;

  const { error } = await supabase
    .from("employee_assignments")
    .update(updates)
    .eq("site_id", getSiteId())
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getExpiringAssignments(
  withinDays: number = 30
): Promise<AdminAssignment[]> {
  return getAssignments({ expiring_within_days: withinDays });
}
