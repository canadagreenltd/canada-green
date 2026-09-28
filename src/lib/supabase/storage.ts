import { createClient } from "@/lib/supabase/client";

/** Storage bucket names — create these in the Supabase dashboard (see supabase/storage-setup.md). */
export const STORAGE_BUCKETS = {
  receipts: "receipts",
  projectImages: "project-images",
  avatars: "avatars",
} as const;

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB

const RECEIPT_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function assertFile(file: File, allowedMime: Set<string>, label: string) {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(`${label} must be 5MB or smaller.`);
  }
  if (!allowedMime.has(file.type)) {
    throw new Error(
      `${label} type not allowed. Use: ${[...allowedMime].join(", ")}`
    );
  }
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^\w.\-]+/g, "_").slice(0, 120);
}

/**
 * Upload a payment receipt to the private `receipts` bucket.
 * Path: `{userId}/{timestamp}-{filename}`
 * Requires an authenticated session whose uid matches `userId` (enforced by RLS).
 */
export async function uploadReceipt(file: File, userId: string) {
  assertFile(file, RECEIPT_MIME_TYPES, "Receipt");

  const supabase = createClient();
  const path = `${userId}/${Date.now()}-${sanitizeFileName(file.name)}`;

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.receipts)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Upload a project photo to the public `project-images` bucket.
 * Path: `{projectId}/{timestamp}-{filename}`
 * Requires admin RLS (will work once roles + policies exist).
 */
export async function uploadProjectImage(file: File, projectId: string) {
  assertFile(file, IMAGE_MIME_TYPES, "Project image");

  const supabase = createClient();
  const path = `${projectId}/${Date.now()}-${sanitizeFileName(file.name)}`;

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.projectImages)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKETS.projectImages).getPublicUrl(data.path);

  return { ...data, publicUrl };
}

/**
 * Create a short-lived signed URL for a private receipt object.
 * Only the owner or an admin can create signed URLs (RLS).
 */
export async function getSignedReceiptUrl(
  path: string,
  expiresInSeconds = 3600
) {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.receipts)
    .createSignedUrl(path, expiresInSeconds);

  if (error) {
    throw new Error(error.message);
  }

  return data.signedUrl;
}

/**
 * Public URL for an object in a public bucket (`project-images` or `avatars`).
 */
export function getPublicStorageUrl(
  bucket: typeof STORAGE_BUCKETS.projectImages | typeof STORAGE_BUCKETS.avatars,
  path: string
) {
  const supabase = createClient();
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);
  return publicUrl;
}
