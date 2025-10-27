/**
 * Ethicore Guardian - Multi-Layer Defense System
 * Orchestrates all detection layers with weighted voting
 * Version: 1.0.0
 * 
 * This is the "immune system coordinator" - it combines:
 * - Layer 1: Behavioral profiling (HOW they interact)
 * - Layer 2: Pattern matching (WHAT they say)
 * - Layer 3: Semantic analysis (WHAT they mean)
 * - Layer 4: ML inference (OVERALL probability)
 * - Layer 5: Network analysis (WHERE/WHEN)
 * - Layer 6: Context tracking (CONVERSATION history)
 * 
 * Decision Logic: Weighted voting across all layers
 * - Each layer votes: BLOCK / SUSPICIOUS / ALLOW
 * - Votes are weighted by confidence and layer importance
 * - Final decision requires consensus or overriding critical findings
 * 
 * @module multi-layer-defense
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
class MultiLayerDefense {
    constructor() {
        this.initialized = false;
        
        // Layer components
        this.layers = {
            behavioral: null,      // BehavioralProfiler
            patterns: null,        // Pattern matcher
            semantic: null,        // SemanticAnalyzer
            ml: null,             // MLInferenceEngine
            network: null,        // Network analyzer
            context: null         // ConversationMemory
        };

        // Layer weights (how much we trust each layer)
        this.layerWeights = {
            behavioral: 1.1,      // Slightly higher - hard to fake
            patterns: 0.9,        // Lower - can have false positives
            semantic: 1.3,        // Highest - captures meaning
            ml: 1.5,             // Highest - combines all signals
            network: 0.8,        // Lower - context dependent
            context: 1.2         // High - progressive attacks
        };

        // Decision thresholds
        this.thresholds = {
            block: 10,           // Weighted score >= 10 → BLOCK
            challenge: 6,        // 6-9 → CHALLENGE (CAPTCHA/verify)
            allow: 6             // < 6 → ALLOW
        };

        // Statistics
        this.stats = {
            totalAnalyses: 0,
            blocked: 0,
            challenged: 0,
            allowed: 0,
            layerAgreement: [],
            avgDecisionTime: 0
        };

        console.log('🛡️ Multi-Layer Defense: Constructor initialized');
    }

    /**
     * Initialize all defense layers
     * @param {Object} components - Layer components
     */
    async initialize(components = {}) {
        if (this.initialized) {
            console.log('🛡️ Multi-Layer Defense: Already initialized');
            return;
        }

        console.log('🛡️ Multi-Layer Defense: Initializing all layers...');

        try {
            // Assign components
            this.layers.behavioral = components.behavioral || null;
            this.layers.patterns = components.patterns || null;
            this.layers.semantic = components.semantic || null;
            this.layers.ml = components.ml || null;
            this.layers.network = components.network || null;
            this.layers.context = components.context || null;

            // Initialize each layer if not already initialized
            if (this.layers.semantic && !this.layers.semantic.initialized) {
                await this.layers.semantic.initialize();
            }

            if (this.layers.ml && !this.layers.ml.initialized) {
                await this.layers.ml.initialize();
            }

            this.initialized = true;
            console.log('✅ Multi-Layer Defense: All layers initialized');
            this.logLayerStatus();

        } catch (error) {
            console.error('❌ Multi-Layer Defense: Initialization failed:', error);
            throw error;
        }
    }

    /**
     * Analyze input through all layers and make decision
     * @param {string} text - User input text
     * @param {Object} metadata - Additional context
     * @returns {Object} Defense decision
     */
    async analyze(text, metadata = {}) {
        const startTime = performance.now();

        if (!this.initialized) {
            console.warn('🛡️ Multi-Layer Defense not initialized, initializing now...');
            await this.initialize();
        }

        console.log('🛡️ Analyzing input across all layers...');

        // Collect votes from all layers
        const votes = await this.collectLayerVotes(text, metadata);

        // Calculate weighted consensus
        const decision = this.calculateConsensus(votes);

        // Update statistics
        const analysisTime = performance.now() - startTime;
        this.updateStats(decision, analysisTime, votes);

        // Add metadata
        decision.metadata = {
            analysisTime,
            layerVotes: votes,
            timestamp: new Date().toISOString(),
            url: metadata.url || window.location.href
        };

        console.log('🛡️ Defense Decision:', decision.verdict, `(${analysisTime.toFixed(2)}ms)`);

        return decision;
    }

    /**
     * Collect votes from all available layers
     * @param {string} text - Input text
     * @param {Object} metadata - Additional context
     * @returns {Array} Array of layer votes
     */
    async collectLayerVotes(text, metadata) {
        const votes = [];

        // Layer 1: Behavioral Profiling
        if (this.layers.behavioral) {
            const vote = await this.voteBehavioral(text, metadata);
            votes.push(vote);
        }

        // Layer 2: Pattern Matching
        if (this.layers.patterns) {
            const vote = await this.votePatterns(text, metadata);
            votes.push(vote);
        }

        // Layer 3: Semantic Analysis
        if (this.layers.semantic) {
            const vote = await this.voteSemantic(text, metadata);
            votes.push(vote);
        }

        // Layer 4: ML Inference
        if (this.layers.ml) {
            const vote = await this.voteML(text, metadata, votes);
            votes.push(vote);
        }

        // Layer 5: Network Analysis
        if (this.layers.network) {
            const vote = await this.voteNetwork(text, metadata);
            votes.push(vote);
        }

        // Layer 6: Context Tracking
        if (this.layers.context) {
            const vote = await this.voteContext(text, metadata);
            votes.push(vote);
        }

        return votes;
    }

    /**
     * Layer 1: Behavioral Profiling Vote
     */
    async voteBehavioral(text, metadata) {
        const analysis = this.layers.behavioral.analyzeAnomaly(text);

        let vote = 'ALLOW';
        let confidence = 0;

        if (analysis.score >= 80) {
            vote = 'BLOCK';
            confidence = 0.95;
        } else if (analysis.score >= 60) {
            vote = 'SUSPICIOUS';
            confidence = 0.75;
        } else if (analysis.score >= 40) {
            vote = 'SUSPICIOUS';
            confidence = 0.50;
        } else {
            vote = 'ALLOW';
            confidence = 0.90;
        }

        return {
            layer: 'behavioral',
            vote,
            confidence,
            weight: this.layerWeights.behavioral,
            details: {
                anomalyScore: analysis.score,
                verdict: analysis.verdict,
                reasons: analysis.explanation
            }
        };
    }

    /**
     * Layer 2: Pattern Matching Vote
     */
    async votePatterns(text, metadata) {
        // Use the existing threat pattern analyzer
        const analysis = this.analyzePatterns(text);

        let vote = 'ALLOW';
        let confidence = 0;

        if (analysis.threatLevel === 'CRITICAL') {
            vote = 'BLOCK';
            confidence = 0.90;
        } else if (analysis.threatLevel === 'HIGH') {
            vote = 'BLOCK';
            confidence = 0.80;
        } else if (analysis.threatLevel === 'MEDIUM') {
            vote = 'SUSPICIOUS';
            confidence = 0.65;
        } else if (analysis.threatLevel === 'LOW') {
            vote = 'SUSPICIOUS';
            confidence = 0.40;
        } else {
            vote = 'ALLOW';
            confidence = 0.95;
        }

        return {
            layer: 'patterns',
            vote,
            confidence,
            weight: this.layerWeights.patterns,
            details: {
                threatLevel: analysis.threatLevel,
                threatScore: analysis.score,
                matchedCategories: analysis.threats.map(t => t.category)
            }
        };
    }

    /**
     * Layer 3: Semantic Analysis Vote
     */
    async voteSemantic(text, metadata) {
        const analysis = await this.layers.semantic.analyze(text);

        let vote = 'ALLOW';
        let confidence = 0;

        if (analysis.highConfidence) {
            vote = 'BLOCK';
            confidence = analysis.confidence;
        } else if (analysis.isThreat) {
            vote = 'SUSPICIOUS';
            confidence = analysis.confidence;
        } else {
            vote = 'ALLOW';
            confidence = 1 - analysis.confidence;
        }

        return {
            layer: 'semantic',
            vote,
            confidence,
            weight: this.layerWeights.semantic,
            details: {
                isThreat: analysis.isThreat,
                similarityScore: analysis.confidence,
                topMatches: analysis.matches.slice(0, 3).map(m => ({
                    category: m.category,
                    similarity: m.similarity
                }))
            }
        };
    }

    /**
     * Layer 4: ML Inference Vote
     */
    async voteML(text, metadata, previousVotes) {
        // Combine all previous analysis into ML features
        const mlData = this.preparMLData(text, metadata, previousVotes);
        const analysis = await this.layers.ml.analyze(mlData);

        let vote = 'ALLOW';
        let confidence = analysis.confidence;

        if (analysis.threatLevel === 'CRITICAL') {
            vote = 'BLOCK';
        } else if (analysis.threatLevel === 'HIGH') {
            vote = 'BLOCK';
        } else if (analysis.threatLevel === 'MEDIUM') {
            vote = 'SUSPICIOUS';
        } else if (analysis.threatLevel === 'LOW') {
            vote = 'SUSPICIOUS';
            confidence = 0.50;
        } else {
            vote = 'ALLOW';
        }

        return {
            layer: 'ml',
            vote,
            confidence,
            weight: this.layerWeights.ml,
            details: {
                threatProbability: analysis.threatProbability,
                threatLevel: analysis.threatLevel,
                modelVersion: analysis.modelVersion
            }
        };
    }

    /**
     * Layer 5: Network Analysis Vote
     */
    async voteNetwork(text, metadata) {
        // Analyze network-level signals
        const networkScore = this.analyzeNetwork(metadata);

        let vote = 'ALLOW';
        let confidence = 0.70;

        if (networkScore >= 80) {
            vote = 'BLOCK';
            confidence = 0.85;
        } else if (networkScore >= 60) {
            vote = 'SUSPICIOUS';
            confidence = 0.70;
        } else {
            vote = 'ALLOW';
            confidence = 0.80;
        }

        return {
            layer: 'network',
            vote,
            confidence,
            weight: this.layerWeights.network,
            details: {
                networkScore,
                requestRate: metadata.requestRate || 0,
                suspiciousHeaders: metadata.suspiciousHeaders || false
            }
        };
    }

    /**
     * Layer 6: Context Tracking Vote
     */
    async voteContext(text, metadata) {
        const contextAnalysis = this.layers.context.assessConversationThreat();

        let vote = 'ALLOW';
        let confidence = 0.75;

        if (contextAnalysis.conversationThreatLevel === 'CRITICAL') {
            vote = 'BLOCK';
            confidence = 0.90;
        } else if (contextAnalysis.conversationThreatLevel === 'HIGH') {
            vote = 'BLOCK';
            confidence = 0.80;
        } else if (contextAnalysis.conversationThreatLevel === 'MEDIUM') {
            vote = 'SUSPICIOUS';
            confidence = 0.65;
        } else if (contextAnalysis.conversationThreatLevel === 'LOW') {
            vote = 'SUSPICIOUS';
            confidence = 0.40;
        } else {
            vote = 'ALLOW';
            confidence = 0.90;
        }

        return {
            layer: 'context',
            vote,
            confidence,
            weight: this.layerWeights.context,
            details: {
                conversationThreatLevel: contextAnalysis.conversationThreatLevel,
                cumulativeScore: contextAnalysis.cumulativeScore,
                turnCount: contextAnalysis.turnCount
            }
        };
    }

    /**
     * Calculate weighted consensus from all votes
     * @param {Array} votes - Array of layer votes
     * @returns {Object} Final decision
     */
    calculateConsensus(votes) {
        let blockScore = 0;
        let suspiciousScore = 0;
        let allowScore = 0;

        // Calculate weighted scores
        votes.forEach(vote => {
            const weightedConfidence = vote.confidence * vote.weight;

            if (vote.vote === 'BLOCK') {
                blockScore += weightedConfidence;
            } else if (vote.vote === 'SUSPICIOUS') {
                suspiciousScore += weightedConfidence;
            } else if (vote.vote === 'ALLOW') {
                allowScore += weightedConfidence;
            }
        });

        const totalScore = blockScore + suspiciousScore + allowScore;

        // Normalize scores
        const normalizedBlock = (blockScore / totalScore) * 100;
        const normalizedSuspicious = (suspiciousScore / totalScore) * 100;
        const normalizedAllow = (allowScore / totalScore) * 100;

        // Critical override: If ANY layer votes BLOCK with >90% confidence, block immediately
        const criticalBlock = votes.some(v => 
            v.vote === 'BLOCK' && v.confidence >= 0.90
        );

        // Make final decision
        let verdict = 'ALLOW';
        let action = 'ALLOW_REQUEST';
        let threatLevel = 'NONE';

        if (criticalBlock || blockScore >= this.thresholds.block) {
            verdict = 'BLOCK';
            action = 'BLOCK_REQUEST';
            threatLevel = 'CRITICAL';
        } else if (blockScore + suspiciousScore >= this.thresholds.challenge) {
            verdict = 'CHALLENGE';
            action = 'SHOW_CAPTCHA';
            threatLevel = 'HIGH';
        } else {
            verdict = 'ALLOW';
            action = 'ALLOW_REQUEST';
            threatLevel = 'NONE';
        }

        // Calculate overall confidence
        const maxScore = Math.max(blockScore, suspiciousScore, allowScore);
        const overallConfidence = maxScore / totalScore;

        return {
            verdict,
            action,
            threatLevel,
            confidence: overallConfidence,
            scores: {
                block: normalizedBlock.toFixed(1),
                suspicious: normalizedSuspicious.toFixed(1),
                allow: normalizedAllow.toFixed(1)
            },
            layerConsensus: {
                blockVotes: votes.filter(v => v.vote === 'BLOCK').length,
                suspiciousVotes: votes.filter(v => v.vote === 'SUSPICIOUS').length,
                allowVotes: votes.filter(v => v.vote === 'ALLOW').length,
                totalLayers: votes.length
            },
            reasoning: this.generateReasoning(votes, verdict)
        };
    }

    /**
     * Generate human-readable reasoning
     */
    generateReasoning(votes, verdict) {
        const reasons = [];

        if (verdict === 'BLOCK') {
            const blockingLayers = votes.filter(v => v.vote === 'BLOCK');
            
            blockingLayers.forEach(layer => {
                if (layer.layer === 'behavioral') {
                    reasons.push(`Suspicious behavioral patterns detected (${layer.details.reasons.join(', ')})`);
                } else if (layer.layer === 'patterns') {
                    reasons.push(`Matched ${layer.details.matchedCategories.length} threat categories`);
                } else if (layer.layer === 'semantic') {
                    reasons.push(`High semantic similarity to known attacks`);
                } else if (layer.layer === 'ml') {
                    reasons.push(`ML model detected ${(layer.details.threatProbability * 100).toFixed(1)}% threat probability`);
                } else if (layer.layer === 'context') {
                    reasons.push(`Multi-turn attack pattern detected`);
                }
            });
        } else if (verdict === 'CHALLENGE') {
            reasons.push('Multiple layers flagged suspicious activity');
            reasons.push('Additional verification required');
        } else {
            reasons.push('Input passed all security layers');
        }

        return reasons;
    }

    /**
     * Analyze patterns (simplified version of ThreatAnalyzer)
     */
    analyzePatterns(text) {
        // This would use the full THREAT_PATTERNS from threat-patterns.js
        // Simplified version for demonstration
        
        const threats = [];
        let totalScore = 0;

        // Check for critical patterns
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

    /**
     * Analyze network signals
     */
    analyzeNetwork(metadata) {
        let score = 0;

        // Check request rate
        if (metadata.requestRate > 10) score += 30;
        else if (metadata.requestRate > 5) score += 15;

        // Check for suspicious headers
        if (metadata.suspiciousHeaders) score += 25;

        // Check for automation signals
        if (metadata.noMouseMovement) score += 20;

        // Check timing
        if (metadata.instantSubmit) score += 25;

        return Math.min(100, score);
    }

    /**
     * Prepare data for ML inference
     */
    preparMLData(text, metadata, previousVotes) {
        // Extract features from previous votes
        const behavioral = previousVotes.find(v => v.layer === 'behavioral');
        const semantic = previousVotes.find(v => v.layer === 'semantic');

        return {
            text: text,
            behavioral: behavioral?.details || {},
            semantic: semantic?.details || {},
            technical: {
                requestSize: text.length,
                hasBase64: /[A-Za-z0-9+/]{40,}={0,2}/.test(text),
                hasSQLPatterns: /SELECT|INSERT|UPDATE|DELETE|DROP/i.test(text),
                hasXSSPatterns: /<script|javascript:|onerror=/i.test(text)
            }
        };
    }

    /**
     * Update statistics
     */
    updateStats(decision, time, votes) {
        this.stats.totalAnalyses++;

        if (decision.verdict === 'BLOCK') {
            this.stats.blocked++;
        } else if (decision.verdict === 'CHALLENGE') {
            this.stats.challenged++;
        } else {
            this.stats.allowed++;
        }

        // Calculate layer agreement
        const agreement = this.calculateLayerAgreement(votes);
        this.stats.layerAgreement.push(agreement);

        // Update average time
        this.stats.avgDecisionTime = 
            (this.stats.avgDecisionTime * (this.stats.totalAnalyses - 1) + time) / 
            this.stats.totalAnalyses;
    }

    /**
     * Calculate how much layers agree
     */
    calculateLayerAgreement(votes) {
        if (votes.length === 0) return 0;

        const voteCount = {};
        votes.forEach(v => {
            voteCount[v.vote] = (voteCount[v.vote] || 0) + 1;
        });

        const maxVotes = Math.max(...Object.values(voteCount));
        return (maxVotes / votes.length) * 100;
    }

    /**
     * Log layer status
     */
    logLayerStatus() {
        console.log('🛡️ Layer Status:');
        Object.entries(this.layers).forEach(([name, layer]) => {
            const status = layer ? '✅' : '❌';
            const weight = this.layerWeights[name];
            console.log(`  ${status} ${name} (weight: ${weight})`);
        });
    }

    /**
     * Get defense statistics
     */
    getStatistics() {
        return {
            totalAnalyses: this.stats.totalAnalyses,
            blocked: this.stats.blocked,
            challenged: this.stats.challenged,
            allowed: this.stats.allowed,
            blockRate: (this.stats.blocked / (this.stats.totalAnalyses || 1) * 100).toFixed(1) + '%',
            avgLayerAgreement: this.stats.layerAgreement.length > 0 
                ? (this.stats.layerAgreement.reduce((a, b) => a + b, 0) / this.stats.layerAgreement.length).toFixed(1) + '%'
                : '0%',
            avgDecisionTime: this.stats.avgDecisionTime.toFixed(2) + 'ms'
        };
    }

    /**
     * Adjust layer weights dynamically
     * (For adaptive learning based on false positives/negatives)
     */
    adjustLayerWeight(layerName, adjustment) {
        if (this.layerWeights.hasOwnProperty(layerName)) {
            this.layerWeights[layerName] = Math.max(0.1, 
                Math.min(2.0, this.layerWeights[layerName] + adjustment)
            );
            console.log(`🛡️ Adjusted ${layerName} weight to ${this.layerWeights[layerName]}`);
        }
    }

    /**
     * Get current configuration
     */
    getConfiguration() {
        return {
            initialized: this.initialized,
            layerWeights: { ...this.layerWeights },
            thresholds: { ...this.thresholds },
            activeLayers: Object.entries(this.layers)
                .filter(([_, layer]) => layer !== null)
                .map(([name, _]) => name)
        };
    }

    /**
     * Update thresholds
     */
    updateThresholds(newThresholds) {
        this.thresholds = { ...this.thresholds, ...newThresholds };
        console.log('🛡️ Thresholds updated:', this.thresholds);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MultiLayerDefense;
}

// Make available globally in browser
if (typeof window !== 'undefined') {
    window.MultiLayerDefense = MultiLayerDefense;
}

console.log('🛡️ Multi-Layer Defense Module Loaded');