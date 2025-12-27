'use client';

import { useState, useEffect } from 'react';
import {
  X,
  CloudArrowUp,
  CaretRight,
  CaretLeft,
  CheckCircle,
  Warning,
  ArrowSquareOut,
  SpinnerGap,
  Gear,
  Shield,
  Check,
  Eye,
  EyeSlash,
  GoogleDriveLogo,
  DropboxLogo,
  MicrosoftOutlookLogo,
  AmazonLogo,
  HardDrives,
  FloppyDisk
} from '@phosphor-icons/react';
import { storageProviderPresets, getStorageProviderPreset, StorageProviderPreset } from '@/lib/config/storageProviderPresets';

interface StorageSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (config: StorageConfigData) => void;
  existingConfig?: StorageConfigData | null;
}

export interface StorageConfigData {
  provider: string;
  config: Record<string, any>;
  enabled: boolean;
}

type WizardStep = 'provider' | 'instructions' | 'credentials' | 'verify' | 'review';

const STEPS: { id: WizardStep; label: string; icon: React.ReactNode }[] = [
  { id: 'provider', label: 'Proveedor', icon: <CloudArrowUp weight="bold" /> },
  { id: 'instructions', label: 'Instrucciones', icon: <Shield weight="bold" /> },
  { id: 'credentials', label: 'Credenciales', icon: <Gear weight="bold" /> },
  { id: 'verify', label: 'Verificar', icon: <CheckCircle weight="bold" /> },
  { id: 'review', label: 'Guardar', icon: <FloppyDisk weight="bold" /> },
];

const getProviderIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    'GoogleDriveLogo': GoogleDriveLogo,
    'DropboxLogo': DropboxLogo,
    'MicrosoftOutlookLogo': MicrosoftOutlookLogo,
    'AmazonLogo': AmazonLogo,
    'HardDrives': HardDrives,
  };
  return icons[iconName] || CloudArrowUp;
};

