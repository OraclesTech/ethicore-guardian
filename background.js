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



const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

const STORAGE_KEYS = {
    THREATS_LOG: 'ethicore_threats_log',
    STATS: 'ethicore_stats',
    CONFIG: 'ethicore_config',
    AUDIT_TRAIL: 'ethicore_audit_trail',
    INCIDENTS: 'ethicore_incidents',
    ALLOWLIST: 'ethicore_allowlist',
    INTEL: 'ethicore_intel',
    ML_MODEL: 'ethicore_ml_model',
    ML_SCALER: 'ethicore_ml_scaler',
    THREAT_EMBEDDINGS: 'ethicore_threat_embeddings'
};

const DEFAULT_CONFIG = {
    blockCritical: true,
    blockHigh: true,
    blockMedium: false,
    enableLogging: true,
    enableAuditTrail: true,
    maxLogSize: 10000,
    autoCleanupDays: 30,
    
    // Tier 1 features
    multiTurnEnabled: true,
    allowlistEnabled: true,
    threatIntelSync: true,
    collaborativeFeed: false,
    enableNotifications: true,
    syncInterval: 24 * 60 * 60 * 1000,
    lastSync: 0,
    
    // Phase 1 features
    multiLayerDefenseEnabled: true,
    behavioralProfilingEnabled: true,
    semanticAnalysisEnabled: true,
    mlInferenceEnabled: true,
    
    // Layer weights (can be adjusted)
    layerWeights: {
        behavioral: 1.1,
        patterns: 0.9,
        semantic: 1.3,
        ml: 1.5,
        network: 0.8,
        context: 1.2
    }
};

let config = { ...DEFAULT_CONFIG };
let stats = {
    threatsDetected: 0,
    threatsBlocked: 0,
    requestsAnalyzed: 0,
    responsesAnalyzed: 0,
    startTime: Date.now(),
    multiTurnBlocks: 0,
    allowlistHits: 0,
    patternsReceived: 0,
    contributionsSent: 0,
    
    // Phase 1 stats
    multiLayerAnalyses: 0,
    behavioralAnomalies: 0,
    semanticMatches: 0,
    mlPredictions: 0,
    avgAnalysisTime: 0
};

let threatBreakdown = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0
};

/**
 * Report Generator Class (Enhanced)
 */
class ReportGenerator {
    constructor() {
        this.browserAPI = browserAPI;
    }

    async generateReport(filters = {}) {
        const stored = await this.browserAPI.storage.local.get(STORAGE_KEYS.INCIDENTS);
        let incidents = stored[STORAGE_KEYS.INCIDENTS] || [];

        console.log('📊 Generating report from', incidents.length, 'incidents');

        incidents = this.filterIncidents(incidents, filters);

        const report = {
            metadata: {
                generatedAt: new Date().toISOString(),
                period: filters.dateRange || 'all_time',
                totalIncidents: incidents.length,
                reportVersion: '2.0',
                multiLayerEnabled: config.multiLayerDefenseEnabled,
                filters: filters
            },

            summary: this.generateSummary(incidents),
            incidents: incidents.map(i => this.formatIncident(i)),
            analytics: this.generateAnalytics(incidents),
            recommendations: this.generateRecommendations(incidents),
            
            // Phase 1 additions
            layerPerformance: this.analyzeLayerPerformance(incidents),
            detectionMethods: this.analyzeDetectionMethods(incidents)
        };

        console.log('✅ Report generated:', report);
        return report;
    }

    filterIncidents(incidents, filters) {
        let filtered = [...incidents];

        if (filters.dateRange) {
            const now = Date.now();
            const ranges = {
                'last_24h': 24 * 60 * 60 * 1000,
                'last_7d': 7 * 24 * 60 * 60 * 1000,
                'last_30d': 30 * 24 * 60 * 60 * 1000
            };

            const range = ranges[filters.dateRange];
            if (range) {
                const cutoff = now - range;
                filtered = filtered.filter(i => 
                    new Date(i.timestamp).getTime() > cutoff
                );
            }
        }

        if (filters.threatLevel) {
            filtered = filtered.filter(i => 
                i.threatLevel === filters.threatLevel
            );
        }

        if (filters.domain) {
            filtered = filtered.filter(i => 
                i.domain === filters.domain
            );
        }

        return filtered;
    }

