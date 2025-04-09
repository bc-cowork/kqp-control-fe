import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  borderRadius: '6px',
  backgroundColor: theme.palette.grey[200],
  padding: 0,
  '& .MuiToggleButtonGroup-grouped': {
    margin: 0.5,
    border: 0,
    borderRadius: '6px',
    '&:not(:first-of-type)': {
      borderLeft: 0,
    },
  },
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  fontSize: 11,
  fontWeight: 400,
  color: theme.palette.grey[400],
  padding: '2px 8px',
  '&.Mui-selected': {
    backgroundColor: theme.palette.common.white,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
  },
  '&:not(.Mui-selected)': {
    backgroundColor: theme.palette.grey[200],
    '&:hover': {
      backgroundColor: theme.palette.grey[300],
    },
  },
}));

type SegmentedButtonGroupProps = {
  tabs: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
};

export function SegmentedButtonGroupChart({ tabs, value, onChange }: SegmentedButtonGroupProps) {
  const handleChange = (event: any, newValue: any) => {
    if (newValue !== null) {
      onChange(newValue); // Pass the selected value to the parent
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
        <StyledToggleButton key={tab.value} value={tab.value} aria-label={`${tab.value} option`}>
          {tab.label}
        </StyledToggleButton>
      ))}
    </StyledToggleButtonGroup>
  );
}
