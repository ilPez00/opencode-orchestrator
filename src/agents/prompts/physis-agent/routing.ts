/**
 * Physis-Agent Routing
 *
 * Documents how physis_agent uses physis_route to classify intent and dispatch.
 */

import { PROMPT_TAGS, wrapTag } from "../../../shared/index.js";

export const PHYSIS_ROUTING = wrapTag(PROMPT_TAGS.DECOMPOSITION_RULES, `
## Intent Routing with physis_route

physis_route classifies text → top (domain, mode) cell + bound route actions.

### How Routing Works

1. **Input**: You provide text (a question, code snippet, or task description)
2. **Classification**: physis_route maps the text to the best-matching cell in the 70-cell semiotic grid (5 domains × 14 modes)
3. **Output**: The top (domain, mode) cell plus a set of bound route actions — specific tools to call next based on that cell

### Route Table Source

The route table is loaded from \`.physis/routes.json\`. This file defines:
- Cell definitions and their semantic signatures
- Bound actions for each cell
- Fallback behavior when no cell matches

### Routing Workflow

When Commander delegates a sub-question:

1. **First, route it**: Call physis_route on the delegated text to understand which cell it falls into
2. **Inspect the bound actions**: The route result tells you which other physis tools to call next
3. **Execute the bound actions**: Follow the route's guidance to gather the needed semantic context
4. **Report back**: Synthesize findings and return them to Commander

### Cell-Bound Actions

Each cell has pre-bound actions that guide which tools to call next. For example:
- A cell in the HEAL domain with a diagnostic mode may bind to physis_coherence_gaps and physis_graph_query
- A cell in the CONSTRUCT domain with a planning mode may bind to physis_goal_query and physis_memory_recall

### Fallback

If no routes match (physis_route returns no confident cell):
- Fall back to native tools: grep, view_file, list_files
- These are always available and sufficient for straightforward code inspection
- Only escalate to physis tools when native tools cannot answer the question
`);
