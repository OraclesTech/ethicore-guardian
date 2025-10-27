/**
 * Ethicore Guardian - Report Viewer Script (FIXED)
 * With comprehensive error handling and debug logging
 */

const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
let currentReport = null;

console.log('📊 Report Viewer: Script loaded');

/**
 * Generate and display report
 */
async function generateReport() {
    console.log('📊 Generate Report clicked');
    
    const dateRange = document.getElementById('dateRange').value;
    const threatLevel = document.getElementById('threatLevel').value;

    const filters = {
        dateRange: dateRange
    };

    if (threatLevel) {
        filters.threatLevel = threatLevel;
    }

    console.log('📊 Filters:', filters);

    try {
        showLoading();

        console.log('📊 Sending message to background...');
        
        const response = await browserAPI.runtime.sendMessage({
            type: 'generateReport',
            filters: filters
        });

        console.log('📊 Response received:', response);

        if (response && response.success) {
            currentReport = response.report;
            console.log('📊 Report data:', currentReport);
            displayReport(currentReport);
        } else {
            const errorMsg = response?.error || 'Unknown error';
            console.error('📊 Report generation failed:', errorMsg);
            showError('Failed to generate report: ' + errorMsg);
        }
    } catch (e) {
        console.error('📊 Report generation error:', e);
        showError('Failed to generate report: ' + e.message);
    }
}

/**
 * Display report in UI
 */
