const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const cors = require("cors");
var MailParser = require("mailparser").MailParser;
const app = express();

var uid;
var emailAdd;
var pw;
var smtpAddr;
var smtpPort
var imapAddr;
var imapPort;

const VALIDATE_USER = "SELECT uid, email_addr, SMTP, IMAP, pwd, imap_port, smtp_port  \
FROM account_t WHERE uid = (SELECT uid FROM user_t WHERE user_name = ? AND password = ?);";

const GET_MESSAGE_PATH = "SELECT msg_path FROM msg_t WHERE uid = ? AND msg_id = ?";
const GET_EMAIL_MSGS = "SELECT msg_id, subject, from_add FROM msg_t WHERE uid = ?;";
const GET_SEARCHED_EMAIL_MSGS = "SELECT msg_id, subject, from_add FROM msg_t WHERE uid = ? AND subject LIKE ?%;";
const GET_CONTACTS = "SELECT uid, first_name, last_name, email_addr FROM address_bk_t WHERE uid = ?;";
const GET_CONTACT = "SELECT uid, first_name, last_name, email_addr FROM address_bk_t WHERE uid = ? AND email_addr = ?;";
const GET_CONTACT_INFO = "SELECT first_name, last_name, email_addr FROM address_bk_t \
WHERE uid = (SELECT uid FROM user_t WHERE first_name = ? AND last_name = ?);";

const GET_ACCOUNTS = "SELECT uid, email_addr, SMTP, IMAP, imap_port, smtp_port, pwd FROM account_t WHERE uid = ?;";

const ENTER_CONTACT = "INSERT INTO address_bk_t (uid, first_name, last_name, email_addr) \
SELECT ?,?,?,? \
WHERE NOT EXISTS (SELECT 1 FROM address_bk_t WHERE email_addr = ?);";



const ENTER_ACCOUNT = "INSERT INTO account_t (uid, email_addr, SMTP, IMAP, pwd, imap_port, smtp_port) \
SELECT (SELECT uid FROM user_t WHERE first_name = ? AND last_name = ?),?,?,?,?,?,? \
WHERE NOT EXISTS (SELECT 1 FROM account_t WHERE email_addr = ?);";

const ENTER_USER = "INSERT INTO user_t (uid, first_name, last_name, phone, password, user_name) \
SELECT MAX(uid)+1,?, ?,?,?,? FROM user_t \
WHERE NOT EXISTS (SELECT 1 FROM user_t WHERE first_name = ? AND last_name = ?); ";

const UPDATE_CONTACT = "UPDATE address_bk_t SET first_name=?, last_name=?, email_addr=? \
WHERE email_addr = ? AND uid = ?;";

const UPDATE_ACCOUNT = "UPDATE account_t \
SET email_addr = ?, \
    SMTP = ?, \
    IMAP = ?, \
    smtp_port = ?, \
    imap_port = ? \
WHERE uid = ?;";

const UPDATE_USER = "UPDATE user_t \
SET phone = ?, \
    password = ?, \
    user_name = ? \
WHERE first_name = ? AND last_name = ?;";

const DELETE_CONTACT = "DELETE FROM address_bk_t WHERE \
email_addr = ? AND uid = ?;";

var Imap = require('imap'),
    inspect = require('util').inspect;
var fs = require('fs'), fileStream;

app.use(cors());


// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'web_svc',
  password: 'CS410',
  database: 'email_client'
})

connection.connect()

var imap = new Imap({
    user: '',
    password: '',
    host: '',
    port: 0,
    tls: false,
    tlsOptions: { rejectUnauthorized: false }
});

// Validate user upon login
app.post('/user/validate', function(req, res) {
    connection.query(VALIDATE_USER, [req.body.user_name, req.body.password], function(error, results, fields) {
        if (error) throw error;
        let fetched_results = results[0];
        if (fetched_results) {
            uid = fetched_results.uid;
            emailAdd = fetched_results.email_addr;
            pw = fetched_results.pwd;
            smtpAddr = fetched_results.SMTP;
            smtpPort = fetched_results.smtp_port;
            imapAddr = fetched_results.IMAP;
            imapPort = fetched_results.imap_port;

            imap = new Imap({
                user: emailAdd,
                password: pw,
                host: imapAddr,
                port: imapPort,
                tls: false,
                tlsOptions: { rejectUnauthorized: false }
            });
            configImap();
        }
        res.end(JSON.stringify(fetched_results))
    }) 
    
});

