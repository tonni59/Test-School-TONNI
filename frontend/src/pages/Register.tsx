// frontend/src/pages/Register.tsx
import React, { useState } from 'react';
import { useRegisterMutation } from '../store/rtkApi';
import { useNavigate } from 'react-router-dom';
import "./Register.css";

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('student');
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await register({ name, email, password, phone, role }).unwrap();
      // backend returns { message, userId, otpSent }
      alert('Registered successfully. Please check your email for OTP (if configured). You can now login.');
      navigate('/login');
    } catch (err: any) {
      alert(err?.data?.message || 'Registration failed');
    }
  }

  return (
    <div className="register-container">
      <form className="register-card" onSubmit={handleSubmit}>
        <h2 className="register-title">Create an Account</h2>
        {/* name/email/password fields */}
        <div className="form-group">
          <label>Full Name</label>
          <input value={name} onChange={(e)=>setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input value={phone} onChange={(e)=>setPhone(e.target.value)} />
        </div>

        <button type="submit" className="btn-register" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Sign Up'}
        </button>

        <p className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </form>
    </div>
  );
}
