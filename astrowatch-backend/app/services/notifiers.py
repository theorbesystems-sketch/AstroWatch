import httpx
import os
from datetime import datetime

WEBHOOK_URL = os.getenv("ALERTS_WEBHOOK_URL")

async def dispatch_alert(event_title: str, message: str, severity: str = "INFO"):
    """
    Dispatches a tactical notification to the external OrbeSystems endpoint.
    """
    if not WEBHOOK_URL:
        # Silently skip if no webhook is configured
        return
        
    payload = {
        "platform": "AstroWatch",
        "timestamp": datetime.utcnow().isoformat(),
        "severity": severity,
        "title": f"TACTICAL ALERT: {event_title}",
        "message": message
    }
    
    try:
        async with httpx.AsyncClient() as client:
            await client.post(WEBHOOK_URL, json=payload, timeout=5.0)
    except Exception as e:
        print(f"Failed to dispatch tactical alert: {e}")

async def check_and_notify_neo(asteroid_name: str, score: float):
    """
    Automated check: If risk score exceeds 85, trigger critical webhook.
    """
    if score >= 85.0:
        await dispatch_alert(
            event_title="HIGH RISK ASTEROID DETECTED",
            message=f"Object {asteroid_name} reached an OrbeSystems Risk Score of {score}. Immediate orbital tracking recommended.",
            severity="CRITICAL"
        )

async def check_and_notify_cme(activity_id: str):
    """
    Notification for new solar events.
    """
    await dispatch_alert(
        event_title="SOLAR ANOMALY (CME)",
        message=f"Coronal Mass Ejection detected: {activity_id}. Assessing grid impact.",
        severity="WARNING"
    )
