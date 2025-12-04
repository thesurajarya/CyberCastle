import React, { useEffect, useMemo, useState } from "react";
import FlashcardDeck from "./Flashcards/FlashcardDeck.jsx";

const ALL_CARDS = [
{
id: "ddos-attacks-1",
topicId: "network-attacks",
subtopic: "DDoS Attacks",
title: "What is a DDoS attack?",
content: "<p>A Distributed Denial of Service (DDoS) attack floods a target server or network with massive traffic from many devices. The goal is to overload resources so legitimate users cannot access services.</p>"
},
{
id: "ddos-attacks-2",
topicId: "network-attacks",
subtopic: "DDoS Attacks",
title: "How does a DDoS attack work?",
content: "<p>Attackers control a botnet of compromised machines and instruct them to send huge numbers of requests to a single target. The target's bandwidth, CPU, or memory is exhausted, causing slowdowns or outages.</p>"
},
{
id: "ddos-attacks-3",
topicId: "network-attacks",
subtopic: "DDoS Attacks",
title: "Impact of DDoS attacks",
content: "<ul><li>Website or app becomes unavailable.</li><li>Revenue loss due to downtime.</li><li>Reputation damage and support overload.</li></ul>"
},
{
id: "ddos-attacks-4",
topicId: "network-attacks",
subtopic: "DDoS Attacks",
title: "Detecting a DDoS attack",
content: "<ul><li>Sudden traffic spikes from unusual locations.</li><li>Services become slow or time out.</li><li>Monitoring tools show abnormal network patterns.</li></ul>"
},
{
id: "ddos-attacks-5",
topicId: "network-attacks",
subtopic: "DDoS Attacks",
title: "Defenses against DDoS attacks",
content: "<ul><li>Use DDoS protection services or CDNs.</li><li>Rate-limit suspicious traffic.</li><li>Overprovision bandwidth and have an incident response plan.</li></ul>"
},

{
id: "mitm-1",
topicId: "network-attacks",
subtopic: "Man-in-the-Middle (MITM)",
title: "What is a Man-in-the-Middle attack?",
content: "<p>A Man-in-the-Middle (MITM) attack occurs when an attacker secretly intercepts and possibly alters communication between two parties. Each side thinks they are talking directly to the other.</p>"
},
{
id: "mitm-2",
topicId: "network-attacks",
subtopic: "Man-in-the-Middle (MITM)",
title: "How MITM attacks intercept traffic",
content: "<p>Attackers position themselves between victim and server by ARP spoofing, rogue Wi-Fi, or DNS poisoning. They then relay messages while reading or modifying the data.</p>"
},
{
id: "mitm-3",
topicId: "network-attacks",
subtopic: "Man-in-the-Middle (MITM)",
title: "Consequences of MITM attacks",
content: "<ul><li>Stolen logins and personal data.</li><li>Altered transactions or messages.</li><li>Compromised confidentiality and integrity of communication.</li></ul>"
},
{
id: "mitm-4",
topicId: "network-attacks",
subtopic: "Man-in-the-Middle (MITM)",
title: "Detecting a MITM attack",
content: "<ul><li>Browser certificate warnings.</li><li>Unexpected or self-signed certificates.</li><li>Strange network behavior on public or unknown Wi-Fi.</li></ul>"
},
{
id: "mitm-5",
topicId: "network-attacks",
subtopic: "Man-in-the-Middle (MITM)",
title: "Preventing MITM attacks",
content: "<ul><li>Use HTTPS everywhere and validate certificates.</li><li>Avoid untrusted Wi-Fi or use a VPN.</li><li>Enable HSTS and certificate pinning in apps.</li></ul>"
},

{
id: "dns-spoofing-1",
topicId: "network-attacks",
subtopic: "DNS Spoofing",
title: "What is DNS spoofing?",
content: "<p>DNS spoofing is an attack where fake DNS responses redirect users to malicious IP addresses. It tricks devices into visiting attacker-controlled sites instead of the real ones.</p>"
},
{
id: "dns-spoofing-2",
topicId: "network-attacks",
subtopic: "DNS Spoofing",
title: "How DNS spoofing works",
content: "<p>Attackers insert forged DNS records into a resolver cache or intercept DNS queries. The victim's computer then resolves a domain to the wrong IP address.</p>"
},
{
id: "dns-spoofing-3",
topicId: "network-attacks",
subtopic: "DNS Spoofing",
title: "Risks of DNS spoofing",
content: "<ul><li>Users land on phishing or malware sites.</li><li>Credentials are captured on fake login pages.</li><li>Traffic can be monitored or altered by attackers.</li></ul>"
},
{
id: "dns-spoofing-4",
topicId: "network-attacks",
subtopic: "DNS Spoofing",
title: "Detecting DNS spoofing",
content: "<ul><li>DNS lookup results do not match trusted records.</li><li>Certificate warnings on known websites.</li><li>Network tools show unexpected DNS servers.</li></ul>"
},
{
id: "dns-spoofing-5",
topicId: "network-attacks",
subtopic: "DNS Spoofing",
title: "Defense against DNS spoofing",
content: "<ul><li>Use DNSSEC-enabled resolvers.</li><li>Secure DNS servers and caches.</li><li>Monitor DNS records for unauthorized changes.</li></ul>"
},

{
id: "xss-1",
topicId: "web-application-attacks",
subtopic: "Cross-Site Scripting (XSS)",
title: "What is Cross-Site Scripting (XSS)?",
content: "<p>XSS is a web attack where attackers inject malicious scripts into trusted websites. These scripts run in the victim's browser and can steal data or modify pages.</p>"
},
{
id: "xss-2",
topicId: "web-application-attacks",
subtopic: "Cross-Site Scripting (XSS)",
title: "How reflected XSS works",
content: "<p>In reflected XSS, the malicious script is in a URL or request parameter and is immediately reflected in the response. The victim must click a crafted link for the attack to run.</p>"
},
{
id: "xss-3",
topicId: "web-application-attacks",
subtopic: "Cross-Site Scripting (XSS)",
title: "Stored XSS behavior",
content: "<p>In stored XSS, the malicious script is saved in the application's database, such as in comments. Every user who views the page loads and executes the script.</p>"
},
{
id: "xss-4",
topicId: "web-application-attacks",
subtopic: "Cross-Site Scripting (XSS)",
title: "Impact of XSS attacks",
content: "<ul><li>Session cookies can be stolen.</li><li>Users can be redirected to malicious sites.</li><li>Pages can be defaced or fake forms injected.</li></ul>"
},
{
id: "xss-5",
topicId: "web-application-attacks",
subtopic: "Cross-Site Scripting (XSS)",
title: "Preventing XSS in applications",
content: "<ul><li>Escape and encode user input before output.</li><li>Use Content Security Policy (CSP).</li><li>Validate input and avoid unsafe HTML rendering.</li></ul>"
},

{
id: "csrf-1",
topicId: "web-application-attacks",
subtopic: "Cross-Site Request Forgery (CSRF)",
title: "What is CSRF?",
content: "<p>Cross-Site Request Forgery (CSRF) tricks a logged-in user into performing unwanted actions on a site. The attacker uses the victim's existing session to send malicious requests.</p>"
},
{
id: "csrf-2",
topicId: "web-application-attacks",
subtopic: "Cross-Site Request Forgery (CSRF)",
title: "How CSRF attacks work",
content: "<p>The victim visits a malicious page that secretly submits a form or request to another site where they are authenticated. The site cannot tell the action was not intended by the user.</p>"
},
{
id: "csrf-3",
topicId: "web-application-attacks",
subtopic: "Cross-Site Request Forgery (CSRF)",
title: "Consequences of CSRF attacks",
content: "<ul><li>Unwanted money transfers or purchases.</li><li>Account email or password changes.</li><li>Privilege changes for other users.</li></ul>"
},
{
id: "csrf-4",
topicId: "web-application-attacks",
subtopic: "Cross-Site Request Forgery (CSRF)",
title: "Defenses against CSRF",
content: "<ul><li>Use anti-CSRF tokens in forms.</li><li>Check the Origin or Referer header.</li><li>Use same-site cookies for session tokens.</li></ul>"
},
{
id: "csrf-5",
topicId: "web-application-attacks",
subtopic: "Cross-Site Request Forgery (CSRF)",
title: "Example CSRF scenario",
content: "<p>A malicious email contains an image tag that actually submits a hidden transfer request to a banking site. When an already logged-in user opens the email, the transfer is executed silently.</p>"
},

{
id: "brute-force-1",
topicId: "authentication-attacks",
subtopic: "Brute Force",
title: "What is a brute force attack?",
content: "<p>A brute force attack tries many possible passwords or keys until one works. It relies on automation and weak or predictable credentials.</p>"
},
{
id: "brute-force-2",
topicId: "authentication-attacks",
subtopic: "Brute Force",
title: "Online vs offline brute force",
content: "<p>Online brute force sends guesses directly to a login form and is limited by rate controls. Offline brute force works on stolen hashes and can try many more guesses without contacting the server.</p>"
},
{
id: "brute-force-3",
topicId: "authentication-attacks",
subtopic: "Brute Force",
title: "Signs of brute force attempts",
content: "<ul><li>Many failed logins from the same IP.</li><li>Repeated attempts on a single account.</li><li>Spikes in authentication logs.</li></ul>"
},
{
id: "brute-force-4",
topicId: "authentication-attacks",
subtopic: "Brute Force",
title: "Defending against brute force attacks",
content: "<ul><li>Implement account lockout or throttling.</li><li>Use CAPTCHAs after several failures.</li><li>Require strong, long passwords.</li></ul>"
},
{
id: "brute-force-5",
topicId: "authentication-attacks",
subtopic: "Brute Force",
title: "Example brute force scenario",
content: "<p>An attacker uses a script to try thousands of common passwords against an admin login. Without rate limiting, they eventually find the correct password.</p>"
},

{
id: "credential-stuffing-1",
topicId: "authentication-attacks",
subtopic: "Credential Stuffing",
title: "What is credential stuffing?",
content: "<p>Credential stuffing is the use of leaked username and password pairs on many sites. Attackers rely on users reusing the same credentials across services.</p>"
},
{
id: "credential-stuffing-2",
topicId: "authentication-attacks",
subtopic: "Credential Stuffing",
title: "How credential stuffing works",
content: "<p>Attackers obtain credentials from a data breach, then use tools to test those logins on other websites. Any successful logins give them access to new accounts.</p>"
},
{
id: "credential-stuffing-3",
topicId: "authentication-attacks",
subtopic: "Credential Stuffing",
title: "Impact of credential stuffing",
content: "<ul><li>Account takeover on multiple platforms.</li><li>Fraudulent purchases or data theft.</li><li>Increased support workload and user distrust.</li></ul>"
},
{
id: "credential-stuffing-4",
topicId: "authentication-attacks",
subtopic: "Credential Stuffing",
title: "Detecting credential stuffing",
content: "<ul><li>Login attempts from many IPs using the same usernames.</li><li>High login failure rates followed by some successes.</li><li>Patterns matching known leaked credential lists.</li></ul>"
},
{
id: "credential-stuffing-5",
topicId: "authentication-attacks",
subtopic: "Credential Stuffing",
title: "Preventing credential stuffing",
content: "<ul><li>Encourage unique passwords and use password managers.</li><li>Enable multi-factor authentication (MFA).</li><li>Use risk-based authentication and IP reputation checks.</li></ul>"
},

{
id: "phishing-1",
topicId: "social-engineering",
subtopic: "Phishing",
title: "What is phishing?",
content: "<p>Phishing is a social engineering attack where fake messages imitate trusted entities to steal information. Common targets include passwords, card details, and personal data.</p>"
},
{
id: "phishing-2",
topicId: "social-engineering",
subtopic: "Phishing",
title: "Common phishing techniques",
content: "<ul><li>Deceptive emails with urgent requests.</li><li>Links to fake login pages.</li><li>Attachments carrying malware.</li></ul>"
},
{
id: "phishing-3",
topicId: "social-engineering",
subtopic: "Phishing",
title: "Recognizing phishing emails",
content: "<ul><li>Generic greetings and spelling errors.</li><li>Strange sender addresses or domains.</li><li>Requests for credentials or sensitive data.</li></ul>"
},
{
id: "phishing-4",
topicId: "social-engineering",
subtopic: "Phishing",
title: "Preventing phishing success",
content: "<ul><li>Verify links before clicking.</li><li>Do not share passwords via email.</li><li>Report suspicious messages to security teams.</li></ul>"
},
{
id: "phishing-5",
topicId: "social-engineering",
subtopic: "Phishing",
title: "Phishing example scenario",
content: "<p>A user receives an email claiming to be from their bank asking them to verify their account. The link leads to a fake site that steals their login details.</p>"
},

{
id: "spear-phishing-1",
topicId: "social-engineering",
subtopic: "Spear Phishing",
title: "What is spear phishing?",
content: "<p>Spear phishing is a targeted phishing attack customized for a specific person or organization. It often uses personal details to appear highly convincing.</p>"
},
{
id: "spear-phishing-2",
topicId: "social-engineering",
subtopic: "Spear Phishing",
title: "How spear phishing gathers information",
content: "<p>Attackers collect data from social media, company websites, and previous leaks. They use this context to craft believable messages that match the victim's role and relationships.</p>"
},
{
id: "spear-phishing-3",
topicId: "social-engineering",
subtopic: "Spear Phishing",
title: "Risks of spear phishing",
content: "<ul><li>Compromise of high-value accounts.</li><li>Unauthorized wire transfers or data access.</li><li>Entry point for larger network breaches.</li></ul>"
},
{
id: "spear-phishing-4",
topicId: "social-engineering",
subtopic: "Spear Phishing",
title: "Defenses against spear phishing",
content: "<ul><li>Train staff to verify unusual requests.</li><li>Use out-of-band confirmation for sensitive actions.</li><li>Apply strict email filtering and DMARC policies.</li></ul>"
},
{
id: "spear-phishing-5",
topicId: "social-engineering",
subtopic: "Spear Phishing",
title: "Example spear phishing scenario",
content: "<p>An attacker pretends to be a company CEO and emails finance staff, asking for an urgent payment to a new vendor, using realistic language and timing.</p>"
},

{
id: "pretexting-1",
topicId: "social-engineering",
subtopic: "Pretexting",
title: "What is pretexting?",
content: "<p>Pretexting is a social engineering method where attackers create a false story or identity to gain trust. The pretext justifies why they need information or access.</p>"
},
{
id: "pretexting-2",
topicId: "social-engineering",
subtopic: "Pretexting",
title: "How pretexting is carried out",
content: "<p>Attackers research the target and then pose as someone with authority or a legitimate need, such as tech support or HR, to request data or actions.</p>"
},
{
id: "pretexting-3",
topicId: "social-engineering",
subtopic: "Pretexting",
title: "Warning signs of pretexting",
content: "<ul><li>Unverified callers asking for sensitive details.</li><li>Claims of urgency to bypass procedures.</li><li>Requests that ignore normal verification steps.</li></ul>"
},
{
id: "pretexting-4",
topicId: "social-engineering",
subtopic: "Pretexting",
title: "Preventing pretexting attacks",
content: "<ul><li>Use strict identity verification procedures.</li><li>Train staff to challenge unusual requests.</li><li>Document and enforce data handling policies.</li></ul>"
},
{
id: "pretexting-5",
topicId: "social-engineering",
subtopic: "Pretexting",
title: "Pretexting example",
content: "<p>Someone calls the helpdesk claiming to be a manager who lost their password. Without verifying identity, the staff resets the account, giving the attacker access.</p>"
},

{
id: "ransomware-1",
topicId: "malware",
subtopic: "Ransomware",
title: "What is ransomware?",
content: "<p>Ransomware is malware that encrypts files or locks systems and demands payment to restore access. Victims lose control of their data until they recover or pay.</p>"
},
{
id: "ransomware-2",
topicId: "malware",
subtopic: "Ransomware",
title: "How ransomware infects systems",
content: "<p>Ransomware often spreads through phishing emails, malicious downloads, or exploiting vulnerable services. Once executed, it encrypts files and displays a ransom note.</p>"
},
{
id: "ransomware-3",
topicId: "malware",
subtopic: "Ransomware",
title: "Consequences of ransomware attacks",
content: "<ul><li>Critical data becomes unavailable.</li><li>Business operations may halt.</li><li>Financial loss and possible data leaks.</li></ul>"
},
{
id: "ransomware-4",
topicId: "malware",
subtopic: "Ransomware",
title: "Defending against ransomware",
content: "<ul><li>Maintain regular offline backups.</li><li>Patch systems and limit privileges.</li><li>Train users to avoid suspicious attachments.</li></ul>"
},
{
id: "ransomware-5",
topicId: "malware",
subtopic: "Ransomware",
title: "Ransomware incident response basics",
content: "<ul><li>Isolate affected systems from the network.</li><li>Do not rush to pay the ransom.</li><li>Engage incident response and restore from clean backups.</li></ul>"
},

{
id: "trojan-horses-1",
topicId: "malware",
subtopic: "Trojan Horses",
title: "What is a Trojan horse?",
content: "<p>A Trojan horse is malware that pretends to be a useful or harmless program. Once installed, it performs hidden malicious actions.</p>"
},
{
id: "trojan-horses-2",
topicId: "malware",
subtopic: "Trojan Horses",
title: "How Trojans spread",
content: "<p>Trojans are often bundled with cracked software, fake installers, or email attachments. Users install them willingly because they believe they are legitimate.</p>"
},
{
id: "trojan-horses-3",
topicId: "malware",
subtopic: "Trojan Horses",
title: "Capabilities of Trojan malware",
content: "<ul><li>Download additional malware.</li><li>Open backdoors for remote access.</li><li>Steal data or monitor activity.</li></ul>"
},
{
id: "trojan-horses-4",
topicId: "malware",
subtopic: "Trojan Horses",
title: "Detecting Trojan horses",
content: "<ul><li>Unexpected processes or network connections.</li><li>Security tools flag suspicious executables.</li><li>System slowdown after installing unknown software.</li></ul>"
},
{
id: "trojan-horses-5",
topicId: "malware",
subtopic: "Trojan Horses",
title: "Preventing Trojan infections",
content: "<ul><li>Download software only from trusted sources.</li><li>Avoid pirated or cracked applications.</li><li>Use up-to-date antivirus and application control.</li></ul>"
},

{
id: "keyloggers-1",
topicId: "malware",
subtopic: "Keyloggers",
title: "What is a keylogger?",
content: "<p>A keylogger is a tool or malware that records keystrokes on a device. It can capture passwords, messages, and other typed data.</p>"
},
{
id: "keyloggers-2",
topicId: "malware",
subtopic: "Keyloggers",
title: "How keyloggers operate",
content: "<p>Software keyloggers run in the background, hooking into the operating system to intercept keystrokes. Hardware keyloggers sit physically between the keyboard and computer.</p>"
},
{
id: "keyloggers-3",
topicId: "malware",
subtopic: "Keyloggers",
title: "Risks posed by keyloggers",
content: "<ul><li>Account credentials can be stolen.</li><li>Confidential communications are exposed.</li><li>Attackers can rebuild sensitive documents.</li></ul>"
},
{
id: "keyloggers-4",
topicId: "malware",
subtopic: "Keyloggers",
title: "Detecting keyloggers",
content: "<ul><li>Use antivirus and anti-spyware scans.</li><li>Monitor for unusual processes and startup items.</li><li>Physically inspect for extra devices in keyboard cables.</li></ul>"
},
{
id: "keyloggers-5",
topicId: "malware",
subtopic: "Keyloggers",
title: "Defending against keyloggers",
content: "<ul><li>Keep systems patched and protected.</li><li>Use multi-factor authentication to reduce password theft impact.</li><li>Avoid entering credentials on untrusted machines.</li></ul>"
},

{
id: "evil-twin-1",
topicId: "wireless-attacks",
subtopic: "Evil Twin",
title: "What is an Evil Twin attack?",
content: "<p>An Evil Twin attack uses a rogue Wi-Fi access point that mimics a legitimate network. Users unknowingly connect to the fake hotspot controlled by the attacker.</p>"
},
{
id: "evil-twin-2",
topicId: "wireless-attacks",
subtopic: "Evil Twin",
title: "How Evil Twin hotspots trick users",
content: "<p>Attackers copy the network name and sometimes the login page of a real Wi-Fi network. Devices automatically join the stronger or familiar signal without the user noticing.</p>"
},
{
id: "evil-twin-3",
topicId: "wireless-attacks",
subtopic: "Evil Twin",
title: "Risks of Evil Twin attacks",
content: "<ul><li>Unencrypted traffic can be captured.</li><li>Logins and personal data may be stolen.</li><li>Victims can be redirected to malicious sites.</li></ul>"
},
{
id: "evil-twin-4",
topicId: "wireless-attacks",
subtopic: "Evil Twin",
title: "Detecting Evil Twin networks",
content: "<ul><li>Multiple networks with the same name.</li><li>Unusual certificate warnings after connecting.</li><li>Captive portals that look different from normal.</li></ul>"
},
{
id: "evil-twin-5",
topicId: "wireless-attacks",
subtopic: "Evil Twin",
title: "Staying safe from Evil Twin attacks",
content: "<ul><li>Only use trusted Wi-Fi networks.</li><li>Prefer using a VPN on public Wi-Fi.</li><li>Avoid accessing sensitive accounts on unknown hotspots.</li></ul>"
},

{
id: "wifi-eavesdropping-1",
topicId: "wireless-attacks",
subtopic: "Wi-Fi Eavesdropping",
title: "What is Wi-Fi eavesdropping?",
content: "<p>Wi-Fi eavesdropping is the interception of wireless network traffic by an unauthorized person. Attackers listen to data sent between devices and access points.</p>"
},
{
id: "wifi-eavesdropping-2",
topicId: "wireless-attacks",
subtopic: "Wi-Fi Eavesdropping",
title: "How Wi-Fi traffic is captured",
content: "<p>Attackers use wireless sniffing tools in monitor mode to capture packets in range. Weak encryption or open networks make the captured data easy to read.</p>"
},
{
id: "wifi-eavesdropping-3",
topicId: "wireless-attacks",
subtopic: "Wi-Fi Eavesdropping",
title: "Consequences of Wi-Fi eavesdropping",
content: "<ul><li>Exposure of browsing activity.</li><li>Capture of unencrypted credentials.</li><li>Leak of personal or business data.</li></ul>"
},
{
id: "wifi-eavesdropping-4",
topicId: "wireless-attacks",
subtopic: "Wi-Fi Eavesdropping",
title: "Preventing Wi-Fi eavesdropping",
content: "<ul><li>Use WPA3 or at least WPA2 encryption.</li><li>Avoid open networks for sensitive work.</li><li>Use HTTPS and VPNs to protect traffic.</li></ul>"
},
{
id: "wifi-eavesdropping-5",
topicId: "wireless-attacks",
subtopic: "Wi-Fi Eavesdropping",
title: "Signs of insecure Wi-Fi usage",
content: "<ul><li>Networks without a password.</li><li>Old security types like WEP in use.</li><li>Frequent disconnections or unusual network names.</li></ul>"
},

{
id: "weak-passwords-1",
topicId: "basic-security-issues",
subtopic: "Weak Passwords",
title: "What are weak passwords?",
content: "<p>Weak passwords are short, simple, or easily guessed strings like common words or patterns. They can often be cracked quickly by attackers.</p>"
},
{
id: "weak-passwords-2",
topicId: "basic-security-issues",
subtopic: "Weak Passwords",
title: "Examples of weak passwords",
content: "<ul><li>Simple sequences like 123456.</li><li>Common words like password.</li><li>Personal details such as names or birthdays.</li></ul>"
},
{
id: "weak-passwords-3",
topicId: "basic-security-issues",
subtopic: "Weak Passwords",
title: "Risks of using weak passwords",
content: "<ul><li>Easy success for brute force attacks.</li><li>Fast account takeover on multiple sites.</li><li>Higher chance of data breaches.</li></ul>"
},
{
id: "weak-passwords-4",
topicId: "basic-security-issues",
subtopic: "Weak Passwords",
title: "Creating strong passwords",
content: "<ul><li>Use long passphrases with multiple words.</li><li>Mix letters, numbers, and symbols.</li><li>Avoid reuse across accounts.</li></ul>"
},
{
id: "weak-passwords-5",
topicId: "basic-security-issues",
subtopic: "Weak Passwords",
title: "Password management best practices",
content: "<ul><li>Use a password manager.</li><li>Enable multi-factor authentication.</li><li>Change passwords after breaches.</li></ul>"
},

{
id: "unpatched-software-1",
topicId: "basic-security-issues",
subtopic: "Unpatched Software",
title: "What is unpatched software?",
content: "<p>Unpatched software is software that has not been updated with the latest fixes. It may contain known vulnerabilities that attackers can exploit.</p>"
},
{
id: "unpatched-software-2",
topicId: "basic-security-issues",
subtopic: "Unpatched Software",
title: "Why patches are released",
content: "<p>Vendors publish patches to fix security flaws, bugs, and performance issues. Delaying these updates leaves systems exposed to known attacks.</p>"
},
{
id: "unpatched-software-3",
topicId: "basic-security-issues",
subtopic: "Unpatched Software",
title: "Risks of unpatched systems",
content: "<ul><li>Remote code execution by attackers.</li><li>Privilege escalation inside networks.</li><li>Widespread malware infections using known exploits.</li></ul>"
},
{
id: "unpatched-software-4",
topicId: "basic-security-issues",
subtopic: "Unpatched Software",
title: "Patch management best practices",
content: "<ul><li>Maintain an inventory of assets.</li><li>Test and deploy patches regularly.</li><li>Prioritize critical security updates.</li></ul>"
},
{
id: "unpatched-software-5",
topicId: "basic-security-issues",
subtopic: "Unpatched Software",
title: "Automating software updates",
content: "<p>Use centralized patch management tools to push updates, schedule maintenance windows, and verify that all systems are up to date.</p>"
},

{
id: "misconfigured-systems-1",
topicId: "basic-security-issues",
subtopic: "Misconfigured Systems",
title: "What is a misconfigured system?",
content: "<p>A misconfigured system is one that has insecure settings, unnecessary services, or incorrect permissions. These mistakes create easy entry points for attackers.</p>"
},
{
id: "misconfigured-systems-2",
topicId: "basic-security-issues",
subtopic: "Misconfigured Systems",
title: "Common misconfiguration examples",
content: "<ul><li>Default passwords left unchanged.</li><li>Open ports that are not needed.</li><li>Cloud storage buckets set to public.</li></ul>"
},
{
id: "misconfigured-systems-3",
topicId: "basic-security-issues",
subtopic: "Misconfigured Systems",
title: "Impact of misconfigurations",
content: "<ul><li>Data leaks of sensitive information.</li><li>Unauthorized access to internal services.</li><li>Privilege escalation within the environment.</li></ul>"
},
{
id: "misconfigured-systems-4",
topicId: "basic-security-issues",
subtopic: "Misconfigured Systems",
title: "Detecting misconfigurations",
content: "<ul><li>Use configuration scanning tools.</li><li>Compare systems to security baselines.</li><li>Run regular vulnerability assessments.</li></ul>"
},
{
id: "misconfigured-systems-5",
topicId: "basic-security-issues",
subtopic: "Misconfigured Systems",
title: "Preventing configuration errors",
content: "<ul><li>Follow hardening guides and standards.</li><li>Automate configuration with templates.</li><li>Review changes through peer and security checks.</li></ul>"
},

{
id: "insecure-data-storage-1",
topicId: "basic-security-issues",
subtopic: "Insecure Data Storage",
title: "What is insecure data storage?",
content: "<p>Insecure data storage occurs when sensitive information is saved without proper protection. This includes unencrypted files or poorly secured databases.</p>"
},
{
id: "insecure-data-storage-2",
topicId: "basic-security-issues",
subtopic: "Insecure Data Storage",
title: "Examples of insecure data storage",
content: "<ul><li>Storing passwords in plain text.</li><li>Saving API keys in public repositories.</li><li>Backups left on unprotected drives.</li></ul>"
},
{
id: "insecure-data-storage-3",
topicId: "basic-security-issues",
subtopic: "Insecure Data Storage",
title: "Risks of insecure storage",
content: "<ul><li>Data theft in case of breach.</li><li>Regulatory fines and legal issues.</li><li>Loss of customer trust.</li></ul>"
},
{
id: "insecure-data-storage-4",
topicId: "basic-security-issues",
subtopic: "Insecure Data Storage",
title: "Securing stored data",
content: "<ul><li>Encrypt data at rest.</li><li>Use strong access controls on databases.</li><li>Mask or tokenize highly sensitive fields.</li></ul>"
},
{
id: "insecure-data-storage-5",
topicId: "basic-security-issues",
subtopic: "Insecure Data Storage",
title: "Handling secrets safely",
content: "<ul><li>Use dedicated secrets management tools.</li><li>Avoid hard-coding secrets in code.</li><li>Rotate keys and passwords regularly.</li></ul>"
},

{
id: "poor-access-control-1",
topicId: "basic-security-issues",
subtopic: "Poor Access Control",
title: "What is poor access control?",
content: "<p>Poor access control means users or systems have more permissions than necessary or permissions are not enforced correctly. It breaks the principle of least privilege.</p>"
},
{
id: "poor-access-control-2",
topicId: "basic-security-issues",
subtopic: "Poor Access Control",
title: "Examples of weak access controls",
content: "<ul><li>Shared admin accounts.</li><li>Guest users with write permissions.</li><li>APIs that do not check user roles.</li></ul>"
},
{
id: "poor-access-control-3",
topicId: "basic-security-issues",
subtopic: "Poor Access Control",
title: "Consequences of poor access control",
content: "<ul><li>Unauthorized data viewing or editing.</li><li>Privilege abuse by insiders.</li><li>Full system compromise if one account is hijacked.</li></ul>"
},
{
id: "poor-access-control-4",
topicId: "basic-security-issues",
subtopic: "Poor Access Control",
title: "Improving access control",
content: "<ul><li>Apply least privilege to every role.</li><li>Review permissions on a regular schedule.</li><li>Separate duties for critical actions.</li></ul>"
},
{
id: "poor-access-control-5",
topicId: "basic-security-issues",
subtopic: "Poor Access Control",
title: "Access control enforcement tips",
content: "<ul><li>Centralize identity and access management.</li><li>Use role-based access control in applications.</li><li>Log and audit all privileged operations.</li></ul>"
}
];


