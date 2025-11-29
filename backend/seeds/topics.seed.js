// Load environment variables from .env
require('dotenv').config();

const mongoose = require('mongoose');
const Topic = require('../models/topic.model');

// Read URI once from env
const MONGODB_URI = process.env.MONGODB_URI;
console.log('MONGODB_URI in seed:', MONGODB_URI);

const topicsData = [
  {
    id: "network-attacks",
    title: "Network Attacks",
    description: "Learn about various network-level attacks and defense mechanisms",
    html: `
      <h2>Network Attacks</h2>
      <p>Network attacks are malicious activities targeting computer networks and the data transmitted across them. Understanding these attacks is crucial for cybersecurity professionals.</p>
      
      <h3>Overview</h3>
      <p>Network attacks can be categorized into passive and active attacks:</p>
      <ul>
        <li><strong>Passive Attacks:</strong> Eavesdropping, traffic analysis, monitoring</li>
        <li><strong>Active Attacks:</strong> Modification, fabrication, interruption of services</li>
      </ul>
      
      <h3>Common Network Attacks</h3>
      <p>The most prevalent network attacks include:</p>
      <ul>
        <li>DDoS (Distributed Denial of Service)</li>
        <li>Man-in-the-Middle (MITM)</li>
        <li>DNS Spoofing</li>
        <li>ARP Spoofing</li>
        <li>Packet Sniffing</li>
      </ul>
    `,
    subtopics: [
      {
        id: "ddos-attacks",
        title: "DDoS Attacks",
        content: `
          <h3>Distributed Denial of Service (DDoS)</h3>
          <p>A DDoS attack involves multiple compromised systems (botnet) flooding a target with traffic to overwhelm its resources.</p>
          
          <h4>Types of DDoS:</h4>
          <ul>
            <li><strong>Volumetric Attacks:</strong> Consume bandwidth (UDP floods, DNS amplification)</li>
            <li><strong>Protocol Attacks:</strong> Exploit weaknesses in protocols (SYN floods, fragmented packet attacks)</li>
            <li><strong>Application Layer:</strong> Target web applications (HTTP floods, Slowloris)</li>
          </ul>
          
          <h4>Defense Mechanisms:</h4>
          <ul>
            <li>Rate limiting and traffic filtering</li>
            <li>Anycast network routing</li>
            <li>DDoS mitigation services (Cloudflare, AWS Shield)</li>
            <li>Firewalls and intrusion prevention systems</li>
          </ul>
        `
      },
      {
        id: "mitm-attacks",
        title: "Man-in-the-Middle (MITM)",
        content: `
          <h3>Man-in-the-Middle Attacks</h3>
          <p>MITM attacks occur when an attacker intercepts communications between two parties, potentially eavesdropping or altering messages.</p>
          
          <h4>Attack Vectors:</h4>
          <ul>
            <li>ARP Spoofing - Manipulating ARP tables</li>
            <li>DNS Spoofing - Redirecting to malicious sites</li>
            <li>SSL Stripping - Downgrading HTTPS to HTTP</li>
            <li>Wi-Fi Eavesdropping - Capturing unencrypted traffic</li>
          </ul>
          
          <h4>Prevention:</h4>
          <ul>
            <li>Use HTTPS/TLS encryption</li>
            <li>Implement certificate pinning</li>
            <li>Use VPNs on public networks</li>
            <li>Enable HSTS (HTTP Strict Transport Security)</li>
            <li>Keep ARP tables static</li>
          </ul>
        `
      },
      {
        id: "dns-spoofing",
        title: "DNS Spoofing",
        content: `
          <h3>DNS Spoofing</h3>
          <p>DNS spoofing (DNS poisoning) manipulates DNS responses to redirect users to malicious websites.</p>
          
          <h4>How It Works:</h4>
          <p>The attacker intercepts DNS queries and sends forged responses with false IP addresses, causing users to visit fake sites.</p>
          
          <h4>Protection:</h4>
          <ul>
            <li>DNSSEC (DNS Security Extensions)</li>
            <li>DNS Query Logging</li>
            <li>Use reputable DNS providers</li>
            <li>Implement DNS filtering</li>
          </ul>
        `
      }
    ],
    keyPoints: [
      "DDoS attacks overwhelm systems with traffic",
      "MITM attacks intercept communications",
      "DNS spoofing redirects users to malicious sites",
      "Network attacks can be passive or active",
      "Encryption and authentication prevent many attacks"
    ]
  },

  {
    id: "web-application-attacks",
    title: "Web Application Attacks",
    description: "Understanding vulnerabilities in web applications and how to defend them",
    html: `
      <h2>Web Application Attacks</h2>
      <p>Web application attacks target vulnerabilities in web-based software to steal data, deface sites, or gain unauthorized access.</p>
      
      <h3>Top Web Application Vulnerabilities (OWASP Top 10)</h3>
      <ul>
        <li>SQL Injection</li>
        <li>Cross-Site Scripting (XSS)</li>
        <li>Cross-Site Request Forgery (CSRF)</li>
        <li>Broken Authentication</li>
        <li>Sensitive Data Exposure</li>
        <li>XML External Entities (XXE)</li>
        <li>Broken Access Control</li>
        <li>Using Components with Known Vulnerabilities</li>
        <li>Insufficient Logging and Monitoring</li>
        <li>Server-Side Template Injection</li>
      </ul>
    `,
    subtopics: [
      {
        id: "sql-injection",
        title: "SQL Injection",
        content: `
          <h3>SQL Injection</h3>
          <p>SQL injection is a code injection technique where attackers insert malicious SQL statements into input fields.</p>
          
          <h4>Prevention:</h4>
          <ul>
            <li>Use prepared statements and parameterized queries</li>
            <li>Input validation and sanitization</li>
            <li>Implement least privilege database access</li>
            <li>Use ORM frameworks</li>
            <li>Web Application Firewalls (WAF)</li>
          </ul>
        `
      },
      {
        id: "xss-attacks",
        title: "Cross-Site Scripting (XSS)",
        content: `
          <h3>Cross-Site Scripting (XSS)</h3>
          <p>XSS attacks inject malicious scripts into web pages viewed by other users.</p>
          
          <h4>Types:</h4>
          <ul>
            <li><strong>Stored XSS:</strong> Malicious script stored in database</li>
            <li><strong>Reflected XSS:</strong> Script reflected in URL parameters</li>
            <li><strong>DOM-based XSS:</strong> Exploits client-side JavaScript</li>
          </ul>
          
          <h4>Defense:</h4>
          <ul>
            <li>Input validation and output encoding</li>
            <li>Content Security Policy (CSP)</li>
            <li>Use security libraries</li>
            <li>Regular security audits</li>
          </ul>
        `
      },
      {
        id: "csrf-attacks",
        title: "Cross-Site Request Forgery (CSRF)",
        content: `
          <h3>Cross-Site Request Forgery (CSRF)</h3>
          <p>CSRF tricks authenticated users into performing unwanted actions on their behalf.</p>
          
          <h4>Prevention:</h4>
          <ul>
            <li>CSRF tokens in forms</li>
            <li>SameSite cookie attribute</li>
            <li>Verify origin headers</li>
            <li>Re-authentication for sensitive operations</li>
          </ul>
        `
      }
    ],
    keyPoints: [
      "SQL injection allows database manipulation",
      "XSS enables script injection attacks",
      "CSRF exploits user authentication",
      "Input validation is critical",
      "Output encoding prevents XSS"
    ]
  },

  {
    id: "authentication-attacks",
    title: "Authentication Attacks",
    description: "Learn about attacks targeting authentication mechanisms",
    html: `
      <h2>Authentication Attacks</h2>
      <p>Authentication attacks aim to bypass, crack, or compromise authentication systems to gain unauthorized access.</p>
      
      <h3>Common Authentication Attack Types</h3>
      <ul>
        <li>Brute Force Attacks</li>
        <li>Dictionary Attacks</li>
        <li>Credential Stuffing</li>
        <li>Phishing</li>
        <li>Password Spraying</li>
        <li>Keylogging</li>
      </ul>
    `,
    subtopics: [
      {
        id: "brute-force",
        title: "Brute Force Attacks",
        content: `
          <h3>Brute Force Attacks</h3>
          <p>Attackers try all possible password combinations until finding the correct one.</p>
          
          <h4>Defense:</h4>
          <ul>
            <li>Account lockout after failed attempts</li>
            <li>CAPTCHA challenges</li>
            <li>Rate limiting</li>
            <li>Strong password requirements</li>
            <li>Multi-factor authentication (MFA)</li>
          </ul>
        `
      },
      {
        id: "credential-stuffing",
        title: "Credential Stuffing",
        content: `
          <h3>Credential Stuffing</h3>
          <p>Attackers use leaked username-password pairs from previous breaches to gain access to other accounts.</p>
          
          <h4>Prevention:</h4>
          <ul>
            <li>Implement MFA</li>
            <li>Monitor for leaked credentials</li>
            <li>Use unique passwords</li>
            <li>Implement CAPTCHA</li>
            <li>Behavioral analysis</li>
          </ul>
        `
      },
      {
        id: "phishing",
        title: "Phishing Attacks",
        content: `
          <h3>Phishing Attacks</h3>
          <p>Phishing tricks users into revealing credentials through deceptive emails or websites.</p>
          
          <h4>Protection:</h4>
          <ul>
            <li>User awareness training</li>
            <li>Email filtering and validation</li>
            <li>Multi-factor authentication</li>
            <li>Domain authentication (DKIM, SPF, DMARC)</li>
          </ul>
        `
      }
    ],
    keyPoints: [
      "Brute force cracks passwords through exhaustive attempts",
      "MFA prevents credential-based attacks",
      "Phishing exploits human psychology",
      "Account lockout prevents brute force",
      "Credential monitoring detects compromised accounts"
    ]
  },

  {
    id: "social-engineering",
    title: "Social Engineering",
    description: "Psychological manipulation techniques used in cyber attacks",
    html: `
      <h2>Social Engineering</h2>
      <p>Social engineering manipulates human psychology to trick people into revealing confidential information or performing security-violating actions.</p>
      
      <h3>Social Engineering Tactics</h3>
      <ul>
        <li>Phishing and Spear Phishing</li>
        <li>Pretexting</li>
        <li>Baiting</li>
        <li>Tailgating</li>
        <li>Reverse Social Engineering</li>
        <li>Vishing (Voice Phishing)</li>
      </ul>
    `,
    subtopics: [
      {
        id: "phishing-tactics",
        title: "Phishing Tactics",
        content: `
          <h3>Phishing Tactics</h3>
          <p>Phishing is sending deceptive emails pretending to be from trusted sources.</p>
          
          <h4>Red Flags:</h4>
          <ul>
            <li>Urgent language and threats</li>
            <li>Suspicious sender addresses</li>
            <li>Links with misleading URLs</li>
            <li>Requests for passwords or personal info</li>
            <li>Grammar and spelling errors</li>
          </ul>
        `
      },
      {
        id: "pretexting",
        title: "Pretexting",
        content: `
          <h3>Pretexting</h3>
          <p>Creating a fabricated scenario to extract information from target.</p>
          
          <h4>Examples:</h4>
          <ul>
            <li>Posing as IT support</li>
            <li>Fake emergency situations</li>
            <li>Authority impersonation</li>
          </ul>
        `
      },
      {
        id: "baiting",
        title: "Baiting",
        content: `
          <h3>Baiting</h3>
          <p>Leaving infected USB drives or offers of free software to lure victims.</p>
          
          <h4>Defense:</h4>
          <ul>
            <li>Never connect unknown devices</li>
            <li>Disable autorun features</li>
            <li>User training</li>
          </ul>
        `
      }
    ],
    keyPoints: [
      "Social engineering exploits human nature",
      "Phishing is the most common attack",
      "Pretexting involves fabricated scenarios",
      "User training is the best defense",
      "Verify before sharing information"
    ]
  },

  {
    id: "malware",
    title: "Malware",
    description: "Malicious software types, detection, and removal",
    html: `
      <h2>Malware</h2>
      <p>Malware is software designed to cause harm, steal data, or gain unauthorized access to systems.</p>
      
      <h3>Types of Malware</h3>
      <ul>
        <li>Viruses - Replicate by attaching to files</li>
        <li>Worms - Self-replicating and spread over networks</li>
        <li>Trojans - Disguised as legitimate software</li>
        <li>Ransomware - Encrypts data and demands payment</li>
        <li>Spyware - Monitors user activity</li>
        <li>Adware - Displays unwanted advertisements</li>
        <li>Rootkits - Gain root/admin access</li>
        <li>Botnets - Networks of compromised machines</li>
      </ul>
    `,
    subtopics: [
      {
        id: "viruses-worms",
        title: "Viruses and Worms",
        content: `
          <h3>Viruses and Worms</h3>
          
          <h4>Viruses:</h4>
          <ul>
            <li>Require host file to spread</li>
            <li>Execute when host program runs</li>
            <li>Slower propagation</li>
          </ul>
          
          <h4>Worms:</h4>
          <ul>
            <li>Self-contained and independent</li>
            <li>Spread through networks automatically</li>
            <li>No host file needed</li>
            <li>Examples: Conficker, Morris Worm</li>
          </ul>
        `
      },
      {
        id: "ransomware",
        title: "Ransomware",
        content: `
          <h3>Ransomware</h3>
          <p>Ransomware encrypts user data and demands payment for decryption keys.</p>
          
          <h4>Protection:</h4>
          <ul>
            <li>Regular backups</li>
            <li>Email filtering</li>
            <li>Keep software updated</li>
            <li>User training</li>
            <li>Endpoint protection</li>
          </ul>
        `
      },
      {
        id: "trojans",
        title: "Trojans",
        content: `
          <h3>Trojans</h3>
          <p>Trojans disguise themselves as legitimate software but contain malicious code.</p>
          
          <h4>Types:</h4>
          <ul>
            <li>Remote Access Trojans (RAT)</li>
            <li>Trojan Downloaders</li>
            <li>Trojan Droppers</li>
            <li>Backdoor Trojans</li>
          </ul>
        `
      }
    ],
    keyPoints: [
      "Viruses attach to host files",
      "Worms spread autonomously",
      "Trojans masquerade as legitimate software",
      "Ransomware encrypts and extorts",
      "Antivirus and backups provide protection"
    ]
  },

  {
    id: "wireless-attacks",
    title: "Wireless Attacks",
    description: "Security threats in wireless networks and prevention",
    html: `
      <h2>Wireless Attacks</h2>
      <p>Wireless networks face unique security challenges due to their broadcast nature and accessibility.</p>
      
      <h3>Common Wireless Attack Types</h3>
      <ul>
        <li>War Driving</li>
        <li>Evil Twin Networks</li>
        <li>Packet Sniffing</li>
        <li>Weak Encryption Attacks</li>
        <li>WPS Vulnerabilities</li>
        <li>Jamming</li>
      </ul>
    `,
    subtopics: [
      {
        id: "wifi-security",
        title: "Wi-Fi Security",
        content: `
          <h3>Wi-Fi Security</h3>
          
          <h4>Encryption Standards:</h4>
          <ul>
            <li><strong>WEP:</strong> Outdated, easily cracked</li>
            <li><strong>WPA:</strong> Improved security</li>
            <li><strong>WPA2:</strong> Enterprise-grade encryption</li>
            <li><strong>WPA3:</strong> Latest standard with enhanced security</li>
          </ul>
          
          <h4>Security Best Practices:</h4>
          <ul>
            <li>Use strong passwords</li>
            <li>Enable WPA3/WPA2</li>
            <li>Hide SSID broadcasting</li>
            <li>Disable WPS</li>
            <li>Enable MAC filtering</li>
          </ul>
        `
      },
      {
        id: "evil-twin",
        title: "Evil Twin Networks",
        content: `
          <h3>Evil Twin Networks</h3>
          <p>Attackers create fake Wi-Fi networks mimicking legitimate ones to intercept traffic.</p>
          
          <h4>Defense:</h4>
          <ul>
            <li>Use VPN on public Wi-Fi</li>
            <li>Verify network names</li>
            <li>Avoid sensitive transactions</li>
            <li>Keep firewall enabled</li>
          </ul>
        `
      },
      {
        id: "packet-sniffing",
        title: "Packet Sniffing",
        content: `
          <h3>Packet Sniffing</h3>
          <p>Capturing and analyzing network packets to extract sensitive information.</p>
          
          <h4>Prevention:</h4>
          <ul>
            <li>Use HTTPS/TLS encryption</li>
            <li>VPN usage</li>
            <li>SSH for remote access</li>
            <li>Disable unencrypted protocols</li>
          </ul>
        `
      }
    ],
    keyPoints: [
      "Wi-Fi networks broadcast signals openly",
      "WPA3 provides modern security",
      "Evil twin networks impersonate legitimate SSIDs",
      "VPNs protect wireless traffic",
      "Encryption prevents packet sniffing"
    ]
  },

  {
    id: "basic-security-issues",
    title: "Basic Security Issues",
    description: "Fundamental security vulnerabilities and common mistakes",
    html: `
      <h2>Basic Security Issues</h2>
      <p>Many security breaches occur due to basic security oversights and poor practices.</p>
      
      <h3>Common Basic Security Problems</h3>
      <ul>
        <li>Weak Passwords</li>
        <li>Default Credentials</li>
        <li>Unpatched Systems</li>
        <li>Lack of Updates</li>
        <li>No Backups</li>
        <li>Unsecured Devices</li>
        <li>Poor Access Control</li>
        <li>Inadequate Monitoring</li>
      </ul>
    `,
    subtopics: [
      {
        id: "weak-passwords",
        title: "Weak Passwords",
        content: `
          <h3>Weak Passwords</h3>
          <p>Simple, easy-to-guess passwords are the primary cause of account breaches.</p>
          
          <h4>Strong Password Guidelines:</h4>
          <ul>
            <li>Minimum 12 characters</li>
            <li>Mix of uppercase, lowercase, numbers, symbols</li>
            <li>Avoid dictionary words and personal info</li>
            <li>Use unique passwords for each account</li>
            <li>Change regularly</li>
          </ul>
        `
      },
      {
        id: "default-credentials",
        title: "Default Credentials",
        content: `
          <h3>Default Credentials</h3>
          <p>Leaving default usernames and passwords on devices/services is a critical vulnerability.</p>
          
          <h4>Examples:</h4>
          <ul>
            <li>admin/admin</li>
            <li>root/root</li>
            <li>admin/password</li>
          </ul>
          
          <h4>Always:</h4>
          <ul>
            <li>Change default credentials immediately</li>
            <li>Document new credentials securely</li>
            <li>Review all default accounts</li>
          </ul>
        `
      },
      {
        id: "unpatched-systems",
        title: "Unpatched Systems",
        content: `
          <h3>Unpatched Systems</h3>
          <p>Failing to apply security patches leaves systems vulnerable to known exploits.</p>
          
          <h4>Best Practices:</h4>
          <ul>
            <li>Enable automatic updates</li>
            <li>Apply patches promptly</li>
            <li>Test patches before deployment</li>
            <li>Maintain update inventory</li>
            <li>Monitor for critical patches</li>
          </ul>
        `
      }
    ],
    keyPoints: [
      "Weak passwords are easily cracked",
      "Default credentials must be changed",
      "Unpatched systems are vulnerable",
      "Regular updates are essential",
      "Backups protect against data loss"
    ]
  }
];

async function seedTopics() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Topic.deleteMany({});
    console.log('Cleared existing topics');

    await Topic.insertMany(topicsData);
    console.log(`Successfully seeded ${topicsData.length} topics`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding topics:', error);
    process.exit(1);
  }
}

seedTopics();
