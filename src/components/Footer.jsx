import React from 'react'

function Footer() {
  return (
    <footer style={{ backgroundColor: '#1a1a2e', color: '#F3E3D0', padding: '12px 0', marginTop: 'auto' }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0" style={{ fontSize: '13px' }}>
              <strong>Email:</strong> support@techpath.com &nbsp;|&nbsp;
              <strong>Phone:</strong> +91 98765 43210
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="mb-0" style={{ fontSize: '13px' }}>
              © {new Date().getFullYear()} TechPath. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer