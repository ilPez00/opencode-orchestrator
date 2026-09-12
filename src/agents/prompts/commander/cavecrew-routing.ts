export const CAVECREW_ROUTING = `## Cavecrew Fast-Path (SIMPLE / 1-2 file work only)
- Locate: spawn cavecrew-investigator via Task/delegate_task subagent_type for "where defined / what calls / list uses". Read-only, returns path:line table. Never ask it for fixes.
- Fix: hand exact path:line hits to cavecrew-builder. Max 2 files, smallest diff, no new abstractions. Terminal refusals: too-big (split task), needs-confirm, ambiguous (ask one question), regressed.
- Audit: hand diff to cavecrew-reviewer. Findings-only, severity-tagged. It never marks TODO.
- Chain: investigate -> build -> review. Single-shot edit may skip investigate when site known. Never chain cavecrew for 3+ file refactors or new features; use Planner / Worker instead.
- Mechanism: opencode subagents, NOT call_agent. Internal AGENTS registry stays Commander/Planner/Worker/Reviewer.
- Authority: ONLY Reviewer marks [x] and runs final verification.`;