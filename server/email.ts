import { MailService } from '@sendgrid/mail';
import { Booking, Package } from '@shared/schema';

// Initialize SendGrid with API key
if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY environment variable is not set. Email notifications will not be sent.");
}

// Check if SendGrid API key is provided
const isSendgridConfigured = !!process.env.SENDGRID_API_KEY;
let mailService: MailService | null = null;

// Only initialize if SendGrid is configured
if (isSendgridConfigured) {
  try {
    mailService = new MailService();
    mailService.setApiKey(process.env.SENDGRID_API_KEY || '');
    console.log("SendGrid mail service initialized");
  } catch (error) {
    console.error("Failed to initialize SendGrid:", error);
    mailService = null;
  }
}

const ADMIN_EMAIL = 'sanskrutimumbai@gmail.com';
const FROM_EMAIL = 'notifications@sanskrutitravels.com';

/**
 * Send a notification email to admin when a new booking is created
 */
export async function sendBookingNotificationEmail(booking: Booking, packageDetails?: Package): Promise<boolean> {
  if (!mailService) {
    console.log('Email notification not sent: SendGrid mail service not configured');
    return false;
  }

  try {
    const packageName = packageDetails ? packageDetails.title : `Package #${booking.packageId}`;
    
    // Email content
    const emailData = {
      to: ADMIN_EMAIL,
      from: FROM_EMAIL,
      subject: `New Booking: ${packageName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #000080; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">New Booking Notification</h1>
          </div>
          
          <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
            <h2 style="color: #000080;">Booking Details</h2>
            <p><strong>Booking ID:</strong> #${booking.id}</p>
            <p><strong>Package:</strong> ${packageName}</p>
            <p><strong>Travel Date:</strong> ${booking.travelDate}</p>
            <p><strong>Number of Travelers:</strong> ${booking.numberOfTravelers}</p>
            
            <h2 style="color: #000080; margin-top: 20px;">Customer Information</h2>
            <p><strong>Name:</strong> ${booking.name}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Phone:</strong> ${booking.phone}</p>
            
            ${booking.specialRequirements ? `
              <h3 style="color: #000080; margin-top: 20px;">Special Requirements</h3>
              <p>${booking.specialRequirements}</p>
            ` : ''}
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              <p>Log in to your admin panel to manage this booking.</p>
              <p><a href="https://sanskrutitravels.com/admin/bookings" style="display: inline-block; background-color: #FF9933; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Booking</a></p>
            </div>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>This is an automated message from Sanskruti Travels booking system.</p>
          </div>
        </div>
      `
    };

    await mailService.send(emailData);
    console.log(`Booking notification email sent to ${ADMIN_EMAIL}`);
    return true;
  } catch (error) {
    console.error('Failed to send booking notification email:', error);
    return false;
  }
}

/**
 * Send a booking status update email to the customer
 */
export async function sendBookingStatusEmail(booking: Booking, packageDetails?: Package): Promise<boolean> {
  if (!mailService) {
    console.log('Status update email not sent: SendGrid mail service not configured');
    return false;
  }

  try {
    const packageName = packageDetails ? packageDetails.title : `Package #${booking.packageId}`;
    const statusMessages = {
      confirmed: 'Your booking has been confirmed. We look forward to providing you with an amazing travel experience!',
      cancelled: 'Your booking has been cancelled. If you have any questions, please contact our support team.',
      completed: 'Your booking has been marked as completed. We hope you enjoyed your trip with us!'
    };
    
    const statusMessage = statusMessages[booking.status as keyof typeof statusMessages] || 
      'Your booking status has been updated.';
    
    // Email content
    const emailData = {
      to: booking.email,
      from: FROM_EMAIL,
      subject: `Booking Status Update: ${packageName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #000080; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Booking Status Update</h1>
          </div>
          
          <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
            <h2 style="color: #000080;">Dear ${booking.name},</h2>
            
            <p>Your booking for <strong>${packageName}</strong> has been updated to <strong>${booking.status}</strong>.</p>
            <p>${statusMessage}</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <h3 style="color: #000080; margin-top: 0;">Booking Summary</h3>
              <p><strong>Booking ID:</strong> #${booking.id}</p>
              <p><strong>Package:</strong> ${packageName}</p>
              <p><strong>Travel Date:</strong> ${booking.travelDate}</p>
              <p><strong>Number of Travelers:</strong> ${booking.numberOfTravelers}</p>
              <p><strong>Status:</strong> ${booking.status}</p>
            </div>
            
            <p>If you have any questions or need further assistance, please don't hesitate to contact us.</p>
            <p>Thank you for choosing Sanskruti Travels!</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center;">
            <p style="margin: 0; font-size: 14px;">© 2025 Sanskruti Travels. All rights reserved.</p>
          </div>
        </div>
      `
    };
    
    // Add a copy to admin
    const adminEmailData = {
      to: ADMIN_EMAIL,
      from: FROM_EMAIL,
      subject: `Booking Status Updated to ${booking.status}: ${packageName}`,
      html: emailData.html
    };

    await mailService.send(emailData);
    await mailService.send(adminEmailData);
    
    console.log(`Status update email sent to ${booking.email} and copied to admin`);
    return true;
  } catch (error) {
    console.error('Failed to send booking status email:', error);
    return false;
  }
}