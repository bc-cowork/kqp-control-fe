import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { T } from 'src/theme/tokens';

type SegmentedButtonGroupProps = {
  tabs: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  metric: string; // Add metric prop to determine if it's a percentage
};

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(() => ({
  borderRadius: '6px',
  backgroundColor: T.bg,
  border: `1px solid ${T.border}`,
  padding: 2,
  '& .MuiToggleButtonGroup-grouped': {
    margin: 0,
    border: 0,
    borderRadius: '4px',
    '&:not(:first-of-type)': {
      borderLeft: 0,
    },
  },
}));

const StyledToggleButton = styled(ToggleButton, {
  shouldForwardProp: (prop) => prop !== 'metric',
})<{ metric: string }>(() => ({
  fontSize: 11,
  fontWeight: 400,
  color: T.textDim,
  padding: '2px 8px',
  '&.Mui-selected': {
    backgroundColor: T.bgHover,
    color: T.textPrim,
    '&:hover': {
      backgroundColor: T.bgHover,
    },
  },
  '&:not(.Mui-selected)': {
    backgroundColor: 'transparent',
    color: T.textDim,
    '&:hover': {
      backgroundColor: 'transparent',
      color: T.textSec,
    },
  },
}));

export function SegmentedButtonGroupChart({
  tabs,
  value,
  onChange,
  metric,
}: SegmentedButtonGroupProps) {
  const handleChange = (event: any, newValue: any) => {
    if (newValue !== null) {
      onChange(newValue);
    }
  };

  return (
    <StyledToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      aria-label="segmented button group"
    >
      {tabs.map((tab) => (
        <StyledToggleButton
          key={tab.value}
          value={tab.value}
          aria-label={`${tab.value} option`}
          metric={metric}
        >
          {tab.label}
        </StyledToggleButton>
      ))}
    </StyledToggleButtonGroup>
  );
}
