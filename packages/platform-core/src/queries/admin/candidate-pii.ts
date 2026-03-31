import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import { encryptPii, decryptPii } from "../../crypto/pii.js";
import type { CandidatePii, UpsertCandidatePiiInput } from "../../types/admin.js";

const PII_COLUMNS =
  "id, site_id, candidate_id, ssn_encrypted, dl_number_encrypted, dl_state, dob_encrypted, visa_type, visa_doc_path, visa_doc_name, created_at, updated_at";

function decryptRow(row: Record<string, unknown>): CandidatePii {
  return {
    id: row.id as string,
    candidate_id: row.candidate_id as string,
    ssn: row.ssn_encrypted ? decryptPii(row.ssn_encrypted as string) : null,
    dl_number: row.dl_number_encrypted
      ? decryptPii(row.dl_number_encrypted as string)
      : null,
    dl_state: (row.dl_state as string) || null,
    dob: row.dob_encrypted ? decryptPii(row.dob_encrypted as string) : null,
    visa_type: (row.visa_type as CandidatePii["visa_type"]) || null,
    visa_doc_path: (row.visa_doc_path as string) || null,
    visa_doc_name: (row.visa_doc_name as string) || null,
    created_at: row.created_at as string,
    updated_at: (row.updated_at as string) || null,
  };
}

export async function getCandidatePii(
  candidateId: string
): Promise<CandidatePii | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("candidate_pii")
    .select(PII_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("candidate_id", candidateId)
    .single();

  if (error || !data) return null;
  return decryptRow(data);
}

export async function upsertCandidatePii(
  candidateId: string,
  input: UpsertCandidatePiiInput
): Promise<{ success: boolean; error?: string; fieldsUpdated: string[] }> {
  const supabase = getServiceClient();
  const siteId = getSiteId();
  const fieldsUpdated: string[] = [];

  const record: Record<string, unknown> = {
    site_id: siteId,
    candidate_id: candidateId,
    updated_at: new Date().toISOString(),
  };

  if (input.ssn !== undefined) {
    record.ssn_encrypted = input.ssn ? encryptPii(input.ssn) : null;
    fieldsUpdated.push("ssn");
  }
  if (input.dl_number !== undefined) {
    record.dl_number_encrypted = input.dl_number
      ? encryptPii(input.dl_number)
      : null;
    fieldsUpdated.push("dl_number");
  }
  if (input.dl_state !== undefined) {
    record.dl_state = input.dl_state || null;
    fieldsUpdated.push("dl_state");
  }
  if (input.dob !== undefined) {
    record.dob_encrypted = input.dob ? encryptPii(input.dob) : null;
    fieldsUpdated.push("dob");
  }
  if (input.visa_type !== undefined) {
    record.visa_type = input.visa_type || null;
    fieldsUpdated.push("visa_type");
  }
  if (input.visa_doc_path !== undefined) {
    record.visa_doc_path = input.visa_doc_path || null;
    fieldsUpdated.push("visa_doc_path");
  }
  if (input.visa_doc_name !== undefined) {
    record.visa_doc_name = input.visa_doc_name || null;
    fieldsUpdated.push("visa_doc_name");
  }

  const { error } = await supabase
    .from("candidate_pii")
    .upsert(record, { onConflict: "site_id,candidate_id" });

  if (error) return { success: false, error: error.message, fieldsUpdated: [] };
  return { success: true, fieldsUpdated };
}