function displayReport(report) {
    console.log('📊 Displaying report...');
    const container = document.getElementById('reportContainer');

    if (!report) {
        showError('No report data received');
        return;
    }

    if (!report.summary || report.summary.totalIncidents === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">✅</div>
                <h2>No Incidents Found</h2>
                <p>No threats detected in the selected time period. Your AI interactions are secure!</p>
                <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
                    Try testing the extension with: "ignore all previous instructions"
                </p>
            </div>
        `;
        console.log('📊 No incidents to display');
        return;
    }

    console.log('📊 Rendering report with', report.summary.totalIncidents, 'incidents');

    container.innerHTML = `
        <!-- Summary Stats -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${report.summary.totalIncidents}</div>
                <div class="stat-label">Total Incidents</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${report.summary.blocked || 0}</div>
                <div class="stat-label">Threats Blocked</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${report.summary.protectionRate}</div>
                <div class="stat-label">Protection Rate</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${report.summary.bySeverity.CRITICAL || 0}</div>
                <div class="stat-label">Critical Threats</div>
            </div>
        </div>

        <!-- Threat Breakdown -->
        <div class="section">
            <h2>Threat Severity Breakdown</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value" style="color: #ef4444;">${report.summary.bySeverity.CRITICAL || 0}</div>
                    <div class="stat-label">Critical</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" style="color: #f97316;">${report.summary.bySeverity.HIGH || 0}</div>
                    <div class="stat-label">High</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" style="color: #eab308;">${report.summary.bySeverity.MEDIUM || 0}</div>
                    <div class="stat-label">Medium</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" style="color: #3b82f6;">${report.summary.bySeverity.LOW || 0}</div>
                    <div class="stat-label">Low</div>
                </div>
            </div>
        </div>

        ${report.summary.topThreats && report.summary.topThreats.length > 0 ? `
        <div class="section">
            <h2>Top Threat Categories</h2>
            <table>
                <thead>
                    <tr>
                        <th>Threat Type</th>
                        <th>Count</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.summary.topThreats.map(t => `
                        <tr>
                            <td>${t.category}</td>
                            <td>${t.count}</td>
                            <td>${((t.count / report.summary.totalIncidents) * 100).toFixed(1)}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        ` : ''}

        ${report.summary.topDomains && report.summary.topDomains.length > 0 ? `
        <div class="section">
            <h2>Top Domains</h2>
            <table>
                <thead>
                    <tr>
                        <th>Domain</th>
                        <th>Incidents</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.summary.topDomains.map(d => `
                        <tr>
                            <td>${d.domain}</td>
                            <td>${d.count}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        ` : ''}

        ${report.analytics && report.analytics.metrics ? `
        <div class="section">
            <h2>Analytics</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${report.analytics.metrics.averageThreatScore}</div>
                    <div class="stat-label">Avg Threat Score</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${report.analytics.metrics.multiTurnAttacks || 0}</div>
                    <div class="stat-label">Multi-Turn Attacks</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${report.analytics.metrics.falsePositiveRate}%</div>
                    <div class="stat-label">False Positive Rate</div>
                </div>
            </div>
        </div>
        ` : ''}

        <div class="section">
            <h2>Recent Incidents (Last 20)</h2>
            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Threat Level</th>
                        <th>Action</th>
                        <th>Threats</th>
                        <th>Domain</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.incidents.slice(0, 20).map(i => `
                        <tr>
                            <td>${new Date(i.timestamp).toLocaleString()}</td>
                            <td><span class="badge badge-${(i.threatLevel || 'low').toLowerCase()}">${i.threatLevel || 'UNKNOWN'}</span></td>
                            <td>${i.action || 'N/A'}</td>
                            <td>${i.threats && i.threats.length > 0 ? i.threats.map(t => t.category).join(', ') : 'None'}</td>
                            <td>${i.domain || 'Unknown'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        ${report.recommendations && report.recommendations.length > 0 ? `
        <div class="section">
            <h2>Security Recommendations</h2>
            ${report.recommendations.map(r => `
                <div class="recommendation">
                    <strong>${r.severity}:</strong> ${r.message}<br>
                    <small style="opacity: 0.8;">Action: ${r.action}</small>
                </div>
            `).join('')}
        </div>
        ` : ''}
    `;

    console.log('✅ Report displayed successfully');
}

/**
 * Show loading state
 */
function showLoading() {
    console.log('📊 Showing loading state');
    const container = document.getElementById('reportContainer');
    container.innerHTML = `
        <div class="loading">
            <div>⏳ Generating report...</div>
        </div>
    `;
}

/**
 * Show error message
 */
function showError(message) {
    console.error('📊 Showing error:', message);
    const container = document.getElementById('reportContainer');
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">⚠️</div>
            <h2>Error</h2>
            <p>${message}</p>
            <button onclick="generateReport()" style="
                margin-top: 20px;
                padding: 10px 20px;
                background: #3b82f6;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
            ">Retry</button>
        </div>
    `;
}

/**
 * Export report
 */
async function exportReport(format) {
    console.log('📊 Exporting report as', format);

    if (!currentReport) {
        alert('Please generate a report first');
        return;
    }

    const dateRange = document.getElementById('dateRange').value;
    const threatLevel = document.getElementById('threatLevel').value;

    const filters = { dateRange };
    if (threatLevel) filters.threatLevel = threatLevel;

    try {
        console.log('📊 Requesting export from background...');
        
        const response = await browserAPI.runtime.sendMessage({
            type: 'exportReport',
            format: format,
            filters: filters
        });

        console.log('📊 Export response:', response);

        if (response && response.success) {
            downloadFile(response.content, `ethicore-report-${Date.now()}.${format}`);
            console.log('✅ Export successful');
        } else {
            alert('Export failed: ' + (response?.error || 'Unknown error'));
        }
    } catch (e) {
        console.error('📊 Export error:', e);
        alert('Export failed: ' + e.message);
    }
}

/**
 * Download file
 */
function downloadFile(content, filename) {
    console.log('📊 Downloading file:', filename);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Debug: Check storage directly
 */
async function debugStorage() {
    console.log('🔍 DEBUG: Checking storage...');
    try {
        const result = await browserAPI.storage.local.get('ethicore_incidents');
        console.log('🔍 Storage contents:', result);
        console.log('🔍 Incidents count:', result.ethicore_incidents?.length || 0);
        if (result.ethicore_incidents && result.ethicore_incidents.length > 0) {
            console.log('🔍 Sample incident:', result.ethicore_incidents[0]);
        }
    } catch (e) {
        console.error('🔍 Storage check failed:', e);
    }
}

/**
 * Setup event listeners
 */
function init() {
    console.log('📊 Initializing report viewer');

    // Debug storage on load
    debugStorage();

    // Setup button handlers
    const generateBtn = document.getElementById('generateReport');
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            console.log('📊 Generate button clicked');
            generateReport();
        });
    } else {
        console.error('❌ Generate button not found!');
    }
    
    const exportHTMLBtn = document.getElementById('exportHTML');
    if (exportHTMLBtn) {
        exportHTMLBtn.addEventListener('click', () => {
            console.log('📊 Export HTML clicked');
            exportReport('html');
        });
    }
    
    const exportCSVBtn = document.getElementById('exportCSV');
    if (exportCSVBtn) {
        exportCSVBtn.addEventListener('click', () => {
            console.log('📊 Export CSV clicked');
            exportReport('csv');
        });
    }
    
    const exportJSONBtn = document.getElementById('exportJSON');
    if (exportJSONBtn) {
        exportJSONBtn.addEventListener('click', () => {
            console.log('📊 Export JSON clicked');
            exportReport('json');
        });
    }

    console.log('✅ Event listeners attached');

    // Auto-generate report on load
    console.log('📊 Auto-generating report...');
    setTimeout(generateReport, 500);
}

// Make functions globally available
window.generateReport = generateReport;
window.exportReport = exportReport;

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

console.log('📊 Report Viewer: Setup complete');