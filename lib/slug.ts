/**
 * Genera un slug URL-safe desde un texto en español.
 * - quita acentos
 * - colapsa espacios y caracteres no alfanuméricos a guiones
 * - lowercase
 */
export function slugify(input: string): string {
    return input
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 120)
}
