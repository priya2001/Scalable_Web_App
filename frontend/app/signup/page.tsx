"use client";
import { useState } from "react";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!name) {
      newErrors.name = "Name is required";
    }
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = "Invalid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const res = await api("/auth/signup", "POST", { name, email, password });
      alert(res.message);
      router.push("/login");
    } catch (error) {
      console.error('Signup error:', error);
      alert(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-96 p-6 shadow rounded">
        <h2 className="text-xl mb-4">Sign Up</h2>
        <form onSubmit={submit}>
          <div className="mb-2">
            <input 
              placeholder="Name" 
              className="input w-full" 
              value={name}
              onChange={e => setName(e.target.value)}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div className="mb-2">
            <input 
              placeholder="Email" 
              className="input w-full" 
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-2">
            <input 
              type="password" 
              placeholder="Password" 
              className="input w-full" 
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <button type="submit" className="btn w-full">Sign Up</button>
        </form>
        <p className="mt-4 text-center">
          Already have an account? <a href="/login" className="text-blue-500 hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
}

