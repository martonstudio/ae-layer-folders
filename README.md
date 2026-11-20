# Layer Folders (After Effects 2024 and later)


Status: 0.1.1, not yet tested in After Effects. Use on a duplicated comp.
Dockable panel that fakes timeline layer folders using header Null layers (guide, comment `LF_HEADER`, name `▼ NAME` / `▶ NAME`).

## Install
Put `Layer Folders.jsx` (or a symlink to it) in the user ScriptUI Panels folder of each AE version, e.g. `~/Library/Preferences/Adobe/After Effects/<version>/Scripts/ScriptUI Panels/` (`24.0` for AE 2024, `25.x` for 2025, `26.x` for 2026, `27.0` for 2027). Restart AE, then Window > Layer Folders.
`ln -s "<this folder>/Layer Folders.jsx" "$HOME/Library/Preferences/Adobe/After Effects/<version>/Scripts/ScriptUI Panels/"`

Uses only ExtendScript ES3 and layer APIs that predate AE 2024 (shy, guide layer, label, comment, moveBefore). Folder symbols are written as `\u25BC`/`\u25B6` escapes so the file is plain ASCII and reads the same whatever encoding AE assumes.

## Use
Select layers > New folder from selection > name it. Pick a folder in the list, then Collapse/Expand, Select, Solo, Mute audio, Set label, Rename, Remove folder. Collapse/Expand all act on every folder. Collapse sets members shy and turns on the comp's Hide Shy Layers.
Folder = header + layers below it until the next header. Layers above the first header are unfiled.
