using Microsoft.Extensions.Options;
using MimeKit;
using MailKit.Net.Smtp;

public interface IEmailSender
{
    Task SendEmailAsync(string email, string subject, string htmlMessage);
}

public class EmailSender : IEmailSender
{
    private readonly EmailSettings _emailSettings;

    public EmailSender(IOptions<EmailSettings> emailSettings)
    {
        _emailSettings = emailSettings.Value;
    }

    public async Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Tu Nombre", _emailSettings.UserName));
        message.To.Add(new MailboxAddress("", email));
        message.Subject = subject;

        var bodyBuilder = new BodyBuilder();
        bodyBuilder.HtmlBody = htmlMessage;
        message.Body = bodyBuilder.ToMessageBody();

        using (var client = new SmtpClient())
        {
            await client.ConnectAsync(_emailSettings.Host, _emailSettings.Port, _emailSettings.EnableSsl);

            // Si quieres autenticar con Gmail usando credenciales, descomenta estas líneas:
            await client.AuthenticateAsync(_emailSettings.UserName, _emailSettings.Password);

            // Si quieres autenticar con Gmail usando OAuth2, descomenta estas líneas y asegúrate de configurar el token OAuth2:
            // await client.AuthenticateAsync(new NetworkCredential(_emailSettings.UserName, "ACCESS_TOKEN"));

            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}