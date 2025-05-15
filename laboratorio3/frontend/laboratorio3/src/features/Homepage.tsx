import { Box, Button, Container, Typography } from "@mui/material";
import { CheckCircle, Gift, Clipboard } from "react-feather";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const Homepage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Header */}
      <Header />

      {/* Menu Centralizado */}
      <Container>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="80vh"
        >
          <Typography variant="h4" gutterBottom>
            Bem-vindo à Homepage!
          </Typography>
          <Box display="flex" gap={2}>
            <Button variant="contained" color="primary" onClick={() => navigate('/vantagem')}>
              <Box display="flex" flexDirection="column" alignItems="center">
                Cadastrar vantagem
                <Gift />
              </Box>
            </Button>
            <Button variant="contained" color="primary" onClick={() => navigate('/vantagem/resgate')}>
              <Box display="flex" flexDirection="column" alignItems="center">
                Resgatar vantagem
                <CheckCircle />
              </Box>
            </Button>
            <Button variant="contained" color="primary" onClick={() => navigate('/extrato')}>
              <Box display="flex" flexDirection="column" alignItems="center">
                Ver extrato
                <Clipboard />
              </Box>
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Homepage;
