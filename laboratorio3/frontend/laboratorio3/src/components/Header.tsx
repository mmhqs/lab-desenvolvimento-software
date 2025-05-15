import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { LogOut } from 'react-feather';

const Header = () => {
  return (
    <AppBar position="fixed">
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Espaço para alinhar ao centro com flexGrow */}
        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
          <Typography variant="h6" component="div">
            Sistema de moedas e vantagens
          </Typography>
        </Box>

        {/* Botão à direita */}
        <Button
          variant="contained"
          color="primary"
          sx={{ ml: 'auto' }} // empurra para a direita
        >
          <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
            Logout
            <LogOut size={18} />
          </Box>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