export default function StorageSetupWizard({
  isOpen,
  onClose,
  onComplete,
  existingConfig
}: StorageSetupWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('provider');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [config, setConfig] = useState<Record<string, any>>({});
  const [showSecrets, setShowSecrets] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (existingConfig) {
      setSelectedProvider(existingConfig.provider);
      setConfig(existingConfig.config || {});
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
    setConfig({});
    setVerificationResult(null);
  };

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
  const preset = getStorageProviderPreset(selectedProvider);

  const canProceed = () => {
    switch (currentStep) {
      case 'provider':
        return selectedProvider !== '';
      case 'instructions':
        return true;
      case 'credentials':
        if (!preset) return false;
        return preset.fields.filter(f => f.required).every(f => config[f.id]);
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
      const response = await fetch('/api/admin/storage-config/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          config,
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
      const response = await fetch('/api/admin/storage-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          config,
          enabled: true,
        }),
      });

      if (response.ok) {
        onComplete({
          provider: selectedProvider,
          config,
          enabled: true,
        });
        onClose();
      }
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderFieldInput = (field: StorageProviderPreset['fields'][0]) => {
    const commonClasses = "w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none";

    if (field.type === 'select' && field.options) {
      return (
        <select
          value={config[field.id] || ''}
          onChange={(e) => setConfig(prev => ({ ...prev, [field.id]: e.target.value }))}
          className={commonClasses}
        >
          <option value="">Seleccionar...</option>
          {field.options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    }

    if (field.type === 'password') {
      return (
        <div className="relative">
          <input
            type={showSecrets ? 'text' : 'password'}
            value={config[field.id] || ''}
            onChange={(e) => setConfig(prev => ({ ...prev, [field.id]: e.target.value }))}
            placeholder={field.placeholder}
            className={`${commonClasses} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowSecrets(!showSecrets)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            {showSecrets ? <EyeSlash size={20} /> : <Eye size={20} />}
          </button>
        </div>
      );
    }

    return (
      <input
        type={field.type}
        value={config[field.id] || ''}
        onChange={(e) => setConfig(prev => ({ ...prev, [field.id]: field.type === 'number' ? parseInt(e.target.value) || '' : e.target.value }))}
        placeholder={field.placeholder}
        className={commonClasses}
      />
    );
  };

  if (!isOpen) return null;

  const ProviderIcon = preset ? getProviderIcon(preset.icon) : CloudArrowUp;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-700">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <CloudArrowUp className="w-5 h-5 text-blue-400" weight="bold" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Configurar Almacenamiento</h2>
              <p className="text-sm text-slate-400">Asistente de configuración</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/50 border-b border-slate-700 overflow-x-auto">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-shrink-0">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${currentStep === step.id
                  ? 'bg-blue-500/20 text-blue-400'
                  : index < currentStepIndex
                    ? 'text-green-400'
                    : 'text-slate-500'
                }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index < currentStepIndex
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
                Selecciona el proveedor de almacenamiento para guardar los documentos del sistema:
              </p>
              <div className="grid gap-3">
                {storageProviderPresets.map(provider => {
                  const Icon = getProviderIcon(provider.icon);
                  return (
                    <button
                      key={provider.id}
                      onClick={() => handleProviderSelect(provider.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${selectedProvider === provider.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                        }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedProvider === provider.id ? 'bg-blue-500/20' : 'bg-slate-700'
                        }`}>
                        <Icon className={`w-6 h-6 ${selectedProvider === provider.id ? 'text-blue-400' : 'text-slate-400'
                          }`} weight="fill" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{provider.label}</h3>
                        <p className="text-sm text-slate-400">{provider.description}</p>
                      </div>
                      {selectedProvider === provider.id && (
                        <CheckCircle className="w-6 h-6 text-blue-400" weight="fill" />
                      )}
                    </button>
                  );
                })}
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
            </div>
          )}

          {currentStep === 'credentials' && preset && (
            <div className="space-y-5">
              <p className="text-slate-300 mb-4">
                Ingresa las credenciales para {preset.label}:
              </p>

              {preset.fields.map(field => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {field.label}
                    {!field.required && <span className="text-slate-500 ml-2">(Opcional)</span>}
                  </label>
                  {renderFieldInput(field)}
                  {field.hint && (
                    <p className="text-xs text-slate-500 mt-1">{field.hint}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {currentStep === 'verify' && preset && (
            <div className="space-y-6">
              <p className="text-slate-300">
                Verifica que la configuración es correcta probando la conexión:
              </p>

              <div className="bg-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Proveedor:</span>
                  <span className="text-white font-medium">{preset.label}</span>
                </div>
                {preset.fields.filter(f => f.type !== 'password' && config[f.id]).map(field => (
                  <div key={field.id} className="flex justify-between text-sm">
                    <span className="text-slate-400">{field.label}:</span>
                    <span className="text-white font-mono text-xs truncate max-w-[200px]">{config[field.id]}</span>
                  </div>
                ))}
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
                    <CloudArrowUp className="w-5 h-5" weight="bold" />
                    Probar Conexión
                  </>
                )}
              </button>

              {verificationResult && (
                <div className={`rounded-xl p-4 flex items-start gap-3 ${verificationResult.success
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
                        Verifica que las credenciales sean correctas y que el servicio esté accesible.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 'review' && preset && (
            <div className="space-y-6">
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" weight="fill" />
                <div>
                  <h3 className="font-medium text-green-400">Configuración verificada</h3>
                  <p className="text-sm text-green-300/80 mt-1">
                    La conexión funciona correctamente. Puedes guardar la configuración.
                  </p>
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl divide-y divide-slate-700">
                <div className="p-4 flex justify-between items-center">
                  <span className="text-slate-400">Proveedor</span>
                  <div className="flex items-center gap-2">
                    <ProviderIcon className="w-5 h-5 text-blue-400" weight="fill" />
                    <span className="text-white font-medium">{preset.label}</span>
                  </div>
                </div>
                {preset.fields.filter(f => f.type !== 'password' && config[f.id]).map(field => (
                  <div key={field.id} className="p-4 flex justify-between">
                    <span className="text-slate-400">{field.label}</span>
                    <span className="text-white font-mono text-sm truncate max-w-[200px]">{config[field.id]}</span>
                  </div>
                ))}
                <div className="p-4 flex justify-between">
                  <span className="text-slate-400">Estado</span>
                  <span className="text-green-400 font-medium">Habilitado</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-slate-700 bg-slate-800/50">
          <button
            onClick={goPrevious}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CaretLeft className="w-4 h-4" />
            Anterior
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
                  <FloppyDisk className="w-5 h-5" weight="bold" />
                  Guardar Configuración
                </>
              )}
            </button>
          ) : (
            <button
              onClick={goNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
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
