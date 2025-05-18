import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

type User = {
  id: number;
  nome: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  tipo: string | null;
  perfil: any | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tipo, setTipo] = useState<string | null>(null);
  const [perfil, setPerfil] = useState<any | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedTipo = localStorage.getItem('tipo');
    const storedPerfil = localStorage.getItem('perfil');

    if (storedUser && storedTipo && storedPerfil) {
      setUser(JSON.parse(storedUser));
      setTipo(storedTipo);
      setPerfil(JSON.parse(storedPerfil));
    }
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      const response = await axios.post('http://localhost:3001/usuario/login', {
        email,
        senha
      });

      const { usuario, tipo, perfil } = response.data;

      setUser(usuario);
      setTipo(tipo);
      setPerfil(perfil);

      localStorage.setItem('user', JSON.stringify(usuario));
      localStorage.setItem('tipo', tipo);
      localStorage.setItem('perfil', JSON.stringify(perfil));
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setTipo(null);
    setPerfil(null);
    localStorage.removeItem('user');
    localStorage.removeItem('tipo');
    localStorage.removeItem('perfil');
  };

  return (
    <AuthContext.Provider value={{ user, tipo, perfil, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 