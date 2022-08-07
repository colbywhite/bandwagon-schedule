import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Image from 'next/image';
import Link from '@mui/material/Link';
import githubLogo from '../public/github.png';

export default function Footer() {
  return (
    <Box component="footer" className="flex flex-row justify-between">
      <Typography variant="subtitle2" component="p">
        Created by{' '}
        <Link href="https://github.com/colbywhite">Colby M. White</Link>
      </Typography>
      <Link href="https://github.com/colbywhite/nextjs-template">
        <div className="h-5 w-5 pointer-events-none relative">
          <Image src={githubLogo} alt="GitHub logo" layout="fill"/>
        </div>
      </Link>
    </Box>
  );
}
