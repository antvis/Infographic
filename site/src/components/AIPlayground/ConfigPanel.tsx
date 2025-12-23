import Image from 'next/image';
import {useEffect, useState} from 'react';
import {type Language} from '../../utils/i18n';
import {t} from '../../utils/translations';
import {Dialog, DialogContent, DialogTitle} from '../ui/dialog';
import {Select} from '../ui/select';
import {DEFAULT_CONFIG, PROVIDER_OPTIONS} from './constants';
import {fetchModels} from './Service';
import {AIConfig, AIProvider} from './types';

export function ConfigPanel({
  open,
  onClose,
  value,
  savedConfigs,
  onSave,
  lang,
}: {
  open: boolean;
  value: AIConfig;
  savedConfigs: Record<AIProvider, AIConfig>;
  onClose: () => void;
  onSave: (config: AIConfig) => void;
  lang: Language;
}) {
  const [draft, setDraft] = useState<AIConfig>(value);

  const [models, setModels] = useState<string[]>(
    draft.model ? [draft.model] : []
  );
  const [loadingModels, setLoadingModels] = useState(false);
  const isAntv = draft.provider === 'antv';
  const configTexts = t(lang, 'aiPage.config') as any;

  const handlePresetSelect = (next: string) => {
    const provider = next as AIProvider;
    const preset = PROVIDER_OPTIONS.find((item) => item.value === provider);
    if (!preset) return;
    const stored = savedConfigs[provider];
    const baseUrl = (stored && stored.baseUrl) || preset.baseUrl || '';
    const nextConfig: AIConfig =
      stored && stored.provider === provider
        ? {...stored, baseUrl}
        : {
            provider,
            baseUrl,
            model: '',
            apiKey: '',
          };
    setDraft(nextConfig);
    setModels(nextConfig.model ? [nextConfig.model] : []);
  };

  useEffect(() => {
    if (!open) return;
    const safeProvider =
      PROVIDER_OPTIONS.find((item) => item.value === value.provider)?.value ||
      PROVIDER_OPTIONS[0]?.value ||
      DEFAULT_CONFIG.provider;
    const preset = PROVIDER_OPTIONS.find((item) => item.value === safeProvider);
    setDraft({
      provider: safeProvider,
      baseUrl: value.baseUrl || preset?.baseUrl || DEFAULT_CONFIG.baseUrl,
      model: value.model,
      apiKey: value.apiKey,
    });
    setModels(value.model ? [value.model] : []);
  }, [open, value]);

  useEffect(() => {
    if (!open) return;
    if (isAntv || !draft.baseUrl || !draft.apiKey) {
      setModels(draft.model ? [draft.model] : []);
      setLoadingModels(false);
      return;
    }
    let cancelled = false;
    const load = async () => {
      setLoadingModels(true);
      const list = await fetchModels(
        draft.provider,
        draft.baseUrl,
        draft.apiKey
      );
      if (cancelled) return;
      const cached = draft.model ? [draft.model] : [];
      const nextList = list.length ? list : cached;
      setModels(nextList);
      if (!nextList.includes(draft.model) && nextList.length) {
        setDraft((prev) => ({...prev, model: nextList[0]}));
      }
      setLoadingModels(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [draft.provider, draft.baseUrl, draft.apiKey, open, draft.model, isAntv]);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        containerClassName="items-start justify-center pt-14"
        className="w-full max-w-4xl bg-white dark:bg-gray-900 border border-border dark:border-border-dark shadow-2xl rounded-3xl px-10 py-7 overflow-y-auto">
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold text-primary dark:text-primary-dark">
                {configTexts.title}
              </DialogTitle>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2 text-base">
              <label className="block text-sm font-semibold">
                {configTexts.provider}
              </label>
              <Select
                value={draft.provider}
                onValueChange={handlePresetSelect}
                placeholder={
                  PROVIDER_OPTIONS.find((item) => item.value === draft.provider)
                    ?.label || configTexts.providerPlaceholder
                }
                options={PROVIDER_OPTIONS.map((item) => ({
                  value: item.value,
                  label: (
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
                  ),
                }))}>
                {/* fallback to children API when options is empty */}
              </Select>
            </div>

            {isAntv ? (
              <div className="space-y-2 text-base rounded-xl border border-dashed border-border dark:border-border-dark bg-wash dark:bg-wash-dark px-4 py-3">
                <p className="text-sm text-secondary dark:text-secondary-dark">
                  {configTexts.presetNotice}
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2 text-base">
                  <label className="block text-sm font-semibold">
                    {configTexts.baseUrl}
                  </label>
                  <input
                    value={draft.baseUrl}
                    onChange={(e) =>
                      setDraft({...draft, baseUrl: e.target.value})
                    }
                    className="w-full rounded-xl border border-border dark:border-border-dark bg-wash dark:bg-wash-dark px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="https://api.openai.com/v1"
                  />
                </div>

                <div className="space-y-2 text-base">
                  <label className="block text-sm font-semibold">
                    {configTexts.apiKey}
                  </label>
                  <input
                    value={draft.apiKey}
                    onChange={(e) =>
                      setDraft({...draft, apiKey: e.target.value})
                    }
                    className="w-full rounded-xl border border-border dark:border-border-dark bg-wash dark:bg-wash-dark px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="sk-..."
                    type="password"
                  />
                </div>

                <div className="space-y-2 text-base">
                  <label className="block text-sm font-semibold">
                    {configTexts.model}
                  </label>
                  <Select
                    value={draft.model}
                    disabled={loadingModels}
                    placeholder={configTexts.modelPlaceholder}
                    options={(models.length
                      ? models
                      : [draft.model || configTexts.customOption]
                    ).map((item) => ({
                      value: item,
                      label: item,
                    }))}
                    onValueChange={(next) => setDraft({...draft, model: next})}
                  />
                  {loadingModels ? (
                    <p className="text-xs text-secondary dark:text-secondary-dark">
                      {configTexts.fetchingModels}
                    </p>
                  ) : null}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onSave(draft)}
              className="flex-1 py-3 rounded-full bg-link text-white dark:bg-brand-dark font-bold hover:bg-opacity-80 active:scale-[.98] transition shadow-secondary-button-stroke">
              {configTexts.save}
            </button>
            <button
              onClick={() => setDraft(DEFAULT_CONFIG)}
              className="px-4 py-3 rounded-full text-primary dark:text-primary-dark shadow-secondary-button-stroke dark:shadow-secondary-button-stroke-dark hover:bg-gray-40/5 active:bg-gray-40/10 hover:dark:bg-gray-60/5 active:dark:bg-gray-60/10 font-bold">
              {configTexts.reset}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-full text-primary dark:text-primary-dark shadow-secondary-button-stroke dark:shadow-secondary-button-stroke-dark hover:bg-gray-40/5 active:bg-gray-40/10 hover:dark:bg-gray-60/5 active:dark:bg-gray-60/10 font-bold">
              {configTexts.cancel}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
