/**
 * Ethicore Guardian - Enhanced Popup Script (Tier 1)
 */
/**
 * Ethicore Engine™ - Guardian
 * Copyright © 2025 Oracles Technologies LLC
 * All Rights Reserved
 * 
 * This software is proprietary and confidential.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 */
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

let stats = {
    threatsDetected: 0,
    threatsBlocked: 0,
    requestsAnalyzed: 0,
    responsesAnalyzed: 0,
    multiTurnBlocks: 0,
    allowlistHits: 0
};

let config = {
    blockCritical: true,
    blockHigh: true,
    enableAuditLogging: true,
    enableNotifications: true,
    multiTurnEnabled: true,
    allowlistEnabled: true,
    threatIntelSync: true,
    collaborativeFeed: false
};

let threatBreakdown = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };

/**
 * Load stats from background
 */
async function loadStats() {
    try {
        const response = await browserAPI.runtime.sendMessage({ type: 'getStats' });
        if (response) {
            stats = response.stats || stats;
            config = response.config || config;
            threatBreakdown = response.breakdown || threatBreakdown;
            updateUI();
        }
    } catch (e) {
        console.error('Stats load error:', e);
    }
}

/**
 * Update UI with current stats
 */
function updateUI() {
    // Update stat values
    document.getElementById('threatsDetected').textContent = stats.threatsDetected || 0;
    document.getElementById('threatsBlocked').textContent = stats.threatsBlocked || 0;
    document.getElementById('requestsAnalyzed').textContent = stats.requestsAnalyzed || 0;
    document.getElementById('responsesAnalyzed').textContent = stats.responsesAnalyzed || 0;

    // NEW: Update Phase 1 stats
    document.getElementById('multiLayerAnalyses').textContent = stats.multiLayerAnalyses || 0;
    document.getElementById('behavioralAnomalies').textContent = stats.behavioralAnomalies || 0;
    document.getElementById('semanticMatches').textContent = stats.semanticMatches || 0;
    document.getElementById('avgAnalysisTime').textContent = 
        stats.avgAnalysisTime ? stats.avgAnalysisTime.toFixed(1) + 'ms' : '0ms';

    // Update threat breakdown
    document.getElementById('criticalCount').textContent = threatBreakdown.CRITICAL || 0;
    document.getElementById('highCount').textContent = threatBreakdown.HIGH || 0;
    document.getElementById('mediumCount').textContent = threatBreakdown.MEDIUM || 0;
    document.getElementById('lowCount').textContent = threatBreakdown.LOW || 0;

    // Update toggles
    updateToggle('toggleCritical', config.blockCritical);
    updateToggle('toggleHigh', config.blockHigh);
    updateToggle('toggleAudit', config.enableAuditLogging);
    updateToggle('toggleNotifications', config.enableNotifications);
    updateToggle('toggleMultiTurn', config.multiTurnEnabled);
    updateToggle('toggleAllowlist', config.allowlistEnabled);
    updateToggle('toggleThreatIntel', config.threatIntelSync);
    updateToggle('toggleCollabFeed', config.collaborativeFeed);

    // Update status badge
    const statusBadge = document.getElementById('statusBadge');
    if (statusBadge) {
        statusBadge.textContent = 'ACTIVE';
        statusBadge.className = 'status-badge status-active';
    }

    // Update uptime
    updateUptime();
    updateLastSyncTime();
}

/**
 * Update toggle state
 */
function updateToggle(elementId, active) {
    const toggle = document.getElementById(elementId);
    if (toggle) {
        if (active) {
            toggle.classList.add('active');
        } else {
            toggle.classList.remove('active');
        }
    }
}

/**
 * Setup toggle event handlers
 */
function setupToggles() {
    const toggles = [
        'toggleCritical',
        'toggleHigh',
        'toggleAudit',
        'toggleNotifications',
        'toggleMultiTurn',
        'toggleAllowlist',
        'toggleThreatIntel',
        'toggleCollabFeed'
    ];

    toggles.forEach(toggleId => {
        const toggle = document.getElementById(toggleId);
        if (toggle) {
            toggle.addEventListener('click', async () => {
                const newValue = !toggle.classList.contains('active');
                
                // Update UI immediately
                if (newValue) {
                    toggle.classList.add('active');
                } else {
                    toggle.classList.remove('active');
                }

                // Map toggle IDs to config keys
                const keyMap = {
                    'toggleCritical': 'blockCritical',
                    'toggleHigh': 'blockHigh',
                    'toggleAudit': 'enableAuditLogging',
                    'toggleNotifications': 'enableNotifications',
                    'toggleMultiTurn': 'multiTurnEnabled',
                    'toggleAllowlist': 'allowlistEnabled',
                    'toggleThreatIntel': 'threatIntelSync',
                    'toggleCollabFeed': 'collaborativeFeed'
                };

                const configUpdate = {};
                configUpdate[keyMap[toggleId]] = newValue;

                await browserAPI.runtime.sendMessage({
                    type: 'updateConfig',
                    config: configUpdate
                });

                // Special handling for collaborative feed
                if (toggleId === 'toggleCollabFeed' && newValue) {
                    showCollabFeedDialog();
                }

                showToast('Settings updated', 'success');
            });
        }
    });
}

