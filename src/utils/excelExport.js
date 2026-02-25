import * as XLSX from 'xlsx';
import { INDIKATOR_CONFIG } from '../data/referensi';

/**
 * Export evaluasi data to .xlsx matching Nadine's evaluasi_template format.
 * All 21 indikators are exported (including hidden ones), as-is if empty.
 */
export function exportToExcel(rows, filename = 'evaluasi_data.xlsx') {
    const headers = [
        'kd_brg',
        'no_aset',
        'cara_evaluasi',
        'tgl_survey',
        ...INDIKATOR_CONFIG.map((i) => i.kd_sub_sub),
        'catatan',
    ];

    const wsData = [headers];

    for (const row of rows) {
        const line = [
            row.kd_brg || '',
            row.no_aset || '',
            row.cara_evaluasi || '',
            row.tgl_survey || '',
            ...INDIKATOR_CONFIG.map((ind) => {
                const val = row[`ind_${ind.kd_sub_sub}`];
                if (val === '' || val == null) return '';
                if (ind.type === 'angka') return Number(val) || 0;
                return val;
            }),
            row.catatan || '',
        ];
        wsData.push(line);
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = headers.map((h) => ({ wch: Math.max(h.length + 2, 14) }));
    XLSX.utils.book_append_sheet(wb, ws, 'Data Evaluasi');
    XLSX.writeFile(wb, filename);
}

/**
 * Generate a blank import template .xlsx with header row.
 * Now includes no_paket and ur_satker columns.
 */
export function generateImportTemplate() {
    const headers = ['no_paket', 'ur_satker', 'kd_brg', 'no_aset', 'ur_sskel', 'luas', 'kondisi_barang'];
    const exampleRow = ['2024/KPKNL-001', 'KPKNL Jakarta IV', '3050201001', '1', 'Gedung Kantor', '500', 'Baik'];
    const exampleRow2 = ['2024/KPKNL-001', 'KPKNL Jakarta IV', '3050201001', '2', 'Gedung Arsip', '200', 'Rusak Ringan'];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, exampleRow, exampleRow2]);
    ws['!cols'] = [
        { wch: 18 }, // no_paket
        { wch: 22 }, // ur_satker
        { wch: 14 }, // kd_brg
        { wch: 8 },  // no_aset
        { wch: 30 }, // ur_sskel
        { wch: 10 }, // luas
        { wch: 16 }, // kondisi_barang
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Daftar Aset');
    XLSX.writeFile(wb, 'template_import_aset.xlsx');
}

/**
 * Helper: extract aset row from raw object.
 */
function mapAsetRow(row) {
    return {
        kd_brg: String(row.kd_brg || row.kode_barang || '').trim(),
        no_aset: String(row.no_aset || row.nup || '').trim(),
        ur_sskel: String(row.ur_sskel || row.uraian || row.nama || '').trim(),
        luas: String(row.luas || '').trim(),
        kondisi_barang: String(row.kondisi_barang || row.kondisi || '').trim(),
    };
}

/**
 * Helper: extract paket metadata from first row if present.
 */
function extractMeta(rows) {
    const first = rows[0] || {};
    return {
        no_paket: String(first.no_paket || '').trim(),
        ur_satker: String(first.ur_satker || first.satker || '').trim(),
    };
}

/**
 * Parse imported JSON.
 * Returns { rows, meta }.
 */
export function parseImportJSON(jsonString) {
    try {
        const parsed = JSON.parse(jsonString);
        const data = Array.isArray(parsed) ? parsed : parsed.data || [];
        const meta = {
            no_paket: String(parsed.no_paket || '').trim(),
            ur_satker: String(parsed.ur_satker || parsed.satker || '').trim(),
        };
        const rows = data.map(mapAsetRow);
        // If meta not in wrapper, try from first row
        if (!meta.no_paket) meta.no_paket = extractMeta(data).no_paket;
        if (!meta.ur_satker) meta.ur_satker = extractMeta(data).ur_satker;
        return { rows, meta };
    } catch {
        return { rows: [], meta: { no_paket: '', ur_satker: '' } };
    }
}

/**
 * Parse imported CSV.
 * Returns { rows, meta }.
 */
export function parseImportCSV(csvString) {
    const lines = csvString.trim().split('\n');
    if (lines.length < 2) return { rows: [], meta: { no_paket: '', ur_satker: '' } };

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/"/g, ''));

    const rawRows = lines.slice(1).map((line) => {
        const vals = line.split(',').map((v) => v.trim().replace(/"/g, ''));
        const row = {};
        headers.forEach((h, i) => {
            row[h] = vals[i] || '';
        });
        return row;
    });

    const meta = extractMeta(rawRows);
    const rows = rawRows.map(mapAsetRow);
    return { rows, meta };
}

/**
 * Parse imported Excel file.
 * Returns { rows, meta }.
 */
export function parseImportExcel(arrayBuffer) {
    try {
        const wb = XLSX.read(arrayBuffer, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws);
        // Normalize header keys to lowercase
        const rawRows = data.map((row) => {
            const normalized = {};
            for (const [k, v] of Object.entries(row)) {
                normalized[k.toLowerCase().replace(/\s+/g, '_')] = v;
            }
            return normalized;
        });
        const meta = extractMeta(rawRows);
        const rows = rawRows.map(mapAsetRow);
        return { rows, meta };
    } catch {
        return { rows: [], meta: { no_paket: '', ur_satker: '' } };
    }
}

/**
 * Auto-detect and parse pasted text (CSV or JSON).
 * Returns { rows, meta }.
 */
export function parseImportText(text) {
    const trimmed = text.trim();
    if (!trimmed) return { rows: [], meta: { no_paket: '', ur_satker: '' } };

    // Detect JSON (starts with [ or {)
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        return parseImportJSON(trimmed);
    }

    // Otherwise treat as CSV
    return parseImportCSV(trimmed);
}
