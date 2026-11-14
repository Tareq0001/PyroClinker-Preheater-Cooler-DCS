/**
 * PYRO-CLINKER: Reciprocating Grate Cooler & PID Kiln Hood Draft Control Component
 * Lead Electrical & Automation Systems Engineer: أ. طارق ابوعشي | Tareq Abuashi
 */

import { ScadaStateManager } from '../engine/scadaState';

export class CoolerGraphic {
  private container: HTMLElement;
  private state: ScadaStateManager;

  constructor(containerId: string, state: ScadaStateManager) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Container #${containerId} not found`);
    this.container = el;
    this.state = state;
    this.render();
    this.state.subscribe(() => this.updateTelemetry());
  }

  private render() {
    this.container.innerHTML = `
      <div class="cooler-panel">
        <div class="panel-header">
          <div class="panel-title">
            <i class="fa-solid fa-snowflake text-cyan"></i>
            <span>RECIPROCATING GRATE COOLER & PID HOOD DRAFT CONTROL</span>
          </div>
          <div class="panel-badges">
            <span class="badge badge-warning" id="clr-discharge-badge">DISCHARGE TEMP: 98°C</span>
            <span class="badge badge-info" id="clr-hyd-badge">HYDRAULIC: 145 BAR</span>
            <span class="badge badge-cyan" id="clr-sec-air-badge">SECONDARY AIR: 980°C</span>
          </div>
        </div>

        <div class="cooler-body-grid">
          <!-- Left: Grate Cooler Animated Process SVG Mimic -->
          <div class="cooler-mimic-wrap">
            <svg class="cooler-svg" viewBox="0 0 740 380" preserveAspectRatio="xMidYMid meet">
              <defs>
                <!-- Clinker Bed Heat Gradient -->
                <linearGradient id="clinkerHeat" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#ef4444"/>
                  <stop offset="25%" stop-color="#f97316"/>
                  <stop offset="60%" stop-color="#eab308"/>
                  <stop offset="85%" stop-color="#71717a"/>
                  <stop offset="100%" stop-color="#3f3f46"/>
                </linearGradient>

                <!-- Undergrate Air Streams -->
                <pattern id="airPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 10 20 L 10 0" stroke="rgba(56, 189, 248, 0.4)" stroke-width="2" stroke-dasharray="3,3"/>
                </pattern>
              </defs>

              <!-- Cooler Casing Structure -->
              <rect x="30" y="40" width="680" height="260" rx="6" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>

              <!-- Kiln Hood & Drop Chute -->
              <polygon points="30,40 160,40 160,110 30,150" fill="#1e293b" stroke="#ef4444" stroke-width="1.5"/>
              <text x="85" y="75" fill="#fca5a5" font-size="10" font-weight="700" font-family="monospace">KILN HOOD</text>
              <text x="85" y="92" fill="#ef4444" font-size="12" font-weight="800" font-family="monospace">1400°C DROP</text>

              <!-- Snowman Acoustic Detector Beam -->
              <line x1="45" y1="125" x2="145" y2="125" stroke="#10b981" stroke-width="2" stroke-dasharray="4,2" id="snowman-beam"/>
              <circle cx="45" cy="125" r="3" fill="#10b981"/>
              <text x="95" y="120" text-anchor="middle" fill="#10b981" font-size="8" font-family="monospace" id="snowman-lbl">SNOWMAN: CLEAR</text>

              <!-- Secondary & Tertiary Air Hot Offtake Ducts (To Kiln & Calciner) -->
              <g transform="translate(100, 40)">
                <path d="M 0 0 L 0 -25 L 80 -25" fill="none" stroke="#f59e0b" stroke-width="8" stroke-dasharray="4,2"/>
                <text x="85" y="-20" fill="#f59e0b" font-size="9" font-family="monospace" font-weight="700">SEC AIR 980°C</text>
              </g>

              <!-- Grate Section 1: Inflow High-Temp Zone -->
              <g id="grate-section-1" transform="translate(120, 150)">
                <rect x="0" y="0" width="160" height="25" rx="3" fill="#1e293b" stroke="#ef4444" stroke-width="1.5"/>
                <!-- Moving Grate Plates -->
                <g class="grate-stroke-anim">
                  <line x1="15" y1="2" x2="15" y2="23" stroke="#f87171" stroke-width="3"/>
                  <line x1="35" y1="2" x2="35" y2="23" stroke="#f87171" stroke-width="3"/>
                  <line x1="55" y1="2" x2="55" y2="23" stroke="#f87171" stroke-width="3"/>
                  <line x1="75" y1="2" x2="75" y2="23" stroke="#f87171" stroke-width="3"/>
                  <line x1="95" y1="2" x2="95" y2="23" stroke="#f87171" stroke-width="3"/>
                  <line x1="115" y1="2" x2="115" y2="23" stroke="#f87171" stroke-width="3"/>
                  <line x1="135" y1="2" x2="135" y2="23" stroke="#f87171" stroke-width="3"/>
                </g>
                <text x="80" y="38" text-anchor="middle" fill="#f87171" font-size="9" font-family="monospace" font-weight="700" id="g1-telemetry">GRATE 1: 20 SpM | 145 Bar</text>
              </g>

              <!-- Grate Section 2: Intermediate Cooling Zone -->
              <g id="grate-section-2" transform="translate(295, 160)">
                <rect x="0" y="0" width="170" height="25" rx="3" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>
                <g class="grate-stroke-anim">
                  <line x1="15" y1="2" x2="15" y2="23" stroke="#fbbf24" stroke-width="3"/>
                  <line x1="40" y1="2" x2="40" y2="23" stroke="#fbbf24" stroke-width="3"/>
                  <line x1="65" y1="2" x2="65" y2="23" stroke="#fbbf24" stroke-width="3"/>
                  <line x1="90" y1="2" x2="90" y2="23" stroke="#fbbf24" stroke-width="3"/>
                  <line x1="115" y1="2" x2="115" y2="23" stroke="#fbbf24" stroke-width="3"/>
                  <line x1="140" y1="2" x2="140" y2="23" stroke="#fbbf24" stroke-width="3"/>
                </g>
                <text x="85" y="38" text-anchor="middle" fill="#fbbf24" font-size="9" font-family="monospace" font-weight="700" id="g2-telemetry">GRATE 2: 16 SpM | 142 Bar</text>
              </g>

              <!-- Grate Section 3: Final Discharge Cooling Zone -->
              <g id="grate-section-3" transform="translate(480, 170)">
                <rect x="0" y="0" width="160" height="25" rx="3" fill="#1e293b" stroke="#0ea5e9" stroke-width="1.5"/>
                <g class="grate-stroke-anim">
                  <line x1="15" y1="2" x2="15" y2="23" stroke="#38bdf8" stroke-width="3"/>
                  <line x1="40" y1="2" x2="40" y2="23" stroke="#38bdf8" stroke-width="3"/>
                  <line x1="65" y1="2" x2="65" y2="23" stroke="#38bdf8" stroke-width="3"/>
                  <line x1="90" y1="2" x2="90" y2="23" stroke="#38bdf8" stroke-width="3"/>
                  <line x1="115" y1="2" x2="115" y2="23" stroke="#38bdf8" stroke-width="3"/>
                  <line x1="140" y1="2" x2="140" y2="23" stroke="#38bdf8" stroke-width="3"/>
                </g>
                <text x="80" y="38" text-anchor="middle" fill="#38bdf8" font-size="9" font-family="monospace" font-weight="700" id="g3-telemetry">GRATE 3: 13 SpM | 138 Bar</text>
              </g>

              <!-- Continuous Clinker Bed Resting On Top of Grates -->
              <path id="clinker-bed-path" d="M 120 150 Q 280 155 480 168 L 640 178 L 640 162 Q 480 152 280 138 L 120 132 Z" fill="url(#clinkerHeat)" opacity="0.9"/>

              <!-- Clinker Discharge Roller Crusher Assembly -->
              <g id="clinker-crusher" transform="translate(645, 175)">
                <!-- Toothed Roller 1 -->
                <circle cx="16" cy="16" r="14" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
                <circle cx="16" cy="16" r="4" fill="#f8fafc"/>
                <g class="rotating-fan">
                  <line x1="16" y1="4" x2="16" y2="28" stroke="#0284c7" stroke-width="2"/>
                  <line x1="4" y1="16" x2="28" y2="16" stroke="#0284c7" stroke-width="2"/>
                </g>

                <!-- Toothed Roller 2 -->
                <circle cx="42" cy="16" r="14" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
                <circle cx="42" cy="16" r="4" fill="#f8fafc"/>
                <g class="rotating-fan" style="animation-direction: reverse;">
                  <line x1="42" y1="4" x2="42" y2="28" stroke="#0284c7" stroke-width="2"/>
                  <line x1="30" y1="16" x2="54" y2="16" stroke="#0284c7" stroke-width="2"/>
                </g>

                <text x="29" y="42" text-anchor="middle" fill="#38bdf8" font-size="8" font-family="monospace">CRUSHER: 38 RPM</text>
                <text x="29" y="52" text-anchor="middle" fill="#94a3b8" font-size="8" font-family="monospace">LOAD: 88 kW</text>
              </g>

              <!-- 6 Under-Grate Cooling Air Fans (FN-01 to FN-06) -->
              <g id="undergrate-fans" transform="translate(60, 230)">
                <!-- Fan 1 & 2 (Zone 1) -->
                <rect x="60" y="10" width="60" height="40" rx="3" fill="#131d35" stroke="#ef4444" stroke-width="1.2"/>
                <text x="90" y="26" text-anchor="middle" fill="#ef4444" font-size="8" font-weight="700" font-family="monospace">FN-01</text>
                <text x="90" y="38" text-anchor="middle" fill="#94a3b8" font-size="7" font-family="monospace" id="fn01-txt">42k m³/h</text>
                <path d="M 90 10 L 90 -45" stroke="#ef4444" stroke-width="3" stroke-dasharray="3,3" class="gas-flow-up"/>

                <rect x="135" y="10" width="60" height="40" rx="3" fill="#131d35" stroke="#ef4444" stroke-width="1.2"/>
                <text x="165" y="26" text-anchor="middle" fill="#ef4444" font-size="8" font-weight="700" font-family="monospace">FN-02</text>
                <text x="165" y="38" text-anchor="middle" fill="#94a3b8" font-size="7" font-family="monospace" id="fn02-txt">41.5k m³/h</text>
                <path d="M 165 10 L 165 -45" stroke="#ef4444" stroke-width="3" stroke-dasharray="3,3" class="gas-flow-up"/>

                <!-- Fan 3 & 4 (Zone 2) -->
                <rect x="245" y="10" width="60" height="40" rx="3" fill="#131d35" stroke="#f59e0b" stroke-width="1.2"/>
                <text x="275" y="26" text-anchor="middle" fill="#f59e0b" font-size="8" font-weight="700" font-family="monospace">FN-03</text>
                <text x="275" y="38" text-anchor="middle" fill="#94a3b8" font-size="7" font-family="monospace" id="fn03-txt">38k m³/h</text>
                <path d="M 275 10 L 275 -35" stroke="#f59e0b" stroke-width="3" stroke-dasharray="3,3" class="gas-flow-up"/>

                <rect x="320" y="10" width="60" height="40" rx="3" fill="#131d35" stroke="#f59e0b" stroke-width="1.2"/>
                <text x="350" y="26" text-anchor="middle" fill="#f59e0b" font-size="8" font-weight="700" font-family="monospace">FN-04</text>
                <text x="350" y="38" text-anchor="middle" fill="#94a3b8" font-size="7" font-family="monospace" id="fn04-txt">37.5k m³/h</text>
                <path d="M 350 10 L 350 -35" stroke="#f59e0b" stroke-width="3" stroke-dasharray="3,3" class="gas-flow-up"/>

                <!-- Fan 5 & 6 (Zone 3) -->
                <rect x="430" y="10" width="60" height="40" rx="3" fill="#131d35" stroke="#0ea5e9" stroke-width="1.2"/>
                <text x="460" y="26" text-anchor="middle" fill="#0ea5e9" font-size="8" font-weight="700" font-family="monospace">FN-05</text>
                <text x="460" y="38" text-anchor="middle" fill="#94a3b8" font-size="7" font-family="monospace" id="fn05-txt">32k m³/h</text>
                <path d="M 460 10 L 460 -25" stroke="#0ea5e9" stroke-width="3" stroke-dasharray="3,3" class="gas-flow-up"/>

                <rect x="505" y="10" width="60" height="40" rx="3" fill="#131d35" stroke="#0ea5e9" stroke-width="1.2"/>
                <text x="535" y="26" text-anchor="middle" fill="#0ea5e9" font-size="8" font-weight="700" font-family="monospace">FN-06</text>
                <text x="535" y="38" text-anchor="middle" fill="#94a3b8" font-size="7" font-family="monospace" id="fn06-txt">31k m³/h</text>
                <path d="M 535 10 L 535 -25" stroke="#0ea5e9" stroke-width="3" stroke-dasharray="3,3" class="gas-flow-up"/>
              </g>
            </svg>
          </div>

          <!-- Right: Closed-Loop PID Kiln Hood Draft Controller Panel -->
          <div class="cooler-pid-card">
            <div class="pid-card-header">
              <span class="pid-title">
                <i class="fa-solid fa-gauge-high text-cyan"></i>
                <span>KILN HOOD DRAFT PID CONTROLLER</span>
              </span>
              <span class="badge badge-success" id="pid-mode-badge">AUTO (CLOSED-LOOP)</span>
            </div>

            <!-- PID Gauge Readouts -->
            <div class="pid-readouts-grid">
              <div class="pid-stat-box">
                <span class="stat-lbl">SETPOINT (SP)</span>
                <span class="stat-val font-mono text-cyan" id="pid-sp-val">-0.80 mbar</span>
              </div>
              <div class="pid-stat-box">
                <span class="stat-lbl">PROCESS VAR (PV)</span>
                <span class="stat-val font-mono text-green" id="pid-pv-val">-0.81 mbar</span>
              </div>
              <div class="pid-stat-box">
                <span class="stat-lbl">CONTROL OUTPUT (MV)</span>
                <span class="stat-val font-mono text-amber" id="pid-mv-val">64.5%</span>
              </div>
            </div>

            <!-- Live SVG Mini-Trend Chart -->
            <div class="pid-trend-box">
              <div class="trend-legend">
                <span class="legend-item"><span class="legend-dot cyan"></span> SP (-0.80)</span>
                <span class="legend-item"><span class="legend-dot green"></span> PV (Actual)</span>
                <span class="legend-item"><span class="legend-dot amber"></span> MV (Damper)</span>
              </div>
              <svg class="pid-trend-svg" id="pid-trend-chart" viewBox="0 0 320 90" preserveAspectRatio="none">
                <!-- Trend grid lines -->
                <line x1="0" y1="20" x2="320" y2="20" stroke="#1e293b" stroke-width="1"/>
                <line x1="0" y1="45" x2="320" y2="45" stroke="#283756" stroke-width="1" stroke-dasharray="2,2"/>
                <line x1="0" y1="70" x2="320" y2="70" stroke="#1e293b" stroke-width="1"/>

                <!-- Dynamic paths -->
                <path id="trend-path-sp" d="" fill="none" stroke="#06b6d4" stroke-width="1.5" stroke-dasharray="3,3"/>
                <path id="trend-path-pv" d="" fill="none" stroke="#10b981" stroke-width="2"/>
                <path id="trend-path-mv" d="" fill="none" stroke="#f59e0b" stroke-width="1.2" opacity="0.75"/>
              </svg>
            </div>

            <!-- PID Operator Controls -->
            <div class="pid-controls-strip">
              <div class="sp-slider-row">
                <label for="slider-pid-sp" class="text-xs text-muted">ADJUST DRAFT SETPOINT (SP):</label>
                <div class="sp-slider-inline">
                  <input type="range" id="slider-pid-sp" min="-1.50" max="-0.20" step="0.05" value="-0.80" class="range-slider">
                  <span class="font-mono text-cyan text-sm" id="txt-slider-sp">-0.80 mbar</span>
                </div>
              </div>

              <div class="pid-tuning-params font-mono text-xs">
                <span>Kp: <b>2.40</b></span>
                <span>Ti: <b>12.0s</b></span>
                <span>Td: <b>1.80s</b></span>
                <span>Deadband: <b>&plusmn;0.02 mb</b></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Hook PID Slider
    const spSlider = document.getElementById('slider-pid-sp') as HTMLInputElement;
    if (spSlider) {
      spSlider.addEventListener('input', (e) => {
        const val = +(e.target as HTMLInputElement).value;
        this.state.setHoodDraftSp(val);
        const txt = document.getElementById('txt-slider-sp');
        if (txt) txt.textContent = `${val.toFixed(2)} mbar`;
      });
    }
  }

  private updateTelemetry() {
    const clr = this.state.cooler;

    // Badges
    const badgeDischarge = document.getElementById('clr-discharge-badge');
    if (badgeDischarge) {
      badgeDischarge.textContent = `DISCHARGE TEMP: ${clr.clinkerDischargeTempC}°C`;
      badgeDischarge.className = clr.clinkerDischargeTempC > 150 ? 'badge badge-danger' : 'badge badge-warning';
    }

    const badgeHyd = document.getElementById('clr-hyd-badge');
    if (badgeHyd) {
      badgeHyd.textContent = `HYDRAULIC: ${clr.grateSections[0].drivePressureBar} BAR`;
      badgeHyd.className = clr.grateSections[0].drivePressureBar > 180 ? 'badge badge-danger' : 'badge badge-info';
    }

    // Grate section telemetry readouts
    const g1 = clr.grateSections[0];
    const g1Txt = document.getElementById('g1-telemetry');
    if (g1Txt) {
      g1Txt.textContent = `GRATE 1: ${g1.strokeRateSpM} SpM | ${g1.drivePressureBar} Bar`;
      g1Txt.setAttribute('fill', g1.isStalled ? '#ef4444' : '#f87171');
    }

    const g2 = clr.grateSections[1];
    const g2Txt = document.getElementById('g2-telemetry');
    if (g2Txt) g2Txt.textContent = `GRATE 2: ${g2.strokeRateSpM} SpM | ${g2.drivePressureBar} Bar`;

    const g3 = clr.grateSections[2];
    const g3Txt = document.getElementById('g3-telemetry');
    if (g3Txt) g3Txt.textContent = `GRATE 3: ${g3.strokeRateSpM} SpM | ${g3.drivePressureBar} Bar`;

    // Fans telemetry
    const fn01 = document.getElementById('fn01-txt');
    if (fn01) fn01.textContent = `${(clr.fans[0].flowM3h / 1000).toFixed(1)}k m³/h`;

    const fn02 = document.getElementById('fn02-txt');
    if (fn02) fn02.textContent = `${(clr.fans[1].flowM3h / 1000).toFixed(1)}k m³/h`;

    const fn03 = document.getElementById('fn03-txt');
    if (fn03) fn03.textContent = `${(clr.fans[2].flowM3h / 1000).toFixed(1)}k m³/h`;

    const fn04 = document.getElementById('fn04-txt');
    if (fn04) fn04.textContent = `${(clr.fans[3].flowM3h / 1000).toFixed(1)}k m³/h`;

    const fn05 = document.getElementById('fn05-txt');
    if (fn05) fn05.textContent = `${(clr.fans[4].flowM3h / 1000).toFixed(1)}k m³/h`;

    const fn06 = document.getElementById('fn06-txt');
    if (fn06) fn06.textContent = `${(clr.fans[5].flowM3h / 1000).toFixed(1)}k m³/h`;

    // PID Readouts
    const pidSp = document.getElementById('pid-sp-val');
    if (pidSp) pidSp.textContent = `${clr.hoodDraftPid.sp.toFixed(2)} mbar`;

    const pidPv = document.getElementById('pid-pv-val');
    if (pidPv) pidPv.textContent = `${clr.hoodDraftPid.pv.toFixed(2)} mbar`;

    const pidMv = document.getElementById('pid-mv-val');
    if (pidMv) pidMv.textContent = `${clr.hoodDraftPid.mv.toFixed(1)}%`;

    // Update PID trend line chart
    this.renderPidTrendChart();
  }

  private renderPidTrendChart() {
    const history = this.state.cooler.hoodDraftPid.history;
    if (history.length < 2) return;

    const width = 320;
    const height = 90;
    const minVal = -1.5;
    const maxVal = 0.0;

    const mapY = (val: number) => {
      const norm = (val - minVal) / (maxVal - minVal);
      return height - norm * (height - 15) - 7.5;
    };

    let spD = '';
    let pvD = '';
    let mvD = '';

    history.forEach((pt, idx) => {
      const x = (idx / (history.length - 1)) * width;
      const ySp = mapY(pt.sp);
      const yPv = mapY(pt.pv);
      // Map MV 0-100% to height
      const yMv = height - (pt.mv / 100) * (height - 15) - 7.5;

      if (idx === 0) {
        spD += `M ${x.toFixed(1)} ${ySp.toFixed(1)}`;
        pvD += `M ${x.toFixed(1)} ${yPv.toFixed(1)}`;
        mvD += `M ${x.toFixed(1)} ${yMv.toFixed(1)}`;
      } else {
        spD += ` L ${x.toFixed(1)} ${ySp.toFixed(1)}`;
        pvD += ` L ${x.toFixed(1)} ${yPv.toFixed(1)}`;
        mvD += ` L ${x.toFixed(1)} ${yMv.toFixed(1)}`;
      }
    });

    const spPath = document.getElementById('trend-path-sp');
    if (spPath) spPath.setAttribute('d', spD);

    const pvPath = document.getElementById('trend-path-pv');
    if (pvPath) pvPath.setAttribute('d', pvD);

    const mvPath = document.getElementById('trend-path-mv');
    if (mvPath) mvPath.setAttribute('d', mvD);
  }
}
