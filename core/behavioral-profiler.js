/**
 * Ethicore Guardian - Behavioral Profiling Engine
 * Analyzes HOW users interact, not just WHAT they type
 * Detects bots, scripts, and automated attacks by behavior
 * @module behavioral-profiler
 * @license MIT 
 */
/**
 * Ethicore Engine™ - Guardian (Open Source Framework)
 * Copyright © 2025 Oracles Technologies LLC
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 */

class BehavioralProfiler {
    constructor() {
        this.profile = {
            // Typing behavior
            typingSpeed: [],
            keystrokeIntervals: [],
            backspaceCount: 0,
            totalKeystrokes: 0,
            
            // Mouse behavior
            mouseMovements: [],
            clickCount: 0,
            lastMouseTime: 0,
            hasMouseActivity: false,
            
            // Clipboard behavior
            pasteEvents: [],
            pasteLength: 0,
            copyEvents: 0,
            
            // Focus behavior
            focusChanges: [],
            backgroundTime: 0,
            activeTime: 0,
            
            // Timing behavior
            sessionStartTime: Date.now(),
            lastInteractionTime: Date.now(),
            interactionCount: 0,
            
            // Input characteristics
            inputLength: 0,
            editDistance: 0,
            characterVariety: 0
        };
        
        this.baselineProfile = null; // Learn normal behavior
        this.initialized = false;
    }

    /**
     * Initialize monitoring for a specific input element
     */
    monitor(inputElement) {
        if (!inputElement) return;
        
        // Keyboard monitoring
        inputElement.addEventListener('keydown', (e) => this.onKeyDown(e));
        inputElement.addEventListener('keyup', (e) => this.onKeyUp(e));
        
        // Clipboard monitoring
        inputElement.addEventListener('paste', (e) => this.onPaste(e));
        inputElement.addEventListener('copy', (e) => this.onCopy(e));
        
        // Focus monitoring
        inputElement.addEventListener('focus', (e) => this.onFocus(e));
        inputElement.addEventListener('blur', (e) => this.onBlur(e));
        
        // Mouse monitoring (on document)
        document.addEventListener('mousemove', (e) => this.onMouseMove(e), { passive: true });
        document.addEventListener('click', (e) => this.onClick(e), { passive: true });
        
        // Page visibility
        document.addEventListener('visibilitychange', () => this.onVisibilityChange());
        
        this.initialized = true;
        console.log('🧬 Behavioral profiler: Monitoring started');
    }

    /**
     * Keyboard event handlers
     */
    onKeyDown(e) {
        const now = Date.now();
        const timeSinceLastKey = now - (this.lastKeyTime || now);
        
        this.profile.totalKeystrokes++;
        this.profile.keystrokeIntervals.push(timeSinceLastKey);
        
        if (e.key === 'Backspace') {
            this.profile.backspaceCount++;
        }
        
        this.lastKeyTime = now;
        this.profile.lastInteractionTime = now;
        this.profile.interactionCount++;
        
        // Keep only recent intervals (last 50)
        if (this.profile.keystrokeIntervals.length > 50) {
            this.profile.keystrokeIntervals.shift();
        }
    }

    onKeyUp(e) {
        // Calculate typing speed (WPM)
        if (this.profile.keystrokeIntervals.length > 5) {
            const avgInterval = this.average(this.profile.keystrokeIntervals);
            const wpm = (60000 / avgInterval) / 5; // Rough WPM estimate
            this.profile.typingSpeed.push(wpm);
            
            if (this.profile.typingSpeed.length > 10) {
                this.profile.typingSpeed.shift();
            }
        }
    }

    /**
     * Clipboard event handlers
     */
    onPaste(e) {
        const pastedText = e.clipboardData?.getData('text') || '';
        
        this.profile.pasteEvents.push({
            timestamp: Date.now(),
            length: pastedText.length,
            hasFormatting: pastedText !== pastedText.trim()
        });
        
        this.profile.pasteLength += pastedText.length;
        
        console.log('📋 Paste detected:', pastedText.length, 'chars');
        
        // Keep only recent pastes
        if (this.profile.pasteEvents.length > 10) {
            this.profile.pasteEvents.shift();
        }
    }

    onCopy(e) {
        this.profile.copyEvents++;
    }

    /**
     * Focus event handlers
     */
    onFocus(e) {
        this.profile.focusChanges.push({
            type: 'focus',
            timestamp: Date.now()
        });
        this.focusStartTime = Date.now();
    }

