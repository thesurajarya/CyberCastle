require('dotenv').config();
require("./cron/dailyNews");
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/users.routes'));
const dashboardRoutes = require("./routes/dashboard.routes");
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/quiz", require("./routes/quiz.routes"));
app.use("/api/newsletter", require("./routes/newsletter.routes"));


// === AI QUIZ SYSTEM START ===
const Topic = require('./models/topic.model');

const questionsStore = {}; // stores the last generated quiz per topic
const userStats = {};

// Helper: shuffle array
function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Pre-built questions for each topic (MCQ + Fill-in-the-blank)
const topicQuestions = {
  'network-attacks': [
    {
      id: 'net_mcq_1',
      type: 'mcq',
      text: 'What does DDoS stand for?',
      options: [
        'Domain Denial System',
        'Distributed Denial of Service',
        'Data Delivery Over Socket',
        'Distributed Data Output Service'
      ],
      correctIndex: 1,
      subtopicKey: 'ddos-attacks'
    },
    {
      id: 'net_mcq_2',
      type: 'mcq',
      text: 'Which of the following best describes a DDoS attack?',
      options: [
        'Single system sending normal traffic',
        'Many systems overwhelming a target with traffic',
        'Intercepting communication between two users',
        'Replacing DNS records silently'
      ],
      correctIndex: 1,
      subtopicKey: 'ddos-attacks'
    },
    {
      id: 'net_mcq_3',
      type: 'mcq',
      text: 'Which type of DDoS focuses on exhausting bandwidth?',
      options: [
        'Volumetric attacks',
        'Protocol attacks',
        'Application layer attacks',
        'Physical attacks'
      ],
      correctIndex: 0,
      subtopicKey: 'ddos-attacks'
    },
    {
      id: 'net_mcq_4',
      type: 'mcq',
      text: 'Man-in-the-Middle (MITM) attacks mainly target:',
      options: [
        'Data at rest',
        'Data in transit',
        'Physical hardware',
        'User passwords in a database'
      ],
      correctIndex: 1,
      subtopicKey: 'mitm-attacks'
    },
    {
      id: 'net_mcq_5',
      type: 'mcq',
      text: 'Which technique is commonly used for MITM on local networks?',
      options: [
        'ARP spoofing',
        'Two-factor authentication',
        'Disk encryption',
        'Input validation'
      ],
      correctIndex: 0,
      subtopicKey: 'mitm-attacks'
    },
    {
      id: 'net_mcq_6',
      type: 'mcq',
      text: 'DNS spoofing primarily affects:',
      options: [
        'IP routing tables',
        'Name resolution (domain → IP)',
        'Disk storage',
        'CPU scheduling'
      ],
      correctIndex: 1,
      subtopicKey: 'dns-spoofing'
    },
    {
      id: 'net_mcq_7',
      type: 'mcq',
      text: 'Which of the following helps protect against DNS spoofing?',
      options: [
        'DNSSEC',
        'WPA3',
        'AES disk encryption',
        'Code obfuscation'
      ],
      correctIndex: 0,
      subtopicKey: 'dns-spoofing'
    },
    {
      id: 'net_mcq_8',
      type: 'mcq',
      text: 'A passive network attack is mainly about:',
      options: [
        'Altering packets in transit',
        'Blocking all traffic',
        'Eavesdropping and monitoring',
        'Deleting log files'
      ],
      correctIndex: 2,
      subtopicKey: 'mitm-attacks'
    },
    {
      id: 'net_mcq_9',
      type: 'mcq',
      text: 'Which of these is an active attack?',
      options: [
        'Traffic analysis',
        'Packet sniffing',
        'Service interruption',
        'Log monitoring'
      ],
      correctIndex: 2,
      subtopicKey: 'ddos-attacks'
    },
    {
      id: 'net_mcq_10',
      type: 'mcq',
      text: 'Which security control helps protect data in transit from MITM?',
      options: [
        'HTTPS/TLS',
        'File permissions',
        'Antivirus',
        'Disk quotas'
      ],
      correctIndex: 0,
      subtopicKey: 'mitm-attacks'
    },

    // Fill-in-the-blank
    {
      id: 'net_fill_1',
      type: 'fill',
      text: 'In a man-in-the-middle (MITM) attack, the attacker ______ communications between two parties.',
      answer: 'intercepts',
      subtopicKey: 'mitm-attacks'
    },
    {
      id: 'net_fill_2',
      type: 'fill',
      text: 'DNS spoofing works by providing a fake ______ address for a given domain.',
      answer: 'ip',
      subtopicKey: 'dns-spoofing'
    },
    {
      id: 'net_fill_3',
      type: 'fill',
      text: 'A network attack that tries to make a service unavailable by overwhelming it with traffic is called a ______ attack.',
      answer: 'ddos',
      subtopicKey: 'ddos-attacks'
    },
    {
      id: 'net_fill_4',
      type: 'fill',
      text: 'An attack that only listens to network traffic without modifying it is called a ______ attack.',
      answer: 'passive',
      subtopicKey: 'mitm-attacks'
    },
    {
      id: 'net_fill_5',
      type: 'fill',
      text: 'Using HTTPS instead of HTTP helps prevent ______ attacks on web traffic.',
      answer: 'mitm',
      subtopicKey: 'mitm-attacks'
    },
    {
      id: 'net_fill_6',
      type: 'fill',
      text: 'To validate DNS responses and prevent tampering, the protocol extension ______ can be used.',
      answer: 'dnssec',
      subtopicKey: 'dns-spoofing'
    }
  ],

  'web-application-attacks': [
    {
      id: 'web_mcq_1',
      type: 'mcq',
      text: 'What is SQL Injection?',
      options: [
        'Injecting CSS into a webpage',
        'Inserting malicious SQL into queries',
        'Injecting JavaScript into HTML',
        'Changing HTTP headers only'
      ],
      correctIndex: 1,
      subtopicKey: 'sql-injection'
    },
    {
      id: 'web_mcq_2',
      type: 'mcq',
      text: 'XSS stands for:',
      options: [
        'XML Secure Shell',
        'Cross-Site Scripting',
        'External Security Service',
        'Cross Server Security'
      ],
      correctIndex: 1,
      subtopicKey: 'xss-attacks'
    },
    {
      id: 'web_mcq_3',
      type: 'mcq',
      text: 'CSRF attacks mainly:',
      options: [
        'Steal database backups directly',
        'Trick authenticated users into unwanted actions',
        'Modify server configuration files',
        'Only deface websites'
      ],
      correctIndex: 1,
      subtopicKey: 'csrf-attacks'
    },
    {
      id: 'web_mcq_4',
      type: 'mcq',
      text: 'Which best prevents SQL Injection?',
      options: [
        'Long passwords',
        'Prepared statements / parameterized queries',
        'VPN usage',
        'Static HTML pages'
      ],
      correctIndex: 1,
      subtopicKey: 'sql-injection'
    },
    {
      id: 'web_mcq_5',
      type: 'mcq',
      text: 'Which helps prevent XSS?',
      options: [
        'Output encoding and input validation',
        'Only HTTPS',
        'Database encryption',
        'Local firewalls'
      ],
      correctIndex: 0,
      subtopicKey: 'xss-attacks'
    },
    {
      id: 'web_mcq_6',
      type: 'mcq',
      text: 'Stored XSS means the malicious script is:',
      options: [
        'Generated only in the URL',
        'Stored on the server/database',
        'Stored in the user’s browser cache',
        'Sent only via HTTP headers'
      ],
      correctIndex: 1,
      subtopicKey: 'xss-attacks'
    },
    {
      id: 'web_mcq_7',
      type: 'mcq',
      text: 'Which header helps reduce XSS impact?',
      options: [
        'Content-Security-Policy',
        'Content-Length',
        'Accept-Language',
        'User-Agent'
      ],
      correctIndex: 0,
      subtopicKey: 'xss-attacks'
    },
    {
      id: 'web_mcq_8',
      type: 'mcq',
      text: 'CSRF defenses often rely on:',
      options: [
        'CSRF tokens and SameSite cookies',
        'Encrypting HTML files',
        'Minifying JavaScript',
        'Using GET instead of POST'
      ],
      correctIndex: 0,
      subtopicKey: 'csrf-attacks'
    },
    {
      id: 'web_mcq_9',
      type: 'mcq',
      text: 'Broken authentication in web apps usually leads to:',
      options: [
        'Better performance',
        'Easier styling',
        'Account takeover',
        'More logs'
      ],
      correctIndex: 2,
      subtopicKey: 'sql-injection'
    },
    {
      id: 'web_mcq_10',
      type: 'mcq',
      text: 'Using components with known vulnerabilities is dangerous because:',
      options: [
        'They reduce code size',
        'Attackers know how to exploit them',
        'They are faster',
        'They are always outdated'
      ],
      correctIndex: 1,
      subtopicKey: 'sql-injection'
    },

    // Fill-in-the-blank
    {
      id: 'web_fill_1',
      type: 'fill',
      text: 'In SQL injection, user input is directly concatenated into an SQL ______.',
      answer: 'query',
      subtopicKey: 'sql-injection'
    },
    {
      id: 'web_fill_2',
      type: 'fill',
      text: 'A web attack that injects JavaScript into pages viewed by other users is called ______.',
      answer: 'xss',
      subtopicKey: 'xss-attacks'
    },
    {
      id: 'web_fill_3',
      type: 'fill',
      text: 'CSRF stands for Cross-Site ______ Forgery.',
      answer: 'request',
      subtopicKey: 'csrf-attacks'
    },
    {
      id: 'web_fill_4',
      type: 'fill',
      text: 'Using ______ queries is a primary defense against SQL injection.',
      answer: 'parameterized',
      subtopicKey: 'sql-injection'
    },
    {
      id: 'web_fill_5',
      type: 'fill',
      text: 'A policy that restricts from where scripts can be loaded is configured using the ______ header.',
      answer: 'content-security-policy',
      subtopicKey: 'xss-attacks'
    },
    {
      id: 'web_fill_6',
      type: 'fill',
      text: 'To defend against CSRF, many sites include a hidden ______ in forms that the attacker cannot guess.',
      answer: 'token',
      subtopicKey: 'csrf-attacks'
    }
  ],

  'authentication-attacks': [
    {
      id: 'auth_mcq_1',
      type: 'mcq',
      text: 'What is brute force in authentication?',
      options: [
        'Guessing based on hints',
        'Trying all possible passwords systematically',
        'Using social engineering only',
        'Using malware only'
      ],
      correctIndex: 1,
      subtopicKey: 'brute-force'
    },
    {
      id: 'auth_mcq_2',
      type: 'mcq',
      text: 'MFA stands for:',
      options: [
        'Maximum File Access',
        'Multi-Factor Authentication',
        'Multi File Authorization',
        'Main Factor Authentication'
      ],
      correctIndex: 1,
      subtopicKey: 'brute-force'
    },
    {
      id: 'auth_mcq_3',
      type: 'mcq',
      text: 'Credential stuffing uses:',
      options: [
        'Random passwords',
        'Leaked username-password pairs',
        'Biometric data only',
        'Time-based tokens only'
      ],
      correctIndex: 1,
      subtopicKey: 'credential-stuffing'
    },
    {
      id: 'auth_mcq_4',
      type: 'mcq',
      text: 'Which defense helps against brute-force attacks?',
      options: [
        'Open Wi-Fi',
        'Account lockout after several failures',
        'Disabling HTTPS',
        'Short passwords'
      ],
      correctIndex: 1,
      subtopicKey: 'brute-force'
    },
    {
      id: 'auth_mcq_5',
      type: 'mcq',
      text: 'Phishing attacks mainly try to:',
      options: [
        'Overload servers',
        'Trick users into revealing credentials',
        'Replace DNS records',
        'Encrypt hard drives'
      ],
      correctIndex: 1,
      subtopicKey: 'phishing'
    },
    {
      id: 'auth_mcq_6',
      type: 'mcq',
      text: 'Password spraying differs from brute force by:',
      options: [
        'Using one password across many accounts',
        'Using many passwords on one account',
        'Not using passwords at all',
        'Only using biometrics'
      ],
      correctIndex: 0,
      subtopicKey: 'brute-force'
    },
    {
      id: 'auth_mcq_7',
      type: 'mcq',
      text: 'Which is a good additional factor in MFA?',
      options: [
        'Username',
        'One-time password from an app',
        'Birthdate',
        'Email address'
      ],
      correctIndex: 1,
      subtopicKey: 'brute-force'
    },
    {
      id: 'auth_mcq_8',
      type: 'mcq',
      text: 'Keylogging attacks mainly target:',
      options: [
        'Network switches',
        'Keystrokes to capture passwords',
        'Disk sectors',
        'Log files'
      ],
      correctIndex: 1,
      subtopicKey: 'phishing'
    },
    {
      id: 'auth_mcq_9',
      type: 'mcq',
      text: 'Reusing the same password on multiple sites increases the risk of:',
      options: [
        'DDoS',
        'Credential stuffing',
        'XSS',
        'SQL injection'
      ],
      correctIndex: 1,
      subtopicKey: 'credential-stuffing'
    },
    {
      id: 'auth_mcq_10',
      type: 'mcq',
      text: 'Which of these is NOT a good authentication practice?',
      options: [
        'Using MFA',
        'Changing default passwords',
        'Using unique passwords per site',
        'Writing passwords on a sticky note at your desk'
      ],
      correctIndex: 3,
      subtopicKey: 'phishing'
    },

    // Fill-in-the-blank
    {
      id: 'auth_fill_1',
      type: 'fill',
      text: 'An attack where all possible passwords are tried is called a ______ attack.',
      answer: 'brute force',
      subtopicKey: 'brute-force'
    },
    {
      id: 'auth_fill_2',
      type: 'fill',
      text: 'Using a stolen password database from one site to log into many other sites is called ______ stuffing.',
      answer: 'credential',
      subtopicKey: 'credential-stuffing'
    },
    {
      id: 'auth_fill_3',
      type: 'fill',
      text: 'Multi-Factor Authentication typically combines at least two of: something you know, something you have, and something you ______.',
      answer: 'are',
      subtopicKey: 'brute-force'
    },
    {
      id: 'auth_fill_4',
      type: 'fill',
      text: 'Emails pretending to be from trusted organizations asking for your password are an example of ______.',
      answer: 'phishing',
      subtopicKey: 'phishing'
    },
    {
      id: 'auth_fill_5',
      type: 'fill',
      text: 'A small piece of software that records every key pressed is called a ______.',
      answer: 'keylogger',
      subtopicKey: 'phishing'
    },
    {
      id: 'auth_fill_6',
      type: 'fill',
      text: 'To reduce credential stuffing risk, users should use ______ passwords on every site.',
      answer: 'unique',
      subtopicKey: 'credential-stuffing'
    }
  ],

  'social-engineering': [
    {
      id: 'se_mcq_1',
      type: 'mcq',
      text: 'Social engineering primarily exploits:',
      options: [
        'Hardware vulnerabilities',
        'Human psychology',
        'Firewall misconfigurations',
        'Encryption weaknesses'
      ],
      correctIndex: 1,
      subtopicKey: 'phishing-tactics'
    },
    {
      id: 'se_mcq_2',
      type: 'mcq',
      text: 'Pretexting involves:',
      options: [
        'Sending random files',
        'Creating a believable fake story or identity',
        'Encrypting emails',
        'Sniffing packets'
      ],
      correctIndex: 1,
      subtopicKey: 'pretexting'
    },
    {
      id: 'se_mcq_3',
      type: 'mcq',
      text: 'Baiting commonly uses:',
      options: [
        'Free infected USB drives',
        'Strong passwords',
        'Encrypted backups',
        'DNSSEC'
      ],
      correctIndex: 0,
      subtopicKey: 'baiting'
    },
    {
      id: 'se_mcq_4',
      type: 'mcq',
      text: 'Which is a strong defense against social engineering?',
      options: [
        'Larger firewalls',
        'User awareness training',
        'More servers',
        'Open doors'
      ],
      correctIndex: 1,
      subtopicKey: 'phishing-tactics'
    },
    {
      id: 'se_mcq_5',
      type: 'mcq',
      text: 'Vishing is social engineering over:',
      options: [
        'Email',
        'Phone calls/voice',
        'SMS only',
        'Web forms'
      ],
      correctIndex: 1,
      subtopicKey: 'phishing-tactics'
    },
    {
      id: 'se_mcq_6',
      type: 'mcq',
      text: 'Tailgating involves:',
      options: [
        'Following someone through a secure door without authorization',
        'Tracking email replies',
        'Following network packets',
        'Following DNS requests'
      ],
      correctIndex: 0,
      subtopicKey: 'pretexting'
    },
    {
      id: 'se_mcq_7',
      type: 'mcq',
      text: 'A typical phishing red flag is:',
      options: [
        'Perfect grammar',
        'Urgent language and threats',
        'Correct domain name',
        'Explicit verification links'
      ],
      correctIndex: 1,
      subtopicKey: 'phishing-tactics'
    },
    {
      id: 'se_mcq_8',
      type: 'mcq',
      text: 'Reverse social engineering means:',
      options: [
        'Victims contacting the attacker for help',
        'Attacker calling the victim directly',
        'Using encryption in reverse',
        'Reversing phishing emails'
      ],
      correctIndex: 0,
      subtopicKey: 'pretexting'
    },
    {
      id: 'se_mcq_9',
      type: 'mcq',
      text: 'Baiting attacks rely heavily on:',
      options: [
        'Curiosity or greed',
        'CPU load',
        'Network congestion',
        'Logs size'
      ],
      correctIndex: 0,
      subtopicKey: 'baiting'
    },
    {
      id: 'se_mcq_10',
      type: 'mcq',
      text: 'Which simple action can often stop social engineering?',
      options: [
        'Blindly trusting all emails',
        'Verifying requests through official channels',
        'Clicking links quickly',
        'Providing details on social media'
      ],
      correctIndex: 1,
      subtopicKey: 'phishing-tactics'
    },

    // Fill-in-the-blank
    {
      id: 'se_fill_1',
      type: 'fill',
      text: 'Emails that pretend to be from trusted organizations to steal information are called ______ emails.',
      answer: 'phishing',
      subtopicKey: 'phishing-tactics'
    },
    {
      id: 'se_fill_2',
      type: 'fill',
      text: 'Creating a fake identity like “IT support” to get a user’s password is known as ______.',
      answer: 'pretexting',
      subtopicKey: 'pretexting'
    },
    {
      id: 'se_fill_3',
      type: 'fill',
      text: 'Leaving an infected USB labeled “Confidential Salary Data” near employees is an example of ______.',
      answer: 'baiting',
      subtopicKey: 'baiting'
    },
    {
      id: 'se_fill_4',
      type: 'fill',
      text: 'When someone closely follows an employee into a secure area without a badge, it is called ______.',
      answer: 'tailgating',
      subtopicKey: 'pretexting'
    },
    {
      id: 'se_fill_5',
      type: 'fill',
      text: 'Security awareness ______ help employees recognize social engineering attempts.',
      answer: 'training',
      subtopicKey: 'phishing-tactics'
    },
    {
      id: 'se_fill_6',
      type: 'fill',
      text: 'Social engineering targets the weakest link in security: the ______.',
      answer: 'human',
      subtopicKey: 'phishing-tactics'
    }
  ],

  'malware': [
    {
      id: 'mal_mcq_1',
      type: 'mcq',
      text: 'A virus requires which of the following to spread?',
      options: [
        'A host file or program',
        'Only a network cable',
        'DNS server',
        'Encrypted disk'
      ],
      correctIndex: 0,
      subtopicKey: 'viruses-worms'
    },
    {
      id: 'mal_mcq_2',
      type: 'mcq',
      text: 'Worms are different from viruses because they:',
      options: [
        'Cannot spread automatically',
        'Do not require a host file',
        'Only infect mobile phones',
        'Only work offline'
      ],
      correctIndex: 1,
      subtopicKey: 'viruses-worms'
    },
    {
      id: 'mal_mcq_3',
      type: 'mcq',
      text: 'Ransomware typically:',
      options: [
        'Steals hardware',
        'Encrypts data and demands payment',
        'Deletes the operating system only',
        'Attacks only routers'
      ],
      correctIndex: 1,
      subtopicKey: 'ransomware'
    },
    {
      id: 'mal_mcq_4',
      type: 'mcq',
      text: 'Trojans usually:',
      options: [
        'Appear as legitimate software',
        'Always self-replicate',
        'Encrypt the hard disk by default',
        'Come only via USB'
      ],
      correctIndex: 0,
      subtopicKey: 'trojans'
    },
    {
      id: 'mal_mcq_5',
      type: 'mcq',
      text: 'A botnet is:',
      options: [
        'A type of antivirus',
        'A network of compromised machines under attacker control',
        'A firewall rule set',
        'A safe browser plugin'
      ],
      correctIndex: 1,
      subtopicKey: 'viruses-worms'
    },
    {
      id: 'mal_mcq_6',
      type: 'mcq',
      text: 'Which of these reduces ransomware impact the most?',
      options: [
        'Open Wi-Fi',
        'Regular offline backups',
        'Using weak passwords',
        'Ignoring updates'
      ],
      correctIndex: 1,
      subtopicKey: 'ransomware'
    },
    {
      id: 'mal_mcq_7',
      type: 'mcq',
      text: 'Spyware mainly:',
      options: [
        'Encrypts files',
        'Monitors user activity secretly',
        'Changes screen resolution',
        'Formats disks'
      ],
      correctIndex: 1,
      subtopicKey: 'trojans'
    },
    {
      id: 'mal_mcq_8',
      type: 'mcq',
      text: 'Rootkits are dangerous because they:',
      options: [
        'Are easy to detect',
        'Hide at low levels with high privileges',
        'Only affect applications',
        'Automatically uninstall themselves'
      ],
      correctIndex: 1,
      subtopicKey: 'trojans'
    },
    {
      id: 'mal_mcq_9',
      type: 'mcq',
      text: 'Which is a common way malware enters systems?',
      options: [
        'Secure coding practices',
        'Opening malicious email attachments',
        'Regular patching',
        'Using MFA'
      ],
      correctIndex: 1,
      subtopicKey: 'viruses-worms'
    },
    {
      id: 'mal_mcq_10',
      type: 'mcq',
      text: 'Which combination is best for general malware protection?',
      options: [
        'Antivirus + regular backups',
        'Open ports + guest accounts',
        'Default passwords + no firewall',
        'Public Wi-Fi + admin access'
      ],
      correctIndex: 0,
      subtopicKey: 'ransomware'
    },

    // Fill-in-the-blank
    {
      id: 'mal_fill_1',
      type: 'fill',
      text: 'A type of malware that encrypts files and demands money is called ______.',
      answer: 'ransomware',
      subtopicKey: 'ransomware'
    },
    {
      id: 'mal_fill_2',
      type: 'fill',
      text: 'A ______ is a self-contained malicious program that spreads automatically over networks.',
      answer: 'worm',
      subtopicKey: 'viruses-worms'
    },
    {
      id: 'mal_fill_3',
      type: 'fill',
      text: 'Malicious software disguised as a harmless or useful program is called a ______.',
      answer: 'trojan',
      subtopicKey: 'trojans'
    },
    {
      id: 'mal_fill_4',
      type: 'fill',
      text: 'A large group of compromised machines controlled by an attacker is a ______.',
      answer: 'botnet',
      subtopicKey: 'viruses-worms'
    },
    {
      id: 'mal_fill_5',
      type: 'fill',
      text: 'Regular ______ are critical to recovering from a ransomware attack without paying.',
      answer: 'backups',
      subtopicKey: 'ransomware'
    },
    {
      id: 'mal_fill_6',
      type: 'fill',
      text: 'Malware that silently records everything you do or type is commonly called ______.',
      answer: 'spyware',
      subtopicKey: 'trojans'
    }
  ],

  'wireless-attacks': [
    {
      id: 'wifi_mcq_1',
      type: 'mcq',
      text: 'Wi-Fi signals are:',
      options: [
        'Always wired',
        'Broadcast over radio waves',
        'Visible light only',
        'Encrypted by default'
      ],
      correctIndex: 1,
      subtopicKey: 'wifi-security'
    },
    {
      id: 'wifi_mcq_2',
      type: 'mcq',
      text: 'Which Wi-Fi security protocol is considered outdated and insecure?',
      options: [
        'WPA3',
        'WPA2',
        'WEP',
        'None of these'
      ],
      correctIndex: 2,
      subtopicKey: 'wifi-security'
    },
    {
      id: 'wifi_mcq_3',
      type: 'mcq',
      text: 'An “evil twin” is:',
      options: [
        'A duplicate MAC address',
        'A fake Wi-Fi access point mimicking a real one',
        'A type of encryption',
        'A VPN protocol'
      ],
      correctIndex: 1,
      subtopicKey: 'evil-twin'
    },
    {
      id: 'wifi_mcq_4',
      type: 'mcq',
      text: 'Packet sniffing on Wi-Fi allows attackers to:',
      options: [
        'Physically destroy routers',
        'Capture network traffic',
        'Update firmware',
        'Change SSID automatically'
      ],
      correctIndex: 1,
      subtopicKey: 'packet-sniffing'
    },
    {
      id: 'wifi_mcq_5',
      type: 'mcq',
      text: 'Which combination best protects wireless traffic on public Wi-Fi?',
      options: [
        'No password + HTTP',
        'VPN + HTTPS',
        'Open Wi-Fi + FTP',
        'WEP + Telnet'
      ],
      correctIndex: 1,
      subtopicKey: 'packet-sniffing'
    },
    {
      id: 'wifi_mcq_6',
      type: 'mcq',
      text: 'WPA3 is:',
      options: [
        'The latest Wi-Fi security standard with improved protection',
        'A file compression tool',
        'An antivirus name',
        'A router hardware version'
      ],
      correctIndex: 0,
      subtopicKey: 'wifi-security'
    },
    {
      id: 'wifi_mcq_7',
      type: 'mcq',
      text: 'Disabling WPS (Wi-Fi Protected Setup) is recommended because:',
      options: [
        'It improves speed',
        'WPS has known security weaknesses',
        'It blocks all devices',
        'It disables SSID broadcast'
      ],
      correctIndex: 1,
      subtopicKey: 'wifi-security'
    },
    {
      id: 'wifi_mcq_8',
      type: 'mcq',
      text: 'War driving is the act of:',
      options: [
        'Attacking cars remotely',
        'Driving around to find Wi-Fi networks',
        'Flooding networks with traffic',
        'Replacing routers physically'
      ],
      correctIndex: 1,
      subtopicKey: 'wifi-security'
    },
    {
      id: 'wifi_mcq_9',
      type: 'mcq',
      text: 'Jamming a wireless network is an example of:',
      options: [
        'DoS attack on wireless',
        'SQL injection',
        'Phishing',
        'Keylogging'
      ],
      correctIndex: 0,
      subtopicKey: 'packet-sniffing'
    },
    {
      id: 'wifi_mcq_10',
      type: 'mcq',
      text: 'Which setting should you prefer on a home Wi-Fi router?',
      options: [
        'Open network without password',
        'WPA3 or WPA2-PSK with strong password',
        'WEP with short key',
        'Guest network with same password for all'
      ],
      correctIndex: 1,
      subtopicKey: 'wifi-security'
    },

    // Fill-in-the-blank
    {
      id: 'wifi_fill_1',
      type: 'fill',
      text: 'A fake Wi-Fi access point used to intercept traffic is called an ______ twin.',
      answer: 'evil',
      subtopicKey: 'evil-twin'
    },
    {
      id: 'wifi_fill_2',
      type: 'fill',
      text: 'Capturing and analyzing network packets is known as packet ______.',
      answer: 'sniffing',
      subtopicKey: 'packet-sniffing'
    },
    {
      id: 'wifi_fill_3',
      type: 'fill',
      text: 'The old and insecure Wi-Fi encryption protocol that can be cracked easily is called ______.',
      answer: 'wep',
      subtopicKey: 'wifi-security'
    },
    {
      id: 'wifi_fill_4',
      type: 'fill',
      text: 'Using a ______ creates an encrypted tunnel over insecure Wi-Fi networks.',
      answer: 'vpn',
      subtopicKey: 'packet-sniffing'
    },
    {
      id: 'wifi_fill_5',
      type: 'fill',
      text: 'The latest Wi-Fi security standard improving on WPA2 is ______.',
      answer: 'wpa3',
      subtopicKey: 'wifi-security'
    },
    {
      id: 'wifi_fill_6',
      type: 'fill',
      text: '________ driving refers to locating Wi-Fi networks by moving around with a device.',
      answer: 'war',
      subtopicKey: 'wifi-security'
    }
  ],

  'basic-security-issues': [
    {
      id: 'basic_mcq_1',
      type: 'mcq',
      text: 'A strong password generally has:',
      options: [
        'At least 4 characters',
        'At least 12+ characters with mix of types',
        'Only lowercase letters',
        'Only numbers'
      ],
      correctIndex: 1,
      subtopicKey: 'weak-passwords'
    },
    {
      id: 'basic_mcq_2',
      type: 'mcq',
      text: 'Default credentials on devices are:',
      options: [
        'Always safe',
        'A critical vulnerability',
        'Randomized for each user',
        'Not related to security'
      ],
      correctIndex: 1,
      subtopicKey: 'default-credentials'
    },
    {
      id: 'basic_mcq_3',
      type: 'mcq',
      text: 'Unpatched systems are dangerous because:',
      options: [
        'They run faster',
        'They contain known vulnerabilities attackers can exploit',
        'They use less memory',
        'They are offline'
      ],
      correctIndex: 1,
      subtopicKey: 'unpatched-systems'
    },
    {
      id: 'basic_mcq_4',
      type: 'mcq',
      text: 'Backups primarily protect against:',
      options: [
        'Password guessing',
        'Data loss',
        'Network sniffing',
        'Physical theft'
      ],
      correctIndex: 1,
      subtopicKey: 'unpatched-systems'
    },
    {
      id: 'basic_mcq_5',
      type: 'mcq',
      text: 'Which is a poor security practice?',
      options: [
        'Changing default passwords',
        'Writing passwords on sticky notes on your monitor',
        'Updating systems regularly',
        'Using MFA'
      ],
      correctIndex: 1,
      subtopicKey: 'weak-passwords'
    },
    {
      id: 'basic_mcq_6',
      type: 'mcq',
      text: 'Least privilege means:',
      options: [
        'Giving every user admin access',
        'Giving users only the access they need to do their job',
        'Removing all access',
        'Allowing guest logins'
      ],
      correctIndex: 1,
      subtopicKey: 'unpatched-systems'
    },
    {
      id: 'basic_mcq_7',
      type: 'mcq',
      text: 'Which of these should be done regularly?',
      options: [
        'Ignoring security warnings',
        'Applying security patches and updates',
        'Sharing passwords',
        'Using default router passwords'
      ],
      correctIndex: 1,
      subtopicKey: 'unpatched-systems'
    },
    {
      id: 'basic_mcq_8',
      type: 'mcq',
      text: 'Which password is strongest?',
      options: [
        'password123',
        'MyName2003',
        'X!q9v#2Lm@7s',
        'qwerty'
      ],
      correctIndex: 2,
      subtopicKey: 'weak-passwords'
    },
    {
      id: 'basic_mcq_9',
      type: 'mcq',
      text: 'Inadequate monitoring may cause:',
      options: [
        'Attacks to go undetected for long periods',
        'Better performance',
        'Fewer logs to store',
        'Automatic patching'
      ],
      correctIndex: 0,
      subtopicKey: 'unpatched-systems'
    },
    {
      id: 'basic_mcq_10',
      type: 'mcq',
      text: 'Which of the following is a basic security hygiene step?',
      options: [
        'Sharing admin accounts',
        'Disabling all logs',
        'Locking your screen when away',
        'Using simple passwords for convenience'
      ],
      correctIndex: 2,
      subtopicKey: 'weak-passwords'
    },

    // Fill-in-the-blank
    {
      id: 'basic_fill_1',
      type: 'fill',
      text: 'Leaving factory-set usernames and passwords on devices means they still use ______ credentials.',
      answer: 'default',
      subtopicKey: 'default-credentials'
    },
    {
      id: 'basic_fill_2',
      type: 'fill',
      text: 'Applying security patches fixes known ______ in software.',
      answer: 'vulnerabilities',
      subtopicKey: 'unpatched-systems'
    },
    {
      id: 'basic_fill_3',
      type: 'fill',
      text: 'A password used on many different sites is called a ______ password.',
      answer: 'reused',
      subtopicKey: 'weak-passwords'
    },
    {
      id: 'basic_fill_4',
      type: 'fill',
      text: 'Regular ______ help restore data after accidental deletion or attacks.',
      answer: 'backups',
      subtopicKey: 'unpatched-systems'
    },
    {
      id: 'basic_fill_5',
      type: 'fill',
      text: 'Giving users only necessary privileges follows the principle of least ______.',
      answer: 'privilege',
      subtopicKey: 'unpatched-systems'
    },
    {
      id: 'basic_fill_6',
      type: 'fill',
      text: 'Many attacks are successful not due to advanced exploits but due to basic security ______.',
      answer: 'mistakes',
      subtopicKey: 'weak-passwords'
    }
  ]
};

