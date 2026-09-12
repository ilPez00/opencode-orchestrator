# ADR-0020: Physis-Agent Integration Plan

**Date:** 2026-09-12
**Status:** Phase 1 Implemented — Phase 2-4 Proposed
**Authors:** Orchestrator Team
**Related:** ADR-0019 (Retire In-Memory Knowledge RAG Subsystem)

---

## Purpose

This document defines the plan for integrating `physis-core` as a neurosemantic agent (`physis-agent`) into the opencode-orchestrator 5-agent architecture (Commander → Planner → Worker → Reviewer).

`physis-core` provides a neurosemantic layer of 30+ MCP tools grounded in a 70-cell semiotic grid, including:

- `physis_pack` — hard-token-budget context packing
- `physis_recall` — verdict-aware retrieval over the coherence graph
- `physis_route` — 70-cell semiotic grid routing for intent classification
- `physis_classify`, `physis_find`, `physis_coherence_query`,
  `physis_goals_*`, `physis_pdca_*`, `physis_dream_generate`

Unlike the retired passive RAG subsystem (ADR-0019), these tools are
**explicitly invoked** — they are available in the agent's tool palette but are
only called when the agent requests them, preserving ADR-0019's principle of
on-demand retrieval.

---

## Background

### The Orchestrator Architecture (v2)

| Agent       | Role                        | Mode    | Can Write | Can Bash |
|-------------|-----------------------------|---------|-----------|----------|
| Commander   | Master orchestrator         | primary | -         | -        |
| Planner     | Planning + research         | subagent| true      | true     |
| Worker      | Implementation + docs       | subagent| true      | true     |
| Reviewer    | Verification + quality gate | subagent| false     | false    |
| PhysisAgent | Neurosemantic analysis      | subagent| false     | false    |
Agents are registered in `src/agents/definitions.ts` via the `AGENTS` map, using
`AGENT_NAMES` constants from `src/shared/agent/constants.ts`. Each agent's
system prompt is composed from modular fragments in `src/agents/prompts/`.

### Physis-Core Architecture

- **PhysisCore** — main entrypoint, manages CellClassifier + QualityTracker +
  DeltaEngine + CoherenceGraph lifecycle
- **70-cell neurological grid** — semiotic routing grid (5 domains (HEAL, CONSTRUCT, FABRICATE, BOND, STUDY) × 14 modes)
- **Ontology loader** — loads from `.physis/ontology.json`
- **Delta engine** — change detection over scanned code
- **MCP server** — 30+ tools exposed via stdio protocol

### ADR-0019 Alignment

ADR-0019 retired passive RAG because automatic prompt injection caused context
pollution. The physis-agent approach is fully aligned: physis tools live in the
MCP tool palette and are invoked **only when explicitly requested** by the agent,
not auto-injected into system prompts.

---

## Integration Phases

### Phase 1: Infrastructure & Agent Registration

**Goal:** Register physis-agent as a subagent with MCP tool access.

#### Tasks:

1. **Add `.mcp.json` to project root** — registers the physis MCP server:
   ```json
   {
     "mcpServers": {
       "physis": {
         "command": "bash",
         "args": ["-c", "cd /home/gio/dev/physis-pro && PHYSIS_SCAN_ROOT=. PHYSIS_DATA_DIR=.physis cargo run --features mcp --bin physis-pro -- serve --stdio"],
         "env": {
           "PHYSIS_SCAN_ROOT": ".",
           "PHYSIS_DATA_DIR": ".physis"
         }
       }
     }
   }
   ```
   > **Note:** The path `/home/gio/dev/physis-pro` must be adapted per
   > deployment. Consider using a path resolution strategy or environment
   > variable for portability.

2. **Add `PHYSIS_AGENT` to `AGENT_NAMES`**:
   - File: `src/shared/agent/constants.ts`
   - Add: `PHYSIS_AGENT: "PhysisAgent"`

3. **Create `agents/physis-agent.ts`** — agent definition following the
   pattern of `planner.ts`, `worker.ts`, `reviewer.ts`:
   - System prompt: physis-specialized role + neurosemantic tool guidance
   - `canWrite: false` (read-only neurosemantic layer)
   - `canBash: false` (no direct shell access)

4. **Register in `definitions.ts`** — add `PhysisAgent` to the `AGENTS` map.

5. **Register in `config-handler.ts`** — add physis-agent to
   `orchestratorAgents` with `mode: "subagent"`, `hidden: true`.

#### Files to modify:
- `src/shared/agent/constants.ts` (add constant)
- `src/agents/definitions.ts` (register agent)
- `src/plugin-handlers/config-handler.ts` (add registration block)
- `.mcp.json` (new file)
- `src/agents/physis-agent.ts` (new file — agent definition)
- `src/agents/prompts/physis-agent/` (new — prompt fragments)

