import { useEffect, useState } from 'react';

/**
 * Hook that resolves the most suitable Japanese voice for the Web Speech API.
 * It picks a voice whose language starts with "ja" and prefers well‑known
 * high‑quality voices (Google, Microsoft Haruka/Ayumi, etc.).
 *
 * Returns `null` when no Japanese voice is available – callers should still
 * set `lang = 'ja-JP'` so the browser can fallback to any generic Japanese
 * voice.
 */
export const useJapaneseVoice = (): SpeechSynthesisVoice | null => {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const load = () => {
      const candidates = speechSynthesis
        .getVoices()
        .filter(v => v.lang.toLowerCase().startsWith('ja'));

      if (candidates.length === 0) {
        setVoice(null);
        return;
      }

      // Prefer known high‑quality voices (case‑insensitive match)
      const preferred = candidates.find(v =>
        /google|haruka|ayumi|reina|takumi|maiko|shiori|nazuna/i.test(v.name)
      );
      setVoice(preferred ?? candidates[0]);
    };

    // In many browsers voices may not be loaded immediately.
    // If they are already available, load straight away.
    if (speechSynthesis.getVoices().length) {
      load();
    }
    speechSynthesis.addEventListener('voiceschanged', load);
    return () => speechSynthesis.removeEventListener('voiceschanged', load);
  }, []);

  return voice;
};
