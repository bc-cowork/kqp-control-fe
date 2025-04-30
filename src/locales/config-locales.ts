// ----------------------------------------------------------------------

export type LanguageValue = 'en' | 'kr';

export const fallbackLng = 'en';
export const languages = ['en', 'kr'];
export const defaultNS = 'common';
export const cookieName = 'i18next';

// ----------------------------------------------------------------------

export function i18nOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    lng,
    fallbackLng,
    ns,
    defaultNS,
    fallbackNS: defaultNS,
    supportedLngs: languages,
  };
}

// ----------------------------------------------------------------------

export const changeLangMessages: Record<
  LanguageValue,
  { success: string; error: string; loading: string }
> = {
  en: {
    success: 'Language has been changed!',
    error: 'Error changing language!',
    loading: 'Loading...',
  },
  kr: {
    success: '언어가 변경되었습니다!',
    error: '언어 변경 중 오류가 발생했습니다!',
    loading: '로딩 중...',
  },
};