// Get all topics (for listing)
app.get('/api/topics', async (req, res) => {
  try {
    const topics = await Topic.find({}, { html: 0 });
    res.json(topics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

// Get single topic
app.get('/api/topics/:id', async (req, res) => {
  try {
    const topic = await Topic.findOne({ id: req.params.id });
    if (!topic) return res.status(404).json({ error: 'Topic not found' });
    res.json(topic);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch topic' });
  }
});

// Generate quiz - random 5 questions, with 1–2 fill-in-the-blank if available
app.post('/api/quiz/generate', async (req, res) => {
  const { topicId, userId = 'anonymous', mode = 'normal' } = req.body;
  
  try {
    console.log('🔍 Quiz Generate Called');
    console.log('Topic ID:', topicId);
    
    const topic = await Topic.findOne({ id: topicId });
    if (!topic) return res.status(404).json({ error: 'Topic not found' });

    let pool = topicQuestions[topicId] || topicQuestions['network-attacks'];
    if (!pool || pool.length === 0) {
      return res.status(400).json({ error: 'No questions available for this topic' });
    }

    // If revision mode: try to restrict pool to weak subtopics
    if (mode === 'revision') {
      const statsKey = `${userId}_${topicId}`;
      const stats = userStats[statsKey];
      const weakSet = new Set(stats?.weakAreas || []);
      const filtered = pool.filter(q => weakSet.has(q.subtopicKey));
      if (filtered.length > 0) {
        pool = filtered;
      }
    }

    const mcqs = pool.filter(q => q.type === 'mcq');
    const fills = pool.filter(q => q.type === 'fill');

    const desiredTotal = 5;
    const maxFill = Math.min(2, fills.length);
    const minFill = fills.length > 0 ? 1 : 0;
    const fillCount = Math.min(maxFill, Math.max(minFill, 1));

    const chosenFills = fills.sort(() => Math.random() - 0.5).slice(0, fillCount);
    const remaining = desiredTotal - chosenFills.length;
    const chosenMcqs = mcqs.sort(() => Math.random() - 0.5).slice(0, remaining);

    const selected = [...chosenFills, ...chosenMcqs].sort(() => Math.random() - 0.5);

    questionsStore[topicId] = selected;
    console.log(`✅ Selected ${selected.length} questions for ${topicId}`);

    res.json({ questions: selected });
  } catch (error) {
    console.error('❌ Quiz error:', error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});



// Submit quiz results
// Expect answers like: { questionId, selected } 
// - MCQ: selected is a number (option index)
// - FILL: selected is a string (typed answer)
// Submit quiz results
// Frontend sends answers: { questionId, selected }
// - MCQ: selected is a number (option index)
// - FILL: selected is a string (typed answer)
app.post('/api/quiz/submit', (req, res) => {
  const { topicId, userId = 'anonymous', answers } = req.body;
  
  const questions = questionsStore[topicId];
  if (!questions) return res.status(400).json({ error: 'No questions found' });

  let correct = 0;
  const wrongSubtopics = {};

  answers.forEach(ans => {
    const q = questions.find(qq => qq.id === ans.questionId);
    if (!q) return;

    let isCorrect = false;

    if (q.type === 'mcq') {
      // selected is option index
      isCorrect = ans.selected === q.correctIndex;
    } else if (q.type === 'fill') {
      const given = String(ans.selected || '').trim().toLowerCase();
      const expectedArray = Array.isArray(q.answer)
        ? q.answer.map(a => String(a).trim().toLowerCase())
        : [String(q.answer).trim().toLowerCase()];
      isCorrect = expectedArray.includes(given);
    }

    if (isCorrect) {
      correct++;
    } else if (q.subtopicKey) {
      wrongSubtopics[q.subtopicKey] = (wrongSubtopics[q.subtopicKey] || 0) + 1;
    }
  });

  const weakAreas = Object.keys(wrongSubtopics);
  
  const statsKey = `${userId}_${topicId}`;
  const prevStats = userStats[statsKey] || { correct: 0, total: 0, weakAreas: [], subtopicStats: {} };

  // Update per-topic & per-subtopic stats
  userStats[statsKey] = {
    correct: prevStats.correct + correct,
    total: prevStats.total + questions.length,
    weakAreas: weakAreas.length ? weakAreas : prevStats.weakAreas,
    subtopicStats: {
      ...(prevStats.subtopicStats || {}),
      ...Object.fromEntries(
        Object.entries(wrongSubtopics).map(([key, value]) => {
          const prev = (prevStats.subtopicStats || {})[key] || { wrong: 0, seen: 0 };
          return [key, {
            wrong: prev.wrong + value,
            seen: prev.seen + value
          }];
        })
      )
    }
  };

  // Mastery tracking: ≥80% counts as a pass
  const passedThisQuiz = (correct / questions.length) >= 0.8;
  const masteryKey = `${userId}_${topicId}_mastery`;
  const prevMastery = userStats[masteryKey] || { passes: 0 };
  userStats[masteryKey] = {
    passes: prevMastery.passes + (passedThisQuiz ? 1 : 0)
  };

  res.json({
    score: correct,
    total: questions.length,
    weakAreas,
    suggestions: weakAreas.map(w => `Review subtopic: ${w}`)
  });
});

// Get per-topic stats (including subtopicStats)
app.get('/api/progress/:userId/:topicId', (req, res) => {
  const { userId, topicId } = req.params;
  const statsKey = `${userId}_${topicId}`;
  const stats = userStats[statsKey] || { correct: 0, total: 0, weakAreas: [], subtopicStats: {} };

  res.json(stats);
});

// Get mastery info for all topics for a user
app.get('/api/mastery/:userId', (req, res) => {
  const { userId } = req.params;
  const result = {};

  Object.keys(userStats).forEach(key => {
    if (key.startsWith(`${userId}_`) && key.endsWith('_mastery')) {
      const topicId = key.slice(userId.length + 1, -('_mastery'.length));
      const { passes } = userStats[key];
      result[topicId] = { passes, mastered: passes >= 3 };
    }
  });

  res.json(result);
});



// === AI QUIZ SYSTEM END ===

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
