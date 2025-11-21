import Image from 'next/image';
import {useEffect, useMemo, useState} from 'react';
import {Dialog, DialogContent, DialogTitle} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {DEFAULT_CONFIG, PROVIDER_OPTIONS} from './constants';
import {AIConfig} from './types';

export function ConfigPanel({
  open,
  onClose,
  value,
  onSave,
}: {
  open: boolean;
  value: AIConfig;
  onClose: () => void;
  onSave: (config: AIConfig) => void;
}) {
  const [draft, setDraft] = useState<AIConfig>(value);
  const providerPreset = useMemo(
    () => PROVIDER_OPTIONS.find((item) => item.value === draft.provider),
    [draft.provider]
  );

  const handlePresetSelect = (next: string) => {
    const preset = PROVIDER_OPTIONS.find((item) => item.value === next);
    if (!preset) return;
    setDraft((prev) => ({
      provider: preset.value,
      baseUrl: preset.baseUrl,
      model: preset.models[0] || prev.model,
      apiKey: prev.apiKey,
    }));
  };

  useEffect(() => {
    if (open) {
      const safeProvider =
        PROVIDER_OPTIONS.find((item) => item.value === value.provider)?.value ||
        PROVIDER_OPTIONS[0]?.value;
      handlePresetSelect(safeProvider);
      setDraft((prev) => ({...prev, apiKey: value.apiKey}));
    }
  }, [open, value]);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        containerClassName="items-start justify-center pt-14"
        className="w-full max-w-4xl bg-white dark:bg-gray-900 border border-border dark:border-border-dark shadow-2xl rounded-3xl px-10 py-7 overflow-y-auto">
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold text-primary dark:text-primary-dark">
                配置模型服务
              </DialogTitle>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2 text-base">
              <label className="block text-sm font-semibold">提供商</label>
              <Select value={draft.provider} onValueChange={handlePresetSelect}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      PROVIDER_OPTIONS.find(
                        (item) => item.value === draft.provider
                      )?.label || '选择提供商'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {PROVIDER_OPTIONS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      <span className="inline-flex items-center gap-2">
                        {item.logo ? (
                          <Image
                            src={item.logo}
                            alt={item.label}
                            width={16}
                            height={16}
                            className="object-contain"
                          />
                        ) : null}
                        {item.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 text-base">
              <label className="block text-sm font-semibold">Base URL</label>
              <input
                value={draft.baseUrl}
                onChange={(e) => setDraft({...draft, baseUrl: e.target.value})}
                className="w-full rounded-xl border border-border dark:border-border-dark bg-wash dark:bg-wash-dark px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-base"
                placeholder="https://api.openai.com/v1"
              />
            </div>

            <div className="space-y-2 text-base">
              <label className="block text-sm font-semibold">模型</label>
              <Select
                value={draft.model}
                onValueChange={(next) => setDraft({...draft, model: next})}>
                <SelectTrigger>
                  <SelectValue placeholder="选择模型" />
                </SelectTrigger>
                <SelectContent>
                  {(providerPreset?.models?.length
                    ? providerPreset.models
                    : [draft.model || '自定义']
                  ).map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 text-base">
              <label className="block text-sm font-semibold">API Key</label>
              <input
                value={draft.apiKey}
                onChange={(e) => setDraft({...draft, apiKey: e.target.value})}
                className="w-full rounded-xl border border-border dark:border-border-dark bg-wash dark:bg-wash-dark px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-base"
                placeholder="sk-..."
                type="password"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onSave(draft)}
              className="flex-1 py-3 rounded-full bg-link text-white dark:bg-brand-dark font-bold hover:bg-opacity-80 active:scale-[.98] transition shadow-secondary-button-stroke">
              保存配置
            </button>
            <button
              onClick={() => setDraft(DEFAULT_CONFIG)}
              className="px-4 py-3 rounded-full text-primary dark:text-primary-dark shadow-secondary-button-stroke dark:shadow-secondary-button-stroke-dark hover:bg-gray-40/5 active:bg-gray-40/10 hover:dark:bg-gray-60/5 active:dark:bg-gray-60/10 font-bold">
              重置
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-full text-primary dark:text-primary-dark shadow-secondary-button-stroke dark:shadow-secondary-button-stroke-dark hover:bg-gray-40/5 active:bg-gray-40/10 hover:dark:bg-gray-60/5 active:dark:bg-gray-60/10 font-bold">
              取消
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
