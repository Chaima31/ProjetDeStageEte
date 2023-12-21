package com.example.demo.controllers;

import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${email.username}")
    private String username;

    @Value("${email.password}")
    private String password;

    @Value("${email.host}")
    private String emailHost;

    @Value("${email.port}")
    private String emailPort;

    public void sendPasswordResetEmail(String recipientEmail, String newPassword) {
        Properties properties = new Properties();
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.host", emailHost);
        properties.put("mail.smtp.port", emailPort);

        Session session = Session.getInstance(properties, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            message.setRecipient(Message.RecipientType.TO, new InternetAddress(recipientEmail));
            message.setSubject("Password Reset");
            message.setText("Your new password is: " + newPassword);

            Transport.send(message);

            System.out.println("Password reset email sent successfully.");
        } catch (MessagingException e) {
            e.printStackTrace();
            System.err.println("Error sending password reset email: " + e.getMessage());
        }
    }
}
