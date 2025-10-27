import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Mail, Lock, User, ArrowRight, CheckCircle2, Phone, Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement authentication logic
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    navigate("/");
  };

  const passwordStrength = password.length >= 8 ? 'strong' : password.length >= 5 ? 'medium' : 'weak';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-chart-3 via-chart-2 to-chart-1 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-chart-3 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-chart-1 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-chart-2 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-10"></div>
      
      <Card className="w-full max-w-md backdrop-blur-2xl bg-card/90 border-white/30 shadow-2xl animate-scale-in relative z-10">
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-chart-3 to-chart-2 rounded-full flex items-center justify-center mx-auto mb-4 animate-fade-in shadow-lg shadow-chart-3/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-chart-3 to-chart-2 animate-pulse"></div>
            <UserPlus className="w-10 h-10 text-white relative z-10 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-chart-3 via-chart-2 to-chart-1 bg-clip-text text-transparent animate-fade-in">
            Crie sua conta
          </CardTitle>
          <CardDescription className="text-base animate-fade-in" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
            Preencha os dados abaixo para começar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
              <Label htmlFor="name" className="text-sm font-medium">
                Nome completo
              </Label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-chart-3" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-11 bg-background/50 backdrop-blur-sm border-border/50 focus:border-chart-3 focus:ring-2 focus:ring-chart-3/20 transition-all duration-300 hover:border-chart-3/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-chart-3" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 bg-background/50 backdrop-blur-sm border-border/50 focus:border-chart-3 focus:ring-2 focus:ring-chart-3/20 transition-all duration-300 hover:border-chart-3/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.35s", animationFillMode: "both" }}>
              <Label htmlFor="phone" className="text-sm font-medium">
                Celular <span className="text-muted-foreground text-xs">(opcional)</span>
              </Label>
              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-chart-3" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-11 bg-background/50 backdrop-blur-sm border-border/50 focus:border-chart-3 focus:ring-2 focus:ring-chart-3/20 transition-all duration-300 hover:border-chart-3/50"
                />
              </div>
            </div>

            <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
              <Label htmlFor="password" className="text-sm font-medium">
                Senha
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-chart-3" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 bg-background/50 backdrop-blur-sm border-border/50 focus:border-chart-3 focus:ring-2 focus:ring-chart-3/20 transition-all duration-300 hover:border-chart-3/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-chart-3 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {password && (
                <div className="flex items-center gap-2 mt-2 animate-fade-in">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        passwordStrength === 'strong' ? 'w-full bg-chart-1' : 
                        passwordStrength === 'medium' ? 'w-2/3 bg-chart-2' : 
                        'w-1/3 bg-chart-3'
                      }`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {passwordStrength === 'strong' ? 'Forte' : passwordStrength === 'medium' ? 'Média' : 'Fraca'}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.5s", animationFillMode: "both" }}>
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar senha
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-chart-3" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-11 pr-11 bg-background/50 backdrop-blur-sm border-border/50 focus:border-chart-3 focus:ring-2 focus:ring-chart-3/20 transition-all duration-300 hover:border-chart-3/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-chart-3 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {confirmPassword && password === confirmPassword && (
                  <CheckCircle2 className="absolute right-11 top-1/2 -translate-y-1/2 h-5 w-5 text-chart-1 animate-scale-in" />
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-chart-3 to-chart-2 hover:from-chart-3/90 hover:to-chart-2/90 text-white font-semibold shadow-lg hover:shadow-chart-3/50 transition-all duration-300 hover:scale-[1.02] group animate-fade-in"
              style={{ animationDelay: "0.6s", animationFillMode: "both" }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="flex items-center justify-center gap-2">
                Criar conta
                <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
              </span>
            </Button>

            <div className="text-center text-sm animate-fade-in" style={{ animationDelay: "0.7s", animationFillMode: "both" }}>
              <span className="text-muted-foreground">Já tem uma conta? </span>
              <Link to="/login" className="text-chart-1 hover:text-chart-1/80 font-semibold transition-all duration-200 hover:underline hover:scale-105 inline-block">
                Fazer login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
