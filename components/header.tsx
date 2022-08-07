import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Image from 'next/image';
import nextLogo from '../public/nextjs.svg';

export default function Header() {
  return (
    <Box component="header" className="flex flex-row justify-between">
      <div className="h-10 w-10 pointer-events-none relative">
        <Image src={nextLogo} alt="Next.js logo" layout="fill"/>
      </div>
      <Typography variant="h6" component="p">Next.js Template</Typography>
    </Box>
  );
}
