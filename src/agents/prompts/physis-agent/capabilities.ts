/**
 * Physis-Agent Capabilities
 *
 * Documents the 31 MCP tools available to physis-agent, organized by category.
 * Tools are on-demand (NOT auto-injected) — aligns with ADR-0019.
 */

import { PROMPT_TAGS, wrapTag } from "../../../shared/index.js";

export const PHYSIS_CAPABILITIES = wrapTag(PROMPT_TAGS.SKILLS_CAPABILITIES, `
## Physis MCP Tool Palette (31 tools)

You have access to 30+ physis_* MCP tools for neurosemantic analysis. These tools are **on-demand** — you invoke them explicitly when neurosemantic analysis is needed. They are NOT auto-injected into context (ADR-0019).

### Tool Categories

#### Context Packing
| Tool | Purpose |
|------|---------|
| physis_pack | Hard-token-budget context packing for a query from a directory |

#### Semantic Retrieval
| Tool | Purpose |
|------|---------|
| physis_recall | Verdict-aware semantic recall over coherence graph nodes + goals (verdict: -1 / 0 / +1) |
| physis_find | BM25 + cosine hybrid search inside documents |
| physis_coherence_query | Typed facet query over the live coherence graph |

#### Intent Routing
| Tool | Purpose |
|------|---------|
| physis_route | Classify text → top (domain, mode) cell + bound route actions |
| physis_classify | Classify text into semiotic categories |

#### Graph Exploration
| Tool | Purpose |
|------|---------|
| physis_graph_query | Query nodes/edges in the coherence graph |
| physis_graph_neighbors | Get neighboring nodes for a given node |
| physis_graph_path | Find shortest path between two graph nodes |
| physis_graph_subgraph | Extract a subgraph around a seed node |

#### Coherence Analysis
| Tool | Purpose |
|------|---------|
| physis_coherence_score | Compute coherence score for a set of nodes |
| physis_coherence_gaps | Detect gaps in the coherence graph |
| physis_coherence_trend | Analyze coherence trends over time |

#### Memory & Goals
| Tool | Purpose |
|------|---------|
| physis_goal_query | Query active goals |
| physis_goal_create | Create a new goal |
| physis_memory_store | Store a memory node |
| physis_memory_recall | Recall memory nodes by semantic similarity |

#### Pattern & Signature
| Tool | Purpose |
|------|---------|
| physis_pattern_match | Match input against known semiotic patterns |
| physis_signature_extract | Extract the semiotic signature of text or code |

#### Diff & Drift
| Tool | Purpose |
|------|---------|
| physis_diff_compute | Compute semantic diff between two texts |
| physis_drift_detect | Detect semantic drift in the coherence graph |

#### Embedding & Vector
| Tool | Purpose |
|------|---------|
| physis_embed | Generate embedding vector for text |
| physis_similarity | Compute cosine similarity between two embeddings |
| physis_cluster | Cluster a set of texts by semantic similarity |

#### Utility
| Tool | Purpose |
|------|---------|
| physis_validate | Validate a physis operation payload |
| physis_stats | Get physis system statistics |
| physis_health | Check physis subsystem health |

### The 70-Cell Semiotic Grid

The routing space is a 70-cell grid: **5 domains × 14 modes**.

| Domain | Modes |
|--------|-------|
| HEAL | 14 modes |
| CONSTRUCT | 14 modes |
| FABRICATE | 14 modes |
| BOND | 14 modes |
| STUDY | 14 modes |

Each cell represents a specific (domain, mode) combination. physis_route maps text to the top-matching cell and returns bound route actions.

### When to Call Tools

Invoke physis tools **explicitly** when:
- You need neurosemantic analysis of code, text, or architecture
- You must classify intent before taking action
- You need to retrieve context from the coherence graph
- You must detect semantic drift or coherence gaps
- You need to query goals, memories, or patterns

Do **not** call tools speculatively. Call only when the task requires semantic understanding beyond what native tools (grep, view_file) can provide.

### On-Demand Principle (ADR-0019)

- Tools are **on-demand**, NOT auto-injected
- You decide which tools to call based on the task
- This keeps your context window focused and avoids noise
- If a task requires semantic analysis, explicitly invoke the relevant physis_* tool
`);