/**
 * Show collaborative feed consent dialog
 */
function showCollabFeedDialog() {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
    `;

    dialog.innerHTML = `
        <div style="
            background: #1f2937;
            padding: 30px;
            border-radius: 12px;
            max-width: 400px;
            color: white;
        ">
            <h2 style="margin-top: 0; color: #60a5fa;">
                🌐 Join Collaborative Defense
            </h2>
            <p style="color: #d1d5db; line-height: 1.6;">
                By enabling this feature, you'll contribute anonymized threat 
                patterns to help protect the entire community.
            </p>
            <p style="color: #d1d5db; line-height: 1.6; font-size: 13px;">
                <strong>Privacy:</strong> Only threat metadata is shared—never 
                your actual prompts or personal information.
            </p>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button id="acceptCollab" style="
                    flex: 1;
                    padding: 10px;
                    background: #10b981;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                ">Enable & Contribute</button>
                <button id="cancelCollab" style="
                    flex: 1;
                    padding: 10px;
                    background: rgba(255,255,255,0.1);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                ">Cancel</button>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);

    document.getElementById('acceptCollab').onclick = () => {
        dialog.remove();
        showToast('✓ Collaborative defense enabled', 'success');
    };

    document.getElementById('cancelCollab').onclick = async () => {
        dialog.remove();
        document.getElementById('toggleCollabFeed').classList.remove('active');
        
        await browserAPI.runtime.sendMessage({
            type: 'updateConfig',
            config: { collaborativeFeed: false }
        });
    };
}

/**
 * Setup button handlers
 */
function setupButtons() {
    // View Audit Trail button
    const viewAuditBtn = document.getElementById('viewAudit');
    if (viewAuditBtn) {
        viewAuditBtn.addEventListener('click', () => {
            browserAPI.tabs.create({
                url: browserAPI.runtime.getURL('ui/report.html')
            });
        });
    }

    // Clear Logs button
    const clearLogsBtn = document.getElementById('clearLogs');
    if (clearLogsBtn) {
        clearLogsBtn.addEventListener('click', async () => {
            if (confirm('Clear all threat logs and incident reports?')) {
                await browserAPI.runtime.sendMessage({ type: 'clearLogs' });
                showToast('Logs cleared', 'info');
                setTimeout(loadStats, 500);
            }
        });
    }

    // Manage Allowlist button (if exists)
    const allowlistBtn = document.getElementById('manageAllowlist');
    if (allowlistBtn) {
        allowlistBtn.addEventListener('click', () => {
            browserAPI.tabs.create({
                url: browserAPI.runtime.getURL('ui/allowlist.html')
            });
        });
    }

    // Sync Now button (if exists)
    const syncBtn = document.getElementById('syncNow');
    if (syncBtn) {
        syncBtn.addEventListener('click', async () => {
            syncBtn.disabled = true;
            syncBtn.textContent = '⏳ Syncing...';
            
            await browserAPI.runtime.sendMessage({ type: 'forceSync' });
            
            setTimeout(() => {
                syncBtn.disabled = false;
                syncBtn.textContent = '🔄 Sync Now';
                showToast('✓ Threat intelligence updated', 'success');
                loadStats();
            }, 2000);
        });
    }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 999999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

/**
 * Update uptime display
 */
function updateUptime() {
    const uptimeEl = document.getElementById('uptime');
    if (uptimeEl && stats.startTime) {
        const uptime = Date.now() - stats.startTime;
        const minutes = Math.floor(uptime / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        let uptimeStr;
        if (days > 0) {
            uptimeStr = `${days}d ${hours % 24}h`;
        } else if (hours > 0) {
            uptimeStr = `${hours}h ${minutes % 60}m`;
        } else {
            uptimeStr = `${minutes}m`;
        }

        uptimeEl.textContent = uptimeStr;
    }
}

/**
 * Update last sync time
 */
async function updateLastSyncTime() {
    try {
        const response = await browserAPI.runtime.sendMessage({ 
            type: 'getLastSync' 
        });

        if (response && response.lastSync) {
            const timeSince = Date.now() - response.lastSync;
            const minutes = Math.floor(timeSince / 60000);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            let timeStr;
            if (days > 0) {
                timeStr = `${days}d ago`;
            } else if (hours > 0) {
                timeStr = `${hours}h ago`;
            } else if (minutes > 0) {
                timeStr = `${minutes}m ago`;
            } else {
                timeStr = 'just now';
            }

            const lastUpdateEl = document.getElementById('lastUpdate');
            if (lastUpdateEl) {
                lastUpdateEl.textContent = timeStr;
            }
        }
    } catch (e) {
        console.error('Sync time error:', e);
    }
}

/**
 * Initialize popup
 */
function init() {
    setupToggles();
    setupButtons();
    loadStats();
    
    // Refresh stats every 5 seconds
    setInterval(loadStats, 5000);
    
    // Update uptime every 30 seconds
    setInterval(updateUptime, 30000);
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}