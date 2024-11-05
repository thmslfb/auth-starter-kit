type EmailCodeTemplateProps = {
  code: string;
};

export const EmailCodeTemplate: React.FC<Readonly<EmailCodeTemplateProps>> = ({
  code,
}) => (
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
                Thank you for testing my Auth Starter Kit. To complete your
                registration and ensure the security of your account, please use
                the following verification code:
              </p>

              <div
                style={{
                  backgroundColor: '#f9fafb',
                  padding: '16px',
                  borderRadius: '6px',
                  textAlign: 'center',
                  margin: '24px 0',
                }}>
                <code
                  style={{
                    fontSize: '18px',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    color: '#1f2937',
                  }}>
                  {code}
                </code>
              </div>

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
