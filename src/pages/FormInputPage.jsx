import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, getOrCreateEvaluasi, updateEvaluasi, updateAsetStatus } from '../db';
import {
    INDIKATOR_CONFIG,
    getGroupedIndikators,
    CARA_EVALUASI_OPTIONS,
} from '../data/referensi';
import {
    ArrowLeft,
    Save,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Hash,
    ListChecks,
    Calendar,
    ClipboardCheck,
} from 'lucide-react';

export default function FormInputPage() {
    const { asetId } = useParams();
    const navigate = useNavigate();

    const aset = useLiveQuery(() => db.asets.get(Number(asetId)), [asetId]);
    const [evaluasi, setEvaluasi] = useState(null);
    const [form, setForm] = useState({});
    const [expandedGroup, setExpandedGroup] = useState(null);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    // Load or create evaluasi
    useEffect(() => {
        if (!aset) return;
        getOrCreateEvaluasi(aset.id).then((ev) => {
            setEvaluasi(ev);
            setForm({
                cara_evaluasi: ev.cara_evaluasi || '',
                tgl_survey: ev.tgl_survey || '',
                ...Object.fromEntries(
                    INDIKATOR_CONFIG.map((ind) => [`ind_${ind.kd_sub_sub}`, ev[`ind_${ind.kd_sub_sub}`] || ''])
                ),
            });
            // Expand first group by default
            const groups = Object.keys(getGroupedIndikators());
            if (groups.length > 0) setExpandedGroup(groups[0]);
        });
    }, [aset]);

    // Auto-save debounced
    const autoSave = useCallback(
        async (newForm) => {
            if (!evaluasi) return;
            setSaving(true);
            try {
                await updateEvaluasi(evaluasi.id, newForm);
                await updateAsetStatus(aset.id);
                setLastSaved(new Date());
            } finally {
                setSaving(false);
            }
        },
        [evaluasi, aset]
    );

    // Debounced change handler
    const [saveTimer, setSaveTimer] = useState(null);

    function handleChange(key, value) {
        const newForm = { ...form, [key]: value };
        setForm(newForm);

        // Debounce auto-save (800ms)
        if (saveTimer) clearTimeout(saveTimer);
        const timer = setTimeout(() => autoSave(newForm), 800);
        setSaveTimer(timer);
    }

    function handleSaveNow() {
        if (saveTimer) clearTimeout(saveTimer);
        autoSave(form);
    }

    if (!aset || !evaluasi) return null;

    const groups = getGroupedIndikators();
    const totalFields = INDIKATOR_CONFIG.length + 2; // +cara +tgl
    const filledFields =
        (form.cara_evaluasi ? 1 : 0) +
        (form.tgl_survey ? 1 : 0) +
        INDIKATOR_CONFIG.filter((ind) => {
            const v = form[`ind_${ind.kd_sub_sub}`];
            return v !== '' && v != null;
        }).length;
    const progress = Math.round((filledFields / totalFields) * 100);

    return (
        <div className="min-h-dvh pb-24">
            {/* Header */}
            <div className="page-header">
                <div className="flex items-center gap-3 mb-2">
                    <button onClick={() => navigate(-1)} className="p-1 -ml-1">
                        <ArrowLeft size={22} />
                    </button>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-blue-400">{aset.kd_brg}</span>
                            <span className="text-xs text-[--color-text-dim]">NUP {aset.no_aset}</span>
                        </div>
                        <h1 className="text-sm font-semibold truncate">{aset.ur_sskel || 'Aset'}</h1>
                    </div>
                    <button
                        onClick={handleSaveNow}
                        className="p-2 rounded-xl bg-blue-500/10 text-blue-400"
                        title="Simpan"
                    >
                        <Save size={18} />
                    </button>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <div className="progress-bar">
                            <div
                                className="progress-bar-fill"
                                style={{
                                    width: `${progress}%`,
                                    background:
                                        progress === 100
                                            ? 'linear-gradient(90deg, #22c55e, #10b981)'
                                            : 'linear-gradient(90deg, #3b82f6, #6366f1)',
                                }}
                            />
                        </div>
                    </div>
                    <span className="text-xs text-[--color-text-dim] whitespace-nowrap">
                        {filledFields}/{totalFields}
                    </span>
                    {saving ? (
                        <span className="text-[10px] text-amber-400">Saving...</span>
                    ) : lastSaved ? (
                        <span className="text-[10px] text-emerald-400">✓ Saved</span>
                    ) : null}
                </div>
            </div>

            <div className="px-5 space-y-4">
                {/* General Fields */}
                <div className="glass-card p-4 space-y-4">
                    <div className="section-title">
                        <ClipboardCheck size={14} />
                        Informasi Umum
                    </div>

                    {/* Cara Evaluasi */}
                    <div>
                        <label className="text-xs font-medium text-[--color-text-dim] mb-2 block">
                            Cara Evaluasi
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {CARA_EVALUASI_OPTIONS.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => handleChange('cara_evaluasi', opt)}
                                    className={`py-3 px-3 rounded-xl text-sm font-medium transition-all ${form.cara_evaluasi === opt
                                            ? 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40'
                                            : 'bg-[--color-surface-2] text-[--color-text-dim]'
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tanggal Survey */}
                    <div>
                        <label className="text-xs font-medium text-[--color-text-dim] mb-1 block">
                            <Calendar size={12} className="inline mr-1" />
                            Tanggal Survey
                        </label>
                        <input
                            type="date"
                            className="input-field"
                            value={form.tgl_survey}
                            onChange={(e) => handleChange('tgl_survey', e.target.value)}
                        />
                    </div>
                </div>

                {/* Indikator Groups */}
                {Object.entries(groups).map(([groupName, indicators]) => {
                    const isExpanded = expandedGroup === groupName;
                    const groupFilled = indicators.filter((ind) => {
                        const v = form[`ind_${ind.kd_sub_sub}`];
                        return v !== '' && v != null;
                    }).length;

                    return (
                        <div key={groupName} className="glass-card overflow-hidden">
                            {/* Group Header */}
                            <button
                                onClick={() => setExpandedGroup(isExpanded ? null : groupName)}
                                className="w-full p-4 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${groupFilled === indicators.length
                                                ? 'bg-emerald-500/20'
                                                : 'bg-blue-500/10'
                                            }`}
                                    >
                                        {groupFilled === indicators.length ? (
                                            <CheckCircle2 size={16} className="text-emerald-400" />
                                        ) : indicators[0].type === 'pilihan' ? (
                                            <ListChecks size={16} className="text-blue-400" />
                                        ) : (
                                            <Hash size={16} className="text-blue-400" />
                                        )}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium">{groupName}</p>
                                        <p className="text-[10px] text-[--color-text-dim]">
                                            {groupFilled}/{indicators.length} terisi
                                        </p>
                                    </div>
                                </div>
                                {isExpanded ? (
                                    <ChevronUp size={18} className="text-[--color-text-dim]" />
                                ) : (
                                    <ChevronDown size={18} className="text-[--color-text-dim]" />
                                )}
                            </button>

                            {/* Group Fields */}
                            {isExpanded && (
                                <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4">
                                    {indicators.map((ind) => (
                                        <IndicatorField
                                            key={ind.kd_sub_sub}
                                            config={ind}
                                            value={form[`ind_${ind.kd_sub_sub}`] || ''}
                                            onChange={(val) => handleChange(`ind_${ind.kd_sub_sub}`, val)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function IndicatorField({ config, value, onChange }) {
    const { kd_sub_sub, label, type, options, unit, hint } = config;

    return (
        <div>
            <label className="text-xs font-medium text-[--color-text-dim] mb-1 block">
                <span className="text-[10px] font-mono text-blue-400/60 mr-1">{kd_sub_sub}</span>
                {label}
            </label>

            {type === 'pilihan' && options ? (
                <div className="space-y-1.5">
                    {options.map((opt) => (
                        <button
                            key={opt.nilai}
                            onClick={() => onChange(opt.nilai)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center justify-between ${value === opt.nilai
                                    ? 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30'
                                    : 'bg-[--color-bg] text-[--color-text-dim] hover:bg-[--color-surface-2]'
                                }`}
                        >
                            <span>{opt.nilai}</span>
                            <span className="text-[10px] opacity-60">skor: {opt.skor}</span>
                        </button>
                    ))}
                </div>
            ) : type === 'angka' ? (
                <div className="relative">
                    <input
                        type="number"
                        inputMode="decimal"
                        className="input-field pr-12"
                        placeholder={hint || `Masukkan ${label.toLowerCase()}`}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    {unit && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[--color-text-dim]">
                            {unit}
                        </span>
                    )}
                </div>
            ) : null}
        </div>
    );
}
