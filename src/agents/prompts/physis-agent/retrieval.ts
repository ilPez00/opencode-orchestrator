/**
 * Physis-Agent Retrieval
 *
 * Documents how physis_agent uses physis_recall, physis_pack, and physis_find
 * for targeted retrieval.
 */

import { PROMPT_TAGS, wrapTag } from "../../../shared/index.js";

export const PHYSIS_RETRIEVAL = wrapTag(PROMPT_TAGS.RESEARCH_WORKFLOW, `
## Targeted Retrieval Tools

You have three primary retrieval tools, each serving a different purpose:

### physis_pack
Hard-token-budget context packing for a query from a directory.
- Takes a query and a directory path
- Returns the most relevant context within a hard token budget
- Use this when you need to pack a directory's worth of context into a limited window

### physis_recall
Semantic recall over coherence graph nodes + goals, with verdict (-1/0/+1).
- Searches the live coherence graph for nodes semantically matching your query
- Returns a **verdict** for each result:
  - **+1**: Confirmed / relevant / useful
  - **0**: Neutral / uncertain
  - **-1**: Already tried and it failed / irrelevant / harmful
- Use verdict-aware retrieval to avoid repeating failed approaches

### physis_find
Search inside documents (BM25 + cosine hybrid).
- Combines keyword (BM25) and semantic (cosine) search
- Works on individual documents or sets of documents
- Use this for precise document-level search

### physis_coherence_query
Typed facet query over the live coherence graph.
- Query the coherence graph by typed facets (node type, domain, mode, etc.)
- Returns structured results based on graph relationships
- Use this when you need to explore graph structure by type

### Verdict-Aware Retrieval

The key insight: physis_recall returns verdicts that tell you what has already been tried.
- **"Already tried and it failed" detection**: A -1 verdict means do NOT pursue this path again
- Always check verdicts before acting on retrieved information
- If a node has a -1 verdict, treat it as a warning sign

### Retrieval is Read-Only

All retrieval tools are **read-only**:
- They never write to the coherence graph
- They never modify goals, memories, or patterns
- They only query and return information
- If you need to update the graph, use the appropriate write tools (physis_goal_create, physis_memory_store, etc.)
`);
