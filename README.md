# Layer Folders (After Effects 27)


Status: 0.1.0, not yet tested in After Effects. Use on a duplicated comp.
Dockable panel that fakes timeline layer folders using header Null layers (guide, comment `LF_HEADER`, name `▼ NAME` / `▶ NAME`).

## Install
Symlink (done by the build) lives at
`~/Library/Preferences/Adobe/After Effects/27.0/Scripts/ScriptUI Panels/Layer Folders.jsx`.
Restart AE, then Window > Layer Folders.
Manual: `ln -s "<this folder>/Layer Folders.jsx" "$HOME/Library/Preferences/Adobe/After Effects/27.0/Scripts/ScriptUI Panels/"`

## Use
Select layers > New folder from selection > name it. Pick a folder in the list, then Collapse/Expand, Select, Solo, Mute audio, Set label, Rename, Remove folder. Collapse/Expand all act on every folder. Collapse sets members shy and turns on the comp's Hide Shy Layers.
Folder = header + layers below it until the next header. Layers above the first header are unfiled.