// Update user account
app.put('/user/put/:id/account', function(req, res) {
    connection.query(UPDATE_ACCOUNT, [req.body.email_addr, req.body.SMTP, req.body.IMAP, req.body.smtp_port, req.body.imap_port, req.body.uid], function(error, results, fields) {
        if (error) throw error;
 
        res.end(JSON.stringify(results))
    }) 
});


// Fetches specific email message and its html
app.get('/user/get/:id/message/:message_id', function(req, res) {
    connection.query(GET_MESSAGE_PATH, [req.params.id,req.params.message_id], function(error, results, fields) {
        let fetched_msg_path = results[0].msg_path;
        if (error) throw error;
        fs.readFile(fetched_msg_path, 'utf8', (err, data) => {
            if (err) throw err;
            console.log(data);
            res.end(JSON.stringify(data)) 
          }); 
    })
});

// Fetch messages based on user's id
app.get('/user/get/:id/messages', function(req, res) {
    connection.query(GET_EMAIL_MSGS, [req.params.id], function(error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results)) 
    })
});

// Create new contact
app.post('/post/contact', function(req, res) {
    connection.query(ENTER_CONTACT, [req.body.uid, req.body.first_name, req.body.last_name, req.body.email_addr, req.body.email_addr], function(error, results, fields) { //change this
        if (error) throw error;
        res.end(JSON.stringify(results)) 
    })
});

// Fetch all contacts based on user's id
app.get('/contacts/get/:id', function(req, res) {
    connection.query(GET_CONTACTS, [req.params.id], function(error, results, fields) {
        if (error) throw error;

        res.end(JSON.stringify(results)) 
    })
});

// Use user's id and contact's email as primary key to fetch contact's details
app.get('/contact/:id/get/:email', function(req, res) {
    connection.query(GET_CONTACT, [req.params.id, req.params.email], function(error, results, fields) {
        let fetched_result = results[0];
        if (error) throw error;

        res.end(JSON.stringify(fetched_result)) 
    })
});

// Update contact's info using user's id and contact's email in where statement
app.put('/contact/:id/put/:email', function(req, res) {
    connection.query(UPDATE_CONTACT, [req.body.first_name, req.body.last_name, req.body.email_addr, req.params.email, req.params.id], function(error, results, fields) { //change this
        if (error) throw error;
        res.end(JSON.stringify(results)) 
    })
});

// Delete contact based on user's id and contact's email
app.delete('/contact/:id/delete/:email', function(req, res) {
    connection.query(DELETE_CONTACT, [req.params.email, req.params.id], function(error, results, fields) { //change this
        if (error) throw error;
        res.end(JSON.stringify(results)) 
    })
});

// Fetches user account info for settings
app.get('/user/get/:id/account', function(req, res) {
    console.log(req.params.id);
    connection.query(GET_ACCOUNTS, [req.params.id], function(error, results, fields) {
        let fetched_results = results[0];
        if (error) throw error;
        res.end(JSON.stringify(fetched_results)) 
    })
});

// Registers new email account
app.post('/user/register', function(req, res) {
   
    connection.query(ENTER_USER, [req.body.first_name, req.body.last_name, req.body.phone, req.body.password, req.body.user_name, req.body.first_name, req.body.last_name], function(error, results, fields) {
        if (error) throw error;
        
        
        res.end(JSON.stringify(results))
    }) 
    
    connection.query(ENTER_ACCOUNT, [req.body.first_name, req.body.last_name, req.body.email_addr, req.body.SMTP, req.body.IMAP, req.body.pwd, req.body.imap_port, req.body.smtp_port, req.body.email_addr], function(error, results, fields) {
        if (error) throw error;

        res.end(JSON.stringify(results))
    }) 
});

