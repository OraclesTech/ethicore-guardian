/**
 * Ethicore Guardian - Semantic Analyzer
 * Uses embeddings to understand MEANING, not just patterns
 * Version: 1.0.0 (Open Source Framework)
 * 
 * This module uses semantic similarity to detect jailbreak attempts
 * that are rephrased to bypass regex patterns.
 * 
 * Key Innovation: "Ignore previous instructions" and "Disregard what you were told"
 * have different words but identical MEANING. Embeddings capture this.
 * 
 * OPEN SOURCE FRAMEWORK:
 * This file provides the ARCHITECTURE and INTERFACE for semantic analysis.
 * The actual embedding model and trained threat embeddings are NOT included.
 * 
 * To use this in production:
 * 1. Train your own Universal Sentence Encoder model OR use a pre-trained one
 * 2. Generate embeddings for your threat patterns
 * 3. Replace the mock implementations with real TensorFlow.js calls
 * 
 * @module semantic-analyzer
 * @license MIT (framework only - models not included)
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
// Import threat patterns for semantic fingerprints
// (In browser context, this will be loaded via script tag)

class SemanticAnalyzer {
    constructor() {
        this.initialized = false;
        this.embeddingCache = new Map();
        this.threatEmbeddings = null;
        this.model = null;
        
        // Configuration
        this.config = {
            similarityThreshold: 0.75,      // Minimum similarity to flag as threat
            highConfidenceThreshold: 0.85,   // High confidence match
            cacheSizeLimit: 500,             // Max cached embeddings
            embeddingDimension: 512          // USE model dimension
        };
    }

    /**
     * Initialize the semantic analyzer
     * Loads Universal Sentence Encoder model
     */
    async initialize() {
        if (this.initialized) {
            console.log('🧠 Semantic Analyzer: Already initialized');
            return;
        }

        console.log('🧠 Semantic Analyzer: Initializing...');

        try {
            // Load Universal Sentence Encoder
            // This is a 50MB model, but it's WORTH IT for semantic understanding
            await this.loadEmbeddingModel();

            // Generate embeddings for all threat fingerprints
            await this.generateThreatEmbeddings();

            this.initialized = true;
            console.log('✅ Semantic Analyzer: Initialized successfully');
            console.log(`📊 Loaded ${this.threatEmbeddings.length} threat embeddings`);

        } catch (error) {
            console.error('❌ Semantic Analyzer: Initialization failed:', error);
            throw error;
        }
    }

    /**
     * Load embedding model (Universal Sentence Encoder)
     */
    async loadEmbeddingModel() {
        // Check if we have a cached model in storage
        const cachedModel = await this.loadCachedModel();
        
        if (cachedModel) {
            console.log('🧠 Using cached embedding model');
            this.model = cachedModel;
            return;
        }

        // Load from CDN (TensorFlow.js Universal Sentence Encoder)
        console.log('🧠 Loading Universal Sentence Encoder from CDN...');
        
        // This would be loaded via TensorFlow.js in production
        // For now, we'll use a simplified embedding function
        this.model = {
            embed: async (texts) => {
                // Placeholder: In production, this calls USE model
                // For now, return mock embeddings
                return this.generateMockEmbeddings(texts);
            }
        };
    }

    /**
     * Generate embeddings for all threat fingerprints
     */
    async generateThreatEmbeddings() {
        const fingerprints = this.getSemanticFingerprintsLocal();
        
        console.log(`🧠 Generating embeddings for ${fingerprints.length} threat patterns...`);

        this.threatEmbeddings = [];

        // Batch processing for efficiency
        const batchSize = 32;
        for (let i = 0; i < fingerprints.length; i += batchSize) {
            const batch = fingerprints.slice(i, i + batchSize);
            const texts = batch.map(fp => fp.text);
            
            // Generate embeddings
            const embeddings = await this.getEmbeddings(texts);
            
            // Store with metadata
            batch.forEach((fp, idx) => {
                this.threatEmbeddings.push({
                    text: fp.text,
                    embedding: embeddings[idx],
                    category: fp.category,
                    severity: fp.severity,
                    weight: fp.weight
                });
            });
        }

        // Cache threat embeddings for future use
        await this.cacheThreatEmbeddings();
    }

    /**
     * Get semantic fingerprints locally (without importing)
     */
    getSemanticFingerprintsLocal() {
        // Access global ThreatPatterns if available
        if (typeof window !== 'undefined' && window.ThreatPatterns) {
            return window.ThreatPatterns.getSemanticFingerprints();
        }
        
        // Fallback: return empty array (will be populated later)
        console.warn('ThreatPatterns not available, using empty fingerprints');
        return [];
    }

    /**
     * Get embeddings for text(s)
     * @param {string|Array} texts - Single text or array of texts
     * @returns {Array} Array of embedding vectors
     */
    async getEmbeddings(texts) {
        const textArray = Array.isArray(texts) ? texts : [texts];
        const embeddings = [];

        for (const text of textArray) {
            // Check cache first
            if (this.embeddingCache.has(text)) {
                embeddings.push(this.embeddingCache.get(text));
                continue;
            }

            // Generate embedding
            const embedding = await this.model.embed([text]);
            const vector = await this.tensorToArray(embedding);

            // Cache it
            this.cacheEmbedding(text, vector[0]);
            embeddings.push(vector[0]);
        }

        return embeddings;
    }

    /**
     * Analyze text for semantic threats
     * @param {string} text - User input text
     * @returns {Object} Analysis result
     */
    async analyze(text) {
        if (!this.initialized) {
            console.warn('🧠 Semantic Analyzer not initialized, initializing now...');
            await this.initialize();
        }

        if (!text || text.length < 5) {
            return {
                isThreat: false,
                confidence: 0,
                matches: [],
                semanticScore: 0
            };
        }

        // Generate embedding for input text
        const [inputEmbedding] = await this.getEmbeddings(text);

        // Compare against all threat embeddings
        const matches = [];
        let maxSimilarity = 0;

        for (const threatPattern of this.threatEmbeddings) {
            const similarity = this.cosineSimilarity(
                inputEmbedding,
                threatPattern.embedding
            );

            if (similarity >= this.config.similarityThreshold) {
                matches.push({
                    category: threatPattern.category,
                    severity: threatPattern.severity,
                    similarity: similarity,
                    matchedPattern: threatPattern.text,
                    weight: threatPattern.weight
                });

                maxSimilarity = Math.max(maxSimilarity, similarity);
            }
        }

        // Sort by similarity (highest first)
        matches.sort((a, b) => b.similarity - a.similarity);

        // Calculate overall semantic threat score
        const semanticScore = this.calculateSemanticScore(matches);

        // Determine if it's a threat
        const isThreat = maxSimilarity >= this.config.similarityThreshold;
        const highConfidence = maxSimilarity >= this.config.highConfidenceThreshold;

        return {
            isThreat,
            confidence: maxSimilarity,
            highConfidence,
            matches: matches.slice(0, 5), // Top 5 matches
            semanticScore,
            analysis: {
                inputLength: text.length,
                matchCount: matches.length,
                avgSimilarity: matches.length > 0
                    ? matches.reduce((sum, m) => sum + m.similarity, 0) / matches.length
                    : 0
            }
        };
    }

    /**
     * Calculate cosine similarity between two vectors
     * @param {Array} vecA - First vector
     * @param {Array} vecB - Second vector
     * @returns {number} Similarity score (0-1)
     */
    cosineSimilarity(vecA, vecB) {
        if (vecA.length !== vecB.length) {
            throw new Error('Vectors must have same dimension');
        }

        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }

        normA = Math.sqrt(normA);
        normB = Math.sqrt(normB);

        if (normA === 0 || normB === 0) return 0;

        return dotProduct / (normA * normB);
    }

    /**
     * Calculate overall semantic threat score
     * @param {Array} matches - Array of semantic matches
     * @returns {number} Threat score
     */
    calculateSemanticScore(matches) {
        if (matches.length === 0) return 0;

        // Weight by similarity and pattern weight
        const weightedScore = matches.reduce((sum, match) => {
            return sum + (match.similarity * match.weight);
        }, 0);

        // Normalize to 0-100 scale
        return Math.min(100, weightedScore / 2);
    }

    /**
     * Cache embedding for text
     * @param {string} text - Text to cache
     * @param {Array} embedding - Embedding vector
     */
    cacheEmbedding(text, embedding) {
        // Limit cache size
        if (this.embeddingCache.size >= this.config.cacheSizeLimit) {
            // Remove oldest entry (FIFO)
            const firstKey = this.embeddingCache.keys().next().value;
            this.embeddingCache.delete(firstKey);
        }

        this.embeddingCache.set(text, embedding);
    }

    /**
     * Convert tensor to array
     * @param {Tensor} tensor - TensorFlow.js tensor
     * @returns {Array} Array of values
     */
    async tensorToArray(tensor) {
        // In production with TensorFlow.js:
        // return await tensor.array();
        
        // Mock implementation
        return tensor;
    }

    /**
     * Generate mock embeddings (PLACEHOLDER - NOT FOR PRODUCTION)
     * 
     * ⚠️ IMPORTANT: This is a MOCK implementation for demonstration only.
     * In production, replace this with actual TensorFlow.js Universal Sentence Encoder.
     * 
     * Example production implementation:
     * ```javascript
     * import * as use from '@tensorflow-models/universal-sentence-encoder';
     * const model = await use.load();
     * const embeddings = await model.embed(texts);
     * return await embeddings.array();
     * ```
     * 
     * @param {Array<string>} texts - Input texts to embed
     * @returns {Array<Array<number>>} Mock embeddings (NOT REAL)
     */
    generateMockEmbeddings(texts) {
        return texts.map(text => {
            // Generate deterministic "embedding" based on text
            const vector = new Array(this.config.embeddingDimension).fill(0);
            
            // Simple hash-based mock (NOT for production)
            for (let i = 0; i < text.length; i++) {
                const charCode = text.charCodeAt(i);
                const idx = (charCode + i) % this.config.embeddingDimension;
                vector[idx] += charCode / 1000;
            }
            
            // Normalize
            const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
            return vector.map(val => val / (norm || 1));
        });
    }

    /**
     * Cache threat embeddings to storage
     */
    async cacheThreatEmbeddings() {
        try {
            const cacheData = {
                embeddings: this.threatEmbeddings,
                timestamp: Date.now(),
                version: '1.0.0'
            };

            // Store in browser storage
            if (typeof chrome !== 'undefined' && chrome.storage) {
                await chrome.storage.local.set({
                    'ethicore_threat_embeddings': cacheData
                });
            } else if (typeof browser !== 'undefined' && browser.storage) {
                await browser.storage.local.set({
                    'ethicore_threat_embeddings': cacheData
                });
            }

            console.log('✅ Threat embeddings cached successfully');
        } catch (error) {
            console.error('❌ Failed to cache threat embeddings:', error);
        }
    }

    /**
     * Load cached model
     */
    async loadCachedModel() {
        try {
            const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
            const stored = await browserAPI.storage.local.get('ethicore_threat_embeddings');
            
            if (stored.ethicore_threat_embeddings) {
                const cache = stored.ethicore_threat_embeddings;
                
                // Check if cache is still valid (30 days)
                const cacheAge = Date.now() - cache.timestamp;
                const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
                
                if (cacheAge < maxAge) {
                    this.threatEmbeddings = cache.embeddings;
                    return true;
                }
            }
        } catch (error) {
            console.log('No cached embeddings found');
        }
        
        return null;
    }

    /**
     * Get analyzer status
     */
    getStatus() {
        return {
            initialized: this.initialized,
            threatPatternsLoaded: this.threatEmbeddings?.length || 0,
            cacheSize: this.embeddingCache.size,
            config: this.config
        };
    }
}


// Make available globally in browser
if (typeof window !== 'undefined') {
    window.SemanticAnalyzer = SemanticAnalyzer;
}

console.log('🧠 Semantic Analyzer Module Loaded');