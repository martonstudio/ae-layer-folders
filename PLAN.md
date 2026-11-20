# PLAN

Finish line: every item below passes in AE 27 on the user's machine.
- [ ] Panel appears under Window after AE restart and docks.
- [ ] New folder from selection inserts header above topmost and keeps relative order.
- [ ] Collapse/Expand per folder and all; other folders untouched; Hide Shy follows state.
- [ ] Select, Solo, Mute audio, Set label, Rename, Remove behave as in README.
- [ ] Locked layers are skipped with a count alert; Cmd+Z undoes each action in one step.
- [ ] Refresh-on-focus works; if not, rely on Refresh button.

Remaining steps
- User runs the checklist in AE and reports failures; fix those only.
- Bump VERSION and LF_VERSION in the .jsx together on every change.

Constraints
- ExtendScript ES3 only: no let/const, arrows, forEach/map/indexOf.
- Collapse/Expand overwrites members' own shy flags.
- Headers count as layers in index-based expressions (index - 1 etc.).
- Layer moves inside folders are tracked by position only.
- Do not use sudo; the /Applications panel folder is root-owned, use the user Scripts folder.
