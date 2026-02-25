import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, importAsetList, deletePaket } from '../db';
import {
    parseImportJSON,
    parseImportCSV,
    parseImportExcel,
    parseImportText,
    generateImportTemplate,
} from '../utils/excelExport';
import {
    FolderOpen,
    Upload,
    Trash2,
    ChevronRight,
    ClipboardList,
    FileSpreadsheet,
    Download,
    ClipboardPaste,
} from 'lucide-react';

export default function HomePage() {
    const navigate = useNavigate();
    const fileRef = useRef(null);
    const [showImport, setShowImport] = useState(false);
    const [importData, setImportData] = useState([]);
    const [paketName, setPaketName] = useState('');
    const [satker, setSatker] = useState('');
    const [tahun, setTahun] = useState(new Date().getFullYear());
    const [importing, setImporting] = useState(false);
    const [showPaste, setShowPaste] = useState(false);
    const [pasteText, setPasteText] = useState('');

    const pakets = useLiveQuery(() => db.pakets.reverse().toArray());

    // Get aset counts per paket
    const [stats, setStats] = useState({});
    useEffect(() => {
        if (!pakets) return;
        (async () => {
            const s = {};
            for (const p of pakets) {
                const total = await db.asets.where('paket_id').equals(p.id).count();
                const done = await db.asets.where('paket_id').equals(p.id).filter((a) => a.status === 'done').count();
                const partial = await db.asets.where('paket_id').equals(p.id).filter((a) => a.status === 'partial').count();
                s[p.id] = { total, done, partial };
            }
            setStats(s);
        })();
    }, [pakets]);

    function applyParsed({ rows, meta }) {
        if (rows.length === 0) {
            alert('Tidak ada data ditemukan');
            return;
        }
        setImportData(rows);
        // Auto-fill from metadata
        if (meta.no_paket) setPaketName(meta.no_paket);
        if (meta.ur_satker) setSatker(meta.ur_satker);
        setShowImport(true);
        setShowPaste(false);
    }

    async function handleFile(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        let result;

        if (file.name.endsWith('.json')) {
            const text = await file.text();
            result = parseImportJSON(text);
        } else if (file.name.endsWith('.csv')) {
            const text = await file.text();
            result = parseImportCSV(text);
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            const buf = await file.arrayBuffer();
            result = parseImportExcel(buf);
        } else {
            alert('Format file tidak didukung. Gunakan .json, .csv, atau .xlsx');
            return;
        }

        e.target.value = '';
        applyParsed(result);
    }

    function handlePasteImport() {
        if (!pasteText.trim()) return;
        const result = parseImportText(pasteText);
        applyParsed(result);
    }

    async function handleImport() {
        if (!paketName.trim()) return;
        setImporting(true);

        try {
            const paketId = await importAsetList(
                { no_paket: paketName, ur_satker: satker, tahun: Number(tahun) },
                importData
            );
            setShowImport(false);
            setImportData([]);
            setPaketName('');
            setSatker('');
            setPasteText('');
            navigate(`/paket/${paketId}`);
        } catch (err) {
            alert('Error import: ' + err.message);
        } finally {
            setImporting(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Hapus paket beserta semua data evaluasi?')) return;
        await deletePaket(id);
    }

    return (
        <div className="min-h-dvh pb-8">
            {/* Header */}
            <div className="page-header">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                        <ClipboardList size={20} color="white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold">Evaluasi Kinerja BMN</h1>
                        <p className="text-xs text-[--color-text-dim]">Form input Peninjauan Lapangan EVAKIN</p>
                    </div>
                </div>
            </div>

            <div className="px-5">
                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                    <button
                        onClick={() => fileRef.current?.click()}
                        className="glass-card p-4 flex flex-col items-center gap-2 text-center"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500/20 to-teal-600/10 flex items-center justify-center">
                            <Upload size={22} className="text-teal-400" />
                        </div>
                        <span className="text-sm font-medium">Import File</span>
                        <span className="text-[10px] text-[--color-text-dim]">XLSX / JSON</span>
                    </button>
                    <button
                        onClick={() => { setShowPaste(true); setPasteText(''); }}
                        className="glass-card p-4 flex flex-col items-center gap-2 text-center"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 flex items-center justify-center">
                            <ClipboardPaste size={22} className="text-cyan-400" />
                        </div>
                        <span className="text-sm font-medium">Paste Text</span>
                        <span className="text-[10px] text-[--color-text-dim]">Copy from Excel / JSON</span>
                    </button>
                    <button
                        onClick={() => generateImportTemplate()}
                        className="glass-card p-4 flex flex-col items-center gap-2 text-center"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500/20 to-sky-600/10 flex items-center justify-center">
                            <Download size={22} className="text-sky-400" />
                        </div>
                        <span className="text-sm font-medium">Template</span>
                        <span className="text-[10px] text-[--color-text-dim]">Download .xlsx</span>
                    </button>
                </div>

                <input
                    ref={fileRef}
                    type="file"
                    accept=".json,.csv,.xlsx,.xls"
                    onChange={handleFile}
                    className="hidden"
                />

                {/* Paket List */}
                <div className="section-title">Daftar Paket</div>

                {!pakets || pakets.length === 0 ? (
                    <div className="glass-card p-8 text-center">
                        <FolderOpen size={48} className="text-[--color-text-dim] mx-auto mb-3 opacity-50" />
                        <p className="text-[--color-text-dim] text-sm mb-1">Belum ada paket</p>
                        <p className="text-[--color-text-dim] text-xs">Import daftar aset untuk memulai</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {pakets.map((p) => {
                            const s = stats[p.id] || { total: 0, done: 0, partial: 0 };
                            const progress = s.total > 0 ? ((s.done / s.total) * 100).toFixed(0) : 0;
                            return (
                                <div
                                    key={p.id}
                                    className="glass-card p-4 cursor-pointer"
                                    onClick={() => navigate(`/paket/${p.id}`)}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-sm truncate">{p.no_paket || 'Paket'}</h3>
                                            <p className="text-xs text-[--color-text-dim] truncate">{p.ur_satker} • {p.tahun}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(p.id);
                                                }}
                                                className="p-2 rounded-lg hover:bg-red-500/10 text-[--color-text-dim] hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <ChevronRight size={18} className="text-[--color-text-dim]" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mt-3">
                                        <div className="flex-1">
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-bar-fill bg-gradient-to-r from-teal-500 to-emerald-500"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-xs text-[--color-text-dim] whitespace-nowrap">
                                            {s.done}/{s.total} selesai
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Paste Modal */}
            {showPaste && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
                    <div className="bg-[--color-surface] w-full max-w-md rounded-2xl overflow-hidden max-h-[85vh] flex flex-col">
                        <div className="p-5 border-b border-white/5">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <ClipboardPaste size={20} className="text-cyan-400" />
                                Import dari Text
                            </h2>
                            <p className="text-xs text-[--color-text-dim] mt-1">
                                Paste data CSV atau JSON dari laptop
                            </p>
                        </div>

                        <div className="p-5 flex-1 overflow-y-auto space-y-3">
                            <textarea
                                className="textarea-field"
                                placeholder={"Paste CSV:\nno_paket,ur_satker,kd_brg,no_aset,ur_sskel,luas,kondisi_barang\n2024/KPKNL-001,KPKNL Jakarta,3050201001,1,Gedung Kantor,500,Baik\n\nAtau paste JSON array..."}
                                rows={8}
                                value={pasteText}
                                onChange={(e) => setPasteText(e.target.value)}
                                autoFocus
                            />
                            <p className="text-[10px] text-[--color-text-dim]">
                                Otomatis deteksi CSV atau JSON. Kolom no_paket & ur_satker akan diisi otomatis.
                            </p>
                        </div>

                        <div className="p-5 border-t border-white/5 flex gap-3">
                            <button className="btn-secondary flex-1" onClick={() => setShowPaste(false)}>
                                Batal
                            </button>
                            <button
                                className="btn-primary flex-1"
                                onClick={handlePasteImport}
                                disabled={!pasteText.trim()}
                            >
                                Parse Data
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Import Modal */}
            {showImport && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
                    <div className="bg-[--color-surface] w-full max-w-md rounded-2xl overflow-hidden max-h-[85vh] flex flex-col">
                        <div className="p-5 border-b border-white/5">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <FileSpreadsheet size={20} className="text-teal-400" />
                                Import Daftar Aset
                            </h2>
                            <p className="text-xs text-[--color-text-dim] mt-1">
                                {importData.length} aset ditemukan
                            </p>
                        </div>

                        <div className="p-5 flex-1 overflow-y-auto space-y-4">
                            <div>
                                <label className="text-xs font-medium text-[--color-text-dim] mb-1 block">Nomor Paket *</label>
                                <input
                                    className="input-field"
                                    placeholder="contoh: 2024/KPKNL-001"
                                    value={paketName}
                                    onChange={(e) => setPaketName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-[--color-text-dim] mb-1 block">Satuan Kerja</label>
                                <input
                                    className="input-field"
                                    placeholder="Nama satuan kerja"
                                    value={satker}
                                    onChange={(e) => setSatker(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-[--color-text-dim] mb-1 block">Tahun</label>
                                <input
                                    className="input-field"
                                    type="number"
                                    value={tahun}
                                    onChange={(e) => setTahun(e.target.value)}
                                />
                            </div>

                            {/* Preview */}
                            <div>
                                <p className="text-xs font-medium text-[--color-text-dim] mb-2">Preview (5 pertama):</p>
                                <div className="space-y-1.5">
                                    {importData.slice(0, 5).map((row, i) => (
                                        <div key={i} className="bg-[--color-bg] rounded-lg px-3 py-2 text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[--color-text-dim] w-5">{i + 1}.</span>
                                                <span className="font-mono">{row.kd_brg}</span>
                                                <span className="text-teal-400">NUP {row.no_aset}</span>
                                                <span className="text-[--color-text-dim] truncate flex-1">{row.ur_sskel}</span>
                                            </div>
                                            {(row.luas || row.kondisi_barang) && (
                                                <div className="flex gap-2 ml-7 mt-1">
                                                    {row.luas && <span className="info-chip">Luas: {row.luas}</span>}
                                                    {row.kondisi_barang && <span className="info-chip">{row.kondisi_barang}</span>}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {importData.length > 5 && (
                                        <p className="text-xs text-[--color-text-dim] text-center py-1">
                                            ... dan {importData.length - 5} lainnya
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-5 border-t border-white/5 flex gap-3">
                            <button className="btn-secondary flex-1" onClick={() => { setShowImport(false); setImportData([]); setPaketName(''); setSatker(''); }}>
                                Batal
                            </button>
                            <button
                                className="btn-primary flex-1"
                                onClick={handleImport}
                                disabled={importing || !paketName.trim()}
                            >
                                {importing ? 'Importing...' : `Import ${importData.length} Aset`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
