import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// TODO: use raw svg as opposed to @mui/icons-material for more control
export default function Header() {
  return (
    <Box component="header" className="flex flex-row justify-between items-center">
      <div className="h-10 w-10 pointer-events-none relative">
        <CalendarMonthIcon className="m-auto block" fontSize="large"/>
      </div>
      <Typography variant="h6" component="p">Bandwagon Schedules</Typography>
    </Box>
  );
}
