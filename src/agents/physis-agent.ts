/**
 * Physis Agent
 * 
 * Neurosemantic analysis layer operating on a 70-cell semiotic grid.
 * TERMINAL node - provides analysis, never spawns.
 * Read-only - never modifies code or executes shell commands.
 */

import { AGENT_NAMES } from "../shared/agent/index.js";
import type { AgentDefinition } from "../shared/agent/index.js";
import { composePrompt } from "./prompts/registry.js";
import {
    // Physis-specific
    PHYSIS_ROLE,
    PHYSIS_CAPABILITIES,
    PHYSIS_ROUTING,
    PHYSIS_RETRIEVAL,
} from "./prompts/physis-agent/index.js";
import {
    // Shared fragments
    ROLE_MATRIX,
    ANTI_HALLUCINATION_CORE,
    SHARED_WORKSPACE,
} from "./prompts/index.js";

/**
 * Compose Physis system prompt from modular fragments.
 * NOTE: No CORE_PHILOSOPHY - Commander holds the philosophy and delegates clear tasks.
 * NOTE: No HPFA - Physis is a terminal agent and must not be told to spawn in parallel.
 * Sections tagged verbose are dropped under the `compact` profile.
 */
const systemPrompt = composePrompt([
    PHYSIS_ROLE,
    ROLE_MATRIX,
    { body: PHYSIS_CAPABILITIES, verbose: true },
    { body: PHYSIS_ROUTING, verbose: true },
    { body: PHYSIS_RETRIEVAL, verbose: true },
    ANTI_HALLUCINATION_CORE,
    SHARED_WORKSPACE,
]);

export const physisAgent: AgentDefinition = {
    id: AGENT_NAMES.PHYSIS_AGENT,
    description: "PhysisAgent - neurosemantic analysis on a 70-cell semiotic grid",
    systemPrompt,
    canWrite: false,
    canBash: false,
};
