"""Email sending process
"""

import queue
import os
import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

mail_queue = queue.Queue()

def send_mail(mail: dict):
    port = 465
    smtp_server = "smtp.gmail.com"
    sender_email = os.environ.get("GMAIL_EMAIL")
    password = os.environ.get("GMAIL_PASSWORD")
    
    email = MIMEMultipart("alternative")
    email["Subject"] = mail["title"]
    email["From"] = sender_email
    email["To"] = mail["email"]
    email.attach(MIMEText(mail["message"], "plain"))

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, mail["email"], email.as_string())

def mail_worker():
    print("Mail worker started")
    while True:
        mail = mail_queue.get()
        if mail is None:
            print("Mail worker exiting")
            break
        try:
            print("Sending mail to", mail["email"])
            send_mail(mail)
        except Exception as e:
            print(e)
