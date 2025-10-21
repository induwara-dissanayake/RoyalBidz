using AutoMapper;
using Microsoft.Extensions.Options;
using RoyalBidz.Server.DTOs;
using RoyalBidz.Server.Models;
using RoyalBidz.Server.Repositories.Interfaces;
using RoyalBidz.Server.Services.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using System.Linq;

namespace RoyalBidz.Server.Services.Interfaces
{
    public interface IEmailNotificationService
    {
        Task SendBidNotificationAsync(int auctionId, decimal bidAmount, string bidderName);
        Task SendAuctionEndNotificationAsync(int auctionId);
        Task SendPaymentReminderAsync(int paymentId);
        Task SendWelcomeEmailAsync(string email, string name);
        Task SendPasswordResetEmailAsync(string email, string resetToken);
        Task SendEmailVerificationCodeAsync(string email, string name, string verificationCode);
        Task SendEmailVerificationSuccessAsync(string email, string name);
        Task SendContactInquiryConfirmationAsync(string email, string name, int inquiryId);
        Task SendNewInquiryNotificationAsync(ContactInquiry inquiry);
        Task SendPaymentSuccessEmailAsync(string email, string name, string auctionTitle, decimal amount, string transactionId);
    }
}

namespace RoyalBidz.Server.Services.Implementations
{
    public class EmailNotificationService : IEmailNotificationService
    {
        private readonly ILogger<EmailNotificationService> _logger;
        private readonly EmailSettings _emailSettings;

        public EmailNotificationService(ILogger<EmailNotificationService> logger, IOptions<EmailSettings> emailSettings)
        {
            _logger = logger;
            _emailSettings = emailSettings.Value;
        }

        private async Task SendEmailAsync(string toEmail, string subject, string htmlBody, string? plainTextBody = null)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(_emailSettings.FromName, _emailSettings.FromEmail));
                message.To.Add(new MailboxAddress("", toEmail));
                message.Subject = subject;

                var bodyBuilder = new BodyBuilder();
                if (!string.IsNullOrEmpty(htmlBody))
                {
                    bodyBuilder.HtmlBody = htmlBody;
                }
                if (!string.IsNullOrEmpty(plainTextBody))
                {
                    bodyBuilder.TextBody = plainTextBody;
                }
                else if (!string.IsNullOrEmpty(htmlBody))
                {
                    // Create a simple text version from HTML if no plain text provided
                    bodyBuilder.TextBody = System.Text.RegularExpressions.Regex.Replace(htmlBody, "<.*?>", "");
                }

                message.Body = bodyBuilder.ToMessageBody();

                using var client = new SmtpClient();
                await client.ConnectAsync(_emailSettings.SmtpHost, _emailSettings.SmtpPort, 
                    _emailSettings.UseSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.None);
                
