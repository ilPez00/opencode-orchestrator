# AGENT_MEMORY.md

## Current Task
Integrate physis-core as a neurosemantic PhysisAgent into opencode-orchestrator (Phase 1 complete)

## Last Completed Step
Phase 1 fully implemented: .mcp.json registration, AGENT_NAMES constant, physis-agent.ts definition, prompt fragments, definitions.ts/config-handler.ts registration, all existing tests updated for 5-agent architecture

## Next Exact Step
Phase 2: Add Commander/Planner prompt integration — mention physis-agent availability for neurosemantic analysis

## Incomplete Items
- Phase 2: Commander prompt integration (pending)
- Phase 3: Planner prompt integration (pending)
- Phase 4: Full test suite validation (Phase 1 tests updated but full suite not yet run)
- Physis-pro MCP: missing 14 tool registrations (graph_query, coherence_score, etc.) referenced in prompt fragments

## Key Decisions
- PhysisAgent is read-only (canWrite: false, canBash: false) — neurosemantic analysis only
- PhysisAgent is a hidden subagent (hidden: true, mode: "subagent")
- .mcp.json uses PHYSIS_CORE_PATH env var for portability
- Grid is 5 domains × 14 modes = 70 cells (verified in models.rs)

## Rejected Alternatives
- Passive RAG injection (rejected — ADR-0019 retirement)
- Making physis-agent a primary agent (rejected — it's a terminal analysis node)

## Known Risks
- 14 tool names in capabilities.ts/routing.ts/retrieval.ts don't yet exist in physis-pro MCP server — either remove from prompts or add to MCP
- Snapshot tests will need regeneration after physis-agent prompt changes
- TypeScript compilation not yet verified (no shell access for tsc)

## Files to Open First Next Session
1. src/agents/physis-agent.ts
2. src/agents/prompts/physis-agent/
3. src/plugin-handlers/config-handler.ts
4. tests/unit/agent-definition.test.ts
5. docs/PHYSIS_AGENT_INTEGRATION_PLAN.md
