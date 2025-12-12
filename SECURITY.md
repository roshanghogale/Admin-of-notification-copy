# Security Policy

## Environment Variables

This project uses sensitive environment variables that must be configured properly:

### Backend (.env)
- `DB_PASSWORD`: Database password - keep secure
- `FIREBASE_PRIVATE_KEY`: Firebase service account private key - never expose
- `FIREBASE_CLIENT_EMAIL`: Firebase service account email

### Frontend (admin/.env)
- `REACT_APP_FIREBASE_API_KEY`: Firebase API key for client-side
- All REACT_APP_ variables are exposed to the browser

## Security Best Practices

1. **Never commit .env files** - they contain sensitive credentials
2. **Use .env.example files** - provide templates without real values
3. **Rotate Firebase keys regularly**
4. **Use HTTPS in production**
5. **Validate all file uploads**
6. **Sanitize user inputs**
7. **Keep dependencies updated**

## File Upload Security

- Uploads are stored in `/uploads` directory
- Implement file type validation
- Limit file sizes
- Scan uploaded files for malware in production

## Database Security

- Use parameterized queries to prevent SQL injection
- Limit database user permissions
- Use connection pooling
- Enable database logging

## Reporting Security Issues

If you discover a security vulnerability, please email the maintainers directly rather than opening a public issue.