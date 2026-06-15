import { useState } from "react";

// CMJ brand
const OCEAN = "#095668";
const SAGE = "#6c9b8a";
const LIGHTBLUE = "#a3c7cc";
const POWDER = "#dbe6e5";
const PEACH = "#f8c7ad";
const IVORY = "#f5efe6";
const INK = "#2d2d2d";

const serif = { fontFamily: "Recoleta, Georgia, 'Times New Roman', serif" };
const sans = { fontFamily: "'Lato', 'Segoe UI', Helvetica, Arial, sans-serif" };

const PEOPLE_PER_COMPANY = 1.75; // dedupe: individuals → companies

const PRESETS = {
  floor: {
    label: "Floor case",
    joinRate: 10, custShare: 60, retentionLift: 5, convRate: 5, referralDeals: 3,
  },
  expected: {
    label: "Expected case",
    joinRate: 15, custShare: 60, retentionLift: 8, convRate: 10, referralDeals: 6,
  },
};

function fmtMoney(n) {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(2).replace(/\.?0+$/, "") + "M";
  return "$" + Math.round(n / 1000) + "K";
}
function fmtFull(n) {
  return "$" + Math.round(n).toLocaleString();
}

function Slider({ label, value, onChange, min, max, step = 1, suffix = "", hint }) {
  return (
    <div className="mb-5">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-sm font-bold" style={{ ...sans, color: OCEAN }}>{label}</span>
        <span className="text-sm font-bold px-2 py-0.5 rounded" style={{ ...sans, background: POWDER, color: OCEAN }}>
          {value.toLocaleString()}{suffix}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cmj-range"
        aria-label={label}
      />
      {hint && <div className="text-xs mt-1" style={{ ...sans, color: "#6b7672" }}>{hint}</div>}
    </div>
  );
}

function LeverCard({ title, value, detail, dark }) {
  return (
    <div className="rounded-xl p-4 flex-1 min-w-[140px]" style={{ background: dark ? OCEAN : IVORY, boxShadow: "0 3px 10px rgba(0,0,0,0.10)" }}>
      <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ ...sans, color: dark ? PEACH : SAGE }}>{title}</div>
      <div className="text-2xl font-bold" style={{ ...serif, color: dark ? "#fff" : OCEAN }}>{fmtMoney(value)}</div>
      <div className="text-xs mt-1 leading-snug" style={{ ...sans, color: dark ? POWDER : "#555" }}>{detail}</div>
    </div>
  );
}

