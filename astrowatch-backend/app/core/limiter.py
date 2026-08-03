from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Global Limiter instance using in-memory state.
# NOTE: According to ORBE_ARCHITECTURE_PROTOCOL.md, Phase 3 will replace get_remote_address 
# and the in-memory storage with a Redis-backed storage for horizontal scalability.
limiter = Limiter(key_func=get_remote_address)
