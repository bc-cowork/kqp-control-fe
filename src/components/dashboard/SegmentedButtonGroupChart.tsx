import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

type SegmentedButtonGroupProps = {
  tabs: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  metric: string; // Add metric prop to determine if it's a percentage
};

// Conditionally style the ToggleButtonGroup based on the metric
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

const StyledToggleButton = styled(ToggleButton, {
  shouldForwardProp: (prop) => prop !== 'metric', // Prevent metric prop from being passed to DOM
})<{ metric: string }>(({ theme, metric }) => {
  const isPercentageMetric = ['cpu', 'memory'].includes(metric);

  return {
    fontSize: 11,
    fontWeight: 400,
    color: isPercentageMetric ? theme.palette.grey[800] : theme.palette.grey[400],
    padding: '2px 8px',
    '&.Mui-selected': {
      backgroundColor: theme.palette.grey[700],
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      color: isPercentageMetric ? '#F0F1F5' : theme.palette.common.white,
      '&:hover': {
        backgroundColor: theme.palette.common.white,
        color: isPercentageMetric ? theme.palette.grey[800] : 'black',
      },
    },
    '&:not(.Mui-selected)': {
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: theme.palette.grey[300],
      },
    },
  };
});

export function SegmentedButtonGroupChart({
  tabs,
  value,
  onChange,
  metric,
}: SegmentedButtonGroupProps) {
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
      sx={{
        backgroundColor: 'black',
      }}
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
