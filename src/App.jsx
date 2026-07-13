// src/App.jsx
import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#1a2a3a',
      color: 'white',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '48px', color: '#f59e0b' }}>
        🏨 Movenpick Hotel
      </h1>
      <p style={{ fontSize: '20px', marginTop: '20px' }}>
        React работает на Vercel! ✅
      </p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{ 
          marginTop: '20px', 
          padding: '10px 20px', 
          background: '#f59e0b',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Клик: {count}
      </button>
    </div>
  )
}