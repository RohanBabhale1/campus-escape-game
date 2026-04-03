import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('MALE'); // default
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/login' : '/signup';
    
    try {
      const payload = isLogin ? { username, password } : { username, password, gender };
      const res = await axios.post(`${API_URL}${endpoint}`, payload);
      
      localStorage.setItem('clubverse_token', res.data.token);
      onAuth(res.data.user);
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error);
      } else {
        setError('Server error, please try again.');
      }
    }
  };

  const handleGuest = async () => {
    setError('');
    try {
      const res = await axios.post(`${API_URL}/guest`);
      localStorage.setItem('clubverse_token', res.data.token);
      onAuth(res.data.user);
      navigate('/');
    } catch (err) {
      setError('Guest login failed.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glassCard}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#fff' }}>
          {isLogin ? 'Login to ClubVerse' : 'Join ClubVerse'}
        </h1>
        
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          
          {!isLogin && (
            <select 
              value={gender} 
              onChange={e => setGender(e.target.value)}
              style={styles.input}
            >
              <option value="MALE">Male (Soldier)</option>
              <option value="FEMALE">Female</option>
            </select>
          )}

          <button type="submit" style={styles.button}>
            {isLogin ? 'Login' : 'Signup'}
          </button>
        </form>

        <div style={styles.switchText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            style={styles.switchLink} 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </span>
        </div>

        <div style={styles.divider}>OR</div>

        <button onClick={handleGuest} style={styles.guestButton}>
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")', // Example campus background
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  glassCard: {
    width: '400px',
    padding: '40px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  input: {
    padding: '12px 15px',
    borderRadius: '8px',
    border: 'none',
    outline: 'none',
    background: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
    fontSize: '16px'
  },
  button: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    background: '#3498db',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '10px'
  },
  guestButton: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #fff',
    background: 'transparent',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    width: '100%',
    fontWeight: 'bold'
  },
  switchText: {
    color: '#ddd',
    textAlign: 'center',
    marginTop: '15px',
    fontSize: '14px'
  },
  switchLink: {
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'underline'
  },
  divider: {
    color: '#ddd',
    textAlign: 'center',
    margin: '20px 0',
    fontSize: '12px',
    letterSpacing: '2px'
  },
  error: {
    color: '#ff6b6b',
    background: 'rgba(255, 0, 0, 0.1)',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px',
    textAlign: 'center'
  }
};

export default Auth;
