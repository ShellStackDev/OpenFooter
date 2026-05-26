import type { OpenFooterLink } from '../schema';

const parseBool = (v?: string) => ['true','yes','1','y'].includes((v ?? '').trim().toLowerCase());

export const parseCsv = (csv: string): OpenFooterLink[] => {
  const [headerLine, ...lines] = csv.split(/\r?\n/).filter(Boolean);
  const headers = headerLine.split(',').map((s) => s.trim());
  return lines.map((line) => {
    const cols = line.split(',').map((s) => s.trim());
    const row: Record<string,string> = {};
    headers.forEach((h, i) => { row[h] = cols[i] ?? ''; });
    return {
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
    };
  });
};