    onBlur(e) {
        this.profile.focusChanges.push({
            type: 'blur',
            timestamp: Date.now()
        });
        
        if (this.focusStartTime) {
            this.profile.activeTime += Date.now() - this.focusStartTime;
        }
    }

    /**
     * Mouse event handlers
     */
    onMouseMove(e) {
        const now = Date.now();
        
        // Sample mouse movements (not every pixel)
        if (now - this.lastMouseSample < 100) return;
        
        this.profile.mouseMovements.push({
            x: e.clientX,
            y: e.clientY,
            timestamp: now
        });
        
        this.profile.hasMouseActivity = true;
        this.profile.lastMouseTime = now;
        this.lastMouseSample = now;
        
        // Keep only recent movements
        if (this.profile.mouseMovements.length > 50) {
            this.profile.mouseMovements.shift();
        }
    }

    onClick(e) {
        this.profile.clickCount++;
        this.profile.lastInteractionTime = Date.now();
    }

    /**
     * Visibility change handler
     */
    onVisibilityChange() {
        if (document.hidden) {
            this.backgroundStartTime = Date.now();
        } else {
            if (this.backgroundStartTime) {
                this.profile.backgroundTime += Date.now() - this.backgroundStartTime;
            }
        }
    }

    /**
     * Analyze current behavior and return anomaly score (0-100)
     */
    analyzeAnomaly(inputText) {
        const features = this.extractFeatures(inputText);
        const score = this.calculateAnomalyScore(features);
        
        return {
            score,
            features,
            profile: this.profile,
            verdict: this.getVerdict(score),
            explanation: this.explainScore(score, features)
        };
    }

    /**
     * Extract behavioral features
     */
    extractFeatures(inputText) {
        const now = Date.now();
        const sessionDuration = now - this.profile.sessionStartTime;
        
        return {
            // Typing features
            avgTypingSpeed: this.average(this.profile.typingSpeed) || 0,
            typingSpeedVariance: this.variance(this.profile.typingSpeed) || 0,
            avgKeystrokeInterval: this.average(this.profile.keystrokeIntervals) || 0,
            keystrokeVariance: this.variance(this.profile.keystrokeIntervals) || 0,
            backspaceRatio: this.profile.totalKeystrokes > 0 ? 
                this.profile.backspaceCount / this.profile.totalKeystrokes : 0,
            
            // Mouse features
            hasMouseMovement: this.profile.hasMouseActivity,
            mouseMovementCount: this.profile.mouseMovements.length,
            clickCount: this.profile.clickCount,
            timeSinceLastMouse: now - this.profile.lastMouseTime,
            mousePathLength: this.calculateMousePathLength(),
            
            // Clipboard features
            pasteCount: this.profile.pasteEvents.length,
            pasteRatio: inputText.length > 0 ? 
                this.profile.pasteLength / inputText.length : 0,
            largePasteDetected: this.profile.pasteEvents.some(p => p.length > 500),
            
            // Focus features
            focusChangeCount: this.profile.focusChanges.length,
            activeTimeRatio: sessionDuration > 0 ? 
                this.profile.activeTime / sessionDuration : 1,
            backgroundTimeRatio: sessionDuration > 0 ?
                this.profile.backgroundTime / sessionDuration : 0,
            
            // Timing features
            sessionDuration: sessionDuration / 1000, // seconds
            interactionRate: sessionDuration > 0 ?
                this.profile.interactionCount / (sessionDuration / 1000) : 0,
            timeSinceLastInteraction: now - this.profile.lastInteractionTime,
            
            // Input characteristics
            inputLength: inputText.length,
            characterVariety: new Set(inputText.toLowerCase()).size,
            hasSpecialChars: /[^a-zA-Z0-9\s]/.test(inputText),
            
            // Suspicious patterns
            instantLongInput: inputText.length > 100 && this.profile.totalKeystrokes < 20,
            noHumanPauses: this.profile.keystrokeIntervals.every(i => i < 50),
            perfectTyping: this.profile.backspaceCount === 0 && inputText.length > 50,
            backgroundPaste: this.profile.backgroundTime > sessionDuration * 0.5 && 
                            this.profile.pasteEvents.length > 0
        };
    }

