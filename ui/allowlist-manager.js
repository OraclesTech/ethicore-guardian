/**
 * Ethicore Guardian - Allowlist Manager Script
 */

const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
let currentRules = [];

/**
 * Load allowlist rules
 */
async function loadRules() {
    try {
        showLoading();

        const response = await browserAPI.runtime.sendMessage({
            type: 'getAllowlistRules'
        });

        if (response.success) {
            currentRules = response.rules || [];
            displayRules(currentRules);
            updateStats();
        } else {
            showError('Failed to load rules: ' + response.error);
        }
    } catch (e) {
        console.error('Load rules error:', e);
        showError('Failed to load rules');
    }
}

/**
 * Display rules in table
 */
function displayRules(rules) {
    const container = document.getElementById('rulesContainer');

    if (rules.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">✓</div>
                <h2>No Allowlist Rules</h2>
                <p>You haven't added any allowlist rules yet. When you override a blocked prompt, you can add it to your allowlist.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Scope</th>
                    <th>Domain</th>
                    <th>Used</th>
                    <th>Created</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${rules.map(rule => `
                    <tr>
                        <td>
                            <div style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">
                                ${rule.pattern.description || 'Custom rule'}
                            </div>
                        </td>
                        <td>${formatCategory(rule.category)}</td>
                        <td><span class="badge badge-${rule.scope}">${rule.scope}</span></td>
                        <td>${rule.domain}</td>
                        <td>
                            ${rule.timesUsed || 0}
                            ${rule.timesUsed > 0 ? `
                                <div class="usage-bar">
                                    <div class="usage-fill" style="width: ${Math.min(100, (rule.timesUsed / 10) * 100)}%"></div>
                                </div>
                            ` : ''}
                        </td>
                        <td>${formatDate(rule.createdAt)}</td>
                        <td>
                            <button class="btn-danger" onclick="removeRule('${rule.id}')">Remove</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

/**
 * Update statistics
 */
function updateStats() {
    document.getElementById('totalRules').textContent = currentRules.length;
    document.getElementById('permanentRules').textContent = 
        currentRules.filter(r => r.scope === 'permanent').length;
    document.getElementById('timesUsed').textContent = 
        currentRules.reduce((sum, r) => sum + (r.timesUsed || 0), 0);
}

/**
 * Format category name
 */
function formatCategory(category) {
    const mapping = {
        'instructionOverride': 'Instruction Override',
        'roleHijacking': 'Role Hijacking',
        'danActivation': 'Jailbreak',
        'systemPromptLeaks': 'System Prompt',
        'safetyBypass': 'Safety Bypass',
        'dataExfiltration': 'Data Exfiltration'
    };
    return mapping[category] || category;
}

/**
 * Format date
 */
function formatDate(timestamp) {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
    
    return date.toLocaleDateString();
}

/**
 * Remove a rule
 */
async function removeRule(ruleId) {
    if (!confirm('Remove this allowlist rule?')) return;

    try {
        const response = await browserAPI.runtime.sendMessage({
            type: 'removeAllowlistRule',
            ruleId: ruleId
        });

        if (response.success) {
            showToast('Rule removed successfully', 'success');
            loadRules();
        } else {
            showToast('Failed to remove rule', 'error');
        }
    } catch (e) {
        console.error('Remove rule error:', e);
        showToast('Failed to remove rule', 'error');
    }
}

/**
 * Clear all rules
 */
async function clearAllRules() {
    if (!confirm('Remove ALL allowlist rules? This cannot be undone.')) return;

    try {
        // Remove each rule individually
        for (const rule of currentRules) {
            await browserAPI.runtime.sendMessage({
                type: 'removeAllowlistRule',
                ruleId: rule.id
            });
        }

        showToast('All rules cleared', 'success');
        loadRules();
    } catch (e) {
        console.error('Clear all error:', e);
        showToast('Failed to clear rules', 'error');
    }
}

/**
 * Show loading state
 */
function showLoading() {
    const container = document.getElementById('rulesContainer');
    container.innerHTML = `
        <div class="loading">
            <div>⏳ Loading allowlist rules...</div>
        </div>
    `;
}

/**
 * Show error
 */
function showError(message) {
    const container = document.getElementById('rulesContainer');
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">⚠️</div>
            <h2>Error</h2>
            <p>${message}</p>
        </div>
    `;
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
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
 * Initialize
 */
function init() {
    loadRules();

    document.getElementById('clearAll').addEventListener('click', clearAllRules);

    // Refresh every 30 seconds
    setInterval(loadRules, 30000);
}

// Make removeRule available globally
window.removeRule = removeRule;

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}