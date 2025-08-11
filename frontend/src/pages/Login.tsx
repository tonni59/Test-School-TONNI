// frontend/src/pages/Login.tsx
import React, { useState } from 'react';
import { useLoginMutation } from '../store/rtkApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      // backend returns { accessToken, refreshToken, user: {id,email,role} }
      dispatch(
        setCredentials({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          user: res.user,
        })
      );
      // Immediately redirect to exam step 1 and start exam
      navigate('/exam/1');
    } catch (err: any) {
      alert(err?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-title">Welcome Back</h2>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" id="email" placeholder="you@example.com" required />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" id="password" placeholder="********" required />
        </div>

        <button type="submit" className="btn-login" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <p className="register-link">
          Don’t have an account? <a href="/register">Sign up here</a>
        </p>
      </form>
    </div>
  );
}
