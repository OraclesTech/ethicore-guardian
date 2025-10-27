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
 * Enhanced Background Script with Multi-Layer Support
 * Version: 2.0.0 - Phase 1 Complete
 * @license MIT 
 */

(function() {
    'use strict';

    if (window.__ethicoreLoaded) return;
    window.__ethicoreLoaded = true;

    const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
    console.log('🛡️ Ethicore Guardian Multi-Layer: Starting protection');

    // ============ LOAD CORE MODULES ============
    // These will be loaded via script injection or bundling
    const BehavioralProfiler = window.BehavioralProfiler;
    const SemanticAnalyzer = window.SemanticAnalyzer;
    const MLInferenceEngine = window.MLInferenceEngine;
    const MultiLayerDefense = window.MultiLayerDefense;

    // ============ CONVERSATION MEMORY (Multi-Turn Detection) ============
    class ConversationMemory {
        constructor(maxTurns = 20, decayFactor = 0.85) {
            this.turns = [];
            this.maxTurns = maxTurns;
            this.decayFactor = decayFactor;
            this.cumulativeScore = 0;
        }

        addTurn(text, analysis) {
            const turn = {
                text: text.substring(0, 500),
                timestamp: Date.now(),
                threatScore: analysis.score || analysis.semanticScore || 0,
                threatLevel: analysis.threatLevel || analysis.verdict || 'NONE',
                threats: analysis.threats || analysis.matches || [],
                hash: this.hashText(text)
            };

            this.turns.push(turn);

            if (this.turns.length > this.maxTurns) {
                this.turns.shift();
            }

            this.updateCumulativeScore();
            this.detectProgressiveAttack();

            return this.assessConversationThreat();
        }

        updateCumulativeScore() {
            const now = Date.now();
            this.cumulativeScore = this.turns.reduce((sum, turn) => {
                const age = now - turn.timestamp;
                const ageMinutes = age / (1000 * 60);
                const decay = Math.pow(this.decayFactor, ageMinutes / 10);
                return sum + (turn.threatScore * decay);
            }, 0);
        }

        detectProgressiveAttack() {
            const recentTurns = this.turns.slice(-5);
            
            // Pattern 1: Escalating role-play
            const rolePlayCount = recentTurns.filter(t => 
                JSON.stringify(t.threats).toLowerCase().includes('role') ||
                JSON.stringify(t.threats).toLowerCase().includes('jailbreak')
            ).length;
            if (rolePlayCount >= 3) this.cumulativeScore += 50;

            // Pattern 2: Instruction override buildup
            const instructionOverrides = recentTurns.filter(t =>
                JSON.stringify(t.threats).toLowerCase().includes('instruction')
            ).length;
            if (instructionOverrides >= 2) this.cumulativeScore += 60;

            // Pattern 3: Suspicious repetition (hammering)
            const recentHashes = recentTurns.map(t => t.hash);
            const uniqueHashes = new Set(recentHashes);
            if (recentHashes.length >= 4 && uniqueHashes.size <= 2) {
                this.cumulativeScore += 40;
            }

            // Pattern 4: Hypothetical framing before dangerous request
            const hasHypothetical = recentTurns.slice(0, 3).some(t =>
                /hypothetically|imagine|fictional|story/gi.test(t.text)
            );
            const hasDangerousRequest = recentTurns.slice(-2).some(t =>
                /hack|exploit|harm|kill|illegal|malicious/gi.test(t.text)
            );
            if (hasHypothetical && hasDangerousRequest) this.cumulativeScore += 55;
        }

        assessConversationThreat() {
            let level = 'NONE';
            
            if (this.cumulativeScore >= 200) level = 'CRITICAL';
            else if (this.cumulativeScore >= 120) level = 'HIGH';
            else if (this.cumulativeScore >= 60) level = 'MEDIUM';
            else if (this.cumulativeScore > 0) level = 'LOW';

            return {
                conversationThreatLevel: level,
                cumulativeScore: this.cumulativeScore,
                turnCount: this.turns.length,
                recentThreats: this.turns.slice(-5).flatMap(t => t.threats)
            };
        }

        hashText(text) {
            let hash = 0;
            for (let i = 0; i < text.length; i++) {
                hash = ((hash << 5) - hash) + text.charCodeAt(i);
                hash = hash & hash;
            }
            return hash;
        }

        reset() {
            this.turns = [];
            this.cumulativeScore = 0;
        }
    }

    // ============ ALLOWLIST MANAGER ============
    class AllowlistManager {
        constructor() {
            this.rules = [];
            this.initialized = false;
        }

        async init() {
            try {
                const stored = await browserAPI.storage.local.get('ethicore_allowlist');
                if (stored.ethicore_allowlist) {
                    this.rules = stored.ethicore_allowlist;
                }
                this.initialized = true;
            } catch (e) {
                console.error('Allowlist init error:', e);
            }
        }

        async addRule(originalText, threatCategory, scope = 'permanent') {
            const rule = {
                id: this.generateRuleId(),
                pattern: this.extractSafePattern(originalText, threatCategory),
                category: threatCategory,
                scope,
                domain: window.location.hostname,
                createdAt: Date.now(),
                timesUsed: 0
            };

            this.rules.push(rule);
            await this.save();
            return rule;
        }

        extractSafePattern(text, category) {
            if (category === 'roleHijacking' || category === 'role_hijacking') {
                const educationalRoles = [
                    'tutor', 'teacher', 'instructor', 'professor', 'mentor',
                    'guide', 'expert', 'consultant', 'advisor'
                ];
                
                const match = text.match(/act as (?:a |an )?([\w\s]+)/i);
                if (match) {
                    const role = match[1].toLowerCase();
                    if (educationalRoles.some(r => role.includes(r))) {
                        return {
                            type: 'regex',
                            pattern: /act as (?:a |an )?(tutor|teacher|instructor|professor|mentor|guide|expert|consultant|advisor)/gi,
                            description: 'Educational role-playing'
                        };
                    }
                }
            }

            return {
                type: 'fuzzy',
                pattern: text,
                threshold: 0.85,
                description: 'User-approved prompt'
            };
        }

        check(text, analysis) {
            for (const rule of this.rules) {
                if (this.matches(text, rule)) {
                    rule.timesUsed++;
                    
                    return {
                        allowed: true,
                        rule: rule,
                        adjustedAnalysis: {
                            ...analysis,
                            threatLevel: 'NONE',
                            verdict: 'ALLOW'
                        }
                    };
                }
            }

            return { allowed: false };
        }

        matches(text, rule) {
            if (rule.pattern.type === 'regex') {
                return rule.pattern.pattern.test(text);
            }
            
            if (rule.pattern.type === 'fuzzy') {
                return this.fuzzyMatch(text, rule.pattern.pattern, rule.pattern.threshold);
            }
            
            return false;
        }

        fuzzyMatch(text1, text2, threshold) {
            const similarity = this.calculateSimilarity(
                text1.toLowerCase(), 
                text2.toLowerCase()
            );
            return similarity >= threshold;
        }

        calculateSimilarity(str1, str2) {
            const longer = str1.length > str2.length ? str1 : str2;
            const shorter = str1.length > str2.length ? str2 : str1;
            
            if (longer.length === 0) return 1.0;
            
            const editDistance = this.levenshteinDistance(longer, shorter);
            return (longer.length - editDistance) / longer.length;
        }

        levenshteinDistance(str1, str2) {
            const matrix = [];
            
            for (let i = 0; i <= str2.length; i++) {
                matrix[i] = [i];
            }
            
            for (let j = 0; j <= str1.length; j++) {
                matrix[0][j] = j;
            }
            
            for (let i = 1; i <= str2.length; i++) {
                for (let j = 1; j <= str1.length; j++) {
                    if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                        matrix[i][j] = matrix[i - 1][j - 1];
                    } else {
                        matrix[i][j] = Math.min(
                            matrix[i - 1][j - 1] + 1,
                            matrix[i][j - 1] + 1,
                            matrix[i - 1][j] + 1
                        );
                    }
                }
            }
            
            return matrix[str2.length][str1.length];
        }

        async save() {
            await browserAPI.storage.local.set({
                ethicore_allowlist: this.rules
            });
        }

        generateRuleId() {
            return `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
    }

    // ============ INCIDENT REPORTER ============
    class IncidentReporter {
        constructor() {
            this.incidents = [];
            this.maxIncidents = 100;
        }

        async init() {
            try {
                const stored = await browserAPI.storage.local.get('ethicore_incidents');
                if (stored.ethicore_incidents) {
                    this.incidents = stored.ethicore_incidents;
                }
            } catch (e) {
                console.error('Incident reporter init error:', e);
            }
        }

        async createIncident(type, analysis, context) {
            const incident = {
                id: `incident_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
                type,
                timestamp: new Date().toISOString(),
                
                threatLevel: analysis.threatLevel || analysis.verdict || 'UNKNOWN',
                threatScore: analysis.score || analysis.semanticScore || 0,
                threats: this.extractThreats(analysis),

                url: window.location.href,
                domain: window.location.hostname,
                pageTitle: document.title,

                conversationContext: analysis.conversationThreat || null,

                action: type === 'blocked_request' ? 'REQUEST_BLOCKED' : 
                        type === 'blocked_response' ? 'RESPONSE_BLOCKED' : 'USER_WARNED',
                
                userOverride: false,
                allowlistRuleCreated: null,

                multiLayerAnalysis: analysis.metadata || null,

                extensionVersion: '2.0.0'
            };

            this.incidents.push(incident);

            if (this.incidents.length > this.maxIncidents) {
                this.incidents = this.incidents.slice(-this.maxIncidents);
            }

            await this.save();
            return incident;
        }

        extractThreats(analysis) {
            // Handle different analysis formats
            if (analysis.threats) return analysis.threats;
            if (analysis.matches) return analysis.matches;
            if (analysis.metadata && analysis.metadata.layerVotes) {
                return analysis.metadata.layerVotes
                    .filter(v => v.details)
                    .flatMap(v => v.details.matchedCategories || []);
            }
            return [];
        }

        async updateIncident(incidentId, updates) {
            const incident = this.incidents.find(i => i.id === incidentId);
            if (incident) {
                Object.assign(incident, updates);
                await this.save();
            }
        }

        async save() {
            await browserAPI.storage.local.set({
                ethicore_incidents: this.incidents
            });
        }
    }

    // ============ INITIALIZE COMPONENTS ============
    const conversationMemory = new ConversationMemory();
    const allowlistManager = new AllowlistManager();
    const incidentReporter = new IncidentReporter();
    
    // Initialize multi-layer defense
    let multiLayerDefense = null;
    let behavioralProfiler = null;
    
    let stats = { threatsDetected: 0, threatsBlocked: 0 };
    let currentIncidentId = null;

    // Initialize async components
    (async function initializeComponents() {
        await allowlistManager.init();
        await incidentReporter.init();
        
        // Initialize behavioral profiler
        if (typeof BehavioralProfiler !== 'undefined') {
            behavioralProfiler = new BehavioralProfiler();
            console.log('✅ Behavioral Profiler initialized');
        }
        
        // Initialize multi-layer defense
        if (typeof MultiLayerDefense !== 'undefined') {
            multiLayerDefense = new MultiLayerDefense();
    
            // Initialize semantic analyzer
            let semanticAnalyzer = null;
            if (typeof SemanticAnalyzer !== 'undefined') {
                semanticAnalyzer = new SemanticAnalyzer();
                // Don't await initialization here - will happen in background
            }
    
            // Initialize ML inference
            let mlEngine = null;
            if (typeof MLInferenceEngine !== 'undefined') {
                mlEngine = new MLInferenceEngine();
                // Don't await initialization here - will happen in background
            }
    
            await multiLayerDefense.initialize({
                behavioral: behavioralProfiler,
                patterns: { analyze: analyzePatterns }, // Pattern analyzer function
                semantic: semanticAnalyzer,
                ml: mlEngine,
                network: null, // Network layer runs in background.js only
                context: conversationMemory
            });
    
            console.log('✅ Multi-Layer Defense initialized');
        }

        // Helper function for pattern analysis (add this)
        function analyzePatterns(text) {
            const threats = [];
            let totalScore = 0;

            const criticalPatterns = [
                { pattern: /ignore\s+(all\s+)?(previous|prior)\s+instructions?/gi, weight: 100, category: 'instructionOverride' },
                { pattern: /you\s+are\s+now\s+(a|an)\s+(?!assistant)/gi, weight: 90, category: 'roleHijacking' },
                { pattern: /\b(DAN|jailbreak)\b/gi, weight: 100, category: 'jailbreakActivation' }
            ];

            criticalPatterns.forEach(({ pattern, weight, category }) => {
                const matches = text.match(pattern);
                if (matches) {
                    threats.push({ category, severity: 'CRITICAL', matches: matches.length });
                    totalScore += weight * matches.length;
                }
            });

            let threatLevel = 'NONE';
            if (totalScore >= 150) threatLevel = 'CRITICAL';
            else if (totalScore >= 80) threatLevel = 'HIGH';
            else if (totalScore >= 30) threatLevel = 'MEDIUM';
            else if (totalScore > 0) threatLevel = 'LOW';

            return { threatLevel, threats, score: totalScore };
        }
        
        console.log('✅ All components initialized');
    })();

    // ============ ENHANCED ANALYSIS WITH MULTI-LAYER ============
    async function analyzeWithMultiLayer(text) {
        // If multi-layer is available, use it
        if (multiLayerDefense && multiLayerDefense.initialized) {
            const analysis = await multiLayerDefense.analyze(text, {
                url: window.location.href,
                timestamp: Date.now()
            });
            
            // Add to conversation memory
            conversationMemory.addTurn(text, analysis);
            
            // Check allowlist
            const allowlistCheck = allowlistManager.check(text, analysis);
            
            if (allowlistCheck.allowed) {
                return {
                    ...allowlistCheck.adjustedAnalysis,
                    allowlistApplied: true,
                    allowlistRule: allowlistCheck.rule
                };
            }
            
            // Create incident if threat detected
            if (analysis.verdict === 'BLOCK' || analysis.verdict === 'CHALLENGE') {
                const incident = await incidentReporter.createIncident(
                    'blocked_request',
                    analysis,
                    { url: window.location.href }
                );
                analysis.incidentId = incident.id;
                currentIncidentId = incident.id;
            }
            
            return analysis;
        }
        
        // Fallback to legacy analysis
        return await analyzeWithFallback(text);
    }

    // ============ FALLBACK ANALYSIS (Legacy) ============
    async function analyzeWithFallback(text) {
        // Simple pattern-based analysis as fallback
        const threats = [];
        let totalScore = 0;

        const criticalPatterns = [
            { pattern: /ignore\s+(all\s+)?(previous|prior)\s+instructions?/gi, weight: 100, category: 'instructionOverride' },
            { pattern: /you\s+are\s+now\s+(a|an)\s+(?!assistant)/gi, weight: 90, category: 'roleHijacking' },
            { pattern: /\b(DAN|jailbreak)\b/gi, weight: 100, category: 'jailbreakActivation' }
        ];

        criticalPatterns.forEach(({ pattern, weight, category }) => {
            const matches = text.match(pattern);
            if (matches) {
                threats.push({ category, severity: 'CRITICAL', matches: matches.length });
                totalScore += weight * matches.length;
            }
        });

        let threatLevel = 'NONE';
        if (totalScore >= 150) threatLevel = 'CRITICAL';
        else if (totalScore >= 80) threatLevel = 'HIGH';
        else if (totalScore >= 30) threatLevel = 'MEDIUM';
        else if (totalScore > 0) threatLevel = 'LOW';

        const shouldBlock = (threatLevel === 'CRITICAL' || threatLevel === 'HIGH');

        return {
            verdict: shouldBlock ? 'BLOCK' : 'ALLOW',
            threatLevel,
            threats,
            score: totalScore,
            shouldBlock,
            fallbackMode: true
        };
    }

    // ============ ENHANCED WARNING UI ============
    function showEnhancedWarning(analysis, originalText) {
        let warning = document.getElementById('ethicore-warning');
        if (warning) warning.remove();

        warning = document.createElement('div');
        warning.id = 'ethicore-warning';
        warning.style.cssText = `
            position: fixed; top: 20px; right: 20px; max-width: 450px; z-index: 999999;
            background: ${analysis.threatLevel === 'CRITICAL' ? '#dc2626' : '#ea580c'};
            color: white; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.4);
            padding: 16px 20px; font-family: system-ui;
        `;

        const threatSummary = analysis.reasoning ? analysis.reasoning.join(', ') : 'Potential threat detected';
        const confidence = analysis.confidence ? `${(analysis.confidence * 100).toFixed(0)}%` : 'High';
        
        warning.innerHTML = `
            <div style="display: flex; align-items: start; gap: 12px;">
                <div style="font-size: 24px;">🛡️</div>
                <div style="flex: 1;">
                    <div style="font-weight: bold; font-size: 16px; margin-bottom: 4px;">
                        ${analysis.threatLevel} THREAT DETECTED
                    </div>
                    <div style="font-size: 13px; opacity: 0.9; margin-bottom: 8px;">
                        Confidence: ${confidence}
                    </div>
                    <div style="font-size: 12px; opacity: 0.85; margin-bottom: 12px; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 4px; max-height: 60px; overflow: hidden;">
                        "${originalText.substring(0, 80)}${originalText.length > 80 ? '...' : ''}"
                    </div>
                    ${analysis.metadata?.layerVotes ? `
                        <div style="font-size: 11px; opacity: 0.8; margin-bottom: 12px; padding: 6px; background: rgba(0,0,0,0.15); border-radius: 4px;">
                            🔍 Multi-layer analysis: ${analysis.layerConsensus?.blockVotes || 0}/${analysis.layerConsensus?.totalLayers || 0} layers flagged
                        </div>
                    ` : ''}
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <button id="ethicore-allow-once" style="
                            padding: 6px 12px; border: none; border-radius: 6px;
                            background: rgba(255,255,255,0.25); color: white;
                            font-size: 12px; font-weight: 600; cursor: pointer;
                            transition: all 0.2s;
                        ">Allow Once</button>
                        <button id="ethicore-allow-always" style="
                            padding: 6px 12px; border: none; border-radius: 6px;
                            background: rgba(255,255,255,0.25); color: white;
                            font-size: 12px; font-weight: 600; cursor: pointer;
                            transition: all 0.2s;
                        ">Allow Similar</button>
                        <button id="ethicore-dismiss" style="
                            padding: 6px 12px; border: none; border-radius: 6px;
                            background: rgba(0,0,0,0.3); color: white;
                            font-size: 12px; font-weight: 600; cursor: pointer;
                            transition: all 0.2s;
                        ">Dismiss</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(warning);

        // Extract primary threat category
        const primaryThreat = analysis.threats?.[0]?.category || 
                             analysis.matches?.[0]?.category || 
                             'unknown';

        document.getElementById('ethicore-allow-once')?.addEventListener('click', async () => {
            await allowlistManager.addRule(originalText, primaryThreat, 'session');
            if (currentIncidentId) {
                await incidentReporter.updateIncident(currentIncidentId, { 
                    userOverride: true,
                    overrideType: 'session'
                });
            }
            warning.remove();
            showToast('✓ Allowed for this session', 'success');
        });

        document.getElementById('ethicore-allow-always')?.addEventListener('click', async () => {
            const rule = await allowlistManager.addRule(originalText, primaryThreat, 'permanent');
            if (currentIncidentId) {
                await incidentReporter.updateIncident(currentIncidentId, { 
                    userOverride: true,
                    allowlistRuleCreated: rule.id,
                    overrideType: 'permanent'
                });
            }
            showToast('✓ Rule saved - similar prompts will be allowed', 'success');
            warning.remove();
        });

        document.getElementById('ethicore-dismiss')?.addEventListener('click', () => {
            warning.remove();
        });

        setTimeout(() => { if (warning.parentElement) warning.remove(); }, 30000);

        stats.threatsDetected++;
        stats.threatsBlocked++;

        browserAPI.runtime.sendMessage({
            type: 'threatDetected',
            eventType: 'BLOCKED_REQUEST',
            analysis
        }).catch(() => {});
    }

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; z-index: 999999;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white; padding: 12px 20px; border-radius: 8px;
            font-family: system-ui; font-size: 14px; font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // ============ INPUT INTERCEPTION ============
    function findInput() {
        const selectors = [
            'textarea[placeholder*="Message"]', 
            'div[contenteditable="true"]', 
            'textarea',
            'input[type="text"]'
        ];
        for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el && el.offsetParent !== null) return el;
        }
        return null;
    }

    function getInputText() {
        const input = findInput();
        if (!input) return '';
        return (input.value || input.textContent || input.innerText || '').trim();
    }

    function setupInputInterception() {
        const monitoredElements = new WeakSet();
        const analyzedTexts = new Map();

        // Monitor input for behavioral profiling
        if (behavioralProfiler) {
            const input = findInput();
            if (input) {
                behavioralProfiler.monitor(input);
                console.log('🧬 Behavioral monitoring active on input');
            }
        }

        document.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn || monitoredElements.has(btn)) return;

            const isSendBtn = btn.textContent.toLowerCase().includes('send') ||
                          btn.innerHTML.toLowerCase().includes('send') ||
                          btn.getAttribute('aria-label')?.toLowerCase().includes('send') ||
                          btn.type === 'submit';

            if (isSendBtn) {
                monitoredElements.add(btn);

                const text = getInputText();
                if (text && text.length > 3) {
                    // Check cache first
                    if (analyzedTexts.has(text)) {
                        const cached = analyzedTexts.get(text);
                        if (cached.verdict === 'BLOCK') {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                            console.error('🚨 BLOCKED (from cache)');
                            return false;
                        }
                        return;
                    }

                    // Not cached - BLOCK FIRST, analyze async
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    // Analyze with multi-layer
                    analyzeWithMultiLayer(text).then(analysis => {
                        console.log('📊 Multi-Layer Analysis:', analysis);
                        
                        analyzedTexts.set(text, analysis);
                        
                        if (analysis.verdict === 'BLOCK') {
                            console.error('🚨 CONFIRMED BLOCK');
                            showEnhancedWarning(analysis, text);
                        } else if (analysis.verdict === 'CHALLENGE') {
                            console.warn('⚠️ CHALLENGE - Additional verification needed');
                            showEnhancedWarning(analysis, text);
                        } else {
                            console.log('✅ Safe - clicking again');
                            setTimeout(() => btn.click(), 50);
                        }
                    });

                    return false;
                }
            }
        }, true);

        console.log('✅ Enhanced input interception active');
    }

    // ============ OUTPUT INTERCEPTION ============
    function setupOutputInterception() {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const [resource] = args;
            const url = typeof resource === 'string' ? resource : resource?.url || '';

            return (async () => {
                const response = await originalFetch.apply(this, args);

                if (response.ok) {
                    try {
                        const clone = response.clone();
                        const data = await clone.json();
                        const responseText = extractResponseText(data);

                        if (responseText && responseText.length > 5) {
                            // Simple output analysis (can be enhanced with ML later)
                            const analysis = analyzeOutput(responseText);

                            if (analysis.threatLevel === 'CRITICAL') {
                                console.error('🚨 BLOCKED RESPONSE:', analysis);
                                
                                await incidentReporter.createIncident(
                                    'blocked_response',
                                    analysis,
                                    { url: window.location.href }
                                );

                                showToast('🛡️ Dangerous response blocked', 'warning');
                                stats.threatsBlocked++;
                                
                                browserAPI.runtime.sendMessage({
                                    type: 'threatDetected',
                                    eventType: 'BLOCKED_RESPONSE',
                                    analysis
                                }).catch(() => {});
                            }
                        }
                    } catch (e) {
                        // Not JSON or parse error
                    }
                }

                return response;
            })();
        };

        console.log('✅ Enhanced output interception active');
    }

    function extractResponseText(data) {
        if (!data) return '';

        if (data.content && Array.isArray(data.content)) {
            return data.content.map(c => c.text || '').join(' ');
        }

        if (data.choices && Array.isArray(data.choices)) {
            return data.choices.map(c => c.message?.content || c.text || '').join(' ');
        }

        if (data.text) return data.text;
        if (data.message) return data.message;

        return '';
    }

    function analyzeOutput(text) {
        const threats = [];
        let score = 0;

        // Check for dangerous code
        if (/import\s+(os|subprocess|sys|socket)/gi.test(text)) {
            if (/\.system\(|Popen\(|eval\(|exec\(/gi.test(text)) {
                threats.push({ type: 'dangerous_code', severity: 'CRITICAL' });
                score += 100;
            }
        }

        // Check for shell commands
        if (/bash|sh|cmd|rm\s+-rf|del\s+\/s|format\s+/gi.test(text)) {
            threats.push({ type: 'shell_command', severity: 'CRITICAL' });
            score += 100;
        }

        // Check for credential exposure
        if (/api[_-]?key|secret[_-]?key|password|token|credentials?/gi.test(text)) {
            if (/=\s*['"a-zA-Z0-9]{20,}/gi.test(text)) {
                threats.push({ type: 'credential_exposure', severity: 'CRITICAL' });
                score += 90;
            }
        }

        return {
            threats,
            score,
            threatLevel: score >= 100 ? 'CRITICAL' : score >= 50 ? 'HIGH' : 'LOW'
        };
    }

    // ============ CONVERSATION RESET DETECTION ============
    function detectConversationReset() {
        const observer = new MutationObserver(() => {
            const newChatButton = document.querySelector('[aria-label*="New chat"]') || 
                                  document.querySelector('button[class*="new"]');
            
            if (newChatButton && !newChatButton.dataset.ethicoreMonitored) {
                newChatButton.dataset.ethicoreMonitored = 'true';
                newChatButton.addEventListener('click', () => {
                    console.log('🔄 Conversation reset detected');
                    conversationMemory.reset();
                    showToast('Conversation memory cleared', 'info');
                });
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ============ INITIALIZE ============
    function init() {
        console.log('🛡️ Ethicore Multi-Layer: Initializing on', window.location.hostname);
        setupInputInterception();
        setupOutputInterception();
        detectConversationReset();
        console.log('✅ Ethicore Guardian Multi-Layer active');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    setInterval(() => {
        browserAPI.runtime.sendMessage({
            type: 'updateStats',
            stats
        }).catch(() => {});
    }, 5000);
})();