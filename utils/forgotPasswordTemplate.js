const forgotPasswordTemplate = ({ name, otp }) => {
  return `
    <div>
      <p>Dear, ${name}</p>
      <p>You requested a password reset. Please use the following OTP code to reset your password.</p>
      <div style="background: yellow; font-size: 20px; padding: 10px; display: inline-block; font-weight: bold;">
        ${otp}
      </div>
      <p>Your OTP is valid for 1 hour only</p>
      <br>
      <p>Thank You</p>
    </div>
  `;
};

export default forgotPasswordTemplate;
