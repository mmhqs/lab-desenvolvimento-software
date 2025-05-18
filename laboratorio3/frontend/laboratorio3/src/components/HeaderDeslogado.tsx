import { AppBar, Toolbar, Typography } from "@mui/material";

const HeaderDeslogado: React.FC = () => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <a href="http://localhost:5173/" style={{ color: 'white', textDecoration: 'none' }}>Sistema de Moedas</a>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderDeslogado;