                await client.AuthenticateAsync(_emailSettings.Username, _emailSettings.Password);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogInformation("Email sent successfully to {Email} with subject: {Subject}", toEmail, subject);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to {Email} with subject: {Subject}", toEmail, subject);
                throw;
            }
        }

        public async Task SendBidNotificationAsync(int auctionId, decimal bidAmount, string bidderName)
        {
            _logger.LogInformation("SendBidNotificationAsync called for auction {AuctionId} by {Bidder} amount {Amount}", auctionId, bidderName, bidAmount);
            // Implementation for bid notifications can be added here when needed
            // This would require additional auction and user data to send meaningful notifications
        }

        public async Task SendAuctionEndNotificationAsync(int auctionId)
        {
            _logger.LogInformation("SendAuctionEndNotificationAsync called for auction {AuctionId}", auctionId);
            // Implementation for auction end notifications can be added here when needed
            // This would require auction data and winner information
        }

        public async Task SendPaymentReminderAsync(int paymentId)
        {
            _logger.LogInformation("SendPaymentReminderAsync called for payment {PaymentId}", paymentId);
            // Implementation for payment reminders can be added here when needed
            // This would require payment and user data
        }

        public async Task SendWelcomeEmailAsync(string email, string name)
        {
            _logger.LogInformation("SendWelcomeEmailAsync called for {Email}", email);
            
            var subject = "Welcome to RoyalBidz!";
            var htmlBody = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }}
        .content {{ padding: 30px 20px; background: #f9f9f9; }}
        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Welcome to RoyalBidz!</h1>
        </div>
        <div class='content'>
            <h2>Hello {name}!</h2>
            <p>Welcome to RoyalBidz, your premier destination for luxury jewelry auctions!</p>
            <p>Your account has been successfully created. You can now:</p>
            <ul>
                <li>Browse our exclusive jewelry collection</li>
                <li>Participate in live auctions</li>
                <li>Manage your bidding history</li>
                <li>Create your wishlist</li>
            </ul>
            <p>Thank you for joining our community of jewelry enthusiasts!</p>
            <p>Happy bidding!</p>
            <p>Best regards,<br>The RoyalBidz Team</p>
        </div>
        <div class='footer'>
            <p>&copy; 2024 RoyalBidz. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";

            await SendEmailAsync(email, subject, htmlBody);
        }

        public async Task SendPasswordResetEmailAsync(string email, string resetToken)
        {
            _logger.LogInformation("SendPasswordResetEmailAsync called for {Email}", email);
            
            var subject = "Password Reset - RoyalBidz";
            var resetLink = $"https://localhost:5173/reset-password?token={resetToken}"; // Adjust URL as needed
            var htmlBody = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }}
        .content {{ padding: 30px 20px; background: #f9f9f9; }}
        .button {{ display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; }}
        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Password Reset Request</h1>
        </div>
        <div class='content'>
            <h2>Password Reset</h2>
            <p>You have requested to reset your password for your RoyalBidz account.</p>
            <p>Click the button below to reset your password:</p>
            <p style='text-align: center;'>
                <a href='{resetLink}' class='button'>Reset Password</a>
            </p>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p>{resetLink}</p>
            <p>This link will expire in 24 hours for security reasons.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <p>Best regards,<br>The RoyalBidz Team</p>
        </div>
        <div class='footer'>
            <p>&copy; 2024 RoyalBidz. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";

            await SendEmailAsync(email, subject, htmlBody);
        }

        public async Task SendEmailVerificationCodeAsync(string email, string name, string verificationCode)
        {
            _logger.LogInformation("SendEmailVerificationCodeAsync called for {Email}", email);
            
            var subject = "Email Verification - RoyalBidz";
            var htmlBody = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }}
        .content {{ padding: 30px 20px; background: #f9f9f9; }}
        .code {{ font-size: 24px; font-weight: bold; text-align: center; background: white; padding: 20px; border: 2px solid #667eea; border-radius: 10px; margin: 20px 0; }}
        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Email Verification</h1>
        </div>
        <div class='content'>
            <h2>Hello {name}!</h2>
            <p>Thank you for registering with RoyalBidz. To complete your registration, please verify your email address using the verification code below:</p>
            <div class='code'>{verificationCode}</div>
            <p>Enter this code in the verification form to activate your account.</p>
            <p>This code will expire in 15 minutes for security reasons.</p>
            <p>If you didn't create an account with RoyalBidz, please ignore this email.</p>
            <p>Best regards,<br>The RoyalBidz Team</p>
        </div>
        <div class='footer'>
            <p>&copy; 2024 RoyalBidz. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";

            await SendEmailAsync(email, subject, htmlBody);
        }

        public async Task SendEmailVerificationSuccessAsync(string email, string name)
        {
            _logger.LogInformation("SendEmailVerificationSuccessAsync called for {Email}", email);
            
            var subject = "Email Verified Successfully - RoyalBidz";
            var htmlBody = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }}
        .content {{ padding: 30px 20px; background: #f9f9f9; }}
        .success {{ background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }}
        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Email Verified!</h1>
        </div>
        <div class='content'>
            <h2>Congratulations {name}!</h2>
            <div class='success'>
                ✅ Your email has been successfully verified!
            </div>
            <p>Your RoyalBidz account is now fully activated and ready to use.</p>
            <p>You can now enjoy all the features of our platform:</p>
            <ul>
                <li>Browse exclusive jewelry collections</li>
                <li>Participate in live auctions</li>
                <li>Place bids on your favorite items</li>
                <li>Track your auction history</li>
            </ul>
            <p>Start exploring our auctions and happy bidding!</p>
            <p>Best regards,<br>The RoyalBidz Team</p>
        </div>
        <div class='footer'>
            <p>&copy; 2024 RoyalBidz. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";

            await SendEmailAsync(email, subject, htmlBody);
        }

        public async Task SendContactInquiryConfirmationAsync(string email, string name, int inquiryId)
        {
            _logger.LogInformation("SendContactInquiryConfirmationAsync called for {Email}, inquiry {Id}", email, inquiryId);
            
            var subject = "Contact Inquiry Received - RoyalBidz";
            var htmlBody = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }}
        .content {{ padding: 30px 20px; background: #f9f9f9; }}
        .info {{ background: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; padding: 15px; border-radius: 5px; margin: 20px 0; }}
        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Inquiry Received</h1>
        </div>
        <div class='content'>
            <h2>Hello {name}!</h2>
            <p>Thank you for contacting RoyalBidz. We have received your inquiry and will respond as soon as possible.</p>
            <div class='info'>
                📧 Inquiry ID: #{inquiryId}<br>
                We typically respond within 24-48 hours during business days.
            </div>
            <p>Our customer service team will review your message and get back to you with a detailed response.</p>
            <p>If you have any urgent questions, please don't hesitate to contact us directly.</p>
            <p>Thank you for your interest in RoyalBidz!</p>
            <p>Best regards,<br>The RoyalBidz Customer Service Team</p>
        </div>
        <div class='footer'>
            <p>&copy; 2024 RoyalBidz. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";

            await SendEmailAsync(email, subject, htmlBody);
        }

        public async Task SendNewInquiryNotificationAsync(ContactInquiry inquiry)
        {
            _logger.LogInformation("SendNewInquiryNotificationAsync called for inquiry {Id}", inquiry?.Id);
            
            if (inquiry == null) return;

            // Send notification to admin email (using FromEmail as admin email)
            var subject = $"New Contact Inquiry #{inquiry.Id} - RoyalBidz";
            var htmlBody = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: #dc3545; color: white; padding: 20px; text-align: center; }}
        .content {{ padding: 30px 20px; background: #f9f9f9; }}
        .details {{ background: white; padding: 20px; border-left: 4px solid #dc3545; margin: 20px 0; }}
        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>New Contact Inquiry</h1>
        </div>
        <div class='content'>
            <h2>New inquiry received from website</h2>
            <div class='details'>
                <strong>Inquiry ID:</strong> #{inquiry.Id}<br>
                <strong>Name:</strong> {inquiry.Name}<br>
                <strong>Email:</strong> {inquiry.Email}<br>
                <strong>Mobile:</strong> {inquiry.MobileNumber ?? "Not provided"}<br>
                <strong>Status:</strong> {inquiry.Status}<br>
                <strong>Priority:</strong> {inquiry.Priority}<br>
                <strong>Enquiry:</strong><br>
                {inquiry.Enquiry}<br><br>
                <strong>Submitted:</strong> {inquiry.CreatedAt:yyyy-MM-dd HH:mm:ss}
            </div>
            <p>Please respond to this inquiry at your earliest convenience.</p>
        </div>
        <div class='footer'>
            <p>&copy; 2024 RoyalBidz Admin Panel</p>
        </div>
    </div>
</body>
</html>";

            await SendEmailAsync(_emailSettings.FromEmail, subject, htmlBody);
        }

        public async Task SendPaymentSuccessEmailAsync(string email, string name, string auctionTitle, decimal amount, string transactionId)
        {
            _logger.LogInformation("SendPaymentSuccessEmailAsync called for {Email}, auction: {AuctionTitle}, amount: {Amount}", email, auctionTitle, amount);
            
            var subject = "Payment Successful - RoyalBidz";
            var htmlBody = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; text-align: center; }}
        .content {{ padding: 30px 20px; background: #f9f9f9; }}
        .success {{ background: #d1fae5; border: 1px solid #a7f3d0; color: #065f46; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center; }}
        .payment-details {{ background: white; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; }}
        .amount {{ font-size: 24px; font-weight: bold; color: #10b981; }}
        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>✅ Payment Successful!</h1>
        </div>
        <div class='content'>
            <h2>Hello {name}!</h2>
            <div class='success'>
                <h3>🎉 Congratulations! Your payment has been processed successfully.</h3>
                <p>You have successfully won the auction and completed the payment!</p>
            </div>
            
            <div class='payment-details'>
                <h3>Payment Details:</h3>
                <strong>Auction Item:</strong> {auctionTitle}<br>
                <strong>Amount Paid:</strong> <span class='amount'>${amount:F2}</span><br>
                <strong>Transaction ID:</strong> {transactionId}<br>
                <strong>Payment Date:</strong> {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC<br>
                <strong>Status:</strong> <span style='color: #10b981; font-weight: bold;'>COMPLETED</span>
            </div>

            <h3>What's Next?</h3>
            <ul>
                <li>You will receive your jewelry item within 5-7 business days</li>
                <li>A tracking number will be sent to your email once shipped</li>
                <li>Your purchase is protected by our authenticity guarantee</li>
                <li>You can track your order status in your account dashboard</li>
            </ul>

            <p>If you have any questions about your purchase or need assistance, please don't hesitate to contact our customer support team.</p>
            
            <p>Thank you for choosing RoyalBidz for your luxury jewelry needs!</p>
            
            <p>Best regards,<br>The RoyalBidz Team</p>
        </div>
        <div class='footer'>
            <p>&copy; 2024 RoyalBidz. All rights reserved.</p>
            <p>This is an automated email. Please do not reply directly to this message.</p>
        </div>
    </div>
</body>
</html>";

            await SendEmailAsync(email, subject, htmlBody);
        }
    }
}