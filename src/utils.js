import { supabase } from "./supabaseClient";

// Upload a file to a Supabase storage bucket and resolve its public URL.
// Returns { publicUrl, error } — callers keep their own UI/error handling.
export async function uploadToBucket(bucket, path, file, options = {}) {
  const { error } = await supabase.storage.from(bucket).upload(path, file, options);
  if (error) return { publicUrl: null, error };
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { publicUrl: data?.publicUrl ?? null, error: null };
}

// Trigger a browser download for the given content (a Blob or raw string).
export function downloadBlob(content, filename, mimeType) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
