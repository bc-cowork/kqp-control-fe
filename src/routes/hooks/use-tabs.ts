import { useMemo, useState, useCallback } from 'react';

// ----------------------------------------------------------------------

export type UseTabsReturn = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  onChange: (newValue: string) => void;
};

export function useTabs(defaultValue: string): UseTabsReturn {
  const [value, setValue] = useState(defaultValue);

  const onChange = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  const memoizedValue = useMemo(() => ({ value, setValue, onChange }), [onChange, value]);

  return memoizedValue;
}