### Phase 2: Prompt Composition & Tool Guidance

**Goal:** Create the physis-agent system prompt with neurosemantic guidance.

#### Tasks:

1. **Create prompt fragments** in `src/agents/prompts/physis-agent/`:
   - `role.ts` — physis-agent role definition
   - `capabilities.ts` — available MCP tools and their use cases
   - `routing.ts` — how to classify tasks via `physis_route`
   - `retrieval.ts` — when and how to use `physis_recall` / `physis_coherence_query`

2. **Compose the system prompt** in `agents/physis-agent.ts` using the existing
   `composePrompt()` registry pattern.

3. **Integrate shared fragments** — reuse `ROLE_MATRIX`,
   `ANTI_HALLUCINATION_CORE`, `SHARED_WORKSPACE` from shared prompts.

#### Files to create:
- `src/agents/prompts/physis-agent/index.ts`
- `src/agents/prompts/physis-agent/role.ts`
- `src/agents/prompts/physis-agent/capabilities.ts`
- `src/agents/prompts/physis-agent/routing.ts`
- `src/agents/prompts/physis-agent/retrieval.ts`

### Phase 3: Commander Integration & Delegation

**Goal:** Enable Commander to delegate to physis-agent for neurosemantic tasks.

#### Tasks:

1. **Update Commander system prompt** to mention physis-agent as available
   for neurosemantic analysis (context packing, coherence queries, intent
   routing).

2. **Update Planner subagent prompt** to suggest physis-agent calls when
   repository-wide semantic understanding is needed.

3. **Document dispatch patterns** — when Commander should spawn physis-agent
   vs. handling inline.

#### Files to modify:
- `src/agents/prompts/commander/` (add physis mention)
- `src/agents/prompts/planner/` (add neurosemantic suggestion)

### Phase 4: Validation & Tests

**Goal:** Verify the integration works end-to-end.

#### Tasks:

1. **TypeScript compilation check** — `tsc --noEmit`
2. **Agent registration test** — verify PHYSIS_AGENT appears in config output
3. **MCP connection test** — verify physis tools are available in tool palette
4. **Prompt composition test** — verify physis-agent system prompt renders correctly

#### Files to create:
- `tests/unit/physis-agent-registration.test.ts`
- `tests/unit/physis-agent-prompt.test.ts`

---

## Architectural Considerations

### Tool Palette Approach

Physis tools are available via the MCP server in the tool palette. The agent
calls them explicitly — no automatic injection. This directly satisfies
ADR-0019's core principle.

### Read-Only Design

Physis-agent is configured as `canWrite: false, canBash: false` because it
operates as a neurosemantic analysis layer, not as an execution agent. It
provides insights, retrievals, and routing decisions to Commander/Planner.

### Hidden Subagent

Like Planner, Worker, and Reviewer, physis-agent is `hidden: true` in the
config — it's spawned internally by Commander, not invoked directly by the user.

### Portability

The `.mcp.json` MCP server path should be made portable. Options:
1. Environment variable `PHYSIS_CORE_PATH`
2. Relative path resolved from workspace root
3. Configurable in plugin options

### Layering

```
Commander (primary)
├── Planner (subagent)
├── Worker (subagent)
├── Reviewer (subagent)
└── PhysisAgent (subagent)  ← NEW
     ├── PhysisCore (Rust crate)
     ├── 70-cell grid
     ├── CoherenceGraph
     └── MCP tools (30+)
```

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| MCP server fails to start | Graceful degradation — agent falls back to native tools |
| physis-core path is wrong | Environment variable + documented defaults |
| Tool palette bloat (30+ tools) | Agent prompt guides selective use; hidden by default |
| Cargo build overhead | physis-pro MCP server runs as a separate stdio process |
| Schema conflicts with existing agents | physis-agent is additive — no existing agent modified |

---

## Rollback Plan

If integration must be reverted:
1. Remove PHYSIS_AGENT from `agent/constants.ts`
2. Remove physis-agent block from `config-handler.ts`
3. Delete `agents/physis-agent.ts` and `prompts/physis-agent/`
4. Remove `.mcp.json`
5. Revert Commander/Planner prompt changes

No existing agents are modified — the change is purely additive.

---

## Acceptance Criteria


### Phase 1 (Implemented)
- [x] physis-agent registered as a hidden subagent
- [x] MCP server configured via `.mcp.json`
- [x] physis-agent system prompt composed from modular fragments
- [x] TypeScript compiles cleanly
- [x] physis tools appear in the tool palette at runtime
- [x] Existing 5-agent test suite remains green (no regressions)

### Phase 2-4 (Proposed)
- [ ] Commander prompt integration — mention physis-agent availability
- [ ] Planner prompt integration — suggest physis-agent calls
- [ ] Full test suite validation (Phase 1 tests updated, full suite pending)
