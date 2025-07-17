import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      if (success) {
        console.log("Usuario autenticado:", localStorage.getItem("user"));
        navigate("/");
      } else {
        setError("Credenciales inválidas");
      }
    } catch (err) {
      setError("Error al iniciar sesión. Intente nuevamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-600 to-green-800 relative overflow-hidden">
      {/* Animación de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-green-400/30 animate-float-slow"></div>
        <div className="absolute top-1/4 right-1/4 w-60 h-60 rounded-full bg-green-500/20 animate-float"></div>
        <div className="absolute bottom-1/3 left-1/3 w-20 h-20 rounded-full bg-green-300/20 animate-float-fast"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-green-400/20 animate-float-medium"></div>
      </div>

      {/* Elementos decorativos */}
      <div className="absolute top-20 right-20 w-40 h-40 rounded-full bg-green-400/50"></div>
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-gradient-to-tr from-green-700 to-green-500 rounded-full"></div>
      <div className="absolute top-1/4 left-1/3 w-1 h-10 bg-white/20 rotate-45"></div>
      <div className="absolute bottom-1/3 right-1/4 w-1 h-10 bg-white/20 rotate-45"></div>
      <div className="absolute top-1/2 left-1/4 w-1 h-10 bg-white/20 rotate-45"></div>

      {/* Contenedor principal */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden w-full max-w-4xl flex z-10">
        {/* Lado izquierdo - Imagen/Logo */}
        <div className="w-2/5 relative rounded-l-3xl overflow-hidden">
          <img
            src="/Logo.png"
            alt="SABS Logo"
            className="absolute inset-0 w-full h-full object-cover rounded-l-3xl"
          />
        </div>
        {/* Lado derecho - Formulario */}
        <div className="w-3/5 p-8">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-green-600">SABS</h1>
              <p className="text-gray-600">
                Sistema Administrativo de Bodega Sena
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="test@gmail.com"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-transform duration-200 hover:scale-110"
                  ></button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 font-medium transition-all duration-300 hover:shadow-lg"
              >
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
