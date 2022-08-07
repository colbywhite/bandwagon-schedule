import Toolbar from '@mui/material/Toolbar';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

interface FullCrumb {
  href?: string;
  label: string;
}

export type Crumb = string | FullCrumb;

function isFullCrumb(crumb: Crumb): crumb is FullCrumb {
  return typeof crumb !== 'string';
}

export default function Header(props: { extraCrumbs?: Crumb[] }) {
  const crumbComps = (props.extraCrumbs || [] as Crumb[])
    .map(crumb => isFullCrumb(crumb)
      ? <Link key={crumb.label} href={crumb.href}>{crumb.label}</Link>
      : <Typography key={crumb}>{crumb}</Typography>
    );
  // TODO use theming to unset the toolbar's min-height
  return (
    <>
      <Toolbar disableGutters component="header">
        <Breadcrumbs sx={{flexGrow: 1}}>
          <Link color="inherit" href="/">Lorem Ipsum</Link>
          {crumbComps}
        </Breadcrumbs>
      </Toolbar>
      <Divider/>
    </>
  );
}