// Send new or reply to email
app.post('/user/post/message', function(req, res) {
   
        console.log("create transpor");
        console.log(smtpAddr);
        console.log(smtpPort);


        let transporter = nodemailer.createTransport({
            //host: req.body.SMTP,
            host: smtpAddr,
            port: smtpPort,
            secure: false, // true for 465, false for other ports
            auth: {
                user: emailAdd, // generated ethereal user
                pass: pw // generated ethereal password
            }
        });
        console.log("post send mail");
        // send mail with defined transport object
        transporter.sendMail({
            from: emailAdd, // sender address
            to: req.body.recipient, // list of receivers
            subject: req.body.subject, // Subject line
            text: req.body.email_msg, // plain text body
            html: "<b>" + req.body.email_msg + "</b>" // html body
        });

});

function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
}

function processMessage(msg, seqno) {
    console.log("Processing msg #" + seqno);

    var parser = new MailParser();
    parser.on("headers", function(headers) {
        var subject = JSON.stringify(headers.get('subject'));
        var trimmedStr = subject.substr(1);
        subject = trimmedStr.slice(0, -1);
        subject = subject.replace(/[^a-zA-Z ]/g, "")
        console.log("Subject: ", subject);
        var str =  JSON.stringify(headers.get('from'));
        var arr = str.split(",");
        arr = arr[0].split(":");
        trimmedStr = arr[2].substr(1);
        var fromStr = trimmedStr.slice(0, -1);
        console.log("From: ", trimmedStr);
        console.log("uid " + uid);
        connection.query("INSERT INTO msg_t (uid, msg_id, msg_path, from_add, subject) SELECT " + uid + "," + seqno + ", 'messages/msg-" + seqno + "-body.html', '"+ fromStr +"', '" + subject + "' WHERE NOT EXISTS (SELECT 1 FROM msg_t WHERE msg_id = " + seqno + " AND uid = " + uid + ")");
    });

    parser.on('data', data => {
        if (data.type === 'text') {
        
            // write message text to file
            fs.writeFile('messages/msg-' + seqno + '-body.html', data.html, 'utf8', (err) => {  
                // throws an error, you could also catch it here
                if (err) throw err;
            });
        }
     });

    msg.on("body", function(stream) {
        stream.on("data", function(chunk) {
            parser.write(chunk.toString("utf8"));
        });
    });

    msg.once("end", function() {
        parser.end();
    });
}

function configImap()
{
    
    imap.once('ready', function() {
        openInbox(function(err, box) {
            var msgCntr = 0;
            var inboxObj = [{
                'ID': 1,
                'body': 2,
            }];

            if (err) throw err;

            imap.search([ 'UNSEEN', ['SINCE', 'Jun 12, 2019'] ], function(err, results) {
                if (err) throw err;

                var f = imap.fetch(results, { bodies: "" });
                //f.on("message", processMessage);

                f.on('message', function(msg, seqno) {
                    inboxObj[msgCntr].ID = seqno;
                    
                    console.log('Message #%d', seqno);
                    var prefix = '(#' + seqno + ')' ;

                    // process email message
                    // store to file
                    processMessage(msg, seqno);

                    msg.on('body', function(chunk) {
                        console.log(chunk);

                        // record entry in database
                        //connection.query("INSERT INTO msg_t (uid, msg_id, msg) SELECT 1," + seqno + ", 'messages/msg-" + seqno + "-body.html' WHERE NOT EXISTS (SELECT 1 FROM msg_t WHERE msg_id = " + seqno + ")");
                    });

                    msg.on('body', function(stream, info) {
                        //stream.pipe(fs.createWriteStream('messages/msg-' + seqno + '-body.txt'));
                    });
                    
                    msg.once('attributes', function(attrs) {
                        console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
                    });

                    msg.once('end', function() {
                        console.log(prefix + 'Finished');
                    });
                });
                
                f.once('error', function(err) {
                    console.log('Fetch error: ' + err);
                });
                f.once('end', function() {
                    console.log('Done fetching all messages!');
                    imap.end();
                });
            });
        });
    });

    imap.once('error', function(err) {
    console.log(err);
    });
    imap.once('end', function() {
    console.log('Connection ended');
    });
    imap.connect();


}
app.get('/', (req, res) => {
    res.render('contact');
});

app.post('/send', (req, res) => {
    console.log(req.body);
    const output = `<p>You have a new contact request<\p>
    <h3>Contact Details</h3>
    <ul>
    <li>Name: ${req.body.name}</li>
    <li>Company: ${req.body.company}</li>
    <li>Email: ${req.body.email}</li>
    <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    `;
});

app.listen(3000, () => console.log('Server started...'));

