import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Home } from "react-feather";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const goHome = () => {
    navigate("/home");
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Home
          onClick={() => goHome()}
          style={{ cursor: "pointer " }}
        />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Sistema de moedas
        </Typography>
        {user && (
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body1">Olá, {user.nome}</Typography>
            <Button color="inherit" onClick={handleLogout}>
              Sair
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
