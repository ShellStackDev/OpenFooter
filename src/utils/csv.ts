import type { OpenFooterConfig, OpenFooterLink } from '../schema';

const parseBool = (v?: string) => ['true', 'yes', '1', 'y'].includes((v ?? '').trim().toLowerCase());

const splitCsvLine = (line: string): string[] => {
  const out: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      out.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  out.push(current.trim());
  return out;
};

const META_KEYS = new Set<keyof OpenFooterConfig>([
  'brandName', 'brandTagline', 'brandMessage', 'brandImageUrl', 'brandImageAlt', 'brandImageShape',
  'copyrightName', 'theme', 'layout', 'showPoweredBy'
]);

export const parseCsv = (csv: string): { config: Partial<OpenFooterConfig>; links: OpenFooterLink[] } => {
  const [headerLine, ...lines] = csv.split(/\r?\n/).filter(Boolean);
  const headers = splitCsvLine(headerLine || '');
  const config: Partial<OpenFooterConfig> = {};
  const links: OpenFooterLink[] = [];

  lines.forEach((line) => {
    const cols = splitCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = cols[i] ?? ''; });

    if ((row.type || '').toLowerCase() === 'meta') {
      const key = row.key as keyof OpenFooterConfig;
      if (!META_KEYS.has(key)) return;
      const value = row.value;
      if (key === 'showPoweredBy') {
        config.showPoweredBy = parseBool(value);
        return;
      }
      (config as Record<string, unknown>)[key] = value;
      return;
    }

    links.push({
      type: (row.type || 'custom') as OpenFooterLink['type'],
      label: row.label,
      url: row.url,
      icon: row.icon,
      category: row.category,
      priority: row.priority ? Number(row.priority) : undefined,
      isActive: row.is_active ? parseBool(row.is_active) : true,
      isFeatured: row.is_featured ? parseBool(row.is_featured) : undefined,
      description: row.description,
      startDate: row.start_date,
      endDate: row.end_date
    });
  });

  return { config, links };
};
