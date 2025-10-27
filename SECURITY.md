# Security Policy

**Ethicore Engine™ - Guardian**  
*Responsible Disclosure & Security Practices*

---

## Our Commitment

Security is at the core of Guardian's mission. We are committed to:

- 🔒 **Transparency** - Open source code for public audit
- 🛡️ **Privacy** - Zero data collection, all analysis is local
- ⚡ **Rapid Response** - Security issues are our highest priority
- 🤝 **Collaboration** - Working with researchers to improve safety

---

## Reporting a Vulnerability

### 🚨 For Security Issues

If you discover a security vulnerability in Guardian, please report it responsibly:

**DO:**
- ✅ Email: **security@oraclestechnologies.com**
- ✅ Include detailed description and reproduction steps
- ✅ Give us reasonable time to fix before public disclosure (90 days preferred)
- ✅ Encrypt sensitive details using our PGP key (available on request)

**DON'T:**
- ❌ Open public GitHub issues for security vulnerabilities
- ❌ Share exploit code publicly before we've patched
- ❌ Test vulnerabilities on production systems without permission

### 📧 What to Include

Help us respond quickly by providing:

```
Subject: [SECURITY] Brief description

1. Vulnerability Type: (e.g., Bypass, XSS, Code Injection)
2. Affected Version: (e.g., v2.0.0)
3. Impact: (CRITICAL/HIGH/MEDIUM/LOW)
4. Reproduction Steps:
   - Step 1...
   - Step 2...
5. Proof of Concept: (code, screenshots, video)
6. Suggested Fix: (optional, but appreciated!)
7. Your Name/Handle: (for credit, if desired)
```

### 🏆 Recognition

We believe in recognizing security researchers:

- ✅ **Hall of Fame** - Listed in SECURITY_CREDITS.md (with permission)
- ✅ **CVE Credit** - Proper attribution in security advisories
- ✅ **Early Access** - Beta test new security features
- ✅ **Swag** - Guardian stickers and merchandise (when available)

**Note:** We're a small startup and cannot offer cash bounties at this time. We appreciate your understanding and contributions to open-source security!

---

## Response Timeline

We aim for:

| Timeline | Action |
|----------|--------|
| **24 hours** | Acknowledge receipt |
| **7 days** | Initial assessment and severity classification |
| **30 days** | Patch development and internal testing |
| **90 days** | Public disclosure (coordinated with reporter) |

**Critical vulnerabilities** (data leakage, RCE, authentication bypass) may receive expedited patches within 7-14 days.

---

## Supported Versions

We provide security updates for:

| Version | Supported | Notes |
|---------|-----------|-------|
| 2.x.x   | ✅ Active | Current stable release |
| 1.x.x   | ⚠️ Limited | Critical fixes only |
| < 1.0   | ❌ No support | Please upgrade |

**Recommendation:** Always use the latest version for best security.

---

## Security Features

### What We Protect Against

✅ **Jailbreak Attempts** - DAN, DUDE, and other role-playing attacks  
✅ **Prompt Injection** - Malicious instructions embedded in prompts  
✅ **System Instruction Override** - Attempts to bypass safety guidelines  
✅ **Data Exfiltration** - Stealing training data or system prompts  
✅ **Bot Attacks** - Automated scripting and mass attacks  
✅ **Context Pollution** - Multi-turn progressive attacks

### What We DON'T Protect Against

❌ **Social Engineering** - Human-to-human manipulation  
❌ **Phishing** - Email/website scams  
❌ **Network Attacks** - Man-in-the-middle, packet sniffing  
❌ **Browser Exploits** - OS/browser vulnerabilities  
❌ **Physical Access** - Local machine compromise

**Note:** Guardian is an AI security tool, not a comprehensive endpoint security solution.

---

## Threat Model

### Assumptions

1. **Trusted Browser** - We assume the browser environment is not compromised
2. **Local Execution** - All analysis happens in the user's browser
3. **No Server Trust** - We don't rely on external servers for security decisions
4. **User Control** - Users can override decisions (with warnings)

### Attack Vectors We Consider

| Vector | Risk | Mitigation |
|--------|------|------------|
| **Bypass Detection** | HIGH | Multi-layer defense, semantic analysis |
| **False Positives** | MEDIUM | Allowlist system, user feedback |
| **Performance DoS** | LOW | Caching, rate limiting |
| **Code Injection** | CRITICAL | CSP, input sanitization |
| **Extension Hijacking** | MEDIUM | Manifest validation, code signing |

### Out of Scope

- Attacks on the AI platforms themselves (e.g., ChatGPT vulnerabilities)
- Browser/OS level exploits
- Supply chain attacks (npm packages, etc.)
- Physical access attacks

---

## Privacy & Data Handling

### What We Store (Locally)

```javascript
// Browser Local Storage Only
{
    "ethicore_threats_log": [...],      // Threat detections
    "ethicore_config": {...},            // User settings
    "ethicore_allowlist": [...],         // User exceptions
    "ethicore_incidents": [...]          // Detailed logs
}
```

### What We NEVER Do

```javascript
// ❌ NEVER in our code:
fetch("https://api.example.com/track", {
    body: JSON.stringify({
        user_input: text,          // ❌ No
        user_prompts: history,     // ❌ No
        device_info: fingerprint   // ❌ No
    })
})

// ❌ NEVER:
- Track users
- Send data to servers
- Use analytics/telemetry
- Share data with third parties
- Monetize user data
```

### Audit

