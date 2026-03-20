def calculate_risk_score(diameter_m: float, velocity_kms: float, distance_ld: float, is_hazardous: bool) -> float:
    """
    OrbeSystems Proprietary Algorithm: Tactical Danger Rating.
    
    Factors:
    - Diameter: Larger asteroids increase risk exponentially.
    - Velocity: Faster objects carry more kinetic energy.
    - Distance: Proximity is the ultimate multiplier.
    - Hazard Flag: NASA's proprietary flag provides a baseline safety offset.
    """
    # Baseline from NASA's hazard flag
    score = 40.0 if is_hazardous else 5.0
    
    # 1. Size Factor (max 25 points) - Normalized against a 1km asteroid
    size_factor = min(25.0, (diameter_m / 1000.0) * 25.0)
    
    # 2. Velocity Factor (max 15 points) - Normalized against 30km/s
    velocity_factor = min(15.0, (velocity_kms / 30.0) * 15.0)
    
    # 3. Proximity Factor (max 20 points) - Drastically increases below 5 LD
    # LD = 1 is the moon distance. Anything < 1 is extreme danger.
    if distance_ld < 5.0:
        proximity_factor = 20.0 * (1.0 - (distance_ld / 10.0))
    else:
        proximity_factor = max(0, 5.0 * (1.0 - (distance_ld / 50.0)))
        
    score += size_factor + velocity_factor + proximity_factor
    
    # Clamp to 100.0
    return round(min(100.0, score), 1)