const RevisionFlashcardsSection = () => {
  const [topics, setTopics] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5001/api/topics")
      .then((res) => res.json())
      .then(setTopics)
      .catch(() => setTopics([]));
  }, []);

  const toggleTopic = (id) => {
    setStarted(false);
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleStart = () => {
    if (selectedIds.length === 0) return;
    setStarted(true);
  };

  const filteredCards = useMemo(() => {
    if (selectedIds.length === 0) return [];
    return ALL_CARDS.filter((c) => selectedIds.includes(c.topicId));
  }, [selectedIds]);

  return (
    <section
      id="revision-flashcards"
      className="py-24 max-w-7xl mx-auto px-6 space-y-10"
    >
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Smart Revision Flashcards
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Select the topics you want to revise and flip through key concepts
          using interactive flashcards.
        </p>
      </div>

      {/* Topic selection chips */}
      <div className="flex flex-wrap gap-3 justify-center">
        {topics.map((topic) => {
          const active = selectedIds.includes(topic.id);
          return (
            <button
              key={topic.id}
              onClick={() => toggleTopic(topic.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                active
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.6)]"
                  : "bg-slate-900/60 border-slate-700 text-gray-200 hover:border-cyan-400/60"
              }`}
            >
              {topic.title}
            </button>
          );
        })}
      </div>

      {/* Start button */}
      <div className="flex justify-center">
        <button
          onClick={handleStart}
          disabled={selectedIds.length === 0}
          className={`relative inline-flex items-center justify-center rounded-full px-0.5 py-0.5 text-sm font-semibold ${
            selectedIds.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 blur-md opacity-80" />
          <span className="relative rounded-full bg-[#050816] px-8 py-3 text-white">
            Start Revision
          </span>
        </button>
      </div>

      {/* Flashcard deck */}
      {started && (
        <div className="mt-8">
          <FlashcardDeck cards={filteredCards} />
        </div>
      )}
    </section>
  );
};

export default RevisionFlashcardsSection;
