import React from 'react'
import { Zap } from 'lucide-react'

function Footer() {
  return (
    <footer style={{
      background: 'rgba(5,5,16,0.95)',
      borderTop: '1px solid var(--border-neon)',
      padding: '16px 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* subtle glow line */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
        background: 'var(--gradient-neon)', opacity: 0.4, filter: 'blur(1px)'
      }} />
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-4 text-center text-md-start mb-2 mb-md-0">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }} className="justify-content-md-start">
              <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: 'var(--gradient-neon)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={11} color="#000" fill="#000"/>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: '900', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', background: 'var(--gradient-neon)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>TechPath</span>
            </div>
          </div>
          <div className="col-md-4 text-center">
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              support@techpath.com &nbsp;·&nbsp; +91 98765 43210
            </p>
          </div>
          <div className="col-md-4 text-center text-md-end">
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.5px' }}>
              © {new Date().getFullYear()} TechPath — All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
