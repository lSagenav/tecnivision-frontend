export function parseProductOptions(value: string | null | undefined) {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((option): option is string => typeof option === "string")
      .map((option) => option.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

export function serializeProductOptions(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) return null;

  const options = parseProductOptions(value);
  return options.length > 0 ? JSON.stringify(options) : null;
}
export function parseProductDescriptions(value: string | null | undefined): string[] {
  return [...new Set((value ?? "").split("\n").map(line => line.trim().replace(/^[-*]\s*/, "").trim()).filter(Boolean))];
}
