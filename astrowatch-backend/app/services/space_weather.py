import re
from typing import List, Dict, Any

def parse_flare_class(class_type: str) -> float:
    """
    Parses flare class (e.g., X1.2, M5.0, C2.1) into a numeric severity score (0-100).
    """
    if not class_type:
        return 0.0
    
    match = re.match(r"([BCMX])(\d+\.?\d*)", class_type)
    if not match:
        return 5.0 if "C" in class_type else (15.0 if "M" in class_type else (40.0 if "X" in class_type else 0.0))
    
    letter, level = match.groups()
    level = float(level)
    
    if letter == "X":
        return min(100.0, 50.0 + (level * 5.0))
    elif letter == "M":
        return 20.0 + (level * 2.0)
    elif letter == "C":
        return 5.0 + level
    else: # B or other
        return level

def calculate_solar_threat_score(cme_list: List[Dict], flare_list: List[Dict], gst_list: List[Dict]) -> Dict[str, Any]:
    """
    OrbeSystems Space Weather Threat Algorithm.
    Consolidates multiple NASA DONKI events into a refined tactical summary.
    """
    scores = []
    
    # 1. CME Analysis
    max_cme_speed = 0
    cme_score = 0
    for cme in cme_list:
        analyses = cme.get("cmeAnalyses", [])
        for analysis in analyses:
            speed = float(analysis.get("speed", 0) or 0)
            if speed > max_cme_speed:
                max_cme_speed = speed
            
            # Base score on speed (0-100)
            # 2000 km/s is extremely fast
            s = min(100.0, (speed / 2000.0) * 100.0)
            
            # Type multiplier
            cme_type = analysis.get("type", "C")
            if cme_type == "ER": s *= 1.2
            elif cme_type == "R": s *= 1.1
            
            scores.append(min(100.0, s))
    
    # 2. Solar Flare Analysis
    max_flare_class = ""
    flare_score = 0
    for flare in flare_list:
        f_class = flare.get("classType", "")
        f_score = parse_flare_class(f_class)
        scores.append(f_score)
        if f_score > flare_score:
            flare_score = f_score
            max_flare_class = f_class
            
    # 3. GST Analysis (Kp-index)
    max_kp = 0
    for gst in gst_list:
        for kp_entry in gst.get("allKpIndex", []):
            kp = float(kp_entry.get("kpRating", 0) or 0)
            if kp > max_kp:
                max_kp = kp
            scores.append((kp / 9.0) * 100.0)

    # Calculate Global Threat Level (Weighted Peak)
    # We take the maximum score as the primary threat, but average it slightly with other active threats
    if not scores:
        global_score = 12.5 # Baseline "quiet" activity
    else:
        peak = max(scores)
        avg = sum(scores) / len(scores)
        global_score = (peak * 0.8) + (avg * 0.2)

    # "Solar Flux" (SFU) Proxy - F10.7
    # Since we don't have a direct live API for F10.7 in DONKI, 
    # we simulate a realistic value based on active flares and CMEs.
    # Quiet sun is ~70 sfu. Active sun can go over 200 sfu.
    solar_flux_proxy = 70.0 + (global_score * 0.8) + (len(flare_list) * 2.0)
    
    return {
        "global_threat_level": round(min(100.0, global_score), 1),
        "solar_flux_sfu": round(solar_flux_proxy, 1),
        "max_cme_speed": max_cme_speed,
        "max_flare_class": max_flare_class,
        "max_kp_index": max_kp,
        "active_events_count": len(cme_list) + len(flare_list) + len(gst_list)
    }