export default function CommunityValueCalculator() {
  const [audience, setAudience] = useState(3500);
  const [accounts, setAccounts] = useState(1000);
  const [arr, setArr] = useState(30000);
  const [joinRate, setJoinRate] = useState(10);
  const [custShare, setCustShare] = useState(60);
  const [retentionLift, setRetentionLift] = useState(5);
  const [convRate, setConvRate] = useState(5);
  const [referralDeals, setReferralDeals] = useState(3);
  const [investment, setInvestment] = useState(145000);
  const [preset, setPreset] = useState("floor");

  const applyPreset = (key) => {
    const p = PRESETS[key];
    setJoinRate(p.joinRate);
    setCustShare(p.custShare);
    setRetentionLift(p.retentionLift);
    setConvRate(p.convRate);
    setReferralDeals(p.referralDeals);
    setPreset(key);
  };

  // Model
  const members = audience * (joinRate / 100);
  const customerMembers = members * (custShare / 100);
  const memberAccounts = Math.min(accounts, customerMembers / PEOPLE_PER_COMPANY);
  const retentionValue = memberAccounts * (retentionLift / 100) * arr;

  const prospectMembers = members - customerMembers;
  const prospectCompanies = prospectMembers / PEOPLE_PER_COMPANY;
  const newAccounts = prospectCompanies * (convRate / 100);
  const conversionValue = newAccounts * arr;

  const referralValue = referralDeals * arr;

  const total = retentionValue + conversionValue + referralValue;
  const multiple = investment > 0 ? total / investment : 0;

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: "#fdfbf7", ...sans }}>
      <style>{`
        .cmj-range { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 3px;
          background: ${POWDER}; outline: none; }
        .cmj-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px;
          border-radius: 50%; background: ${OCEAN}; cursor: pointer; border: 3px solid #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.25); }
        .cmj-range::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: ${OCEAN};
          cursor: pointer; border: 3px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.25); }
        .cmj-range:focus-visible { box-shadow: 0 0 0 3px ${LIGHTBLUE}; }
      `}</style>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: SAGE }}>
            The CMJ Group · Create Belonging
          </div>
          <h1 className="text-3xl md:text-4xl font-bold" style={{ ...serif, color: OCEAN }}>
            What is this community worth to you?
          </h1>
          <p className="text-sm mt-2 max-w-2xl" style={{ color: INK }}>
            Adjust any assumption to your real numbers. Every default below is deliberately conservative,
            so most corrections move the value up.
          </p>
        </div>

        {/* Preset toggle */}
        <div className="flex gap-2 mb-6">
          {Object.entries(PRESETS).map(([key, p]) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className="px-4 py-2 rounded-full text-sm font-bold transition-colors"
              style={{
                background: preset === key ? OCEAN : "#fff",
                color: preset === key ? "#fff" : OCEAN,
                border: `2px solid ${OCEAN}`,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Left: assumptions */}
          <div className="md:col-span-2 rounded-2xl p-5 bg-white" style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }}>
            <h2 className="text-lg font-bold mb-4" style={{ ...serif, color: OCEAN }}>Your assumptions</h2>

            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: SAGE }}>The audience</div>
            <Slider label="Total engaged audience" value={audience} onChange={(v) => setAudience(v)} min={500} max={10000} step={100}
              hint="Event signups, course takers, hackathon applicants" />
            <Slider label="Customer accounts" value={accounts} onChange={(v) => setAccounts(v)} min={100} max={5000} step={50}
              hint="Companies that already pay you today" />
            <Slider label="ACV" value={arr} onChange={(v) => setArr(v)} min={5000} max={100000} step={1000} suffix=""
              hint={fmtFull(arr) + " in contract value per account per year"} />

            <div className="text-xs font-bold uppercase tracking-widest mb-2 mt-5" style={{ color: SAGE }}>Participation</div>
            <Slider label="Join the community" value={joinRate} onChange={(v) => { setJoinRate(v); setPreset(null); }} min={1} max={40} suffix="%" />
            <Slider label="Members who are existing customers" value={custShare} onChange={(v) => { setCustShare(v); setPreset(null); }} min={0} max={100} suffix="%"
              hint="Connects members back to your customer accounts; the rest count as prospects" />

            <div className="text-xs font-bold uppercase tracking-widest mb-2 mt-5" style={{ color: SAGE }}>The three levers</div>
            <Slider label="Retention lift on member accounts" value={retentionLift} onChange={(v) => { setRetentionLift(v); setPreset(null); }} min={0} max={20} suffix=" pts"
              hint="Applies only to customer accounts with at least one member inside the community. Benchmark: members retain 13 to 24% better" />
            <Slider label="Prospect members who convert" value={convRate} onChange={(v) => { setConvRate(v); setPreset(null); }} min={0} max={25} suffix="%" />
            <Slider label="Closed referral deals per year" value={referralDeals} onChange={(v) => { setReferralDeals(v); setPreset(null); }} min={0} max={20} />

            <div className="text-xs font-bold uppercase tracking-widest mb-2 mt-5" style={{ color: SAGE }}>The investment</div>
            <Slider label="Year 1 program investment" value={investment} onChange={(v) => setInvestment(v)} min={50000} max={300000} step={5000}
              hint={fmtFull(investment) + " across all phases"} />
          </div>

          {/* Right: results */}
          <div className="md:col-span-3 flex flex-col gap-4">
            {/* Headline total */}
            <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: OCEAN, boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: PEACH }}>
                Year 1 value created
              </div>
              <div className="text-5xl md:text-6xl font-bold" style={{ ...serif, color: "#fff" }}>
                {fmtMoney(total)}
              </div>
              <div className="text-sm mt-2" style={{ color: POWDER }}>
                {Math.round(members).toLocaleString()} members · {Math.round(memberAccounts).toLocaleString()} customer accounts represented in the community · {newAccounts.toFixed(1).replace(/\.0$/, "")} new accounts won
              </div>
              {/* Multiplier badge */}
              <div className="absolute top-5 right-5 w-20 h-20 md:w-24 md:h-24 rounded-full flex flex-col items-center justify-center"
                style={{ background: PEACH, boxShadow: "0 3px 10px rgba(0,0,0,0.2)" }}>
                <div className="text-xl md:text-2xl font-bold leading-none" style={{ ...serif, color: OCEAN }}>
                  {multiple >= 10 ? Math.round(multiple) : multiple.toFixed(1)}x
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wide" style={{ color: OCEAN }}>return</div>
              </div>
            </div>

            {/* Lever breakdown */}
            <div className="flex flex-wrap gap-4">
              <LeverCard
                title="Retention"
                value={retentionValue}
                detail={`${Math.round(memberAccounts)} customer accounts with members inside × ${retentionLift} pt renewal lift × ${fmtMoney(arr)} ACV`}
              />
              <LeverCard
                title="Conversion"
                value={conversionValue}
                detail={`${Math.round(prospectCompanies)} prospect companies × ${convRate}% convert × ${fmtMoney(arr)} ACV`}
              />
              <LeverCard
                title="Referral"
                value={referralValue}
                detail={`${referralDeals} closed deals × ${fmtMoney(arr)} ACV`}
              />
            </div>

            {/* Investment vs value bar */}
            <div className="rounded-2xl p-5 bg-white" style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }}>
              <div className="flex justify-between text-sm font-bold mb-2" style={{ color: OCEAN }}>
                <span>Investment: {fmtMoney(investment)}</span>
                <span>Value: {fmtMoney(total)}</span>
              </div>
              <div className="w-full h-6 rounded-full overflow-hidden flex" style={{ background: POWDER }}>
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (investment / Math.max(total, investment)) * 100)}%`,
                    background: LIGHTBLUE,
                  }}
                  title="Investment"
                />
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.max(0, ((total - investment) / Math.max(total, investment)) * 100))}%`,
                    background: SAGE,
                  }}
                  title="Net value"
                />
              </div>
              <div className="text-xs mt-2" style={{ color: "#6b7672" }}>
                {total > investment
                  ? `Net new value after the program pays for itself: ${fmtMoney(total - investment)}`
                  : "Adjust assumptions to explore the breakeven point"}
              </div>
            </div>

            {/* Fine print */}
            <div className="text-xs leading-relaxed px-1" style={{ color: "#6b7672" }}>
              How the model works: "Customer accounts" are the companies that already pay you. Members who work at
              those companies link the community back to them, and retention value is earned only on accounts with
              at least one member inside, never on your full customer base. Members from everywhere else count as
              prospect companies and drive conversion value. Individuals are mapped to companies at {PEOPLE_PER_COMPANY} people
              per company to avoid double counting, and all dollar values use your ACV. Year 2+ value
              compounds as retained accounts renew again and participation grows. All defaults reflect the floor
              case from the proposal.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
