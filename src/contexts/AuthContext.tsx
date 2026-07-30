// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import { LoginRequest, CreateUserRequest, User } from '@/types/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  signUp: (data: CreateUserRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Carregar dados do usuário ao inicializar
  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      const savedUser = authService.getUserData();

      if (token && savedUser) {
        setUser(savedUser);
        
        // Tentar buscar dados atualizados do usuário
        try {
          const userData = await userService.getById(savedUser.id);
          setUser(userData);
          authService.saveUserData(userData);
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
          // Se falhar, mantém os dados salvos
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      // Buscar dados completos do usuário
      // Como o backend não retorna o ID do usuário no login,
      // vamos buscar pela lista de usuários (temporário)
      try {
        const users = await userService.getAll();
        const currentUser = users.find(u => u.email === credentials.email);
        
        if (currentUser) {
          setUser(currentUser);
          authService.saveUserData(currentUser);
        } else {
          // Fallback: criar um objeto básico de usuário
          const basicUser: User = {
            id: 0,
            name: '',
            email: credentials.email,
          };
          setUser(basicUser);
          authService.saveUserData(basicUser);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
      
      toast.success('Login realizado com sucesso!');
      navigate('/home');
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: CreateUserRequest) => {
    try {
      setIsLoading(true);
      await authService.signUp(data);
      
      toast.success('Conta criada com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    authService.clearUserData();
    localStorage.removeItem('userSubscription');
    setUser(null);
    toast.info('Você foi desconectado');
    navigate('/login');
  };

  const refreshUser = async () => {
    if (!user) return;

    try {
      const userData = await userService.getById(user.id);
      setUser(userData);
      authService.saveUserData(userData);
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signUp,
        logout,
        refreshUser,
      }}
    >
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
