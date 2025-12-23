# 🔒 Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | ✅ Yes    |
| < 1.0   | ❌ No     |

---

## Reporting a Vulnerability

### 🚨 Do NOT create public issues for security vulnerabilities

### How to Report

1. **Email**: Send details to security@traviapp.com
2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

| Stage | Timeline |
|-------|----------|
| Acknowledgment | 24-48 hours |
| Initial Assessment | 72 hours |
| Fix Development | 1-2 weeks |
| Public Disclosure | After fix deployed |

---

## Security Features

### Authentication
- bcrypt password hashing
- 2FA/MFA with TOTP
- Session-based authentication
- OAuth/OIDC support

### Authorization
- Role-based access control (RBAC)
- 5 permission levels
- Content ownership validation

### Rate Limiting
- Auth endpoints: 5 req/min
- API endpoints: 100 req/min
- Newsletter: 2 req/min

### Data Protection
- SQL injection prevention (Drizzle ORM)
- XSS protection (CSP headers)
- CSRF protection middleware
- Input validation (Zod)

### Monitoring
- Audit logs for all actions
- IP tracking and blocking
- Request logging

---

## Best Practices for Users

1. **Use strong passwords** (12+ characters)
2. **Enable 2FA** for admin accounts
3. **Keep API keys secure** - never commit to git
4. **Review audit logs** regularly
5. **Update dependencies** frequently

---

## Security Headers

The application sets these security headers:

```
Content-Security-Policy: default-src 'self'...
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

---

## Responsible Disclosure

We believe in responsible disclosure. If you discover a vulnerability:

1. Report it privately
2. Give us time to fix it
3. Don't exploit it maliciously
4. We'll credit you (if desired)

Thank you for helping keep Traviapp secure! 🙏
