const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOwnerNotification = async (ownerEmail, tenantName, listingTitle, score) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: ownerEmail,
      subject: 'High Compatibility Tenant Interested in Your Listing',
      html: `
        <h2>New Interest Request</h2>
        <p><strong>${tenantName}</strong> has expressed interest in your listing: <strong>${listingTitle}</strong></p>
        <p>Compatibility Score: <strong>${score}/100</strong></p>
        <p>Log in to your dashboard to accept or decline this request.</p>
      `
    });
  } catch (error) {
    // Email failure should not break the main flow
    console.error('Owner email notification failed:', error.message);
  }
};

const sendTenantNotification = async (tenantEmail, status, listingTitle) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: tenantEmail,
      subject: `Your interest request has been ${status}`,
      html: `
        <h2>Interest Request Update</h2>
        <p>Your interest in <strong>${listingTitle}</strong> has been <strong>${status}</strong>.</p>
        ${status === 'accepted'
          ? '<p>You can now chat with the owner through the platform!</p>'
          : '<p>Do not be discouraged — keep browsing other listings.</p>'
        }
      `
    });
  } catch (error) {
    console.error('Tenant email notification failed:', error.message);
  }
};

module.exports = { sendOwnerNotification, sendTenantNotification };