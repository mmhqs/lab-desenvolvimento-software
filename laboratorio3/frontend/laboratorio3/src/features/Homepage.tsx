import { Box, Button, Container, Typography } from "@mui/material";
import { CheckCircle, Gift, Clipboard, UserCheck, DollarSign } from "react-feather";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const { perfil } = useAuth();

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
            {/* Cadastrar vantagem (empresa) */}
            {perfil.cnpj && (
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
            )}
            {/* Resgatar vantagem e ver extrato (aluno) */}
            {perfil.cpf && (
              <>
                {!perfil.departamento && (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate("/vantagem/resgate")}
                      style={{ width: "10rem" }}
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                      >
                        Resgatar vantagem
                        <CheckCircle />
                      </Box>
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate("/extrato-aluno")}
                      style={{ width: "10rem" }}
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                      >
                        Consultar extrato (aluno)
                        <Clipboard />
                      </Box>
                    </Button>
                  </>
                )}

                {perfil.departamento && (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate("/professor/extrato")}
                      style={{ width: "10rem" }}
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                      >
                        Consultar extrato (professor)
                        <Clipboard />
                      </Box>
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate("/professor/envio-moedas")}
                      style={{ width: "10rem" }}
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                      >
                        Enviar moedas
                        <DollarSign />
                      </Box>
                    </Button>
                  </>
                )}
              </>
            )}
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
