---
name: Threat Pattern Submission
about: Submit a new jailbreak or threat pattern
title: '[PATTERN] '
labels: threat-pattern, enhancement
assignees: ''
---

## 🎯 Threat Category

**Select one:**
- [ ] Instruction Override
- [ ] Role Hijacking
- [ ] Jailbreak Activation (DAN, etc.)
- [ ] Safety Bypass
- [ ] System Prompt Leak
- [ ] Privilege Escalation
- [ ] Data Exfiltration
- [ ] Context Pollution
- [ ] Other: _____________

## 🚨 Severity Level

**Select one:**
- [ ] CRITICAL (Bypasses all safety completely)
- [ ] HIGH (Bypasses most safety measures)
- [ ] MEDIUM (Partial bypass or context-dependent)
- [ ] LOW (Minimal risk or theoretical)

## 📝 Pattern Examples

**Provide 3-5 example prompts that use this technique:**

1. ```
   Example prompt 1
   ```

2. ```
   Example prompt 2
   ```

3. ```
   Example prompt 3
   ```

## 🔍 Detection Method

**Regex Pattern (if applicable):**
```javascript
/your\s+regex\s+pattern/gi
```

**Semantic Fingerprints:**
```
- "semantic variant 1"
- "semantic variant 2"
- "semantic variant 3"
```

## 📊 Testing Results

**Have you tested if Guardian currently detects this?**
- [ ] Yes, Guardian detects it (rate: __%)
- [ ] No, Guardian misses it (rate: __%)
- [ ] Partially detected
- [ ] Not tested yet

## 🌐 Real-World Context

**Where did you encounter this?**
- [ ] Research paper
- [ ] Social media / Forums
- [ ] Personal testing
- [ ] Reported by user
- [ ] Other: _____________

**Source (if public):**

## ⚠️ False Positive Risk

**Could this pattern trigger on legitimate use?**
- [ ] Low risk (very specific to attacks)
- [ ] Medium risk (might trigger on some valid use)
- [ ] High risk (could trigger frequently on valid use)

**Mitigation ideas:**

## 📌 Additional Context

**Any other relevant information:**

## 🤝 Attribution

**Credit (optional):**
- Name/Handle: _____________
- Link: _____________

---

**Checklist:**
- [ ] I have tested these patterns
- [ ] I have provided multiple examples
- [ ] I have considered false positive risk
- [ ] This is not a security vulnerability requiring responsible disclosure
