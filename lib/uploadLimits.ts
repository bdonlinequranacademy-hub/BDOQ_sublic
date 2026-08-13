export const PDF_MAX_BYTES = 10 * 1024 * 1024;
export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export const DOCUMENT_ACCEPT =
  ".pdf,.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp,application/pdf";

export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/*";

export function isPdfFile(file: File): boolean {
  return (
    file.type === "application/pdf" ||
    file.type === "application/x-pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  );
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif)$/i.test(file.name);
}

export type UploadKind = "document" | "image";

export function validateUploadFile(
  file: File,
  kind: UploadKind,
  messages: {
    fileSize10mb: string;
    imageSize5mb: string;
    documentType: string;
    imageType: string;
  }
): string | null {
  if (kind === "image") {
    if (!isImageFile(file)) return messages.imageType;
    if (file.size > IMAGE_MAX_BYTES) return messages.imageSize5mb;
    return null;
  }

  if (isPdfFile(file)) {
    if (file.size > PDF_MAX_BYTES) return messages.fileSize10mb;
    return null;
  }

  if (isImageFile(file)) {
    if (file.size > IMAGE_MAX_BYTES) return messages.imageSize5mb;
    return null;
  }

  return messages.documentType;
}
