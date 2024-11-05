type EmailForgotTemplateProps = {
  resetUrl: string;
};

export const EmailResetTemplate: React.FC<
  Readonly<EmailForgotTemplateProps>
> = ({ resetUrl }) => (
  <table
    style={{
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
    }}>
    <tr>
      <td style={{ padding: '24px' }}>
        <table
          style={{
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}>
          <tr>
            <td style={{ padding: '32px' }}>
              <h1
                style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  color: '#1f2937',
                  marginBottom: '24px',
                }}>
                Auth Starter Kit
              </h1>

              <p style={{ color: '#374151', marginBottom: '16px' }}>Hi,</p>

              <p
                style={{
                  color: '#374151',
                  marginBottom: '24px',
                  lineHeight: '1.5',
                }}>
                We received a request to reset your password. If you didn&apos;t
                make this request, you can safely ignore this email.
              </p>

              <div style={{ textAlign: 'center', margin: '32px 0' }}>
                <a
                  href={resetUrl}
                  style={{
                    backgroundColor: 'black',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: 500,
                    display: 'inline-block',
                  }}>
                  Reset Password
                </a>
              </div>

              <p
                style={{
                  color: '#374151',
                  marginTop: '24px',
                  fontSize: '14px',
                }}>
                Or copy and paste this URL into your browser: <br />
                <span style={{ color: '#6b7280', wordBreak: 'break-all' }}>
                  {resetUrl}
                </span>
              </p>

              <p style={{ color: '#374151', marginTop: '24px' }}>
                This link will expire in 10 minutes.
              </p>

              <p style={{ color: '#374151', marginTop: '24px' }}>
                Best regards,
                <br />
                thmslfb - Auth Starter Kit
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
);
