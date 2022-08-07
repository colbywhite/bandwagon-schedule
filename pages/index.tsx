import type {NextPage} from 'next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Image from 'next/image';
import nextLogo from '../public/nextjs.svg';
import githubLogo from '../public/github.png';
import Link from '@mui/material/Link';

function Header() {
  return (
    <Box component="header" className="flex flex-row justify-between">
      <div className="h-10 w-10 pointer-events-none relative">
        <Image src={nextLogo} alt="Next.js logo" layout="fill"/>
      </div>
      <Typography variant="h6" component="p">Next.js Template</Typography>
    </Box>
  );
}

function Footer() {
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


const Home: NextPage = () => {
  return (
    <Container className="max-w-xl flex flex-col justify-around gap-10 py-2">
      <Header/>
      <Container component="main" className="flex flex-col gap-5 justify-between">
        <Typography variant="body1">
          This is a starting template for a <code>create-next-app</code> project with what I consider a sane set of
          starting settings.
        </Typography>
        <ul className="list-disc">
          <li>The basic &quot;Hello, World&quot; page you&apos;re looking at now</li>
          <li><code>material-ui</code> components</li>
          <li>A two-color theme:&nbsp;
            <Chip color="primary" label="primary"></Chip>
            &nbsp;
            <Chip color="secondary" label="secondary"></Chip>
          </li>
          <li>CSS reset via <code>CssBaseline</code></li>
          <li><code>tailwindcss</code></li>
          <li>Simple header/footer layout</li>
          <li>Image usage</li>
        </ul>
      </Container>
      <Footer/>
    </Container>
  );
};

export default Home;