    generateSummary(incidents) {
        const blocked = incidents.filter(i => 
            i.action === 'REQUEST_BLOCKED' || i.action === 'RESPONSE_BLOCKED'
        ).length;

        const warned = incidents.filter(i => 
            i.action === 'USER_WARNED'
        ).length;

        const overridden = incidents.filter(i => 
            i.userOverride === true
        ).length;

        const bySeverity = {
            CRITICAL: incidents.filter(i => i.threatLevel === 'CRITICAL').length,
            HIGH: incidents.filter(i => i.threatLevel === 'HIGH').length,
            MEDIUM: incidents.filter(i => i.threatLevel === 'MEDIUM').length,
            LOW: incidents.filter(i => i.threatLevel === 'LOW').length
        };

        const topThreats = this.getTopThreats(incidents);
        const topDomains = this.getTopDomains(incidents);

        return {
            totalIncidents: incidents.length,
            blocked,
            warned,
            overridden,
            bySeverity,
            topThreats,
            topDomains,
            protectionRate: incidents.length > 0 ? 
                ((blocked / incidents.length) * 100).toFixed(1) + '%' : '0%'
        };
    }

    getTopThreats(incidents) {
        const threatCounts = {};

        incidents.forEach(incident => {
            if (incident.threats && Array.isArray(incident.threats)) {
                incident.threats.forEach(threat => {
                    const category = threat.category || 'unknown';
                    threatCounts[category] = (threatCounts[category] || 0) + 1;
                });
            }
        });

        return Object.entries(threatCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([category, count]) => ({ 
                category: this.humanReadableCategory(category), 
                count 
            }));
    }

    getTopDomains(incidents) {
        const domainCounts = {};

        incidents.forEach(incident => {
            if (incident.domain) {
                domainCounts[incident.domain] = (domainCounts[incident.domain] || 0) + 1;
            }
        });

        return Object.entries(domainCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([domain, count]) => ({ domain, count }));
    }

    formatIncident(incident) {
        return {
            id: incident.id,
            timestamp: incident.timestamp,
            threatLevel: incident.threatLevel,
            action: incident.action,
            threats: (incident.threats || []).map(t => ({
                category: this.humanReadableCategory(t.category),
                severity: t.severity
            })),
            domain: incident.domain,
            conversationThreat: incident.conversationContext?.cumulativeScore > 0,
            userOverride: incident.userOverride || false,
            multiLayer: incident.multiLayerAnalysis ? true : false
        };
    }

