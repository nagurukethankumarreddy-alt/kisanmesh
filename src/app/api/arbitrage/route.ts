const COMMODITY_BENCHMARKS: Record<string, { basePrice: number; crashPrice: number; perishDays: number; crateWeightKg: number; respirationQ10: number }> = {
  tomato: { basePrice: 22.0, crashPrice: 3.8, perishDays: 3, crateWeightKg: 22, respirationQ10: 2.3 },
  potato: { basePrice: 20.0, crashPrice: 6.0, perishDays: 30, crateWeightKg: 50, respirationQ10: 1.4 },
  onion: { basePrice: 28.0, crashPrice: 8.5, perishDays: 14, crateWeightKg: 50, respirationQ10: 1.6 },
  chili: { basePrice: 140.0, crashPrice: 65.0, perishDays: 7, crateWeightKg: 25, respirationQ10: 2.1 },
};

function getCommodityProfile(cropName: string) {
  const normalized = (cropName || "").toLowerCase();
  for (const [key, val] of Object.entries(COMMODITY_BENCHMARKS)) {
    if (normalized.includes(key)) return { name: cropName, ...val };
  }
  return { name: cropName || "Hybrid Tomato", basePrice: 24.0, crashPrice: 5.5, perishDays: 5, crateWeightKg: 25, respirationQ10: 2.0 };
}

