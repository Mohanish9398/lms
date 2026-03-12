import logo from '../lms logo.JPG'
import React from 'react'

export default function Footer() {
  return (
    <footer style={{ borderTop:'1px solid var(--b-1)', background:'var(--bg-0)', padding:'18px 0' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <img src={logo} alt="TechPath" style={{ height:28, width:'auto', objectFit:'contain' }}/>
          <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:13, color:'var(--t-hi)' }}>TechPath</span>
        </div>
        <p style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--t-lo)' }}>support@techpath.com · +91 98765 43210</p>
        <p style={{ fontFamily:'var(--font-body)', fontSize:11, color:'var(--t-lo)' }}>© {new Date().getFullYear()} TechPath. All rights reserved.</p>
      </div>
    </footer>
  )
}