    /**
     * Calculate anomaly score from features
     */
    calculateAnomalyScore(features) {
        let score = 0;
        
        // Typing anomalies (0-25 points)
        if (features.avgTypingSpeed > 200) score += 10; // Superhuman typing
        if (features.avgTypingSpeed < 10 && features.inputLength > 100) score += 5; // Too slow
        if (features.typingSpeedVariance < 10) score += 10; // Too consistent (bot)
        if (features.perfectTyping) score += 15; // No mistakes
        if (features.noHumanPauses) score += 10; // No natural pauses
        
        // Mouse anomalies (0-20 points)
        if (!features.hasMouseMovement && features.inputLength > 50) score += 15; // No mouse at all
        if (features.mouseMovementCount < 5 && features.sessionDuration > 10) score += 10;
        if (features.timeSinceLastMouse > 60000) score += 5; // No mouse for 1min
        
        // Clipboard anomalies (0-25 points)
        if (features.largePasteDetected) score += 20; // Large paste
        if (features.pasteRatio > 0.8) score += 15; // Mostly pasted
        if (features.pasteCount > 3) score += 10; // Multiple pastes
        
        // Timing anomalies (0-15 points)
        if (features.instantLongInput) score += 25; // Instant long text
        if (features.backgroundTimeRatio > 0.7) score += 10; // Mostly background
        if (features.timeSinceLastInteraction > 300000) score += 5; // Inactive
        
        // Suspicious patterns (0-15 points)
        if (features.backgroundPaste) score += 20; // Pasted in background
        if (features.sessionDuration < 2 && features.inputLength > 200) score += 15; // Too fast
        
        return Math.min(100, Math.round(score));
    }

    /**
     * Get verdict from score
     */
    getVerdict(score) {
        if (score >= 80) return 'CRITICAL'; // Almost certainly automated/malicious
        if (score >= 60) return 'HIGH'; // Very suspicious
        if (score >= 40) return 'MEDIUM'; // Somewhat suspicious
        if (score >= 20) return 'LOW'; // Slightly unusual
        return 'NORMAL'; // Human behavior
    }

    /**
     * Explain the anomaly score
     */
    explainScore(score, features) {
        const reasons = [];
        
        if (features.instantLongInput) {
            reasons.push('Long text appeared instantly without typing');
        }
        if (features.largePasteDetected) {
            reasons.push('Large text pasted from clipboard');
        }
        if (!features.hasMouseMovement && features.inputLength > 50) {
            reasons.push('No mouse movement detected');
        }
        if (features.perfectTyping) {
            reasons.push('No corrections or backspaces (suspicious for long text)');
        }
        if (features.backgroundPaste) {
            reasons.push('Text pasted while tab was in background');
        }
        if (features.avgTypingSpeed > 200) {
            reasons.push('Typing speed exceeds human capabilities');
        }
        if (features.noHumanPauses) {
            reasons.push('No natural pauses in typing rhythm');
        }
        
        return reasons.length > 0 ? reasons : ['Behavior appears normal'];
    }

    /**
     * Helper functions
     */
    average(arr) {
        if (arr.length === 0) return 0;
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }

    variance(arr) {
        if (arr.length === 0) return 0;
        const avg = this.average(arr);
        return arr.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / arr.length;
    }

    calculateMousePathLength() {
        if (this.profile.mouseMovements.length < 2) return 0;
        
        let length = 0;
        for (let i = 1; i < this.profile.mouseMovements.length; i++) {
            const prev = this.profile.mouseMovements[i - 1];
            const curr = this.profile.mouseMovements[i];
            length += Math.sqrt(
                Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
            );
        }
        return length;
    }

    /**
     * Reset profile for new input
     */
    reset() {
        this.profile = {
            typingSpeed: [],
            keystrokeIntervals: [],
            backspaceCount: 0,
            totalKeystrokes: 0,
            mouseMovements: [],
            clickCount: 0,
            lastMouseTime: 0,
            hasMouseActivity: false,
            pasteEvents: [],
            pasteLength: 0,
            copyEvents: 0,
            focusChanges: [],
            backgroundTime: 0,
            activeTime: 0,
            sessionStartTime: Date.now(),
            lastInteractionTime: Date.now(),
            interactionCount: 0,
            inputLength: 0,
            editDistance: 0,
            characterVariety: 0
        };
    }

    /**
     * Get current profile snapshot
     */
    getProfile() {
        return JSON.parse(JSON.stringify(this.profile));
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BehavioralProfiler;
}

// Make available globally
if (typeof window !== 'undefined') {
    window.BehavioralProfiler = BehavioralProfiler;
}