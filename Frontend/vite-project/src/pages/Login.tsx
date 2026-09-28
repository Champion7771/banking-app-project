import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../redux/store";
import { loginUser } from "../redux/Slices/authSlice";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await dispatch(
        loginUser({
          email,
          password,
        }),
      ).unwrap();

      // ROLE BASED REDIRECT
      if (result.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center px-6">
      {/* LOGIN CARD */}
      <Card className="w-full max-w-md">
        {/* BRAND */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-emerald-400 tracking-tight">
            SkyPay
          </h1>

          <p className="text-zinc-400 mt-4 leading-7">
            Secure digital banking with real-time transactions and modern
            authentication.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* ERROR */}
          {error && <p className="text-red-400 text-sm">{error}</p>}

          {/* BUTTON */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* FOOTER */}
        <div className="mt-8 text-center text-zinc-400">
          Don’t have an account?{" "}
          <Link to="/register" className="text-emerald-400 hover:underline">
            Register
          </Link>
        </div>
      </Card>
    </div>
  );
};
export default Login;
