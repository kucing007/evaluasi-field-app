import * as XLSX from 'xlsx';
import { INDIKATOR_CONFIG } from '../data/referensi';

/**
 * Export evaluasi data to .xlsx matching Nadine's evaluasi_template format.
 *
 * @param {Array} rows - [{ kd_brg, no_aset, cara_evaluasi, tgl_survey, ind_111111, ... }]
 * @param {string} filename - Output filename
 */
export function exportToExcel(rows, filename = 'evaluasi_data.xlsx') {
    const headers = [
        'kd_brg',
        'no_aset',
        'cara_evaluasi',
        'tgl_survey',
        ...INDIKATOR_CONFIG.map((i) => i.kd_sub_sub),
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
        ];
        wsData.push(line);
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Auto-width columns
    ws['!cols'] = headers.map((h) => ({ wch: Math.max(h.length + 2, 14) }));

    XLSX.utils.book_append_sheet(wb, ws, 'Data Evaluasi');
    XLSX.writeFile(wb, filename);
}

/**
 * Parse an imported JSON file containing a list of asets.
 * Expected format: [{ kd_brg, no_aset, ur_sskel }]
 * or { data: [{ kd_brg, no_aset, ur_sskel }] }
 */
export function parseImportJSON(jsonString) {
    try {
        const parsed = JSON.parse(jsonString);
        const data = Array.isArray(parsed) ? parsed : parsed.data || [];
        return data.map((row) => ({
            kd_brg: String(row.kd_brg || '').trim(),
            no_aset: String(row.no_aset || row.nup || '').trim(),
            ur_sskel: String(row.ur_sskel || row.uraian || row.nama || '').trim(),
        }));
    } catch {
        return [];
    }
}

/**
 * Parse an imported CSV file containing a list of asets.
 */
export function parseImportCSV(csvString) {
    const lines = csvString.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/"/g, ''));

    return lines.slice(1).map((line) => {
        const vals = line.split(',').map((v) => v.trim().replace(/"/g, ''));
        const row = {};
        headers.forEach((h, i) => {
            row[h] = vals[i] || '';
        });
        return {
            kd_brg: String(row.kd_brg || row['kode_barang'] || '').trim(),
            no_aset: String(row.no_aset || row.nup || '').trim(),
            ur_sskel: String(row.ur_sskel || row.uraian || row.nama || '').trim(),
        };
    });
}

/**
 * Parse an imported Excel file containing a list of asets.
 */
export function parseImportExcel(arrayBuffer) {
    try {
        const wb = XLSX.read(arrayBuffer, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws);
        return data.map((row) => ({
            kd_brg: String(row.kd_brg || row['Kode Barang'] || row['kd barang'] || '').trim(),
            no_aset: String(row.no_aset || row.NUP || row.nup || '').trim(),
            ur_sskel: String(row.ur_sskel || row.uraian || row.Uraian || row.nama || '').trim(),
        }));
    } catch {
        return [];
    }
}