**Verify our claims:**
1. Read the source code: [GitHub Repository](https://github.com/oraclestech/ethicore-guardian)
2. Check network tab: No outbound requests (except AI platform traffic)
3. Review manifest: Only necessary permissions
4. Inspect storage: Data stays local

---

## Secure Development Practices

### Code Review

- ✅ All PRs require review before merge
- ✅ Security-critical changes require 2+ approvals
- ✅ Automated tests for core detection logic
- ✅ Manual security review for new features

### Dependencies

```json
// Minimal dependencies by design
{
  "dependencies": {
    // None! Pure vanilla JavaScript
  },
  "devDependencies": {
    // Build tools only, not shipped to users
  }
}
```

**Philosophy:** Zero dependencies = minimal attack surface

### Testing

- ✅ Unit tests for detection algorithms
- ✅ Integration tests for extension APIs
- ✅ Fuzzing for parser robustness
- ✅ Performance benchmarks
- ✅ Real-world jailbreak test suite (200+ patterns)

### Release Process

1. **Code Freeze** - No new features during security review
2. **Security Audit** - Internal review of changes
3. **Beta Testing** - Community testing (opt-in)
4. **Staged Rollout** - Gradual deployment to catch issues early
5. **Monitoring** - Track crash reports, performance

---

## Known Limitations

We believe in transparency about what Guardian can and cannot do:

### Current Limitations

1. **Novel Jailbreaks**: May miss brand-new, never-seen-before attacks
   - *Mitigation*: Community-driven pattern updates, ML generalization

2. **Highly Obfuscated Content**: Base64, ROT13, etc. in complex chains
   - *Mitigation*: Encoding detection layer, but not foolproof

3. **False Positives**: Legitimate roleplaying/educational use may trigger
   - *Mitigation*: Allowlist system, fuzzy matching

4. **Performance**: Semantic analysis takes ~15ms, may feel slow on old hardware
   - *Mitigation*: Caching, parallel processing

5. **Browser Compatibility**: Designed for Firefox, Chrome may have quirks
   - *Mitigation*: Ongoing compatibility testing

### Accepting Risk

We are **not** perfect. If you need:
- Military-grade security → Use air-gapped systems
- 100% accuracy → No such system exists
- Zero user friction → Security requires tradeoffs

Guardian provides **best-effort protection** with transparency about limitations.

---

## Secure Configuration

### Recommended Settings

For maximum security:

```javascript
{
    // Block all threat levels
    blockCritical: true,
    blockHigh: true,
    blockMedium: true,
    
    // Enable all layers
    multiLayerDefenseEnabled: true,
    behavioralProfilingEnabled: true,
    semanticAnalysisEnabled: true,
    mlInferenceEnabled: true,
    
    // Aggressive logging
    enableAuditTrail: true,
    maxLogSize: 10000
}
```

For balanced security + usability (default):

```javascript
{
    blockCritical: true,
    blockHigh: true,
    blockMedium: false,  // Only challenge, not block
    // ... other layers enabled
}
```

---

## Incident Response

### If Guardian Fails to Block an Attack

If you encounter a jailbreak that Guardian missed:

1. **Report It:**
   - Email: security@oraclestechnologies.com
   - Include: Prompt text, AI platform, Guardian version
   - Mark sensitivity appropriately

2. **We Will:**
   - Analyze the attack pattern
   - Update threat signatures
   - Release patch within 7 days
   - Credit you in release notes (optional)

3. **Community Alert:**
   - Critical bypasses announced on GitHub
   - Security advisory published
   - Auto-update pushed to users

### If Guardian Causes Harm

False positives blocking legitimate use:

1. **Report It:**
   - GitHub Issue (not security-sensitive)
   - Include: Text that triggered, expected behavior
   
2. **Workaround:**
   - Use allowlist feature
   - Temporarily disable medium-severity blocks
   
3. **We Will:**
   - Investigate false positive
   - Adjust detection thresholds
   - Add contextual hints to patterns

---

## Security Hall of Fame

We gratefully acknowledge security researchers who have responsibly disclosed vulnerabilities:

<!-- 
As researchers contribute, we'll add:

### 2025
- **John Doe** - Reported bypass in semantic analyzer (CVE-2025-XXXX)
- **Jane Smith** - Found XSS in report viewer (CVE-2025-YYYY)
-->

*Hall of Fame will be updated as we receive responsible disclosures.*

Want to be listed? Report a vulnerability following our guidelines above!

---

## Security Resources

### For Researchers

- **Test Environment:** Use `about:debugging` in Firefox to load unpacked extension
- **Sample Jailbreaks:** See `tests/jailbreaks/` directory (if contributing tests)
- **API Documentation:** See [ARCHITECTURE.md](ARCHITECTURE.md)

### For Users

- **Privacy Policy:** [privacy_policy.md](privacy_policy.md)
- **Safe Usage:** Enable all protection layers for maximum safety
- **Support:** support@oraclestechnologies.com

### For Developers

- **Contributing:** [CONTRIBUTING.md](CONTRIBUTING.md)
- **Code Review:** All PRs undergo security review
- **Testing:** Run `npm test` before submitting

---

## Questions?

- **Security Issues:** security@oraclestechnologies.com (encrypted: PGP key on request)
- **General Security Questions:** [GitHub Discussions - Security](https://github.com/oraclestech/ethicore-guardian/discussions/categories/security)
- **False Positives:** [GitHub Issues](https://github.com/oraclestech/ethicore-guardian/issues)

---

## Legal

### Disclosure

This security policy does not create a legal obligation or warranty. Guardian is provided "as-is" under the MIT License. See [LICENSE](LICENSE) for full terms.

### Responsible Research

We support responsible security research. Testing Guardian on your own systems is encouraged. Testing on others' systems requires proper authorization.

---

## Updates

This security policy may be updated as Guardian evolves. Major changes will be announced via:

- GitHub releases
- Security advisories
- Project website

**Last Updated:** October 2025  
**Policy Version:** 1.0

---

*Built with integrity. Protected by community. Secured by transparency.*