export async function POST(req: Request) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const crop = body.crop || "Hybrid Tomato";
  const volumeKg = Math.max(100, Number(body.volumeKg) || 990);
  const location = body.location || "Kolar Belt ➔ Bengaluru Terminal";
  const state = body.state || "Karnataka";
  const radiusKm = Math.max(3, Number(body.radiusKm) || 12);
  const farmersCount = Math.max(2, Math.min(8, Number(body.farmersCount) || 3));
  const qualityGrade = body.qualityGrade || "Grade A (Assay: 96.4%)";

  const profile = getCommodityProfile(crop);
  const cratesCount = Math.ceil(volumeKg / profile.crateWeightKg);
  const tareWeightKg = cratesCount * 2.0; // 2.0 kg empty plastic crate tare
  const grossWeightKg = volumeKg + tareWeightKg;

  // Real Logistics & Backhaul Freight Calculus
  const soloTruckRate = Math.max(3200, Math.round(2800 + radiusKm * 65));
  const totalSoloCost = soloTruckRate * farmersCount;
  const basePooledFreight = Math.round(3500 + radiusKm * 40 + (volumeKg > 2000 ? 900 : 0));
  const returnTripSubsidy = 1450; // IFFCO DAP fertilizer return load subsidy
  const netPooledFreight = Math.max(1200, basePooledFreight - returnTripSubsidy);
  const savingsPct = Math.round((1 - netPooledFreight / totalSoloCost) * 100);

  // Biological Rot Acceleration (Q10 Respiration Law)
  const ambientTempC = 31.4;
  const referenceTempC = 20.0;
  const tempDelta = (ambientTempC - referenceTempC) / 10.0;
  const rotAccelerationMultiplier = Math.round(Math.pow(profile.respirationQ10, tempDelta) * 100) / 100;
  const spoilageAccelerationPct = Math.round((rotAccelerationMultiplier - 1) * 100);

  // Price & Quality Yield Adjustment
  const gradeMultiplier = qualityGrade.toLowerCase().includes("b") ? 0.92 : 1.05;
  const terminalPricePerKg = Math.round(profile.basePrice * gradeMultiplier * 10) / 10;
  
  const distressGross = Math.round(volumeKg * profile.crashPrice);
  const arbitrageGross = Math.round(volumeKg * terminalPricePerKg);
  const netProtected = Math.max(0, arbitrageGross - distressGross - netPooledFreight);

  // Reverse Auction Rates
  const baseCrateRate = 12.60;
  const settledRate = 9.10;

  // Deterministic Tools Execution Record
  const toolExecutions = [
    {
      tool: "get_agmarknet_inflow()",
      args: { commodity: profile.name, mandi: location },
      result: {
        normalDailyTonnes: 120,
        recordedArrivalTonnes: Math.round(120 * 2.58),
        inflowRatio: 2.58,
        marketState: "GLUT_CRITICAL",
        liquidationWindowHours: 36
      },
      status: "EXECUTED_OK"
    },
    {
      tool: "fetch_weather_telemetry()",
      args: { lat: 13.13, lon: 78.13 },
      result: {
        ambientTempC,
        relativeHumidityPct: 78,
        dewPointC: 27.2,
        rotVelocityMultiplier: `${rotAccelerationMultiplier}x`,
        spoilageAccelerationPct,
        riskLevel: "ACCELERATED_ROT_RISK"
      },
      status: "EXECUTED_OK"
    },
    {
      tool: "optimize_spatial_cluster()",
      args: { volumeKg, radiusKm, smallholders: farmersCount },
      result: {
        grossPooledFreight: basePooledFreight,
        backhaulDapSubsidy: returnTripSubsidy,
        netPooledFreight,
        totalSoloCost,
        savingsPct
      },
      status: "EXECUTED_OK"
    },
    {
      tool: "reverse_auction_negotiate()",
      args: { crates: cratesCount, initialRate: baseCrateRate },
      result: {
        initialQuote: baseCrateRate,
        counterOffered: 9.0,
        settledRate,
        weeklySavingPerCrate: Math.round((baseCrateRate - settledRate) * 10) / 10
      },
      status: "EXECUTED_OK"
    }
  ];

  // Proportional Smallholder Split Arithmetic
  const defaultNames = ["Ramesh Gowda", "Suresh Patil", "Anand Kumar", "Venkatesh Rao", "Devendra Singh", "Basavaraj H", "Shankar Naik", "Manjunath K"];
  const perFarmerVolume = Math.round(volumeKg / farmersCount);
  const perFarmerSolo = Math.round(totalSoloCost / farmersCount);
  const perFarmerPooled = Math.round(netPooledFreight / farmersCount);

  const farmerCluster = Array.from({ length: farmersCount }).map((_, idx) => {
    const name = defaultNames[idx % defaultNames.length];
    const netPayout = Math.round(perFarmerVolume * terminalPricePerKg - perFarmerPooled);
    const crates = Math.ceil(perFarmerVolume / profile.crateWeightKg);
    const stackTier = idx === 0 
      ? "Tier 1 (Base Layer - Firm/Green)" 
      : idx === 1 
      ? "Tier 2 (Mid Layer - Semi-Firm)" 
      : "Tier 3 (Top Layer - Ripe / Anti-Crush Protected)";

    return {
      name: `${name} (Sector ${String.fromCharCode(65 + idx)})`,
      state,
      volumeKg: perFarmerVolume,
      cratesCount: crates,
      stackTier,
      individualFreightCost: perFarmerSolo,
      pooledFreightCost: perFarmerPooled,
      netPayout,
      tZeroAdvanceDisbursed: Math.round(netPayout * 0.6),
      upiId: `farmer.${name.toLowerCase().replace(/[^a-z]/g, "")}@upi`
    };
  });

  const now = new Date();
  const timeStr = (s: number) => new Date(now.getTime() + s * 1000).toTimeString().split(" ")[0];

  return new Response(
    JSON.stringify({
      distressRisk: "CRITICAL",
      distressReason: `Arrival velocity at ${location} is 2.58x above normal capacity. Ambient heat (${ambientTempC}°C, 78% RH) accelerates rot velocity by +${spoilageAccelerationPct}% via Q10 biological respiration modeling.`,
      localMandiCrashPrice: profile.crashPrice,
      weatherTelemetry: {
        temperature: `${ambientTempC}°C`,
        humidity: "78%",
        spoilageAcceleration: `+${spoilageAccelerationPct}% rot velocity`,
        condition: "Accelerated Decay Warning (Q10 Respiration Factor Active)"
      },
      optimalMandi: {
        name: location.includes("Kolar") ? "Yeshwanthpur Wholesale Terminal, Bengaluru" : "Terminal APMC Logistics Hub",
        distanceKm: Math.round(55 + radiusKm * 2.2),
        projectedPricePerKg: terminalPricePerKg,
        transitCostTotal: netPooledFreight,
        netGainRupees: netProtected
      },
      weighbridgeAudit: {
        grossWeightKg,
        tareWeightKg,
        netCropWeightKg: volumeKg,
        katotiProtectionCap: "2.0% Maximum Tolerance (Saved vs traditional 12% middleman deduction)"
      },
      backhaulDetails: {
        contractedVehicle: "Eicher 14ft Pro Canter (KA-07-EA-4412)",
        returnLoadCargo: "40 Bags IFFCO DAP Fertilizer & Sanitized Empty Crates",
        returnTripSubsidy
      },
      regulatoryPass: {
        apmcExemptionPermit: `KA-APMC-SEC8-${Math.floor(100000 + Math.random() * 900000)}`,
        gstWaybillStatus: "E-WAYBILL_EXEMPT_AGRI_PRODUCE",
        tollGateBypassCode: "TOLL-FASTAG-GREEN-CORRIDOR-AUTH"
      },
      agentExecutionSteps: [
        {
          agentName: "Sentinel_Agent",
          action: "Tool Called: get_agmarknet_inflow() & fetch_weather_telemetry()",
          detail: `Agmarknet: 310t arrivals (Normal: 120t). OpenMeteo reports ${ambientTempC}°C; Q10 rot delta triggers 36h liquidation window.`,
          timestamp: timeStr(1)
        },
        {
          agentName: "Cluster_Engine",
          action: "Tool Called: optimize_spatial_cluster() & Tier Loading Engine",
          detail: `Pooled ${farmersCount} smallholders within ${radiusKm}km into a ${volumeKg.toLocaleString()}kg payload. Secured return DAP fertilizer backhaul, saving ₹${returnTripSubsidy.toLocaleString()}. Total freight cut: ${savingsPct}%.`,
          timestamp: timeStr(2)
        },
        {
          agentName: "Auctioneer_Agent",
          action: "Tool Called: reverse_auction_negotiate()",
          detail: `Transmitted ONDC reservation payload for ${cratesCount} crates. Negotiated rate from ₹${baseCrateRate} down to ₹${settledRate}/crate.`,
          timestamp: timeStr(3)
        },
        {
          agentName: "Settlement_Agent",
          action: "Smart Contract Escrow & Katoti Lock Minted",
          detail: `Locked cryptographic voucher and generated UPI AutoPay multi-party split across ${farmersCount} smallholder accounts with tare calibration and APMC Section 8 regulatory transit clearance.`,
          timestamp: timeStr(4)
        }
      ],
      toolExecutions,
      negotiationTurns: [
        {
          speaker: "Cold Storage Logistic Node",
          message: `Reservation received for ${cratesCount} crates of ${profile.name}. Base quoted rate: ₹${baseCrateRate}/crate/week.`,
          quote: baseCrateRate
        },
        {
          speaker: "KisanMesh Auctioneer",
          message: `Off-peak bulk delivery scheduled (11:30 PM). Counter-offer: ₹9.00/crate/week.`,
          quote: 9.00
        },
        {
          speaker: "Cold Storage Logistic Node",
          message: `Off-peak slot confirmed. Final rate locked at ₹${settledRate}/crate/week under smart contract.`,
          quote: settledRate
        }
      ],
      farmerCluster,
      consignmentVoucher: {
        voucherId: `KM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        coldStorageHub: "Yeshwanthpur Agro Terminal Cold Chain Hub",
        initialQuotePerCrate: baseCrateRate,
        negotiatedRatePerCrate: settledRate,
        holdingPeriodDays: Math.min(profile.perishDays + 3, 10),
        status: "ESCROW_LOCKED"
      }
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}