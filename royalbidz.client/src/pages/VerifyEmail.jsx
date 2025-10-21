import React from 'react';
import './VerifyEmail.css';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    // Get email from location state (passed from registration)
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If no email, redirect to register
      navigate("/");
    }
  }, [location.state, navigate]);

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/verify-email", {
        email,
        verificationCode,
      });

      if (response.data.Success) {
        setSuccess("Email verified successfully! Please sign in to continue.");
        setTimeout(() => {
          setShowSignIn(true);
        }, 2000);
      } else {
        setError(response.data.Message || "Verification failed");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/auth/resend-verification", {
        email,
      });

      setSuccess(
        "Verification code sent successfully! Please check your email."
      );
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to resend verification code"
      );
    } finally {
      setResending(false);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 6) {
      setVerificationCode(value);
      setError("");
    }
  };

  return (
    <div className="verify-wrapper">
      <div className="verify-card">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/542/542638.png" 
          alt="Mail Icon" 
          className="verify-icon"
        />
        <h2>Please verify your email</h2>
        <p>You’re almost there! We sent an email to</p>
        <p className="email">abcd@gmail.com</p>
        <p className="note">
          Just click on the link in that email to complete your signup. 
          If you don’t see it, you may need to check your spam folder.
        </p>
        <button className="verify-btn">Resend Verification Email</button>
      </div>

      <footer className="footer">
        <div className="footer-column">
          <h4>Our Pages</h4>
          <p>Home</p>
          <p>For you</p>
          <p>Items</p>
          <p>Register</p>
          <p>Sign in</p>
        </div>
        <div className="footer-column">
          <h4>Explore</h4>
          <p>Design</p>
          <p>Prototyping</p>
          <p>Design systems</p>
        </div>
        <div className="footer-column">
          <h4>Resources</h4>
          <p>Blog</p>
          <p>Support</p>
          <p>Developers</p>
        </div>
      </footer>
    </div>
  );
};

export default VerifyEmail;
