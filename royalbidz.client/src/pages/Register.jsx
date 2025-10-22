import React, { useEffect } from 'react';
import RegisterForm from '../components/RegisterForm';
import './Register.css';

const Register = () => {
  useEffect(() => {
    // Ensure the standalone register page opens scrolled to top
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="register-page modal-standalone">
      <RegisterForm />
    </div>
  );
};

export default Register;

