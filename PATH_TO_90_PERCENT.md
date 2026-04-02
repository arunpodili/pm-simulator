# 🎯 Path to 90% Test Coverage

## Current Status vs Target

| Component | Current | Target | Gap | Tests Needed |
|-----------|---------|--------|-----|--------------|
| Authentication | 85% | 90% | +5% | ~3 tests |
| Rate Limiter | 75% | 90% | +15% | ~5 tests |
| Cleanup Manager | 80% | 90% | +10% | ~4 tests |
| API Integration | 60% | 90% | +30% | ~15 tests |
| **NEW** Streaming | 0% | 90% | +90% | ~12 tests |
| **NEW** Database | 0% | 90% | +90% | ~10 tests |
| **NEW** LLM Router | 0% | 90% | +90% | ~15 tests |
| **NEW** Simulation Engine | 0% | 90% | +90% | ~15 tests |

**Total New Tests Needed: ~79**

---

## 📝 What I Need From You

### 1. Database Configuration (For Database Tests)
```
NEED:
- PostgreSQL test database URL
- Or: Permission to create local test DB
- Or: Use SQLite for tests? (simpler but not identical)

Example:
TEST_DATABASE_URL=postgresql://test:test@localhost:5432/pm_test
```

### 2. LLM API Keys (For LLM Router Tests - Optional)
```
NEED:
- Anthropic API key (for Claude tests)
- Gemini API key (for Gemini tests)
- Or: Use mocks? (recommended for unit tests)

RECOMMENDATION: Use mocks to avoid API costs during tests
```

### 3. Redis Configuration (For Integration Tests)
```
NEED:
- Redis instance for testing
- Or: Mock Redis? (simpler but less realistic)

RECOMMENDATION: Use redis-server locally or Docker
```

### 4. Test Data (For Simulation Engine Tests)
```
NEED:
- Sample simulation configurations
- Expected simulation results
- Or: I can generate mock data

RECOMMENDATION: I'll create realistic mock data
```

---

## 🚀 My Recommendation: Phased Approach

### Phase 1: Unit Tests (No External Dependencies) - Target 85%
**Can do immediately - no input needed:**
- [ ] Streaming module tests (async patterns)
- [ ] LLM router tests (with mocks)
- [ ] Simulation engine tests (with mocks)
- [ ] Field mapper tests (NLP patterns)
- [ ] Edge cases for existing tests

**Time:** 2-3 hours
**Coverage:** 60% → 85%

### Phase 2: Integration Tests (Minimal Dependencies) - Target 90%
**Need simple setup:**
- [ ] Database tests (SQLite acceptable?)
- [ ] Redis tests (mock acceptable?)
- [ ] API flow tests
- [ ] E2E workflow tests

**Time:** 2-3 hours
**Coverage:** 85% → 90%

### Phase 3: Full Integration (Production-like) - Target 95%
**Need your environment:**
- [ ] Real PostgreSQL tests
- [ ] Real Redis tests
- [ ] Load tests
- [ ] Performance benchmarks

**Time:** 4-6 hours
**Coverage:** 90% → 95%

---

## ❓ Quick Questions

Please answer these so I can proceed efficiently:

### Question 1: Database for Tests
**A)** Use SQLite (simpler, no setup, 95% compatible)  
**B)** Use PostgreSQL (exact production match, requires setup)  
**C)** Use both (SQLite for quick tests, PostgreSQL for integration)

### Question 2: External Services
**A)** Mock everything (fast, no costs, 90% coverage possible)  
**B)** Test with real APIs (slower, costs money, more realistic)  
**C)** Hybrid (mock unit tests, real integration tests)

### Question 3: Test Priority
**A)** Focus on critical paths (auth, security, core API) - get to 90% fast  
**B)** Comprehensive coverage (all modules to 90%) - takes longer  
**C)** Prioritize by risk (security > business logic > edge cases)

### Question 4: CI/CD Integration
**A)** Create GitHub Actions workflow  
**B)** Create simple test runner script  
**C)** Just write tests, CI comes later

---

## 📊 Estimated Effort

| Approach | Time | Coverage | Your Involvement |
|----------|------|----------|------------------|
| **Minimal** (Phase 1 only) | 2-3 hrs | 85% | None |
| **Standard** (Phase 1+2) | 4-6 hrs | 90% | 15 min setup |
| **Complete** (All phases) | 8-12 hrs | 95% | 1 hour setup |

---

## 🎯 My Suggestion

**Go with Option A (Minimal) + Option 2 (Mock) + Option 1 (Critical Paths)**

This gets you to **85% coverage in 2-3 hours** with:
- Full security/auth coverage
- Core business logic tested
- No external dependencies
- Fast test execution

**Then** we can add integration tests later if needed.

---

**Please reply with your answers (e.g., "1A, 2A, 3A, 4B") and I'll start immediately.**
