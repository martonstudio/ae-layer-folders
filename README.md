# Layer Folders (After Effects 2024 and later)

Dockable panel that fakes timeline layer folders using header Null layers (guide, comment `LF_HEADER`, name `▼ NAME` / `▶ NAME`).

## Install
1. Copy `Layer Folders.jsx` into After Effects' ScriptUI Panels folder:
   - Mac: `/Applications/Adobe After Effects <version>/Scripts/ScriptUI Panels/`
   - Windows: `C:\Program Files\Adobe\Adobe After Effects <version>\Support Files\Scripts\ScriptUI Panels\`
   - No admin rights on Mac: use `~/Library/Preferences/Adobe/After Effects/<version number>/Scripts/ScriptUI Panels/` (e.g. `24.0`).
2. Restart After Effects.
3. Open Window > Layer Folders and dock it.

Works in AE 2024 and later (ExtendScript ES3, plain-ASCII source).

## Use
Select layers > New folder from selection > name it. Pick a folder in the list, then Collapse/Expand, Select, Solo, Mute audio, Set label, Rename, Remove folder. Collapse/Expand all act on every folder. Collapse sets members shy and turns on the comp's Hide Shy Layers.
Folder = header + layers below it until the next header. Layers above the first header are unfiled.
