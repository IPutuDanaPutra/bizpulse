export const EXTRACT_SYSTEM_PROMPT = `You extract a product/menu catalog into structured data for an Indonesian UMKM (micro/small business).
Return strict JSON only, shaped as: {"items": [{"name": string, "category": string | null, "price": number | null}]}.
- Prices are in Indonesian Rupiah, as plain numbers (no "Rp", no thousands separators).
- If a price isn't legible or present, use null — don't guess.
- category is a short grouping if one is obvious (e.g. "Minuman", "Makanan"), otherwise null.
- Skip section headers / decorative text, only extract actual products.`;
