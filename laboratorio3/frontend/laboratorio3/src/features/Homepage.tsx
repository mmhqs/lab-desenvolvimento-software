import { Box, Button, Container, Typography } from "@mui/material";
import {
  CheckCircle,
  Gift,
  Clipboard,
  User,
  Edit,
  UserX,
  UserCheck,
} from "react-feather";
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
          <Typography variant="h5">Gerenciamento de vantagens</Typography>
          <Box display="flex" gap={2} marginBottom={5}>
            {/* Cadastrar vantagem */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/vantagem")}
              style={{ width: "10rem" }}
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                Cadastrar vantagem
                <Gift />
              </Box>
            </Button>

            {/* Resgatar vantagem */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/vantagem/resgate")}
              style={{ width: "10rem" }}
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                Resgatar vantagem
                <CheckCircle />
              </Box>
            </Button>

            {/* Ver extrato */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/extrato")}
              style={{ width: "10rem" }}
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                Ver extrato
                <Clipboard />
              </Box>
            </Button>
          </Box>

          <Typography variant="h5">Gerenciamento de usuário</Typography>
          <Box display="flex" gap={2}>
            {/* Consultar usuário */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/usuario/consulta")}
              style={{ width: "10rem" }}
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                Consultar usuário
                <UserCheck />
              </Box>
            </Button>
            
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Homepage;
