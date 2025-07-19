import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Registration: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      // Получаем текущих пользователей из localStorage
      const usersRaw = localStorage.getItem("app-users");
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      // Проверка на уникальность email
      if (users.some((u: any) => u.email === email)) {
        throw new Error("Пользователь с таким email уже существует");
      }
      // Создаём нового пользователя
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role: "viewer",
        createdAt: Date.now(),
      };
      const updatedUsers = [...users, newUser];
      localStorage.setItem("app-users", JSON.stringify(updatedUsers));
      localStorage.setItem("user_data", JSON.stringify(newUser));
      setSuccess(true);
      setName("");
      setEmail("");
      setPassword("");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Регистрация</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {success && (
          <div className="mb-4 text-green-600">Регистрация успешна!</div>
        )}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Имя</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Регистрация..." : "Зарегистрироваться"}
        </button>
      </form>
    </div>
  );
};

export default Registration;
