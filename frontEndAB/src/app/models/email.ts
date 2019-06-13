export interface SendEmail {
  email_addr: string;
  recipent: string;
  email_msg: string;
  subject: string;
}

export interface RecievedEmail {
  msg_id: string;
  subject: string;
  from_add: string;
}

