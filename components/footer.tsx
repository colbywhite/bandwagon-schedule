import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

export default function Footer({}) {
  return (
    <>
      <Divider sx={{mt: '8px'}}/>
      <Container disableGutters component="footer">
        <Typography variant="overline">Vivamus facilisis suscipit.</Typography>
      </Container>
    </>
  );
}
