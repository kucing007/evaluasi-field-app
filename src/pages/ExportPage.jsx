import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { INDIKATOR_CONFIG } from '../data/referensi';
import { exportToExcel } from '../utils/excelExport';
import {
    ArrowLeft,
    Download,
    CheckCircle2,
    FileSpreadsheet,
    AlertCircle,
} from 'lucide-react';

export default function ExportPage() {
    const { paketId } = useParams();
    const navigate = useNavigate();
    const [exporting, setExporting] = useState(false);
    const [exported, setExported] = useState(false);

    const paket = useLiveQuery(() => db.pakets.get(Number(paketId)), [paketId]);
    const asets = useLiveQuery(
        () => db.asets.where('paket_id').equals(Number(paketId)).toArray(),
        [paketId]
    );
    const evaluasis = useLiveQuery(async () => {
        if (!asets) return [];
        const asetIds = asets.map((a) => a.id);
        return db.evaluasis.where('aset_id').anyOf(asetIds).toArray();
    }, [asets]);

    if (!paket || !asets) return null;

    const evalMap = {};
    (evaluasis || []).forEach((ev) => {
        evalMap[ev.aset_id] = ev;
    });

    const done = asets.filter((a) => a.status === 'done').length;
    const partial = asets.filter((a) => a.status === 'partial').length;
    const total = asets.length;

    function handleExport() {
        setExporting(true);

        try {
            const rows = asets.map((a) => {
                const ev = evalMap[a.id] || {};
                const row = {
                    kd_brg: a.kd_brg,
                    no_aset: a.no_aset,
                    cara_evaluasi: ev.cara_evaluasi || '',
                    tgl_survey: ev.tgl_survey || '',
                };

                // Add indikator values
                for (const ind of INDIKATOR_CONFIG) {
                    row[`ind_${ind.kd_sub_sub}`] = ev[`ind_${ind.kd_sub_sub}`] || '';
                }

                row.catatan = ev.catatan || '';
                return row;
            });

            const filename = `evaluasi_${paket.no_paket.replace(/\//g, '-')}_${new Date()
                .toISOString()
                .slice(0, 10)}.xlsx`;
            exportToExcel(rows, filename);
            setExported(true);
        } catch (err) {
            alert('Error export: ' + err.message);
        } finally {
            setExporting(false);
        }
    }

    return (
        <div className="min-h-dvh pb-8">
            {/* Header */}
            <div className="page-header">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-1 -ml-1">
                        <ArrowLeft size={22} />
                    </button>
                    <div>
                        <h1 className="text-base font-bold">Export Data</h1>
                        <p className="text-xs text-[--color-text-dim]">{paket.no_paket}</p>
                    </div>
                </div>
            </div>

            <div className="px-5 space-y-6">
                {/* Summary Card */}
                <div className="glass-card p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500/20 to-teal-600/10 flex items-center justify-center">
                            <FileSpreadsheet size={24} className="text-teal-400" />
                        </div>
                        <div>
                            <h2 className="font-semibold">{paket.no_paket}</h2>
                            <p className="text-xs text-[--color-text-dim]">{paket.ur_satker} • {paket.tahun}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-[--color-bg] rounded-xl p-3 text-center">
                            <div className="text-lg font-bold text-teal-400">{total}</div>
                            <div className="text-[10px] text-[--color-text-dim]">Total Aset</div>
                        </div>
                        <div className="bg-[--color-bg] rounded-xl p-3 text-center">
                            <div className="text-lg font-bold text-emerald-400">{done}</div>
                            <div className="text-[10px] text-[--color-text-dim]">Selesai</div>
                        </div>
                        <div className="bg-[--color-bg] rounded-xl p-3 text-center">
                            <div className="text-lg font-bold text-amber-400">{partial}</div>
                            <div className="text-[10px] text-[--color-text-dim]">Sebagian</div>
                        </div>
                    </div>

                    {total - done - partial > 0 && (
                        <div className="mt-4 bg-amber-500/10 rounded-xl p-3 flex items-start gap-2">
                            <AlertCircle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-amber-300">
                                {total - done - partial} aset masih kosong. Data kosong tetap akan diekspor tanpa isian.
                            </p>
                        </div>
                    )}
                </div>

                {/* Export Format Info */}
                <div className="glass-card p-5">
                    <div className="section-title">Format Ekspor</div>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-emerald-400" />
                            <span className="text-[--color-text-dim]">Format kompatibel dengan Nadine CLI</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-emerald-400" />
                            <span className="text-[--color-text-dim]">Header: kd_brg, no_aset, cara_evaluasi, tgl_survey, + 21 indikator</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-emerald-400" />
                            <span className="text-[--color-text-dim]">File .xlsx siap import ke Automasi Penginputan</span>
                        </div>
                    </div>
                </div>

                {/* Export Button */}
                {exported ? (
                    <div className="glass-card p-5 text-center">
                        <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-3" />
                        <h3 className="font-semibold text-emerald-400 mb-1">Export Berhasil!</h3>
                        <p className="text-xs text-[--color-text-dim] mb-4">
                            File telah didownload. Import ke Nadine CLI → Automasi Penginputan.
                        </p>
                        <div className="flex gap-3">
                            <button className="btn-secondary flex-1" onClick={() => navigate(-1)}>
                                Kembali
                            </button>
                            <button
                                className="btn-primary flex-1"
                                onClick={() => {
                                    setExported(false);
                                    handleExport();
                                }}
                            >
                                Export Lagi
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="btn-primary w-full flex items-center justify-center gap-2 py-4"
                    >
                        <Download size={20} />
                        {exporting ? 'Exporting...' : `Export ${total} Aset ke Excel`}
                    </button>
                )}
            </div>
        </div>
    );
}
