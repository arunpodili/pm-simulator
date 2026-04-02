# Security Hardening Plan - PM Simulator v2.0

**Created:** 2026-04-02
**Status:** IN PROGRESS
**Risk Level:** HIGH (before fixes) → MEDIUM (after fixes)

---

## Executive Summary

This document outlines all security vulnerabilities discovered in the PM Simulator v2.0 production architecture and provides step-by-step remediation procedures.

**Initial Security Score:** 4/10
**Target Security Score:** 8/10

---

## Critical Issues (Severity: CRITICAL)

### 1. Authentication Missing
**Risk:** Unauthorized access to all API endpoints, data theft, DoS attacks
**Affected Files:** `app_v2.py` (all endpoints)
**Remediation:**
```python
# Add to all protected endpoints:
@app.route('/api/simulation/create', methods=['POST'])
@require_auth  # NEW
@rate_limit    # NEW
def create_simulation():
    ...
```
**Implementation:** See `auth_middleware.py`
**Verification:** Test with curl - should return 401 without token

### 2. Race Condition in Streaming
**Risk:** Concurrent simulations interfere with each other, data corruption
**Affected Files:** `streaming.py:156`
**Remediation:** Replace global random with instance-based
**Implementation:** Fixed in `streaming.py`
**Verification:** Run 10 concurrent simulations, check outputs are independent

### 3. Redis No Password
**Risk:** Unauthorized Redis access, data theft, task injection
**Affected Files:** `tasks.py:22-23`
**Remediation:** Require password, use SSL
**Implementation:** Updated `tasks.py` + `.env.staging`
**Verification:** `redis-cli -a password ping` must succeed

### 4. API Key Exposure
**Risk:** LLM API keys exposed in logs, financial theft
**Affected Files:** `llm_router.py:229`
**Remediation:** Sanitize all error messages
**Implementation:** Fixed in `llm_router.py`
**Verification:** Check logs contain no API keys

---

## Major Issues (Severity: HIGH)

### 5. Memory Leak
**Risk:** Server crash after extended operation
**Affected Files:** `app_v2.py:42-44`
**Remediation:** Add TTL-based cleanup
**Implementation:** `cleanup.py` + scheduled tasks
**Verification:** Monitor memory usage over 24 hours

### 6. No Rate Limiting
**Risk:** DoS attacks, resource exhaustion
**Affected Files:** All endpoints in `app_v2.py`
**Remediation:** Add Flask-Limiter
**Implementation:** `rate_limiter.py`
**Verification:** 11th request should return 429

### 7. Celery Task Time Too Long
**Risk:** Resource exhaustion
**Affected Files:** `tasks.py:35`
**Remediation:** Reduce to 10 minutes
**Implementation:** Updated `tasks.py`
**Verification:** Tasks timeout after 600 seconds

### 8. Z-Score Division by Zero
**Risk:** Silent failures in validation
**Affected Files:** `validation.py`
**Remediation:** Add logging, handle gracefully
**Implementation:** Updated `validation.py`
**Verification:** Test with zero std_dev datasets

---

## Implementation Phases

### Phase 1: Critical Security (Day 1)
1. [x] Create authentication middleware
2. [x] Add JWT token validation
3. [x] Secure Redis configuration
4. [x] Sanitize error messages

### Phase 2: Infrastructure Hardening (Day 1-2)
1. [x] Implement rate limiting
2. [x] Fix race conditions
3. [x] Add memory cleanup
4. [x] Update Celery timeouts

### Phase 3: Staging Deployment (Day 2)
1. [x] Create Docker Compose staging config
2. [x] Generate secure environment files
3. [x] Add health checks
4. [x] Configure monitoring

### Phase 4: Testing & Verification (Day 3)
1. [ ] Security penetration testing
2. [ ] Load testing
3. [ ] Authentication testing
4. [ ] Failover testing

---

## Security Controls Matrix

| Control | Before | After | Verification |
|---------|--------|-------|--------------|
| Authentication | None | JWT | Unit test |
| Rate Limiting | None | 10 req/min | Integration test |
| Redis Auth | None | Password + SSL | Connection test |
| Error Sanitization | None | Full | Log review |
| Memory Cleanup | None | TTL 24h | Monitor |
| Race Conditions | Present | Fixed | Concurrent test |
| Input Validation | Basic | Strict | Fuzzing |
| Secrets Management | Env vars | Vault-ready | Audit |

---

## Deployment Checklist

### Pre-Deployment
- [ ] All critical issues fixed
- [ ] Security tests passing
- [ ] Environment variables configured
- [ ] Redis password set
- [ ] JWT secret generated
- [ ] Rate limits configured

### Deployment
- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Verify health endpoints
- [ ] Check logs for errors
- [ ] Test authentication flow
- [ ] Test rate limiting

### Post-Deployment
- [ ] Monitor for 24 hours
- [ ] Review security logs
- [ ] Check memory usage
- [ ] Verify cleanup jobs running
- [ ] Performance baseline

---

## Rollback Plan

If issues detected:
1. Revert to previous Docker image: `docker-compose down && docker-compose up -d previous`
2. Restore previous env: `cp .env.backup .env`
3. Verify health: `curl /api/health`
4. Notify team via Slack

---

## Security Contacts

- Security Lead: [TBD]
- On-Call: [TBD]
- Emergency: [TBD]

---

**Last Updated:** 2026-04-02
**Next Review:** 2026-04-09
