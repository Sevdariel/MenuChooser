using Email.Entities;
using Email.Interface;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using Users.Service;

namespace Email.Service
{
    public class EmailSender : IEmailSender
    {
        private readonly IOptions<EmailConfiguration> _configuration;
        private readonly IUserService _userService;
        private readonly ILogger<EmailSender> _logger;
        
        public EmailSender(IOptions<EmailConfiguration> configuration,
            IUserService userService,
            ILogger<EmailSender> logger)
        {
            _configuration = configuration;
            _userService = userService;
            _logger = logger;
        }

        public async Task SendEmailAsync(Message message)
        {
            try
            {
                _logger.LogInformation("Preparing to send email to {RecipientCount} recipients", message.To.Count);
                var emailMessage = CreateEmailMessage(message.To, message.Content, message.Subject);

                await SendAsync(emailMessage);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending email to {RecipientCount} recipients", message.To.Count);
                throw;
            }
        }

        private MimeMessage CreateEmailMessage(List<MailboxAddress> users, string messageContent, string subject)
        {
            try
            {
                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress(_configuration.Value.Username, _configuration.Value.From));
                emailMessage = AddReceiverInfo(emailMessage, users);
                emailMessage.Subject = subject;
                emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html)
                {
                    Text = messageContent,
                };

                return emailMessage;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating email message");
                throw;
            }
        }

        private MimeMessage AddReceiverInfo(MimeMessage message, List<MailboxAddress> users)
        {
            try
            {
                foreach (var user in users) {
                    message.To.Add(user);
                }

                return message;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding receiver info to email message");
                throw;
            }
        }

        private async Task SendAsync(MimeMessage mailMessage)
        { 
            _logger.LogInformation("Connecting to SMTP server: {SmtpServer}:{Port}", _configuration.Value.SmtpServer, _configuration.Value.Port);
            
            using (var client = new SmtpClient())
            {
                try
                {
                    client.ServerCertificateValidationCallback = (sender, certificate, chain, errors) => true;

                    await client.ConnectAsync(_configuration.Value.SmtpServer, _configuration.Value.Port, MailKit.Security.SecureSocketOptions.StartTls);
                    _logger.LogInformation("Connected to SMTP server successfully");
                    
                    client.AuthenticationMechanisms.Remove("XOAUTH2");
                    await client.AuthenticateAsync(_configuration.Value.Username, _configuration.Value.Password);
                    _logger.LogInformation("Authenticated to SMTP server successfully");

                    await client.SendAsync(mailMessage);
                    _logger.LogInformation("Email sent successfully to {RecipientCount} recipients", mailMessage.To.Count);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to send email. Server: {SmtpServer}, Port: {Port}, Username: {Username}", 
                        _configuration.Value.SmtpServer, _configuration.Value.Port, _configuration.Value.Username);
                    
                    var errorMessage = $"Failed to send email. Error details:\n" +
                             $"Server: {_configuration.Value.SmtpServer}\n" +
                             $"Port: {_configuration.Value.Port}\n" +
                             $"Username: {_configuration.Value.Username}\n" +
                             $"Error: {ex.Message}\n" +
                             $"Stack Trace: {ex.StackTrace}";
            
                    throw new Exception(errorMessage, ex);
                }
                finally
                {
                    await client.DisconnectAsync(true);
                    client.Dispose();
                    _logger.LogDebug("SMTP client disconnected");
                }
            }
        }
    }
}
