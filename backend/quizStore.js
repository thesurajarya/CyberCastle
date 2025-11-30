// Shared quiz store and question pools
const questionsStore = {}; // stores the last generated quiz per topic
const userStats = {};

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
    {
      id: 'net_fill_1',
      type: 'fill',
      text: 'In a man-in-the-middle (MITM) attack, the attacker _ _ _ _ _ _ _ _ _ communications between two parties.',
      answer: 'intercepts',
      subtopicKey: 'mitm-attacks'
    },
    {
      id: 'net_fill_2',
      type: 'fill',
      text: 'DNS spoofing works by providing a fake _ _ address for a given domain.',
      answer: 'ip',
      subtopicKey: 'dns-spoofing'
    },
    {
      id: 'net_fill_3',
      type: 'fill',
      text: 'A network attack that tries to make a service unavailable by overwhelming it with traffic is called a _ _ _ _ attack.',
      answer: 'ddos',
      subtopicKey: 'ddos-attacks'
    },
    {
      id: 'net_fill_4',
      type: 'fill',
      text: 'An attack that only listens to network traffic without modifying it is called a _ _ _ _ _ _ _ attack.',
      answer: 'passive',
      subtopicKey: 'mitm-attacks'
    },
    {
      id: 'net_fill_5',
      type: 'fill',
      text: 'Using HTTPS instead of HTTP helps prevent _ _ _ _ attacks on web traffic.',
      answer: 'mitm',
      subtopicKey: 'mitm-attacks'
    },
    {
      id: 'net_fill_6',
      type: 'fill',
      text: 'To validate DNS responses and prevent tampering, the protocol extension _ _ _ _ _ _ can be used.',
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
        'Stored in the user\'s browser cache',
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
    {
      id: 'web_fill_1',
      type: 'fill',
      text: 'In SQL injection, user input is directly concatenated into an SQL _ _ _ _ _.',
      answer: 'query',
      subtopicKey: 'sql-injection'
    },
    {
      id: 'web_fill_2',
      type: 'fill',
      text: 'A web attack that injects JavaScript into pages viewed by other users is called _ _ _.',
      answer: 'xss',
      subtopicKey: 'xss-attacks'
    },
    {
      id: 'web_fill_3',
      type: 'fill',
      text: 'CSRF stands for Cross-Site _ _ _ _ _ _ _ Forgery.',
      answer: 'request',
      subtopicKey: 'csrf-attacks'
    },
    {
      id: 'web_fill_4',
      type: 'fill',
      text: 'Using _ _ _ _ _ _ _ _ _ _ queries is a primary defense against SQL injection.',
      answer: 'parameterized',
      subtopicKey: 'sql-injection'
    },
    {
      id: 'web_fill_5',
      type: 'fill',
      text: 'A policy that restricts from where scripts can be loaded is configured using the _ _ _ _ _ _-_ _ _ _ _ _ _ _-_ _ _ _ _ header.',
      answer: 'content-security-policy',
      subtopicKey: 'xss-attacks'
    },
    {
      id: 'web_fill_6',
      type: 'fill',
      text: 'To defend against CSRF, many sites include a hidden _ _ _ _ _ in forms that the attacker cannot guess.',
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
    {
      id: 'auth_fill_1',
      type: 'fill',
      text: 'An attack where all possible passwords are tried is called a _ _ _ _ _  _ _ _ _ _ attack.',
      answer: 'brute force',
      subtopicKey: 'brute-force'
    },
    {
      id: 'auth_fill_2',
      type: 'fill',
      text: 'Using a stolen password database from one site to log into many other sites is called _ _ _ _ _ _ _ _ _ _ stuffing.',
      answer: 'credential',
      subtopicKey: 'credential-stuffing'
    },
    {
      id: 'auth_fill_3',
      type: 'fill',
      text: 'Multi-Factor Authentication typically combines at least two of: something you know, something you have, and something you _ _ _.',
      answer: 'are',
      subtopicKey: 'brute-force'
    },
    {
      id: 'auth_fill_4',
      type: 'fill',
      text: 'Emails pretending to be from trusted organizations asking for your password are an example of _ _ _ _ _ _ _.',
      answer: 'phishing',
      subtopicKey: 'phishing'
    },
    {
      id: 'auth_fill_5',
      type: 'fill',
      text: 'A small piece of software that records every key pressed is called a _ _ _ _ _ _ _ _ _.',
      answer: 'keylogger',
      subtopicKey: 'phishing'
    },
    {
      id: 'auth_fill_6',
      type: 'fill',
      text: 'To reduce credential stuffing risk, users should use _ _ _ _ _ _ passwords on every site.',
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
    {
      id: 'se_fill_1',
      type: 'fill',
      text: 'Emails that pretend to be from trusted organizations to steal information are called _ _ _ _ _ _ _ emails.',
      answer: 'phishing',
      subtopicKey: 'phishing-tactics'
    },
    {
      id: 'se_fill_2',
      type: 'fill',
      text: 'Creating a fake identity like "IT support" to get a user\'s password is known as _ _ _ _ _ _ _ _ _.',
      answer: 'pretexting',
      subtopicKey: 'pretexting'
    },
    {
      id: 'se_fill_3',
      type: 'fill',
      text: 'Leaving an infected USB labeled "Confidential Salary Data" near employees is an example of _ _ _ _ _ _.',
      answer: 'baiting',
      subtopicKey: 'baiting'
    },
    {
      id: 'se_fill_4',
      type: 'fill',
      text: 'When someone closely follows an employee into a secure area without a badge, it is called _ _ _ _ _ _ _ _.',
      answer: 'tailgating',
      subtopicKey: 'pretexting'
    },
    {
      id: 'se_fill_5',
      type: 'fill',
      text: 'Security awareness _ _ _ _ _ _ _ _ help employees recognize social engineering attempts.',
      answer: 'training',
      subtopicKey: 'phishing-tactics'
    },
    {
      id: 'se_fill_6',
      type: 'fill',
      text: 'Social engineering targets the weakest link in security: the _ _ _ _ _.',
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
    {
      id: 'mal_fill_1',
      type: 'fill',
      text: 'A type of malware that encrypts files and demands money is called _ _ _ _ _ _ _ _ _.',
      answer: 'ransomware',
      subtopicKey: 'ransomware'
    },
    {
      id: 'mal_fill_2',
      type: 'fill',
      text: 'A _ _ _ _ is a self-contained malicious program that spreads automatically over networks.',
      answer: 'worm',
      subtopicKey: 'viruses-worms'
    },
    {
      id: 'mal_fill_3',
      type: 'fill',
      text: 'Malicious software disguised as a harmless or useful program is called a _ _ _ _ _.',
      answer: 'trojan',
      subtopicKey: 'trojans'
    },
    {
      id: 'mal_fill_4',
      type: 'fill',
      text: 'A large group of compromised machines controlled by an attacker is a _ _ _ _ _ _.',
      answer: 'botnet',
      subtopicKey: 'viruses-worms'
    },
    {
      id: 'mal_fill_5',
      type: 'fill',
      text: 'Regular _ _ _ _ _ _ _ are critical to recovering from a ransomware attack without paying.',
      answer: 'backups',
      subtopicKey: 'ransomware'
    },
    {
      id: 'mal_fill_6',
      type: 'fill',
      text: 'Malware that silently records everything you do or type is commonly called _ _ _ _ _ _.',
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
      text: 'An "evil twin" is:',
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
    {
      id: 'wifi_fill_1',
      type: 'fill',
      text: 'A fake Wi-Fi access point used to intercept traffic is called an _ _ _ _ twin.',
      answer: 'evil',
      subtopicKey: 'evil-twin'
    },
    {
      id: 'wifi_fill_2',
      type: 'fill',
      text: 'Capturing and analyzing network packets is known as packet _ _ _ _ _ _ _ _.',
      answer: 'sniffing',
      subtopicKey: 'packet-sniffing'
    },
    {
      id: 'wifi_fill_3',
      type: 'fill',
      text: 'The old and insecure Wi-Fi encryption protocol that can be cracked easily is called _ _ _.',
      answer: 'wep',
      subtopicKey: 'wifi-security'
    },
    {
      id: 'wifi_fill_4',
      type: 'fill',
      text: 'Using a _ _ _ creates an encrypted tunnel over insecure Wi-Fi networks.',
      answer: 'vpn',
      subtopicKey: 'packet-sniffing'
    },
    {
      id: 'wifi_fill_5',
      type: 'fill',
      text: 'The latest Wi-Fi security standard improving on WPA2 is _ _ _ _.',
      answer: 'wpa3',
      subtopicKey: 'wifi-security'
    },
    {
      id: 'wifi_fill_6',
      type: 'fill',
      text: '_ _ _ driving refers to locating Wi-Fi networks by moving around with a device.',
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
    {
      id: 'basic_fill_1',
      type: 'fill',
      text: 'Leaving factory-set usernames and passwords on devices means they still use _ _ _ _ _ _ _ credentials.',
      answer: 'default',
      subtopicKey: 'default-credentials'
    },
    {
      id: 'basic_fill_2',
      type: 'fill',
      text: 'Applying security patches fixes known _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ in software.',
      answer: 'vulnerabilities',
      subtopicKey: 'unpatched-systems'
    },
    {
      id: 'basic_fill_3',
      type: 'fill',
      text: 'A password used on many different sites is called a _ _ _ _ _ _ password.',
      answer: 'reused',
      subtopicKey: 'weak-passwords'
    },
    {
      id: 'basic_fill_4',
      type: 'fill',
      text: 'Regular _ _ _ _ _ _ _ help restore data after accidental deletion or attacks.',
      answer: 'backups',
      subtopicKey: 'unpatched-systems'
    },
    {
      id: 'basic_fill_5',
      type: 'fill',
      text: 'Giving users only necessary privileges follows the principle of least _ _ _ _ _ _ _ _.',
      answer: 'privilege',
      subtopicKey: 'unpatched-systems'
    },
    {
      id: 'basic_fill_6',
      type: 'fill',
      text: 'Many attacks are successful not due to advanced exploits but due to basic security _ _ _ _ _ _ _ _.',
      answer: 'mistakes',
      subtopicKey: 'weak-passwords'
    }
  ]
};

module.exports = {
  topicQuestions,
  questionsStore,
  userStats
};
