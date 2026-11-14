/**
 * PYRO-CLINKER: Engineering Dossier Modal & Technical Calculations Component
 * Lead Electrical & Automation Systems Engineer: أ. طارق ابوعشي | Tareq Abuashi
 */

export class DossierModal {
  private container: HTMLElement;

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Container #${containerId} not found`);
    this.container = el;
    this.render();
    this.hookEvents();
  }

  private render() {
    this.container.innerHTML = `
      <div class="modal-backdrop" id="dossier-modal-backdrop" style="display: none;">
        <div class="modal-dialog">
          <div class="modal-header">
            <div class="modal-title-group">
              <i class="fa-solid fa-file-shield text-cyan text-xl"></i>
              <div>
                <div class="modal-title font-mono font-bold">
                  PYRO-CLINKER: DCS AUTOMATION & PYROPROCESSING ENGINEERING DOSSIER
                </div>
                <div class="modal-subtitle text-xs text-muted">
                  Technical Specifications, Thermodynamic Formulations, Closed-Loop PID Kinetics & Safety Interlocks
                </div>
              </div>
            </div>
            <button class="modal-close-btn" id="btn-close-dossier">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="modal-body">
            <!-- Lead Engineer Certification Banner -->
            <div class="dossier-engineer-card">
              <div class="dossier-avatar">
                <i class="fa-solid fa-user-gear text-cyan"></i>
              </div>
              <div class="dossier-info">
                <div class="dossier-name font-bold">أ. طارق ابوعشي | Tareq Abuashi</div>
                <div class="dossier-title text-cyan text-sm">Lead Electrical & Automation Systems Engineer</div>
                <div class="dossier-dept text-xs text-muted">
                  Industrial SCADA, DCS Process Control & Functional Safety Systems Architecture
                </div>
              </div>
              <div class="dossier-stamp">
                <i class="fa-solid fa-certificate text-green"></i>
                <span class="text-green font-mono text-xs">CERTIFIED IEC 61508 / NFPA 86</span>
              </div>
            </div>

            <!-- Tabbed Navigation -->
            <div class="dossier-tabs-nav">
              <button class="dossier-tab-btn active" data-tab="tab-preheater">
                <i class="fa-solid fa-tower-observation"></i> 1. Preheater & Calciner
              </button>
              <button class="dossier-tab-btn" data-tab="tab-cooler">
                <i class="fa-solid fa-snowflake"></i> 2. Grate Cooler & PID
              </button>
              <button class="dossier-tab-btn" data-tab="tab-bms">
                <i class="fa-solid fa-shield-halved"></i> 3. BMS & CEMS Safety
              </button>
              <button class="dossier-tab-btn" data-tab="tab-refractory">
                <i class="fa-solid fa-brain"></i> 4. AI Refractory Model
              </button>
            </div>

            <!-- TAB 1: PREHEATER & CALCINER -->
            <div class="dossier-tab-content active" id="tab-preheater">
              <h4 class="section-heading text-cyan">1. 5-Stage Cyclone Heat Exchange & Calcination Kinetics</h4>
              <p class="section-p">
                The 5-stage cyclone suspension preheater system transfers thermal energy from kiln counter-current exhaust gases 
                to descending raw meal. In each cyclone stage $i$, gas-solid separation efficiency $\eta_c$ and temperature reduction are governed by:
              </p>
              
              <div class="formula-card font-mono">
                $$\eta_{c, i} = 1 - \exp\left[ -\left(\frac{d_p}{d_{50}}\right)^m \right]$$
                $$\dot{Q}_{\text{trans}} = \dot{m}_{\text{meal}} \cdot C_{p, \text{meal}} \cdot (T_{\text{meal, out}} - T_{\text{meal, in}}) = \dot{m}_{\text{gas}} \cdot C_{p, \text{gas}} \cdot (T_{\text{gas, in}} - T_{\text{gas, out}})$$
              </div>

              <h5 class="sub-heading text-amber">Precalciner Endothermic Decarbonization Kinetics</h5>
              <p class="section-p">
                Over 90–95% of the limestone decarbonization occurs inside the precalciner at temperatures between $880^\circ\text{C}$ and $920^\circ\text{C}$:
              </p>
              <div class="formula-card font-mono text-amber">
                CaCO3 (solid) + 1782 kJ/kg &mdash;&gt; [890&deg;C] &mdash;&gt; CaO (solid) + CO2 (gas)
              </div>
              <p class="section-p">
                Tertiary air duct provides preheated oxygen-rich air (~$825^\circ\text{C}$) directly from the clinker cooler, reducing primary kiln fuel consumption and NOx generation.
              </p>

              <h5 class="sub-heading text-cyan">Air Blaster Cannon Acoustic Shock Wave (8.5 Bar)</h5>
              <p class="section-p">
                Cyclones C4 and C5 conical bottoms are subject to alkali/sulfur/chloride build-ups and meal bridging. Automated high-pressure pneumatic blast cannons (8.5 Bar) inject instant kinetic energy:
              </p>
              <div class="formula-card font-mono">
                $$E_{\text{blast}} = \frac{P_0 \cdot V_{\text{cannon}}}{\gamma - 1} \left[ 1 - \left(\frac{P_{\text{atm}}}{P_0}\right)^{\frac{\gamma-1}{\gamma}} \right] \approx 42.5 \text{ kJ per pulse}$$
              </div>
            </div>

            <!-- TAB 2: COOLER & PID -->
            <div class="dossier-tab-content" id="tab-cooler">
              <h4 class="section-heading text-cyan">2. Reciprocating Grate Cooler & Kiln Hood Draft PID</h4>
              <p class="section-p">
                The reciprocating grate cooler rapidly quenches molten clinker from $1400^\circ\text{C}$ down to $< 100^\circ\text{C}$ to lock in the alite ($\text{C}_3\text{S}$) crystal structure and prevent retrograde conversion to belite ($\text{C}_2\text{S}$).
              </p>

              <div class="formula-card font-mono">
                $$\eta_{\text{recuperation}} = \frac{\dot{Q}_{\text{secondary air}} + \dot{Q}_{\text{tertiary air}}}{\dot{Q}_{\text{clinker inflow}}} \ge 72.5\%$$
                $$\dot{Q}_{\text{clinker}} = \dot{m}_{\text{clinker}} \int_{95^\circ\text{C}}^{1400^\circ\text{C}} C_p(T) \, dT$$
              </div>

              <h5 class="sub-heading text-green">Closed-Loop Kiln Hood Draft Discrete PID Algorithm</h5>
              <p class="section-p">
                Kiln hood pressure must be strictly maintained at a slightly negative setpoint ($SP = -0.80\text{ mbar}$) to prevent hot gas puffing into the burner platform or excess ambient air ingress:
              </p>
              <div class="formula-card font-mono text-green">
                $$u(k) = u(k-1) + K_p \left[ e(k) - e(k-1) \right] + \frac{K_p T_s}{T_i} e(k) + \frac{K_p T_d}{T_s} \left[ e(k) - 2e(k-1) + e(k-2) \right]$$
                $$\text{Tuned Parameters: } K_p = 2.40, \; T_i = 12.0\text{ s}, \; T_d = 1.80\text{ s}, \; \text{Deadband} = \pm 0.02\text{ mbar}$$
              </div>
            </div>

            <!-- TAB 3: BMS & CEMS -->
            <div class="dossier-tab-content" id="tab-bms">
              <h4 class="section-heading text-amber">3. Burner Management System (BMS) & CEMS Safety Interlocks</h4>
              <p class="section-p">
                Compliant with <b>NFPA 86 (Standard for Ovens and Furnaces)</b> and <b>EN 746-2 (Industrial Thermo-Processing Equipment)</b>.
              </p>

              <h5 class="sub-heading text-red">High Carbon Monoxide (CO) Electrostatic Precipitator (ESP) Explosion Hazard</h5>
              <p class="section-p">
                When flue gas CO exceeds $1.5\%$ ($15,000\text{ ppm}$), the mixture approaches the explosive flammability limit in air. Inside the Electrostatic Precipitator (operating at $80\text{ kV}$), high-voltage corona discharges can trigger catastrophic deflagrations.
              </p>

              <div class="formula-card font-mono text-red">
                Interlock Stage 1 (Warning): CO &gt; 1000 ppm &rArr; Annunciator Yellow Alert<br>
                Interlock Stage 2 (Trip Arm): CO &gt; 1500 ppm &rArr; 15-second fail-safe countdown timer<br>
                Interlock Stage 3 (Trip Exec): Timer expires &rArr; ESP 80kV VCB Trip + BMS Double Block &amp; Bleed Shutoff
              </div>

              <h5 class="sub-heading text-cyan">Double Block & Bleed (DB&B) Valve Sequence</h5>
              <p class="section-p">
                Upon trip condition, main fuel shutoff valves SV-101 and SV-103 snap closed within &lt; 0.8 seconds via pneumatic spring return, while intermediate vent valve SV-102 snaps open to release any trapped fuel to atmosphere.
              </p>
            </div>

            <!-- TAB 4: AI REFRACTORY -->
            <div class="dossier-tab-content" id="tab-refractory">
              <h4 class="section-heading text-purple">4. AI Predictive Refractory Lining Diagnostics & Hotspot Detection</h4>
              <p class="section-p">
                Thermal conduction through the high-alumina/magnesite-spinel refractory lining and outer steel kiln shell is modeled using multi-layer 1D cylindrical heat conduction:
              </p>

              <div class="formula-card font-mono text-purple">
                $$q = \frac{2\pi L (T_{\text{internal}} - T_{\text{ambient}})}{\frac{1}{k_{\text{coating}}}\ln\frac{r_1}{r_0} + \frac{1}{k_{\text{brick}}}\ln\frac{r_2}{r_1} + \frac{1}{k_{\text{shell}}}\ln\frac{r_3}{r_2} + \frac{1}{h_{\text{conv}} r_3}}$$
              </div>

              <h5 class="sub-heading text-cyan">Anomaly Classification Algorithms</h5>
              <ul class="dossier-list">
                <li><b>Zone 3 Hotspot Alert:</b> Shell temperature exceeding $380^\circ\text{C}$ indicates refractory brick spalling or loss of protective coating, necessitating immediate burner flame shaping or clinker cooling.</li>
                <li><b>C4 Cyclone Plugging Predictor:</b> Divergence between stage C3 and C4 static pressure accompanied by drop in draft vacuum identifies cone meal stagnation prior to full chute clogging.</li>
                <li><b>Remaining Useful Life (RUL):</b> Continuously calculated using exponential degradation tracking calibrated against historical campaign cycles (nominal 300 days).</li>
              </ul>
            </div>
          </div>

          <div class="modal-footer">
            <span class="text-xs text-muted font-mono">PYRO-CLINKER DCS SUITE &bull; TAREQ ABUASHI</span>
            <button class="btn btn-secondary" id="btn-modal-dismiss">Close Dossier</button>
          </div>
        </div>
      </div>
    `;
  }

  private hookEvents() {
    const backdrop = document.getElementById('dossier-modal-backdrop');
    const btnClose = document.getElementById('btn-close-dossier');
    const btnDismiss = document.getElementById('btn-modal-dismiss');

    const closeModal = () => {
      if (backdrop) backdrop.style.display = 'none';
    };

    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnDismiss) btnDismiss.addEventListener('click', closeModal);
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });
    }

    // Tab buttons
    const tabBtns = this.container.querySelectorAll('.dossier-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        tabBtns.forEach(b => b.classList.remove('active'));
        const targetBtn = e.currentTarget as HTMLElement;
        targetBtn.classList.add('active');

        const tabId = targetBtn.getAttribute('data-tab');
        const tabContents = this.container.querySelectorAll('.dossier-tab-content');
        tabContents.forEach(c => c.classList.remove('active'));

        if (tabId) {
          const targetContent = document.getElementById(tabId);
          if (targetContent) targetContent.classList.add('active');
        }
      });
    });
  }

  public open() {
    const backdrop = document.getElementById('dossier-modal-backdrop');
    if (backdrop) backdrop.style.display = 'flex';
  }
}
