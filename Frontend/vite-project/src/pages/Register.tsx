import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { registerUser } from "../redux/Slices/authSlice";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";


const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(
        registerUser({
          name,
          email,
          password,
        }),
      ).unwrap();

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
  
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center px-6">
        <Card className="w-full max-w-md">
          {/* HEADER */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-extrabold text-emerald-400">SkyPay</h1>

            <p className="text-zinc-400 mt-4 leading-7">
              Create your secure banking account and start managing transactions
              instantly.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleRegister} className="space-y-5">
            <Input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* ERROR */}
            {error && <p className="text-red-400 text-sm">{error}</p>}

            {/* BUTTON */}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating Account..." : "Register"}
            </Button>
          </form>

          {/* FOOTER */}
          <div className="mt-8 text-center text-zinc-400">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-400 hover:underline">
              Login
            </Link>
          </div>
        </Card>
      </div>
  );
};

export default Register;
