# Contributing to Ethicore Engine™ - Guardian

First off, **thank you** for considering contributing to Guardian! 🎉

This project exists to make AI safer for everyone, and we can only achieve that mission through community collaboration. Whether you're fixing bugs, adding threat patterns, improving documentation, or conducting research, your contribution matters.

---

## 🌟 Ways to Contribute

### 1. 🐛 Report Bugs

Found a bug? Help us squash it!

- **Check existing issues** first: [GitHub Issues](https://github.com/oraclestech/ethicore-guardian/issues)
- **Open a new issue** if it's not already reported
- **Include:**
  - Guardian version
  - Browser & OS
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots/logs if applicable

**Template:**
```markdown
**Bug Description:**
[Clear description]

**Steps to Reproduce:**
1. Go to...
2. Click on...
3. See error

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Environment:**
- Guardian Version: 2.0.0
- Browser: Firefox 120
- OS: Windows 11

**Screenshots/Logs:**
[Attach if relevant]
```

### 2. 🎯 Add Threat Patterns

Know a jailbreak technique Guardian misses? Share it!

**Process:**
1. Fork the repository
2. Edit `core/threat-patterns.js`
3. Add your pattern to the appropriate category
4. Test it thoroughly
5. Submit PR with examples

**Pattern Template:**
```javascript
newThreatCategory: {
    patterns: [
        /your\s+regex\s+pattern/gi,
        // Add multiple variants
    ],
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
    weight: 100,  // 0-100 scoring
    description: 'Brief explanation of threat',
    semanticFingerprint: [
        'semantic variant 1',
        'semantic variant 2',
        // Natural language versions
    ],
    contextHints: {
        escalators: ['urgent', 'must'],  // Increase suspicion
        mitigators: ['example', 'demo']   // Decrease suspicion
    },
    falsePositiveRisk: 'LOW' | 'MEDIUM' | 'HIGH',
    mitigationStrategy: 'How to reduce false positives'
}
```

**Guidelines:**
- Include 3-5 regex patterns per category
- Add 5-10 semantic fingerprints
- Test against real jailbreaks
- Consider false positive risk
- Document in comments

### 3. 🧪 Submit Test Cases

Real-world examples make Guardian stronger.

**What to share:**
- Actual jailbreak attempts (anonymized)
- Edge cases Guardian misses
- False positive examples
- Novel attack techniques

**Format:**
```javascript
// tests/jailbreaks/test-cases.js
{
    id: "JAILBREAK_001",
    category: "instructionOverride",
    severity: "CRITICAL",
    text: "The actual prompt text here...",
    expectedDetection: true,
    actualDetection: false,  // If Guardian missed it
    notes: "Uses obfuscation technique X"
}
```

### 4. 📝 Improve Documentation

Documentation is crucial for adoption.

**Areas needing help:**
- Clarifying technical explanations
- Adding examples and diagrams
- Fixing typos and grammar
- Translating to other languages (future)
- Video tutorials (future)

**Process:**
1. Find what needs improvement
2. Make changes in markdown files
3. Submit PR with clear description

### 5. 💻 Code Contributions

Want to add features or fix bugs?

**Before you start:**
- Check [open issues](https://github.com/oraclestech/ethicore-guardian/issues)
- Comment on issue to claim it
- Discuss major changes in [GitHub Discussions](https://github.com/oraclestech/ethicore-guardian/discussions) first

**Development setup:**
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ethicore-guardian.git
cd ethicore-guardian

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes
# Test locally: Load extension in Firefox via about:debugging

# Commit with descriptive message
git commit -m "Add: New behavioral feature X"

# Push to your fork
git push origin feature/your-feature-name

# Open PR on GitHub
```

### 6. 🔬 Research Contributions

Academic or independent research welcome!

**Share:**
- Novel detection algorithms
- Performance optimizations
- Security analysis
- Adversarial testing results
- Comparative studies

**Format:**
- Open GitHub Discussion in "Research" category
- Link to papers/preprints
- Share code/data if applicable
- Collaborate on implementation

---

## 📋 Contribution Guidelines

### Code Style

**JavaScript:**
```javascript
// Use clear, descriptive names
function detectJailbreakPattern(text, patterns) {
    // Use camelCase for variables
    const threatScore = 0;
    
    // Comments for complex logic
    // This loop checks each pattern against the input
    for (const pattern of patterns) {
        // ...
    }
    
    // Return objects with clear structure
    return {
        detected: true,
        score: threatScore,
        category: 'instructionOverride'
    };
}

// Use 4-space indentation
// Add blank lines between logical sections
```

**Comments:**
```javascript
// Good: Explain WHY, not WHAT
// We use time-decay to prioritize recent threats
const decay = Math.pow(0.85, ageMinutes / 10);

// Bad: Obvious comment
// Loop through patterns
for (const pattern of patterns) { ... }
```

### Commit Messages

**Format:**
```
Type: Brief description (50 chars max)

Longer explanation if needed (wrap at 72 chars).

- Bullet points for details
- Multiple changes explained
```

**Types:**
- `Add:` New feature or pattern
- `Fix:` Bug fix
- `Update:` Modify existing feature
- `Remove:` Delete code/feature
- `Docs:` Documentation only
- `Test:` Add or modify tests
- `Refactor:` Code restructuring
- `Perf:` Performance improvement

**Examples:**
```
Add: Semantic fingerprint for DAN v12 jailbreak

Includes 8 new semantic variants of the DAN v12 attack.
Tested against 50+ real examples with 98% detection rate.

Fix: False positive in roleplay detection

Educational roleplay was triggering unnecessarily.
Added 'educational' context hint to reduce FP by 40%.

Docs: Clarify ML model training process

Added step-by-step guide with examples.
```

### Pull Request Process

1. **Fork & Branch:**
   - Fork the repo
   - Create feature branch: `git checkout -b feature/amazing-feature`

2. **Make Changes:**
   - Write clear, commented code
   - Test thoroughly on multiple platforms
   - Update documentation if needed

3. **Test:**
   - Load extension in browser
   - Test your specific change
   - Test existing functionality (regression)
   - Check console for errors

4. **Submit PR:**
   - Push to your fork
   - Open PR against `main` branch
   - Fill out PR template
   - Link related issues

5. **PR Template:**
```markdown
## Description
[What does this PR do?]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing Done
- [ ] Tested in Firefox
- [ ] Tested in Chrome
- [ ] Tested on Windows/Mac/Linux
- [ ] Added/updated tests
- [ ] No console errors

## Related Issues
Closes #123

## Screenshots
[If UI changes]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex logic
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests (if applicable)
```

6. **Review Process:**
   - Maintainers review within 3-7 days
   - Address feedback
   - CI tests must pass
   - Requires 1+ approvals
   - Maintainer merges

### Testing Requirements

**For Code Changes:**
```javascript
// Manually test:
1. Load extension in Firefox (about:debugging)
2. Navigate to ChatGPT/Claude/Gemini
3. Test your specific change
4. Test common jailbreaks still work
5. Check browser console for errors

// Future: Automated tests
npm test  // (when implemented)
```

**For Pattern Changes:**
```javascript
// Test against:
1. Known jailbreaks (should detect)
2. Legitimate use cases (should NOT detect)
3. Edge cases
4. Obfuscated variants

// Document:
- Detection rate (% caught)
- False positive rate
- Performance impact
```

---

## 🎯 Priority Areas

We especially welcome contributions in:

1. **🔥 High-Priority:**
   - Novel jailbreak patterns (DAN variants, etc.)
   - False positive reduction
   - Performance optimization
   - Browser compatibility (Chrome, Edge)

2. **📊 Medium-Priority:**
   - UI/UX improvements
   - Better error messages
   - Documentation examples
   - Test coverage

3. **🔮 Future:**
   - Mobile support
   - Multilingual support
   - Advanced ML models
   - API integration

---

## 🚫 What We DON'T Accept

Please avoid PRs that:

- ❌ Add external dependencies without discussion
- ❌ Introduce telemetry or tracking
- ❌ Require server-side components
- ❌ Violate user privacy
- ❌ Add bloat (keep it lightweight)
- ❌ Break existing functionality
- ❌ Lack documentation/comments

---

## 💬 Communication

### Where to Ask Questions

- **General Questions:** [GitHub Discussions - Q&A](https://github.com/oraclestech/ethicore-guardian/discussions/categories/q-a)
- **Feature Requests:** [GitHub Discussions - Ideas](https://github.com/oraclestech/ethicore-guardian/discussions/categories/ideas)
- **Bug Reports:** [GitHub Issues](https://github.com/oraclestech/ethicore-guardian/issues)
- **Security Issues:** security@oraclestechnologies.com (private)
- **General Contact:** support@oraclestechnologies.com

### Response Times

- Issues: 3-7 days
- PRs: 3-7 days for initial review
- Discussions: Best effort, community-driven
- Security: 24 hours acknowledgment

---

## 🏆 Recognition

### Contributors

All contributors are recognized in:
- `CONTRIBUTORS.md` file
- GitHub contributors page
- Release notes (for significant contributions)

### Special Recognition

Outstanding contributors may receive:
- Co-author credit on papers
- Early access to new features
- Invitation to maintainer team
- Ethicore Engine swag (when available)

---

## 📜 Licensing

By contributing, you agree that:

- Your contributions are licensed under MIT License
- You have rights to submit the contribution
- You understand Ethicore Engine™ is a trademark

**CLA:** Not required, but we may ask for verification on large contributions.

---

## 🎓 Learning Resources

New to browser extensions or AI security?

**Browser Extensions:**
- [MDN: Browser Extensions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Chrome Extensions Docs](https://developer.chrome.com/docs/extensions/)

**AI Security:**
- [OWASP LLM Top 10](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [PromptInjection.dev](https://promptinjection.dev/)
- Guardian's own [ARCHITECTURE.md](ARCHITECTURE.md)

**Regular Expressions:**
- [RegexOne Tutorial](https://regexone.com/)
- [Regex101 Tester](https://regex101.com/)

---

## 🤝 Code of Conduct

We are committed to fostering a welcoming, respectful community. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details.

**TL;DR:**
- Be respectful and constructive
- Focus on the issue, not the person
- Accept feedback gracefully
- Help newcomers
- Report harassment to support@oraclestechnologies.com

---

## 🎯 First-Time Contributors

**Looking for a place to start?**

Check out issues labeled:
- `good first issue` - Easy pickings for newcomers
- `help wanted` - We need your expertise
- `documentation` - Improve docs (great first PR!)
- `bug` - Fix something broken

**Tips:**
1. Start small (fix typo, add test)
2. Ask questions (no dumb questions!)
3. Read existing code for patterns
4. Test thoroughly before submitting
5. Don't be discouraged by feedback

**Your first PR checklist:**
- [ ] Read this guide
- [ ] Pick an issue
- [ ] Comment to claim it
- [ ] Fork & clone repo
- [ ] Make changes
- [ ] Test locally
- [ ] Commit with good message
- [ ] Push to fork
- [ ] Open PR
- [ ] Respond to feedback
- [ ] Celebrate! 🎉

---

## 📞 Need Help?

**Stuck?** Don't hesitate to ask!

- **Technical questions:** Open a Discussion
- **Contribution process:** Comment on the issue
- **Something else:** support@oraclestechnologies.com

We're here to help you succeed!

---

## 🙏 Thank You

Every contribution, no matter how small, makes Guardian better. You're helping protect users from AI threats while advancing the field of AI safety.

**Your contribution helps:**
- Protect millions of users
- Advance AI security research
- Build a safer digital future
- Support open-source security

---

<p align="center">
  <strong>Innovate with integrity. Contribute with purpose.</strong><br>
  <sub>Built by the community, for the community.</sub>
</p>

<p align="center">
  <a href="https://github.com/oraclestech/ethicore-guardian">Back to Repository</a>
</p>
