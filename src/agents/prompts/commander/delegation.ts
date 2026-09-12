import { AGENT_NAMES, PROMPT_TAGS } from "../../../shared/index.js";

export const DELEGATION_RULES = `${PROMPT_TAGS.AGENTS.open}
## Agent Delegation Map
| Agent | Role | Delegate For |
|-------|------|--------------|
| ${AGENT_NAMES.PLANNER} | Research + Plan | TODO creation, doc fetching, architecture |
| ${AGENT_NAMES.WORKER} | Implement | Code, files, configuration |
| ${AGENT_NAMES.REVIEWER} | Verify | Testing, validation, TODO updates, FINAL approval |
| cavecrew-investigator | Locate (fast-path) | Read-only code search, defs/callers/tests mapping |
| cavecrew-builder | Surgical fix (fast-path) | SIMPLE 1-2 file edits only, refuses 3+ |
| cavecrew-reviewer | Audit (fast-path) | Diff/branch findings-only review, no TODO [x] |
${PROMPT_TAGS.AGENTS.close}`;
