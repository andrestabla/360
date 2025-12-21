'use client';
import { useApp } from '@/context/AppContext';
import { useTranslation } from '@/lib/i18n';
import { Check, EnvelopeSimple, Buildings, Clock, ShieldCheck, LockKey, DeviceMobile, Desktop } from '@phosphor-icons/react';
import { useState, useEffect, useRef } from 'react';

export default function ProfilePage() {
    const { currentUser, updateUser } = useApp();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'INFO' | 'SECURITY'>('INFO');
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
    const [saved, setSaved] = useState(false);

    // Security Form State
    const [securityData, setSecurityData] = useState({ current: '', new: '', confirm: '' });
    const [securitySaved, setSecuritySaved] = useState(false);

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
        updateUser(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleChange = (e: any) => {
        const { id, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [id]: value }));
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
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

    const handleSecuritySave = () => {
        if (securityData.new !== securityData.confirm) {
            alert(t('security_pass_mismatch'));
            return;
        }
        // Mock API call
        setSecuritySaved(true);
        setTimeout(() => {
            setSecuritySaved(false);
            setSecurityData({ current: '', new: '', confirm: '' });
        }, 2000);
    };

    return (
        <div className="grid-4" style={{ gridTemplateColumns: '1fr 2fr', alignItems: 'start', gap: 24 }}>
            <div className="card">
                <div className="card-body" style={{ textAlign: 'center', padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div
                        className="relative group cursor-pointer w-24 h-24 mb-4 rounded-full shadow-lg ring-4 ring-white transition-transform hover:scale-105"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {formData.avatar ? (
                            <img src={formData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center text-3xl font-bold text-slate-500">
                                {currentUser.initials}
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <span className="text-white text-[10px] font-bold uppercase tracking-wider">{t('profile_change_photo')}</span>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <h3 style={{ fontSize: 18, margin: '10px 0 5px' }}>{formData.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>{formData.jobTitle || currentUser.role}</p>
                    <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'center' }}>
                        <span className="badge bg-success">{t('profile_active')}</span>
                        <span className="badge bg-primary">{t('profile_level')} {currentUser.level}</span>
                    </div>
                    <hr style={{ margin: '20px 0', border: 0, borderTop: '1px solid var(--border)' }} />
                    <div style={{ textAlign: 'left', fontSize: 13, color: 'var(--text-main)' }}>
                        <p style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                            <EnvelopeSimple style={{ marginRight: 8, color: 'var(--text-muted)' }} />
                            {currentUser.id}@company.com
                        </p>
                        <p style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                            <Buildings style={{ marginRight: 8, color: 'var(--text-muted)' }} />
                            {currentUser.unit}
                        </p>
                        <p style={{ display: 'flex', alignItems: 'center' }}>
                            <Clock style={{ marginRight: 8, color: 'var(--text-muted)' }} />
                            {t('profile_last_access')}: {t('profile_today')} 08:30 AM
                        </p>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-head">
                    <div className="tabs" style={{ border: 'none', background: 'transparent', padding: 0 }}>
                        <button
                            className={`tab ${activeTab === 'INFO' ? 'active' : ''}`}
                            style={{ padding: '0 15px 10px', borderBottomWidth: 3, cursor: 'pointer', background: 'none' }}
                            onClick={() => setActiveTab('INFO')}
                        >
                            {t('profile_tab_info')}
                        </button>
                        <button
                            className={`tab ${activeTab === 'SECURITY' ? 'active' : ''}`}
                            style={{ padding: '0 15px 10px', borderBottomWidth: 3, cursor: 'pointer', background: 'none' }}
                            onClick={() => setActiveTab('SECURITY')}
                        >
                            {t('profile_tab_security')}
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    {activeTab === 'INFO' ? (
                        <div className="animate-fadeIn">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{t('profile_name')}</label>
                                    <input type="text" id="name" value={formData.name} onChange={handleChange} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{t('profile_title')}</label>
                                    <input type="text" id="jobTitle" value={formData.jobTitle} onChange={handleChange} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{t('profile_phone')}</label>
                                    <input type="text" id="phone" value={formData.phone} onChange={handleChange} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{t('profile_location')}</label>
                                    <input type="text" id="location" value={formData.location} onChange={handleChange} />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{t('profile_bio')}</label>
                                    <textarea id="bio" rows={3} value={formData.bio} onChange={handleChange} style={{ resize: 'none' }}></textarea>
                                </div>
                            </div>

                            <h4 style={{ fontSize: 14, marginBottom: 15, borderBottom: '1px solid var(--border)', paddingBottom: 5 }}>{t('profile_regional')}</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{t('profile_lang')}</label>
                                    <select id="language" value={formData.language} onChange={handleChange}>
                                        <option value="Es">Español</option>
                                        <option value="En">Inglés</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{t('profile_timezone')}</label>
                                    <select id="timezone" value={formData.timezone} onChange={handleChange}>
                                        <option value="GMT-5">Bogotá/Lima (GMT-5)</option>
                                        <option value="GMT-6">México (GMT-6)</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ marginTop: 30, textAlign: 'right' }}>
                                <button className="btn btn-ghost" style={{ marginRight: 10 }}>{t('cancel')}</button>
                                <button
                                    className={`btn ${saved ? 'bg-success' : 'btn-primary'}`}
                                    onClick={handleSave}
                                    style={{ color: saved ? 'var(--success)' : 'white' }}
                                >
                                    {saved ? <><Check /> {t('profile_saved')}</> : t('profile_save_btn')}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-fadeIn">
                            {/* --- Security Tab --- */}
                            <div className="flex flex-col gap-6">
                                {/* Change Password */}
                                <div className="p-4 rounded-lg bg-amber-50 border border-amber-100 dark:bg-slate-800 dark:border-slate-700">
                                    <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-4 pb-2 border-b border-amber-200">
                                        <LockKey className="text-amber-600" size={20} />
                                        {t('security_password_title')}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">{t('security_current_pass')}</label>
                                            <input
                                                type="password"
                                                id="current"
                                                value={securityData.current}
                                                onChange={handleSecurityChange}
                                                className="w-full"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">{t('security_new_pass')}</label>
                                            <input
                                                type="password"
                                                id="new"
                                                value={securityData.new}
                                                onChange={handleSecurityChange}
                                                className="w-full"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">{t('security_confirm_pass')}</label>
                                            <input
                                                type="password"
                                                id="confirm"
                                                value={securityData.confirm}
                                                onChange={handleSecurityChange}
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="col-span-2 flex justify-end mt-2">
                                            <button
                                                className={`btn ${securitySaved ? 'bg-success text-white' : 'btn-primary'}`}
                                                onClick={handleSecuritySave}
                                            >
                                                {securitySaved ? <><Check weight="bold" /> {t('profile_saved')}</> : t('security_change_btn')}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Login Activity / 2FA Mock */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-4 rounded-lg bg-white border border-slate-200">
                                        <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-2">
                                            <ShieldCheck className="text-green-600" size={20} />
                                            {t('security_mfa_title')}
                                        </h4>
                                        <p className="text-sm text-slate-500 mb-4">{t('security_mfa_desc')}</p>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <div className="w-10 h-5 bg-slate-200 rounded-full relative">
                                                <div className="w-4 h-4 bg-white rounded-full shadow absolute top-0.5 left-0.5"></div>
                                            </div>
                                            <span className="text-sm font-bold text-slate-600">{t('security_mfa_enable')}</span>
                                        </label>
                                    </div>

                                    <div className="p-4 rounded-lg bg-white border border-slate-200">
                                        <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-2">
                                            <Desktop className="text-blue-600" size={20} />
                                            {t('security_activity_title')}
                                        </h4>
                                        <p className="text-sm text-slate-500 mb-4">{t('security_activity_desc')}</p>
                                        <ul className="space-y-3">
                                            <li className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Desktop size={16} className="text-slate-400" />
                                                    <span className="font-medium text-slate-700">MacBook Pro (This device)</span>
                                                </div>
                                                <span className="text-green-600 text-xs font-bold">{t('profile_active')}</span>
                                            </li>
                                            <li className="flex items-center justify-between text-sm opacity-60">
                                                <div className="flex items-center gap-2">
                                                    <DeviceMobile size={16} className="text-slate-400" />
                                                    <span className="font-medium text-slate-700">iPhone 13</span>
                                                </div>
                                                <span className="text-slate-400 text-xs">2d ago</span>
                                            </li>
                                        </ul>
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
