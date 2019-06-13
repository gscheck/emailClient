export class User {
  uid?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  password: string;
  user_name: string
}

export class UserAccount extends User{
  IMAP: string;
  STMP: string;
  pwd: string;
  imap_port: string;
  smtp_port: string;
  email_addr: string;
}