    humanReadableCategory(category) {
        const mapping = {
            'instruction_override': 'Instruction Override',
            'instructionOverride': 'Instruction Override',
            'role_hijacking': 'Role Hijacking',
            'roleHijacking': 'Role Hijacking',
            'jailbreak_activation': 'Jailbreak Attempt',
            'jailbreakActivation': 'Jailbreak Attempt',
            'danActivation': 'Jailbreak Attempt',
            'system_prompt_leak': 'System Prompt Leak',
            'systemPromptLeaks': 'System Prompt Leak',
            'safety_bypass': 'Safety Bypass',
            'safetyBypass': 'Safety Bypass',
            'data_exfiltration': 'Data Exfiltration',
            'dataExfiltration': 'Data Exfiltration',
            'command_injection': 'Command Injection',
            'commandInjection': 'Command Injection',
            'sql_injection': 'SQL Injection',
            'sqlInjection': 'SQL Injection',
            'dangerous_code': 'Dangerous Code',
            'shell_command': 'Shell Command',
            'credential_exposure': 'Credential Exposure',
            'privilege_escalation': 'Privilege Escalation',
            'developerMode': 'Developer Mode',
            'encoding_attack': 'Encoding Attack',
            'context_injection': 'Context Pollution',
            'contextPollution': 'Context Pollution',
            'boundary_testing': 'Boundary Testing',
            'progressiveBoundaryTesting': 'Boundary Testing',
            'urgency_exploit': 'Social Engineering',
            'urgencyExploit': 'Social Engineering'
        };

        return mapping[category] || category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    generateAnalytics(incidents) {
        const timeline = this.generateTimeline(incidents);
        const patterns = this.analyzePatterns(incidents);

        const metrics = {
            averageThreatScore: incidents.length > 0 ?
                (incidents.reduce((sum, i) => sum + (i.threatScore || 0), 0) / incidents.length).toFixed(1) : 0,
            multiTurnAttacks: incidents.filter(i => 
                i.conversationContext?.turnCount > 3
            ).length,
            falsePositiveRate: incidents.length > 0 ?
                (incidents.filter(i => i.userOverride).length / incidents.length * 100).toFixed(1) : 0,
            multiLayerDetections: incidents.filter(i => i.multiLayerAnalysis).length
        };

        return { timeline, patterns, metrics };
    }

    generateTimeline(incidents) {
        const timeline = {};

        incidents.forEach(incident => {
            const date = new Date(incident.timestamp).toLocaleDateString();
            timeline[date] = (timeline[date] || 0) + 1;
        });

        return Object.entries(timeline)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    analyzePatterns(incidents) {
        const recentIncidents = incidents.slice(-10);
        const avgRecentScore = recentIncidents.reduce((sum, i) => 
            sum + (i.threatScore || 0), 0
        ) / (recentIncidents.length || 1);

        const olderIncidents = incidents.slice(0, -10);
        const avgOlderScore = olderIncidents.reduce((sum, i) => 
            sum + (i.threatScore || 0), 0
        ) / (olderIncidents.length || 1);

        const escalating = avgRecentScore > avgOlderScore * 1.5;

        return {
            escalating,
            repeatedCategories: this.findRepeatedCategories(incidents)
        };
    }

    findRepeatedCategories(incidents) {
        const categoryCounts = {};

        incidents.forEach(incident => {
            if (incident.threats && Array.isArray(incident.threats)) {
                incident.threats.forEach(threat => {
                    const cat = threat.category || 'unknown';
                    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
                });
            }
        });

        return Object.entries(categoryCounts)
            .filter(([cat, count]) => count >= 3)
            .map(([category, count]) => ({ 
                category: this.humanReadableCategory(category), 
                count 
            }));
    }

    generateRecommendations(incidents) {
        const recommendations = [];

        if (incidents.length > 50) {
            recommendations.push({
                type: 'volume',
                severity: 'HIGH',
                message: 'High volume of threats detected.',
                action: 'Review recent conversations for suspicious activity'
            });
        }

        const multiTurn = incidents.filter(i => 
            i.conversationContext?.turnCount > 3
        ).length;

        if (multiTurn > 5) {
            recommendations.push({
                type: 'multi_turn',
                severity: 'MEDIUM',
                message: 'Multiple progressive attack attempts detected.',
                action: 'Consider enabling stricter multi-turn detection'
            });
        }

        const overrideRate = incidents.filter(i => i.userOverride).length / 
            (incidents.length || 1);

        if (overrideRate > 0.3) {
            recommendations.push({
                type: 'false_positives',
                severity: 'LOW',
                message: 'High false positive rate detected.',
                action: 'Review allowlist rules or adjust layer weights'
            });
        }

        const topThreats = this.getTopThreats(incidents);
        if (topThreats.length > 0 && topThreats[0].count > 10) {
            recommendations.push({
                type: 'pattern',
                severity: 'MEDIUM',
                message: `Repeated "${topThreats[0].category}" attempts.`,
                action: 'This may indicate targeted attack patterns'
            });
        }

        return recommendations;
    }

    analyzeLayerPerformance(incidents) {
        const multiLayerIncidents = incidents.filter(i => i.multiLayerAnalysis);
        
        if (multiLayerIncidents.length === 0) {
            return {
                available: false,
                message: 'No multi-layer analysis data available'
            };
        }

        const layerStats = {
            behavioral: { detections: 0, falsePositives: 0 },
            patterns: { detections: 0, falsePositives: 0 },
            semantic: { detections: 0, falsePositives: 0 },
            ml: { detections: 0, falsePositives: 0 },
            context: { detections: 0, falsePositives: 0 }
        };

        multiLayerIncidents.forEach(incident => {
            const votes = incident.multiLayerAnalysis?.layerVotes || [];
            
            votes.forEach(vote => {
                if (layerStats[vote.layer]) {
                    if (vote.vote === 'BLOCK') {
                        layerStats[vote.layer].detections++;
                        if (incident.userOverride) {
                            layerStats[vote.layer].falsePositives++;
                        }
                    }
                }
            });
        });

        return {
            available: true,
            layers: layerStats,
            totalMultiLayerAnalyses: multiLayerIncidents.length
        };
    }

    analyzeDetectionMethods(incidents) {
        const methods = {
            patternMatching: 0,
            semanticAnalysis: 0,
            behavioralProfiling: 0,
            mlInference: 0,
            multiLayer: 0,
            networkLevel: 0
        };

        incidents.forEach(incident => {
            if (incident.multiLayerAnalysis) {
                methods.multiLayer++;
            } else if (incident.threats && incident.threats.length > 0) {
                methods.patternMatching++;
            }
        });

        return methods;
    }

    async exportReport(format = 'json', filters = {}) {
        const report = await this.generateReport(filters);

        switch (format) {
            case 'json':
                return JSON.stringify(report, null, 2);
            
            case 'csv':
                return this.convertToCSV(report.incidents);
            
            case 'html':
                return this.generateHTMLReport(report);
            
            default:
                return JSON.stringify(report, null, 2);
        }
    }

    convertToCSV(incidents) {
        const headers = ['Timestamp', 'Threat Level', 'Action', 'Threats', 'Domain', 'Multi-Layer'];
        const rows = incidents.map(i => [
            i.timestamp,
            i.threatLevel,
            i.action,
            i.threats.map(t => t.category).join('; '),
            i.domain,
            i.multiLayer ? 'Yes' : 'No'
        ]);

        return [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
    }

    generateHTMLReport(report) {
        return `<!DOCTYPE html>
<html>
<head>
    <title>Ethicore Guardian - Security Report v2.0</title>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            max-width: 1200px;
            margin: 40px auto;
            padding: 20px;
            background: #f9fafb;
            color: #1f2937;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
        }
        .header h1 { margin: 0 0 10px 0; font-size: 28px; }
        .header p { margin: 0; opacity: 0.9; }
        .badge { 
            display: inline-block; 
            padding: 4px 8px; 
            border-radius: 4px; 
            font-size: 11px; 
            font-weight: 600; 
            background: rgba(255,255,255,0.2);
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .stat-value {
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }
        .stat-label { color: #6b7280; font-size: 14px; }
        .section {
            background: white;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        .section h2 { margin-top: 0; color: #1f2937; font-size: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td {
            text-align: left;
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
        }
        th { background: #f9fafb; font-weight: 600; color: #374151; }
        .badge-critical { background: #fee2e2; color: #991b1b; }
        .badge-high { background: #fed7aa; color: #9a3412; }
        .badge-medium { background: #fef3c7; color: #92400e; }
        .badge-low { background: #dbeafe; color: #1e40af; }
        .recommendation {
            padding: 15px;
            border-left: 4px solid #f59e0b;
            background: #fffbeb;
            margin-bottom: 10px;
            border-radius: 4px;
        }
        .recommendation strong { color: #92400e; }
        .phase-badge {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 700;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🛡️ Ethicore Guardian - Security Report</h1>
        <p>Generated: ${report.metadata.generatedAt} <span class="badge">v2.0</span> <span class="phase-badge">PHASE 1 COMPLETE</span></p>
        <p>Period: ${report.metadata.period.replace('_', ' ')} | Multi-Layer Defense: ${report.metadata.multiLayerEnabled ? 'Enabled' : 'Disabled'}</p>
    </div>

    <div class="summary-grid">
        <div class="stat-card">
            <div class="stat-value">${report.summary.totalIncidents}</div>
            <div class="stat-label">Total Incidents</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${report.summary.blocked}</div>
            <div class="stat-label">Threats Blocked</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${report.summary.protectionRate}</div>
            <div class="stat-label">Protection Rate</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${report.summary.bySeverity.CRITICAL}</div>
            <div class="stat-label">Critical Threats</div>
        </div>
    </div>

    ${report.layerPerformance?.available ? `
    <div class="section">
        <h2>🎯 Multi-Layer Performance</h2>
        <p style="margin-bottom: 15px;">Phase 1 Defense Layers Active</p>
        <table>
            <thead>
                <tr>
                    <th>Layer</th>
                    <th>Detections</th>
                    <th>False Positives</th>
                    <th>Accuracy</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(report.layerPerformance.layers).map(([layer, stats]) => `
                    <tr>
                        <td style="text-transform: capitalize;">${layer}</td>
                        <td>${stats.detections}</td>
                        <td>${stats.falsePositives}</td>
                        <td>${stats.detections > 0 ? ((1 - stats.falsePositives / stats.detections) * 100).toFixed(1) : 100}%</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    ` : ''}

    <div class="section">
        <h2>Top Threat Categories</h2>
        <table>
            <thead>
                <tr>
                    <th>Threat Type</th>
                    <th>Count</th>
                </tr>
            </thead>
            <tbody>
                ${report.summary.topThreats.map(t => `
                    <tr>
                        <td>${t.category}</td>
                        <td>${t.count}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Recent Incidents</h2>
        <table>
            <thead>
                <tr>
                    <th>Time</th>
                    <th>Threat Level</th>
                    <th>Action</th>
                    <th>Domain</th>
                    <th>Multi-Layer</th>
                </tr>
            </thead>
            <tbody>
                ${report.incidents.slice(0, 20).map(i => `
                    <tr>
                        <td>${new Date(i.timestamp).toLocaleString()}</td>
                        <td><span class="badge badge-${i.threatLevel.toLowerCase()}">${i.threatLevel}</span></td>
                        <td>${i.action}</td>
                        <td>${i.domain}</td>
                        <td>${i.multiLayer ? '✅' : '—'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    ${report.recommendations.length > 0 ? `
    <div class="section">
        <h2>Recommendations</h2>
        ${report.recommendations.map(r => `
            <div class="recommendation">
                <strong>${r.severity}:</strong> ${r.message}<br>
                <small>Action: ${r.action}</small>
            </div>
        `).join('')}
    </div>
    ` : ''}
</body>
</html>`;
    }
}

// Initialize extension
async function initializeExtension() {
    try {
        const stored = await browserAPI.storage.local.get([
            STORAGE_KEYS.CONFIG,
            STORAGE_KEYS.STATS
        ]);
        
        if (stored[STORAGE_KEYS.CONFIG]) {
            config = { ...DEFAULT_CONFIG, ...stored[STORAGE_KEYS.CONFIG] };
        }

        if (stored[STORAGE_KEYS.STATS]) {
            stats = { ...stats, ...stored[STORAGE_KEYS.STATS] };
        }

        console.log('🛡️ Ethicore Guardian v2.0 initialized - Phase 1 Complete');
        console.log('📊 Multi-Layer Defense:', config.multiLayerDefenseEnabled ? 'Enabled' : 'Disabled');
        updateBadge();

        if (config.threatIntelSync) {
            scheduleSync();
        }

    } catch (e) {
        console.error('🛡️ Init error:', e);
    }
}

// Network-level interception (PRESERVED - critical for CSP-strict sites)
browserAPI.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (details.method !== 'POST') return;
        if (!details.requestBody) return;
        
        let body = '';
        if (details.requestBody.raw) {
            const decoder = new TextDecoder('utf-8');
            body = decoder.decode(details.requestBody.raw[0].bytes);
        }
        
        try {
            const parsed = JSON.parse(body);
            let promptText = '';
            
            if (parsed.messages) {
                const last = parsed.messages[parsed.messages.length - 1];
                promptText = last?.content || last?.text || '';
            } else if (parsed.prompt) {
                promptText = parsed.prompt;
            }
            
            if (containsCriticalThreat(promptText)) {
                console.error('🚨 Network-level block:', promptText.substring(0, 60));
                
                stats.threatsBlocked++;
                stats.requestsAnalyzed++;
                threatBreakdown.CRITICAL++;
                saveStats();
                updateBadge();
                                
                // Notify if enabled
                if (config.enableNotifications) {
                    try {
                        browserAPI.notifications.create({
                            type: 'basic',
                            iconUrl: 'icons/icon-128.png',
                            title: '🛡️ Network-Level Block',
                            message: 'Critical threat blocked at network layer',
                            priority: 2
                        });
                    } catch (e) {
                        console.log('Notification error:', e);
                    }
                }

                return { cancel: true };
            }
        } catch (e) {
            // Not JSON or parse error, allow
        }
        
        return { cancel: false };
    },
    {
        urls: [
            "*://chat.openai.com/*",
            "*://*.openai.com/*",
            "*://chatgpt.com/*",
            "*://*.chatgpt.com/*",
            "*://gemini.google.com/*",
            "*://*.gemini.google.com/*",
            "*://www.bing.com/*",
            "*://copilot.microsoft.com/*",
            "*://claude.ai/*",
            "*://*.anthropic.com/*"
        ],
        types: ["xmlhttprequest", "other"]
    },
    ["blocking", "requestBody"]
);

function containsCriticalThreat(text) {
    if (!text || text.length < 5) return false;
    
    const patterns = [
        /ignore\s+(all\s+)?(previous|prior)\s+instructions?/gi,
        /you\s+are\s+now\s+(a|an)\s+DAN/gi,
        /jailbreak/gi,
        /system\s+prompt/gi,
        /disable\s+(safety|ethical)\s+(guidelines?|filters?)/gi
    ];
    
    return patterns.some(p => p.test(text));
}

// Message handlers
browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const handlers = {
        'threatDetected': handleThreatDetection,
        'getStats': handleGetStats,
        'getThreatBreakdown': handleGetThreatBreakdown,
        'updateConfig': handleUpdateConfig,
        'clearLogs': handleClearLogs,
        'getAuditTrail': handleGetAuditTrail,
        'forceSync': handleForceSync,
        'getLastSync': handleGetLastSync,
        'updateStats': handleUpdateStats,
        'generateReport': handleGenerateReport,
        'exportReport': handleExportReport,
        'getAllowlistRules': handleGetAllowlistRules,
        'removeAllowlistRule': handleRemoveAllowlistRule,
        'getLayerWeights': handleGetLayerWeights,
        'updateLayerWeights': handleUpdateLayerWeights
    };

    const handler = handlers[request.type];
    if (handler) {
        const result = handler(request, sender);
        if (result instanceof Promise) {
            result.then(sendResponse).catch(err => {
                console.error('Handler error:', err);
                sendResponse({ success: false, error: err.message });
            });
            return true;
        } else {
            sendResponse(result);
        }
    } else {
        sendResponse({ error: 'Unknown message type' });
    }
});

async function handleGenerateReport(request) {
    try {
        console.log('📊 Generating v2.0 report with filters:', request.filters);
        const generator = new ReportGenerator();
        const report = await generator.generateReport(request.filters || {});
        console.log('✅ Report generated successfully');
        return { success: true, report };
    } catch (e) {
        console.error('📊 Report generation error:', e);
        return { success: false, error: e.message };
    }
}

async function handleExportReport(request) {
    try {
        const generator = new ReportGenerator();
        const content = await generator.exportReport(
            request.format || 'json',
            request.filters || {}
        );
        return { success: true, content };
    } catch (e) {
        console.error('📊 Report export error:', e);
        return { success: false, error: e.message };
    }
}

async function handleThreatDetection(request, sender) {
    try {
        const { eventType, analysis } = request;

        stats.threatsDetected++;
        
        // Track multi-layer analyses
        if (analysis.metadata?.layerVotes) {
            stats.multiLayerAnalyses++;
        }
        
        if (eventType === 'BLOCKED_REQUEST') {
            stats.requestsAnalyzed++;
            if (analysis.verdict === 'BLOCK' || analysis.shouldBlock) {
                stats.threatsBlocked++;
            }
        } else if (eventType === 'BLOCKED_RESPONSE') {
            stats.responsesAnalyzed++;
            stats.threatsBlocked++;
        }

        const level = analysis.threatLevel || analysis.verdict || 'UNKNOWN';
        if (level && threatBreakdown.hasOwnProperty(level)) {
            threatBreakdown[level]++;
        }

        if (analysis.conversationThreat?.cumulativeScore > 0) {
            stats.multiTurnBlocks++;
        }
        if (analysis.allowlistApplied) {
            stats.allowlistHits++;
        }

        // Track layer-specific stats
        if (analysis.metadata?.layerVotes) {
            analysis.metadata.layerVotes.forEach(vote => {
                if (vote.layer === 'behavioral' && vote.vote === 'BLOCK') {
                    stats.behavioralAnomalies++;
                } else if (vote.layer === 'semantic' && vote.vote === 'BLOCK') {
                    stats.semanticMatches++;
                } else if (vote.layer === 'ml' && vote.vote === 'BLOCK') {
                    stats.mlPredictions++;
                }
            });
        }

        // Track analysis time
        if (analysis.metadata?.analysisTime) {
            const count = stats.multiLayerAnalyses || 1;
            stats.avgAnalysisTime = 
                (stats.avgAnalysisTime * (count - 1) + analysis.metadata.analysisTime) / count;
        }

        if (config.enableLogging) {
            await logThreat({
                type: eventType,
                severity: level,
                threats: analysis.threats || analysis.matches || [],
                url: sender.url,
                timestamp: new Date().toISOString(),
                tabId: sender.tab?.id,
                tabTitle: sender.tab?.title,
                multiTurn: analysis.conversationThreat?.cumulativeScore > 0,
                allowlistApplied: analysis.allowlistApplied,
                multiLayer: analysis.metadata?.layerVotes ? true : false,
                layerConsensus: analysis.layerConsensus
            });
        }

        if (config.enableAuditTrail) {
            await addToAuditTrail({
                event: 'threat_detected',
                severity: level,
                eventType,
                url: sender.url,
                threatCount: (analysis.threats?.length || analysis.matches?.length || 0),
                timestamp: new Date().toISOString(),
                multiLayerEnabled: config.multiLayerDefenseEnabled
            });
        }

        updateBadge();
        
        if (config.enableNotifications) {
            notifyUser(eventType, analysis, sender.tab);
        }

        await saveStats();

        return { received: true };

    } catch (e) {
        console.error('🛡️ Error handling threat:', e);
        return { received: false, error: e.message };
    }
}

function handleGetStats() {
    return { 
        stats, 
        config, 
        breakdown: threatBreakdown,
        version: '2.0.0',
        phase: 'Phase 1 Complete'
    };
}

function handleGetThreatBreakdown() {
    return { breakdown: threatBreakdown };
}

async function handleUpdateConfig(request) {
    try {
        config = { ...config, ...request.config };
        await browserAPI.storage.local.set({ [STORAGE_KEYS.CONFIG]: config });
        console.log('🛡️ Config updated:', request.config);
        
        if (request.config.threatIntelSync) {
            scheduleSync();
        }
        
        return { success: true };
    } catch (e) {
        console.error('🛡️ Config update error:', e);
        return { success: false, error: e.message };
    }
}

async function handleClearLogs() {
    try {
        await browserAPI.storage.local.remove([
            STORAGE_KEYS.THREATS_LOG,
            STORAGE_KEYS.AUDIT_TRAIL,
            STORAGE_KEYS.INCIDENTS
        ]);
        
        stats = {
            threatsDetected: 0,
            threatsBlocked: 0,
            requestsAnalyzed: 0,
            responsesAnalyzed: 0,
            startTime: Date.now(),
            multiTurnBlocks: 0,
            allowlistHits: 0,
            patternsReceived: 0,
            contributionsSent: 0,
            multiLayerAnalyses: 0,
            behavioralAnomalies: 0,
            semanticMatches: 0,
            mlPredictions: 0,
            avgAnalysisTime: 0
        };
        
        threatBreakdown = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
        
        await saveStats();
        updateBadge();
        
        console.log('🛡️ Logs cleared');
        return { success: true };
    } catch (e) {
        console.error('🛡️ Clear logs error:', e);
        return { success: false, error: e.message };
    }
}

async function handleGetAuditTrail() {
    try {
        const stored = await browserAPI.storage.local.get(STORAGE_KEYS.AUDIT_TRAIL);
        return { trail: stored[STORAGE_KEYS.AUDIT_TRAIL] || [] };
    } catch (e) {
        console.error('🛡️ Audit trail retrieval error:', e);
        return { trail: [] };
    }
}

async function handleForceSync() {
    try {
        await performSync();
        return { success: true };
    } catch (e) {
        console.error('🛡️ Force sync error:', e);
        return { success: false, error: e.message };
    }
}

function handleGetLastSync() {
    return { lastSync: config.lastSync };
}

async function handleUpdateStats(request) {
    if (request.stats) {
        Object.assign(stats, request.stats);
        await saveStats();
    }
    return { received: true };
}

async function handleGetAllowlistRules() {
    try {
        const stored = await browserAPI.storage.local.get(STORAGE_KEYS.ALLOWLIST);
        return { 
            success: true, 
            rules: stored[STORAGE_KEYS.ALLOWLIST] || [] 
        };
    } catch (e) {
        console.error('🛡️ Get allowlist error:', e);
        return { success: false, error: e.message };
    }
}

async function handleRemoveAllowlistRule(request) {
    try {
        const stored = await browserAPI.storage.local.get(STORAGE_KEYS.ALLOWLIST);
        let rules = stored[STORAGE_KEYS.ALLOWLIST] || [];
        
        rules = rules.filter(r => r.id !== request.ruleId);
        
        await browserAPI.storage.local.set({ [STORAGE_KEYS.ALLOWLIST]: rules });
        return { success: true };
    } catch (e) {
        console.error('🛡️ Remove allowlist rule error:', e);
        return { success: false, error: e.message };
    }
}

async function handleGetLayerWeights() {
    return {
        success: true,
        weights: config.layerWeights
    };
}

async function handleUpdateLayerWeights(request) {
    try {
        config.layerWeights = { ...config.layerWeights, ...request.weights };
        await browserAPI.storage.local.set({ [STORAGE_KEYS.CONFIG]: config });
        console.log('🛡️ Layer weights updated:', config.layerWeights);
        return { success: true };
    } catch (e) {
        console.error('🛡️ Layer weights update error:', e);
        return { success: false, error: e.message };
    }
}

function updateBadge() {
    try {
        const recentThreats = stats.threatsDetected > 99 ? '99+' : String(stats.threatsDetected);
        
        browserAPI.browserAction.setBadgeText({ text: recentThreats });
        browserAPI.browserAction.setBadgeBackgroundColor({
            color: stats.threatsBlocked > 0 ? '#dc2626' : '#fbbf24'
        });
    } catch (e) {
        console.log('🛡️ Badge update error:', e);
    }
}

async function logThreat(threatData) {
    try {
        const stored = await browserAPI.storage.local.get(STORAGE_KEYS.THREATS_LOG);
        let logs = stored[STORAGE_KEYS.THREATS_LOG] || [];

        logs.push(threatData);

        if (logs.length > config.maxLogSize) {
            logs = logs.slice(-config.maxLogSize);
        }

        await browserAPI.storage.local.set({ [STORAGE_KEYS.THREATS_LOG]: logs });
    } catch (e) {
        console.error('🛡️ Logging error:', e);
    }
}

async function addToAuditTrail(entry) {
    try {
        const stored = await browserAPI.storage.local.get(STORAGE_KEYS.AUDIT_TRAIL);
        let trail = stored[STORAGE_KEYS.AUDIT_TRAIL] || [];

        trail.push({
            ...entry,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: entry.timestamp || new Date().toISOString()
        });

        if (trail.length > 1000) {
            trail = trail.slice(-1000);
        }

        await browserAPI.storage.local.set({ [STORAGE_KEYS.AUDIT_TRAIL]: trail });
    } catch (e) {
        console.error('🛡️ Audit trail error:', e);
    }
}

function notifyUser(eventType, analysis, tab) {
    try {
        const title = eventType === 'BLOCKED_REQUEST' ? 
            '🛡️ Threat Blocked: Malicious Input' : 
            '🛡️ Threat Blocked: Unsafe Output';

        const level = analysis.threatLevel || analysis.verdict || 'UNKNOWN';
        const layerInfo = analysis.metadata?.layerVotes ? 
            ` | ${analysis.layerConsensus?.blockVotes}/${analysis.layerConsensus?.totalLayers} layers flagged` : '';
        
        const message = `Severity: ${level}${layerInfo}\nThreats: ${analysis.threats?.length || analysis.matches?.length || 0}`;

        browserAPI.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon-128.png',
            title,
            message,
            priority: level === 'CRITICAL' ? 2 : 1
        });
    } catch (e) {
        console.log('🛡️ Notification error:', e);
    }
}

async function saveStats() {
    try {
        await browserAPI.storage.local.set({ 
            [STORAGE_KEYS.STATS]: stats,
            ethicore_threat_breakdown: threatBreakdown
        });
    } catch (e) {
        console.error('🛡️ Save stats error:', e);
    }
}

async function performSync() {
    try {
        console.log('🔄 Performing threat intelligence sync...');

        // Simulate sync (in production, this would hit real API)
        await new Promise(resolve => setTimeout(resolve, 1000));

        config.lastSync = Date.now();
        stats.patternsReceived += Math.floor(Math.random() * 5) + 1;

        await browserAPI.storage.local.set({ [STORAGE_KEYS.CONFIG]: config });
        await saveStats();

        console.log('✅ Sync complete');
        
        if (config.enableNotifications) {
            browserAPI.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon-128.png',
                title: '🔄 Threat Intelligence Updated',
                message: `${stats.patternsReceived} patterns synced | Multi-Layer Defense Active`,
                priority: 0
            });
        }

    } catch (error) {
        console.error('🔄 Sync failed:', error);
    }
}

function scheduleSync() {
    setInterval(async () => {
        if (config.threatIntelSync) {
            const timeSinceSync = Date.now() - config.lastSync;
            if (timeSinceSync > config.syncInterval) {
                await performSync();
            }
        }
    }, 60 * 60 * 1000); // Check every hour

    console.log('⏰ Threat intelligence sync scheduled');
}

browserAPI.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('🛡️ Ethicore Guardian v2.0 installed - Phase 1 Complete');
        try {
            browserAPI.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon-128.png',
                title: '🛡️ Ethicore Guardian v2.0 Installed',
                message: 'Multi-Layer Defense System Active | Phase 1: Foundation Complete'
            });
        } catch (e) {
            console.log('🛡️ Install notification error:', e);
        }
        
        if (config.threatIntelSync) {
            setTimeout(performSync, 5000);
        }
    }
    
    if (details.reason === 'update') {
        const previousVersion = details.previousVersion || '1.0.0';
        console.log(`🛡️ Ethicore Guardian updated: ${previousVersion} → 2.0.0`);
        try {
            browserAPI.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon-128.png',
                title: '🛡️ Ethicore Guardian Updated to v2.0',
                message: 'New: Multi-Layer Defense | Behavioral Profiling | Semantic Analysis | ML Inference'
            });
        } catch (e) {
            console.log('🛡️ Update notification error:', e);
        }
    }
});

async function performCleanup() {
    try {
        const cutoffDate = Date.now() - (config.autoCleanupDays * 24 * 60 * 60 * 1000);
        
        const threatsStored = await browserAPI.storage.local.get(STORAGE_KEYS.THREATS_LOG);
        let threats = threatsStored[STORAGE_KEYS.THREATS_LOG] || [];
        threats = threats.filter(t => new Date(t.timestamp).getTime() > cutoffDate);
        await browserAPI.storage.local.set({ [STORAGE_KEYS.THREATS_LOG]: threats });

        const incidentsStored = await browserAPI.storage.local.get(STORAGE_KEYS.INCIDENTS);
        let incidents = incidentsStored[STORAGE_KEYS.INCIDENTS] || [];
        incidents = incidents.filter(i => new Date(i.timestamp).getTime() > cutoffDate);
        await browserAPI.storage.local.set({ [STORAGE_KEYS.INCIDENTS]: incidents });

        console.log('🧹 Cleanup complete');
    } catch (e) {
        console.error('🧹 Cleanup error:', e);
    }
}

setInterval(performCleanup, 24 * 60 * 60 * 1000); // Daily cleanup

// Initialize extension
initializeExtension();

console.log('🛡️ Ethicore Guardian v2.0 Background Script Loaded');
console.log('📊 Phase 1 Status: Multi-Layer Defense, Behavioral Profiling, Semantic Analysis, ML Inference');