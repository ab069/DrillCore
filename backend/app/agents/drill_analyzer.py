class DrillAnalyzer:
    OPTIMAL_ROP = 30.0  # ft/hr
    MAX_BIT_HOURS = 200.0
    MAX_SAFE_DEPTH = 15000.0

    @staticmethod
    def analyze_rop(rop_rate: float, depth: float, bit_hours: float) -> dict:
        efficiency = min(100.0, (rop_rate / DrillAnalyzer.OPTIMAL_ROP) * 100)
        efficiency = round(efficiency, 1)
        wear = min(100.0, (bit_hours / DrillAnalyzer.MAX_BIT_HOURS) * 100)
        status = "excellent" if efficiency >= 80 else "good" if efficiency >= 60 else "fair" if efficiency >= 40 else "poor"
        return {
            "rop_rate_ft_hr": rop_rate,
            "efficiency_pct": efficiency,
            "bit_wear_pct": round(wear, 1),
            "status": status,
            "recommendation": "Continue drilling" if efficiency > 60 else "Consider adjusting WOB/RPM",
        }

    @staticmethod
    def analyze_mud_pressure(mud_weight: float, depth: float) -> dict:
        formation_pressure_gradient = 0.465  # psi/ft
        required_mud_weight = formation_pressure_gradient * depth / 0.052 / depth if depth > 0 else 8.33
        margin = mud_weight - required_mud_weight
        stability = "stable" if margin > 0.5 else "caution" if margin > 0 else "unstable"
        return {
            "mud_weight_ppg": mud_weight,
            "required_mud_weight_ppg": round(required_mud_weight, 2),
            "margin_ppg": round(margin, 2),
            "stability": stability,
            "recommendation": "Maintain current mud weight" if stability == "stable" else "Increase mud weight",
        }

    @staticmethod
    def calculate_risk_score(rop_efficiency: float, mud_stability: str, bit_condition: float) -> int:
        score = 0
        if rop_efficiency < 40:
            score += 35
        elif rop_efficiency < 60:
            score += 20
        elif rop_efficiency < 80:
            score += 10
        if mud_stability == "unstable":
            score += 40
        elif mud_stability == "caution":
            score += 20
        if bit_condition > 80:
            score += 25
        elif bit_condition > 60:
            score += 15
        elif bit_condition > 40:
            score += 5
        return min(100, score)

    @staticmethod
    def generate_drill_report(rig_name: str, score: int, findings: list[str]) -> str:
        level = "LOW" if score < 25 else "MODERATE" if score < 50 else "HIGH" if score < 75 else "CRITICAL"
        header = f"DRILLING REPORT — {rig_name}\n{'=' * 40}\nRisk Score: {score}/100 ({level})\n\nFindings:\n"
        items = "\n".join(f"  • {f}" for f in findings)
        return header + items


drill_analyzer = DrillAnalyzer()
