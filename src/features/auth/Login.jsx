import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser, clearError } from "./authSlice";
import toast from "react-hot-toast";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, user } = useSelector((state) => state.auth);
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (user && !hasNavigated.current) {
      hasNavigated.current = true;
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return toast.error("Please fill in all fields");
    }
    dispatch(loginUser(form));
  };

  const fillDemo = (email) => {
    setForm({ email, password: "password123" });
  };

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
              <span className="text-white text-2xl font-bold">CRM</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 mt-1">Sign in to your CRM account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field pr-20"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700 font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 text-base">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-medium hover:text-blue-500">
              Create one
            </Link>
          </p>
        </div>

        <div className="mt-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200">
          <p className="text-xs font-semibold text-gray-500 mb-3 text-center">QUICK LOGIN</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Admin", email: "admin@crm.com" },
              { label: "Manager", email: "sarah@crm.com" },
              { label: "Sales", email: "john@crm.com" },
            ].map((demo) => (
              <button
                key={demo.email}
                type="button"
                onClick={() => fillDemo(demo.email)}
                className="px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all text-gray-600"
              >
                {demo.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">Password: password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;