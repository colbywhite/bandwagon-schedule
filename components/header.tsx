import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function Header() {
  return (
    <Box component="header" className="flex flex-row justify-between">
      <div className="h-10 w-10 pointer-events-none relative">
        <CalendarMonthIcon />
      </div>
      <Typography variant="h6" component="p">Bandwagon Schedules</Typography>
    </Box>
  );
}
