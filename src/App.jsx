// src/App.jsx - минимальная версия для проверки на Vercel
export default function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '20px',
      background: 'linear-gradient(135deg, #1a2a3a, #2c3e50)',
      color: 'white'
    }}>
      <h1 style={{ 
        fontSize: '48px', 
        fontFamily: 'Playfair Display, serif',
        color: '#f59e0b',
        marginBottom: '20px'
      }}>
        🏨 Movenpick Hotel
      </h1>
      <p style={{ fontSize: '20px', color: '#e5e7eb' }}>
        React работает на Vercel!
      </p>
      <p style={{ color: '#9ca3af', marginTop: '10px' }}>
        {new Date().toLocaleString()}
      </p>
    </div>
  );
}