'use client';
import { useApp } from '@/context/AppContext';
import { useTranslation } from '@/lib/i18n';
import { Check, EnvelopeSimple, Buildings, Clock, ShieldCheck, LockKey, DeviceMobile, Desktop, SpinnerGap } from '@phosphor-icons/react';
import { useState, useEffect, useRef, useTransition } from 'react';
import { updateProfile, updatePassword, updateUserPreferences } from '@/app/lib/actions';

export default function ProfilePage() {
    const { currentUser, updateUser } = useApp();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'INFO' | 'SECURITY' | 'PREFS'>('INFO');
    const [formData, setFormData] = useState<any>({
        name: '',
        jobTitle: '',
        phone: '',
        location: '',
        bio: '',
        language: 'Es',
        timezone: 'GMT-5',
        avatar: ''
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [saved, setSaved] = useState(false);
    const [isPending, startTransition] = useTransition();

    // Security Form State
    const [securityData, setSecurityData] = useState({ current: '', new: '', confirm: '' });
    const [securitySaved, setSecuritySaved] = useState(false);

    // Refs must be declared before any conditional returns
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (currentUser) {
            setFormData({
                name: currentUser.name || '',
                jobTitle: currentUser.jobTitle || '',
                phone: currentUser.phone || '',
                location: currentUser.location || '',
                bio: currentUser.bio || '',
                language: currentUser.language || 'Es',
                timezone: currentUser.timezone || 'GMT-5',
                avatar: currentUser.avatar || ''
            });
        }
    }, [currentUser]);

    if (!currentUser) return null;

    const handleSave = () => {
        // Actualización optimista del contexto local
        updateUser(formData);

        startTransition(async () => {
            const data = new FormData();
            // Agregar todos los campos al FormData
            Object.entries(formData).forEach(([key, value]) => {
                if (key !== 'avatar' && value !== null && value !== undefined) {
                    data.append(key, value as string);
                }
            });

            if (selectedFile) {
                data.append('avatar', selectedFile);
            } else if (formData.avatar && typeof formData.avatar === 'string' && formData.avatar.startsWith('http')) {
                // If we have an existing URL and no new file, send it explicitly to ensure persistence
                data.append('avatar', formData.avatar);
            }

            const result = await updateProfile(data);

            if (result.success) {
                // Cast to any because the return type might not be fully inferred yet
                const res = result as any;
                if (res.avatarUrl) {
                    updateUser({ ...formData, avatar: res.avatarUrl });
                    setFormData((prev: any) => ({ ...prev, avatar: res.avatarUrl }));
                }
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            } else {
                alert('Error al guardar los cambios en el servidor: ' + result.error);
            }
        });
    };

    const handleChange = (e: any) => {
        const { id, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [id]: value }));
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('La imagen no puede superar los 5MB');
                return;
            }
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setFormData((prev: any) => ({ ...prev, avatar: base64 }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSecurityChange = (e: any) => {
        const { id, value } = e.target;
        setSecurityData(prev => ({ ...prev, [id]: value }));
    };

    const handleSecuritySave = async () => {
        if (!securityData.current || !securityData.new || !securityData.confirm) {
            alert('Por favor completa todos los campos');
            return;
        }

        if (securityData.new !== securityData.confirm) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            const result = await updatePassword(
                securityData.current,
                securityData.new,
                securityData.confirm
            );

            if (result.success) {
                setSecuritySaved(true);
                setTimeout(() => {
                    setSecuritySaved(false);
                    setSecurityData({ current: '', new: '', confirm: '' });
                }, 2000);
            } else {
                alert(result.error || 'Error al cambiar la contraseña');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            alert('Error al cambiar la contraseña');
        }
    };

    const calculatePasswordStrength = (pass: string) => {
        if (!pass) return 0;
        let score = 0;
        if (pass.length >= 8) score += 25;
        if (/[0-9]/.test(pass)) score += 25;
        if (/[A-Z]/.test(pass)) score += 25;
        if (/[^A-Za-z0-9]/.test(pass)) score += 25;
        return score;
    };

    const getStrengthColor = (score: number) => {
        if (score <= 25) return 'bg-red-500';
        if (score <= 50) return 'bg-amber-500';
        if (score <= 75) return 'bg-blue-500';
        return 'bg-success';
    };

    const getStrengthLabel = (score: number) => {
        if (score <= 25) return 'Muy débil';
        if (score <= 50) return 'Débil';
        if (score <= 75) return 'Fuerte';
        return 'Muy fuerte';
    };

    const passwordScore = calculatePasswordStrength(securityData.new);

    const handlePreferenceUpdate = async (prefs: any) => {
        startTransition(async () => {
            const result = await updateUserPreferences(prefs);
            if (result.success) {
                updateUser({ preferences: { ...currentUser.preferences, ...prefs } } as any);
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            } else {
                alert('Error al guardar preferencias: ' + result.error);
            }
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] items-start gap-6 max-w-7xl mx-auto">
            {/* Left Summary Card */}
            <div className="card sticky top-24 shadow-sm border-slate-200/60 dark:border-slate-800/60">
                <div className="card-body text-center p-8 flex flex-col items-center">
                    <div
                        className="relative group cursor-pointer w-28 h-28 mb-4 rounded-full shadow-lg ring-4 ring-white dark:ring-slate-800 transition-all hover:scale-105 active:scale-95"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {formData.avatar ? (
                            <img
                                src={formData.avatar}
                                alt="Avatar"
                                className="w-full h-full rounded-full object-cover"
                                onError={(e) => {
                                    const target = e.currentTarget;
                                    // Fallback to proxy if direct URL fails and it's an avatar path
                                    if (target.src.includes('/avatars/') && !target.src.includes('/api/storage/')) {
                                        console.log('Falling back to storage proxy for avatar');
                                        target.src = '/api/storage' + target.src.substring(target.src.indexOf('/avatars/'));
                                    } else {
                                        console.error("Error loading avatar image:", formData.avatar);
                                        // Optional: Set a placeholder if proxy also fails
                                        // target.src = '/placeholder-avatar.png'; 
                                    }
                                }}
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-4xl font-bold text-slate-400 uppercase">
                                {currentUser.initials || currentUser.name?.substring(0, 2)}
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Desktop size={20} className="text-white mb-1" />
                            <span className="text-white text-[9px] font-bold uppercase tracking-wider">Cambiar</span>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1">{formData.name}</h3>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-6">{formData.jobTitle || currentUser.role}</p>

                    <div className="flex flex-wrap gap-2 justify-center w-full mb-6">
                        <span className="badge bg-success/10 text-success border border-success/20 py-1 px-3 rounded-full text-[10px] font-bold uppercase">
                            {t('profile_active')}
                        </span>
                        <span className="badge bg-primary/10 text-primary border border-primary/20 py-1 px-3 rounded-full text-[10px] font-bold uppercase">
                            {t('profile_level')} {currentUser.level}
                        </span>
                    </div>

                    <div className="w-full border-t border-slate-100 dark:border-slate-800 pt-6 text-left space-y-4">
                        <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-700/50">
                                <EnvelopeSimple size={14} />
                            </div>
                            <span className="truncate flex-1 font-medium">{currentUser.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-700/50">
                                <Buildings size={14} />
                            </div>
                            <span className="truncate flex-1 font-medium">{currentUser.unit}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-700/50">
                                <Clock size={14} />
                            </div>
                            <span className="truncate flex-1 font-medium italic opacity-70">Acceso: hoy</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm border-slate-200/60 dark:border-slate-800/60 min-h-[600px] overflow-hidden">
                <div className="card-head px-6 pt-6 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/30 dark:bg-slate-900/10">
                    <div className="tabs flex gap-8">
                        {[
                            { id: 'INFO', label: 'Editar Perfil', icon: ShieldCheck },
                            { id: 'SECURITY', label: 'Seguridad', icon: LockKey },
                            { id: 'PREFS', label: 'Preferencias', icon: DeviceMobile }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                className={`tab relative pb-4 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === tab.id
                                    ? 'text-primary'
                                    : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                                    }`}
                                onClick={() => setActiveTab(tab.id as any)}
                            >
                                <tab.icon weight={activeTab === tab.id ? "fill" : "bold"} size={16} />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary rounded-full animate-fadeIn" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="card-body p-8">
                    {activeTab === 'INFO' && (
                        <div className="animate-fadeIn space-y-8">
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    Información General
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{t('profile_name')}</label>
                                        <input type="text" id="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-primary/20" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{t('profile_title')}</label>
                                        <input type="text" id="jobTitle" value={formData.jobTitle} onChange={handleChange} className="w-full bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-primary/20" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{t('profile_phone')}</label>
                                        <input type="text" id="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-primary/20" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{t('profile_location')}</label>
                                        <input type="text" id="location" value={formData.location} onChange={handleChange} className="w-full bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-primary/20" />
                                    </div>
                                    <div className="col-span-1 md:col-span-2 space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{t('profile_bio')}</label>
                                        <textarea id="bio" rows={4} value={formData.bio} onChange={handleChange} className="w-full bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-primary/20 p-3" style={{ resize: 'none' }}></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-100 dark:border-slate-800/60">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    Configuración Regional
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{t('profile_lang')}</label>
                                        <select id="language" value={formData.language} onChange={handleChange} className="w-full bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-primary/20">
                                            <option value="Es">Español</option>
                                            <option value="En">Inglés</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{t('profile_timezone')}</label>
                                        <select id="timezone" value={formData.timezone} onChange={handleChange} className="w-full bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-primary/20">
                                            <option value="GMT-5">Bogotá/Lima (GMT-5)</option>
                                            <option value="GMT-6">México (GMT-6)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-8 mt-4 border-t border-slate-50 dark:border-slate-800/40">
                                <button className="btn btn-ghost px-6 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-800 mr-2">{t('cancel')}</button>
                                <button
                                    className={`btn px-8 font-bold text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 ${saved ? 'bg-success text-white' : 'btn-primary shadow-primary/20'}`}
                                    onClick={handleSave}
                                    disabled={isPending}
                                >
                                    {isPending && <SpinnerGap className="animate-spin mr-2" />}
                                    {saved ? <><Check weight="bold" className="mr-2" /> {t('profile_saved')}</> : isPending ? 'Guardando...' : t('profile_save_btn')}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'SECURITY' && (
                        <div className="animate-fadeIn max-w-xl mx-auto py-4">
                            <div className="space-y-8">
                                <div className="p-8 rounded-3xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 shadow-inner">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                                            <LockKey size={28} weight="fill" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white leading-tight mb-1">{t('security_password_title')}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Mantén tu cuenta protegida cambiando tu contraseña periódicamente</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Contraseña Actual</label>
                                            <input
                                                type="password"
                                                id="current"
                                                value={securityData.current}
                                                onChange={handleSecurityChange}
                                                className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-primary/20"
                                                placeholder="••••••••"
                                            />
                                        </div>

                                        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 mt-2 space-y-6">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Nueva Contraseña</label>
                                                <input
                                                    type="password"
                                                    id="new"
                                                    value={securityData.new}
                                                    onChange={handleSecurityChange}
                                                    className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-primary/20"
                                                    placeholder="••••••••"
                                                />

                                                {/* Password Strength Meter */}
                                                {securityData.new && (
                                                    <div className="mt-3 space-y-2 animate-fadeIn">
                                                        <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                                                            <span className="text-slate-400">Fortaleza</span>
                                                            <span className={getStrengthColor(passwordScore).replace('bg-', 'text-')}>
                                                                {getStrengthLabel(passwordScore)}
                                                            </span>
                                                        </div>
                                                        <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full transition-all duration-700 ease-out ${getStrengthColor(passwordScore)}`}
                                                                style={{ width: `${passwordScore}%` }}
                                                            />
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 leading-tight">
                                                            Usa al menos 8 caracteres, números y símbolos para una mayor seguridad.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Confirmar Nueva Contraseña</label>
                                                <input
                                                    type="password"
                                                    id="confirm"
                                                    value={securityData.confirm}
                                                    onChange={handleSecurityChange}
                                                    className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-primary/20"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button
                                                className={`btn w-full font-bold text-xs uppercase tracking-widest py-3 shadow-lg active:scale-[0.98] transition-all ${securitySaved ? 'bg-success text-white border-success' : 'btn-primary shadow-primary/20'}`}
                                                onClick={handleSecuritySave}
                                                disabled={isPending}
                                            >
                                                {securitySaved ? <><Check weight="bold" className="mr-2" /> Contraseña Actualizada</> : 'Actualizar Contraseña'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'PREFS' && (
                        <div className="animate-fadeIn max-w-xl mx-auto py-4">
                            <div className="space-y-8">
                                <div className="p-8 rounded-3xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 shadow-inner">
                                    <div className="space-y-8">
                                        {/* Visual Preferences Removed as per user request */}

                                        <div className="pt-0 border-t-0">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 block">Notificaciones</label>
                                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                                        <EnvelopeSimple size={20} weight="fill" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800 dark:text-white leading-none mb-1">Alertas del Sistema</p>
                                                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Recibo correos sobre actividad importante</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handlePreferenceUpdate({ notifications: !currentUser.preferences?.notifications })}
                                                    className={`w-12 h-6 rounded-full transition-all relative ${currentUser.preferences?.notifications !== false ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'
                                                        }`}
                                                >
                                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${currentUser.preferences?.notifications !== false ? 'left-7' : 'left-1'
                                                        }`} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
