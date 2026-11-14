/**
 * PYRO-CLINKER: AI Predictive Refractory Scanner & Thermal Profile Component
 * Lead Electrical & Automation Systems Engineer: أ. طارق ابوعشي | Tareq Abuashi
 */

import { ScadaStateManager } from '../engine/scadaState';

export class RefractoryScanner {
  private container: HTMLElement;
  private state: ScadaStateManager;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animFrameId: number | null = null;
  private scanlineX: number = 0;

  constructor(containerId: string, state: ScadaStateManager) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Container #${containerId} not found`);
    this.container = el;
    this.state = state;
    this.render();
    this.initCanvas();
    this.state.subscribe(() => this.updateDiagnostics());
  }

  private render() {
    this.container.innerHTML = `
      <div class="scanner-panel">
        <div class="panel-header">
          <div class="panel-title">
            <i class="fa-solid fa-microchip text-purple"></i>
            <span>AI REFRACTORY THERMAL SCANNER & COATING PROFILE</span>
          </div>
          <div class="panel-badges">
            <span class="badge badge-purple" id="ai-health-badge">HEALTH INDEX: 96.5%</span>
            <span class="badge badge-info" id="ai-rul-badge">RUL: 284 DAYS</span>
          </div>
        </div>

        <div class="scanner-content-grid">
          <!-- Canvas Thermal Map & Profile -->
          <div class="scanner-canvas-wrap">
            <div class="canvas-header-bar">
              <span class="text-xs text-muted font-mono">AXIAL PYRO-ZONE INFRARED SHELL SCAN (60 FPS REAL-TIME)</span>
              <span class="text-xs font-mono text-cyan" id="scanner-peak-temp">PEAK SHELL: 278°C</span>
            </div>
            <canvas id="thermal-scanner-canvas" width="620" height="150" class="thermal-canvas"></canvas>
            
            <div class="canvas-color-legend">
              <span class="text-xs text-muted">150°C</span>
              <div class="legend-gradient-bar"></div>
              <span class="text-xs text-muted">450°C (CRITICAL HOTSPOT)</span>
            </div>
          </div>

          <!-- AI Diagnostic Insights & Anomaly List -->
          <div class="scanner-insights-card">
            <div class="subcard-header">
              <span class="subcard-title"><i class="fa-solid fa-brain text-purple"></i> AI Predictive Diagnostics Engine</span>
              <span class="badge badge-success" id="ai-anomaly-status">NORMAL</span>
            </div>

            <!-- Anomaly Alerts Stream -->
            <div class="anomalies-list" id="anomalies-list-box">
              <!-- Dynamically populated -->
            </div>

            <div class="ai-meta-grid">
              <div class="ai-stat-box">
                <span class="ai-stat-lbl">C4 BLOCKAGE RISK</span>
                <span class="ai-stat-val font-mono text-cyan" id="ai-c4-risk">4.2%</span>
              </div>
              <div class="ai-stat-box">
                <span class="ai-stat-lbl">HOTSPOT DETECTION</span>
                <span class="ai-stat-val font-mono text-green" id="ai-hotspot-status">NONE</span>
              </div>
              <div class="ai-stat-box">
                <span class="ai-stat-lbl">COATING RETENTION</span>
                <span class="ai-stat-val font-mono text-amber" id="ai-coating-avg">195 mm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private initCanvas() {
    this.canvas = document.getElementById('thermal-scanner-canvas') as HTMLCanvasElement;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.startRenderLoop();
  }

  private startRenderLoop() {
    const render = () => {
      this.drawThermalMap();
      this.animFrameId = requestAnimationFrame(render);
    };
    this.animFrameId = requestAnimationFrame(render);
  }

  private drawThermalMap() {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Clear background
    ctx.fillStyle = '#070b14';
    ctx.fillRect(0, 0, width, height);

    const points = this.state.aiPredictive.shellAxialPoints;
    const numPoints = points.length;

    // 1. Draw Infrared Heatmap Grid (Unwrapped cylinder)
    const shellHeight = 90;
    const cellWidth = width / (numPoints - 1);

    for (let i = 0; i < numPoints - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const x1 = i * cellWidth;
      const x2 = (i + 1) * cellWidth;

      const grad = ctx.createLinearGradient(x1, 0, x2, 0);
      grad.addColorStop(0, this.temperatureToColor(p1.tempC));
      grad.addColorStop(1, this.temperatureToColor(p2.tempC));

      ctx.fillStyle = grad;
      ctx.fillRect(x1, 10, cellWidth + 1, shellHeight);
    }

    // Grid overlays on heatmap
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.lineWidth = 1;
    for (let y = 10; y <= 10 + shellHeight; y += 18) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 2. Moving Infrared Scanner Line (Radar sweep effect)
    this.scanlineX = (this.scanlineX + 2.5) % width;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(this.scanlineX, 10);
    ctx.lineTo(this.scanlineX, 10 + shellHeight);
    ctx.stroke();
    ctx.shadowBlur = 0; // reset

    // 3. Coating Thickness Profile Line Graph (Bottom 40px)
    ctx.fillStyle = 'rgba(19, 29, 53, 0.8)';
    ctx.fillRect(0, 105, width, 40);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
      const p = points[i];
      const x = i * cellWidth;
      // Map thickness 0 - 250mm to height 140 -> 110
      const y = 142 - (p.coatingThicknessMm / 250) * 32;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Coating profile label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px monospace';
    ctx.fillText('REFRACTORY COATING PROFILE (mm)', 10, 138);

    // Zone labels along top
    ctx.fillStyle = '#64748b';
    ctx.font = '9px monospace';
    ctx.fillText('Z1 CALCINER', 20, 8);
    ctx.fillText('Z2 TRANSITION', 180, 8);
    ctx.fillText('Z3 KILN INLET', 380, 8);
    ctx.fillText('Z4 DISCHARGE', 530, 8);
  }

  private temperatureToColor(tempC: number): string {
    // Normal: 220°C (Deep blue/cyan) -> 300°C (Yellow/Amber) -> 420°C (Hot Crimson Red)
    if (tempC < 240) {
      return '#0284c7'; // Cyan/Blue
    } else if (tempC < 290) {
      return '#059669'; // Emerald
    } else if (tempC < 340) {
      return '#f59e0b'; // Amber
    } else if (tempC < 380) {
      return '#ea580c'; // Orange
    } else {
      return '#ef4444'; // Red Critical Hotspot
    }
  }

  private updateDiagnostics() {
    const ai = this.state.aiPredictive;

    // Badges
    const badgeHealth = document.getElementById('ai-health-badge');
    if (badgeHealth) {
      badgeHealth.textContent = `HEALTH INDEX: ${ai.refractoryHealthIndexPercent}%`;
      badgeHealth.className = ai.refractoryHealthIndexPercent < 70 ? 'badge badge-danger' : 'badge badge-purple';
    }

    const badgeRul = document.getElementById('ai-rul-badge');
    if (badgeRul) badgeRul.textContent = `RUL: ${ai.remainingUsefulLifeDays} DAYS`;

    // Peak Temp
    const peakTemp = document.getElementById('scanner-peak-temp');
    if (peakTemp) {
      peakTemp.textContent = `PEAK SHELL: ${ai.maxShellTempC}°C`;
      peakTemp.className = ai.maxShellTempC > 380 ? 'text-xs font-mono text-red font-bold' : 'text-xs font-mono text-cyan';
    }

    // Status pill
    const statusPill = document.getElementById('ai-anomaly-status');
    if (statusPill) {
      if (ai.hotspotActive || ai.c4BlockageActive) {
        statusPill.textContent = 'ANOMALY DETECTED';
        statusPill.className = 'badge badge-danger';
      } else {
        statusPill.textContent = 'NORMAL';
        statusPill.className = 'badge badge-success';
      }
    }

    // Anomaly list box
    const listBox = document.getElementById('anomalies-list-box');
    if (listBox) {
      listBox.innerHTML = ai.anomalyList.map(a => `
        <div class="anomaly-item ${a.includes('CRITICAL') || a.includes('blockage') ? 'danger' : 'normal'}">
          <i class="fa-solid ${a.includes('CRITICAL') || a.includes('blockage') ? 'fa-triangle-exclamation text-red' : 'fa-circle-check text-green'}"></i>
          <span>${a}</span>
        </div>
      `).join('');
    }

    // Meta readouts
    const c4Risk = document.getElementById('ai-c4-risk');
    if (c4Risk) {
      c4Risk.textContent = `${ai.c4BlockageRiskPercent.toFixed(1)}%`;
      c4Risk.className = ai.c4BlockageRiskPercent > 50 ? 'ai-stat-val font-mono text-red font-bold' : 'ai-stat-val font-mono text-cyan';
    }

    const hotspotStatus = document.getElementById('ai-hotspot-status');
    if (hotspotStatus) {
      if (ai.hotspotActive) {
        hotspotStatus.textContent = `${ai.maxShellTempC}°C (Z3)`;
        hotspotStatus.className = 'ai-stat-val font-mono text-red font-bold';
      } else {
        hotspotStatus.textContent = 'NONE';
        hotspotStatus.className = 'ai-stat-val font-mono text-green';
      }
    }
  }
}
