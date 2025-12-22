'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  Envelope, 
  CaretRight, 
  CaretLeft, 
  CheckCircle, 
  Warning,
  Copy,
  ArrowSquareOut,
  SpinnerGap,
  Gear,
  PaperPlaneTilt,
  Shield,
  Check
} from '@phosphor-icons/react';
import { emailProviderPresets, ProviderPreset, getProviderPreset } from '@/lib/config/emailProviderPresets';

interface EmailSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (config: EmailConfigData) => void;
  existingConfig?: EmailConfigData | null;
  tenantId: string;
}

interface EmailConfigData {
  provider: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
}

type WizardStep = 'provider' | 'instructions' | 'credentials' | 'verify' | 'review';

const STEPS: { id: WizardStep; label: string; icon: React.ReactNode }[] = [
  { id: 'provider', label: 'Proveedor', icon: <Envelope weight="bold" /> },
  { id: 'instructions', label: 'Instrucciones', icon: <Shield weight="bold" /> },
  { id: 'credentials', label: 'Credenciales', icon: <Gear weight="bold" /> },
  { id: 'verify', label: 'Verificar', icon: <CheckCircle weight="bold" /> },
  { id: 'review', label: 'Guardar', icon: <PaperPlaneTilt weight="bold" /> },
];

export default function EmailSetupWizard({ 
  isOpen, 
  onClose, 
  onComplete,
  existingConfig,
  tenantId 
}: EmailSetupWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('provider');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [config, setConfig] = useState<EmailConfigData>({
    provider: '',
    smtpHost: '',
    smtpPort: 587,
    smtpSecure: false,
    smtpUser: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: '',
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    if (existingConfig) {
      setConfig(existingConfig);
      setSelectedProvider(existingConfig.provider || 'custom');
    }
  }, [existingConfig]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep('provider');
      setVerificationResult(null);
    }
  }, [isOpen]);

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    const preset = getProviderPreset(providerId);
    if (preset) {
      setConfig(prev => ({
        ...prev,
        provider: providerId,
        smtpHost: preset.defaults.host,
        smtpPort: preset.defaults.port,
        smtpSecure: preset.defaults.secure,
      }));
      if (preset.regions && preset.regions.length > 0) {
        setSelectedRegion(preset.regions[0].id);
      }
    }
  };

  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(regionId);
    const preset = getProviderPreset(selectedProvider);
    const region = preset?.regions?.find(r => r.id === regionId);
    if (region) {
      setConfig(prev => ({
        ...prev,
        smtpHost: region.host,
      }));
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
  const preset = getProviderPreset(selectedProvider);

  const canProceed = () => {
    switch (currentStep) {
      case 'provider':
        return selectedProvider !== '';
      case 'instructions':
        return true;
      case 'credentials':
        return config.smtpHost && config.smtpPort && config.smtpUser && config.smtpPassword && config.fromEmail && config.fromName;
      case 'verify':
        return verificationResult?.success === true;
      case 'review':
        return true;
      default:
        return false;
    }
  };

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].id);
    }
  };

  const goPrevious = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id);
      setVerificationResult(null);
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerificationResult(null);
    
    try {
      const response = await fetch('/api/admin/email-config/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          smtpHost: config.smtpHost,
          smtpPort: config.smtpPort,
          smtpSecure: config.smtpSecure,
          smtpUser: config.smtpUser,
          smtpPassword: config.smtpPassword,
          fromEmail: config.fromEmail,
          fromName: config.fromName,
          isDraft: true,
        }),
      });
      
      const data = await response.json();
      setVerificationResult({
        success: data.success,
        message: data.success ? 'Conexión verificada correctamente' : (data.error || 'Error de conexión'),
      });
    } catch (error) {
      setVerificationResult({
        success: false,
        message: 'Error al verificar la conexión',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/email-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          provider: config.provider,
          smtpHost: config.smtpHost,
          smtpPort: config.smtpPort,
          smtpSecure: config.smtpSecure,
          smtpUser: config.smtpUser,
          smtpPassword: config.smtpPassword,
          fromEmail: config.fromEmail,
          fromName: config.fromName,
          isActive: true,
        }),
      });
      
      if (response.ok) {
        onComplete(config);
        onClose();
      }
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-700">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Envelope className="w-5 h-5 text-blue-400" weight="bold" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Configurar Correo Saliente</h2>
              <p className="text-sm text-slate-400">Asistente de configuración</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/50 border-b border-slate-700">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                currentStep === step.id 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : index < currentStepIndex 
                    ? 'text-green-400' 
                    : 'text-slate-500'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index < currentStepIndex 
                    ? 'bg-green-500/20' 
                    : currentStep === step.id 
                      ? 'bg-blue-500/30' 
                      : 'bg-slate-700'
                }`}>
                  {index < currentStepIndex ? <Check weight="bold" className="w-4 h-4" /> : index + 1}
                </div>
                <span className="hidden sm:inline text-sm font-medium">{step.label}</span>
              </div>
              {index < STEPS.length - 1 && (
                <CaretRight className="w-4 h-4 text-slate-600 mx-2" />
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 'provider' && (
            <div className="space-y-4">
              <p className="text-slate-300 mb-6">
                Selecciona tu proveedor de correo electrónico para autoconfigurar los ajustes SMTP:
              </p>
              <div className="grid gap-3">
                {emailProviderPresets.map(provider => (
                  <button
                    key={provider.id}
                    onClick={() => handleProviderSelect(provider.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                      selectedProvider === provider.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      selectedProvider === provider.id ? 'bg-blue-500/20' : 'bg-slate-700'
                    }`}>
                      <Envelope className={`w-6 h-6 ${
                        selectedProvider === provider.id ? 'text-blue-400' : 'text-slate-400'
                      }`} weight="bold" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{provider.label}</h3>
                      <p className="text-sm text-slate-400">
                        {provider.id === 'custom' ? 'Configura tu propio servidor SMTP' : `Puerto ${provider.defaults.port} - ${provider.defaults.host}`}
                      </p>
                    </div>
                    {selectedProvider === provider.id && (
                      <CheckCircle className="w-6 h-6 text-blue-400" weight="fill" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'instructions' && preset && (
            <div className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">{preset.instructions.title}</h3>
                <ol className="space-y-3">
                  {preset.instructions.steps.map((step, index) => (
                    <li key={index} className="flex gap-3 text-slate-300">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-sm font-bold text-blue-400">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {preset.instructions.warning && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex gap-3">
                  <Warning className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" weight="fill" />
                  <p className="text-amber-200 text-sm">{preset.instructions.warning}</p>
                </div>
              )}

              {preset.instructions.links.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-400">Enlaces útiles:</h4>
                  <div className="flex flex-wrap gap-2">
                    {preset.instructions.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-blue-400 transition-colors"
                      >
                        <ArrowSquareOut className="w-4 h-4" />
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {preset.regions && preset.regions.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Región del servidor:</label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => handleRegionChange(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  >
                    {preset.regions.map(region => (
                      <option key={region.id} value={region.id}>{region.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {currentStep === 'credentials' && (
            <div className="space-y-5">
              <p className="text-slate-300 mb-4">
                Ingresa tus credenciales SMTP{preset ? ` para ${preset.label}` : ''}:
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Servidor SMTP</label>
                  <input
                    type="text"
                    value={config.smtpHost}
                    onChange={(e) => setConfig(prev => ({ ...prev, smtpHost: e.target.value }))}
                    placeholder="smtp.ejemplo.com"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Puerto</label>
                  <input
                    type="number"
                    value={config.smtpPort}
                    onChange={(e) => setConfig(prev => ({ ...prev, smtpPort: parseInt(e.target.value) || 587 }))}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Usuario SMTP
                  {preset && <span className="text-slate-500 ml-2">(ej: {preset.userHint})</span>}
                </label>
                <input
                  type="text"
                  value={config.smtpUser}
                  onChange={(e) => setConfig(prev => ({ ...prev, smtpUser: e.target.value }))}
                  placeholder={preset?.userHint || 'usuario@ejemplo.com'}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Contraseña SMTP</label>
                <input
                  type="password"
                  value={config.smtpPassword}
                  onChange={(e) => setConfig(prev => ({ ...prev, smtpPassword: e.target.value }))}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="border-t border-slate-700 pt-5">
                <h4 className="text-sm font-medium text-slate-300 mb-4">Remitente de correos</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Nombre del remitente</label>
                    <input
                      type="text"
                      value={config.fromName}
                      onChange={(e) => setConfig(prev => ({ ...prev, fromName: e.target.value }))}
                      placeholder="Mi Empresa"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email del remitente</label>
                    <input
                      type="email"
                      value={config.fromEmail}
                      onChange={(e) => setConfig(prev => ({ ...prev, fromEmail: e.target.value }))}
                      placeholder="noreply@miempresa.com"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="smtpSecure"
                  checked={config.smtpSecure}
                  onChange={(e) => setConfig(prev => ({ ...prev, smtpSecure: e.target.checked }))}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="smtpSecure" className="text-sm text-slate-300">
                  Usar conexión SSL/TLS directa (puerto 465)
                </label>
              </div>
            </div>
          )}

          {currentStep === 'verify' && (
            <div className="space-y-6">
              <p className="text-slate-300">
                Verifica que la configuración es correcta probando la conexión SMTP:
              </p>

              <div className="bg-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Servidor:</span>
                  <span className="text-white font-mono">{config.smtpHost}:{config.smtpPort}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Usuario:</span>
                  <span className="text-white font-mono">{config.smtpUser}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Remitente:</span>
                  <span className="text-white">{config.fromName} &lt;{config.fromEmail}&gt;</span>
                </div>
              </div>

              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-xl transition-colors"
              >
                {isVerifying ? (
                  <>
                    <SpinnerGap className="w-5 h-5 animate-spin" />
                    Verificando conexión...
                  </>
                ) : (
                  <>
                    <PaperPlaneTilt className="w-5 h-5" weight="bold" />
                    Probar Conexión
                  </>
                )}
              </button>

              {verificationResult && (
                <div className={`rounded-xl p-4 flex items-start gap-3 ${
                  verificationResult.success 
                    ? 'bg-green-500/10 border border-green-500/30' 
                    : 'bg-red-500/10 border border-red-500/30'
                }`}>
                  {verificationResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" weight="fill" />
                  ) : (
                    <Warning className="w-5 h-5 text-red-400 flex-shrink-0" weight="fill" />
                  )}
                  <div>
                    <p className={verificationResult.success ? 'text-green-300' : 'text-red-300'}>
                      {verificationResult.message}
                    </p>
                    {!verificationResult.success && (
                      <p className="text-sm text-slate-400 mt-2">
                        Verifica que las credenciales sean correctas y que el servidor SMTP esté accesible.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 'review' && (
            <div className="space-y-6">
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" weight="fill" />
                <div>
                  <h3 className="font-medium text-green-400">Configuración verificada</h3>
                  <p className="text-sm text-green-300/80 mt-1">
                    La conexión SMTP funciona correctamente. Puedes guardar la configuración.
                  </p>
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl divide-y divide-slate-700">
                <div className="p-4 flex justify-between">
                  <span className="text-slate-400">Proveedor</span>
                  <span className="text-white font-medium">{preset?.label || 'Personalizado'}</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-slate-400">Servidor SMTP</span>
                  <span className="text-white font-mono text-sm">{config.smtpHost}:{config.smtpPort}</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-slate-400">Remitente</span>
                  <span className="text-white">{config.fromName} &lt;{config.fromEmail}&gt;</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-slate-400">Conexión segura</span>
                  <span className="text-white">{config.smtpSecure ? 'SSL/TLS' : 'STARTTLS'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-slate-700 bg-slate-800/50">
          <button
            onClick={currentStepIndex === 0 ? onClose : goPrevious}
            className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white transition-colors"
          >
            <CaretLeft className="w-4 h-4" />
            {currentStepIndex === 0 ? 'Cancelar' : 'Anterior'}
          </button>

          {currentStep === 'review' ? (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white font-medium rounded-xl transition-colors"
            >
              {isSaving ? (
                <>
                  <SpinnerGap className="w-5 h-5 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" weight="bold" />
                  Guardar Configuración
                </>
              )}
            </button>
          ) : (
            <button
              onClick={goNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-xl transition-colors"
            >
              Siguiente
              <CaretRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
