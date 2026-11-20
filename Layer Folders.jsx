// Layer Folders - dockable panel that fakes timeline layer folders with header null layers.
// Header: guide null, comment LF_HEADER, name "\u25BC NAME" (open) / "\u25B6 NAME" (collapsed).
// Members: all layers below a header down to the next header. ExtendScript (ES3).
(function (thisObj) {
    var LF_VERSION = "0.1.1"; // must match VERSION file
    var TAG = "LF_HEADER";
    var OPEN = "\u25BC ", CLOSED = "\u25B6 ";
    var LABELS = ["0 None", "1 Red", "2 Yellow", "3 Aqua", "4 Pink", "5 Lavender", "6 Peach", "7 Sea Foam",
        "8 Blue", "9 Green", "10 Purple", "11 Orange", "12 Brown", "13 Fuchsia", "14 Cyan", "15 Sandstone", "16 Dark Green"];

    function versionText() { return "Layer Folders v" + LF_VERSION; }

    var ui = {}; // list, labelDd
    var folderRefs = []; // {layer, name} per list row

    function activeComp(silent) {
        var c = app.project ? app.project.activeItem : null;
        if (c instanceof CompItem) { return c; }
        if (!silent) { alert("Layer Folders: no active composition.\nOpen a comp and click its timeline first."); }
        return null;
    }
    function isHeader(l) {
        var c = "";
        try { c = l.comment; } catch (e) {}
        if (c === TAG) { return true; }
        var ch = l.name.charAt(0);
        return ch === "\u25BC" || ch === "\u25B6";
    }
    function isCollapsed(h) { return h.name.charAt(0) === "\u25B6"; }
    function baseName(h) { return h.name.replace(/^[\u25BC\u25B6]\s*/, ""); }
    function setState(h, collapsed) { h.name = (collapsed ? CLOSED : OPEN) + baseName(h); }

    function headers(comp) {
        var out = [], i;
        for (i = 1; i <= comp.numLayers; i++) { if (isHeader(comp.layer(i))) { out.push(comp.layer(i)); } }
        return out;
    }
    function members(comp, h) {
        var out = [], i;
        for (i = h.index + 1; i <= comp.numLayers; i++) {
            if (isHeader(comp.layer(i))) { break; }
            out.push(comp.layer(i));
        }
        return out;
    }
    // Set prop on layers; locked layers are skipped. Returns skipped count.
    function setAll(layers, prop, val) {
        var skipped = 0, i;
        for (i = 0; i < layers.length; i++) {
            if (layers[i].locked) { skipped++; continue; }
            try { layers[i][prop] = val; } catch (e) { skipped++; }
        }
        return skipped;
    }
    function syncHideShy(comp) {
        var hs = headers(comp), any = false, i;
        for (i = 0; i < hs.length; i++) { if (isCollapsed(hs[i])) { any = true; break; } }
        comp.hideShyLayers = any;
    }
    function report(skipped) {
        if (skipped > 0) { alert("Layer Folders: " + skipped + " locked layer(s) skipped."); }
    }

    function refresh() {
        folderRefs = [];
        ui.list.removeAll();
        var comp = activeComp(true);
        if (!comp) { return; }
        var hs = headers(comp), i, it;
        for (i = 0; i < hs.length; i++) {
            it = ui.list.add("item", hs[i].name + "  (" + members(comp, hs[i]).length + ")");
            folderRefs.push({ layer: hs[i], name: hs[i].name });
        }
    }
    // Run an undoable action. fn(comp) returns skipped count (optional).
    function run(label, fn) {
        var comp = activeComp(false);
        if (!comp) { return; }
        var skipped = 0;
        app.beginUndoGroup("Layer Folders: " + label);
        try { skipped = fn(comp) || 0; } catch (e) { alert("Layer Folders error (" + label + "): " + e.toString()); }
        app.endUndoGroup();
        refresh();
        report(skipped);
    }
    // Resolve the selected list row to a live header layer; null if stale.
    function selectedHeader(comp) {
        var s = ui.list.selection;
        if (!s) { alert("Layer Folders: select a folder in the list first."); return null; }
        var ref = folderRefs[s.index], h = ref.layer;
        try {
            if (h.containingComp === comp && h.name === ref.name && isHeader(h)) { return h; }
        } catch (e) {}
        refresh();
        alert("Layer Folders: the list was out of date and has been refreshed. Select the folder again.");
        return null;
    }
    function withFolder(label, fn) {
        run(label, function (comp) {
            var h = selectedHeader(comp);
            return h ? fn(comp, h) : 0;
        });
    }

    function collapse(comp, h, c) {
        var skipped = setAll(members(comp, h), "shy", c);
        setState(h, c);
        syncHideShy(comp);
        return skipped;
    }
    function allFolders(c) {
        run(c ? "Collapse all" : "Expand all", function (comp) {
            var hs = headers(comp), i, sk = 0;
            for (i = 0; i < hs.length; i++) { sk += collapse(comp, hs[i], c); }
            return sk;
        });
    }
    // true if every candidate already has prop === true
    function allOn(layers, prop) {
        var i, n = 0;
        for (i = 0; i < layers.length; i++) {
            if (layers[i].locked) { continue; }
            n++;
            if (!layers[i][prop]) { return false; }
        }
        return n > 0;
    }

    function newFolder() {
        var comp = activeComp(false);
        if (!comp) { return; }
        var sel = [], i, j, t, raw = comp.selectedLayers;
        for (i = 0; i < raw.length; i++) { if (!isHeader(raw[i])) { sel.push(raw[i]); } }
        if (sel.length === 0) { alert("Layer Folders: select one or more (non-header) layers first."); return; }
        var name = prompt("Folder name:", "New Folder");
        if (name === null || name.replace(/\s/g, "") === "") { return; }
        for (i = 0; i < sel.length; i++) { // sort by index ascending
            for (j = i + 1; j < sel.length; j++) {
                if (sel[j].index < sel[i].index) { t = sel[i]; sel[i] = sel[j]; sel[j] = t; }
            }
        }
        var skipped = 0;
        app.beginUndoGroup("Layer Folders: New folder");
        try {
            var h = comp.layers.addNull(comp.duration);
            h.guideLayer = true;
            h.shy = false;
            h.comment = TAG;
            h.name = OPEN + name;
            h.moveBefore(sel[0]);
            var prev = sel[0];
            for (i = 1; i < sel.length; i++) {
                if (sel[i].locked) { skipped++; continue; }
                sel[i].moveAfter(prev);
                prev = sel[i];
            }
        } catch (e) { alert("Layer Folders error (New folder): " + e.toString()); }
        app.endUndoGroup();
        refresh();
        report(skipped);
    }

    function buildUI(pnl) {
        pnl.orientation = "column";
        pnl.alignChildren = ["fill", "top"];
        pnl.spacing = 6;
        pnl.margins = 8;
        var title = pnl.add("statictext", undefined, versionText());
        var top = pnl.add("group");
        top.orientation = "row";
        var bNew = top.add("button", undefined, "New folder from selection");
        var bRef = top.add("button", undefined, "Refresh");
        var all = pnl.add("group");
        var bCol = all.add("button", undefined, "Collapse all");
        var bExp = all.add("button", undefined, "Expand all");
        ui.list = pnl.add("listbox", undefined, [], { multiselect: false });
        ui.list.preferredSize = [220, 140];
        ui.list.alignment = ["fill", "fill"];
        var r1 = pnl.add("group");
        var bTog = r1.add("button", undefined, "Collapse/Expand");
        var bSel = r1.add("button", undefined, "Select");
        var r2 = pnl.add("group");
        var bSolo = r2.add("button", undefined, "Solo");
        var bMute = r2.add("button", undefined, "Mute audio");
        var r3 = pnl.add("group");
        ui.labelDd = r3.add("dropdownlist", undefined, LABELS);
        ui.labelDd.selection = 0;
        var bLab = r3.add("button", undefined, "Set label");
        var r4 = pnl.add("group");
        var bRen = r4.add("button", undefined, "Rename");
        var bDel = r4.add("button", undefined, "Remove folder");

        bNew.onClick = newFolder;
        bRef.onClick = refresh;
        bCol.onClick = function () { allFolders(true); };
        bExp.onClick = function () { allFolders(false); };
        bTog.onClick = function () {
            withFolder("Toggle folder", function (comp, h) { return collapse(comp, h, !isCollapsed(h)); });
        };
        bSel.onClick = function () {
            withFolder("Select members", function (comp, h) {
                var m = members(comp, h), i, cur = comp.selectedLayers;
                for (i = 0; i < cur.length; i++) { cur[i].selected = false; }
                for (i = 0; i < m.length; i++) { m[i].selected = true; }
                return 0;
            });
        };
        bSolo.onClick = function () {
            withFolder("Solo", function (comp, h) {
                var m = members(comp, h);
                return setAll(m, "solo", !allOn(m, "solo"));
            });
        };
        bMute.onClick = function () {
            withFolder("Mute audio", function (comp, h) {
                var m = members(comp, h), a = [], i, audible = false;
                for (i = 0; i < m.length; i++) {
                    if (m[i].hasAudio === true) { a.push(m[i]); if (m[i].audioEnabled) { audible = true; } }
                }
                return setAll(a, "audioEnabled", !audible); // any audible -> mute all; none audible -> unmute all
            });
        };
        bLab.onClick = function () {
            withFolder("Label colour", function (comp, h) {
                var idx = ui.labelDd.selection.index;
                return setAll(members(comp, h).concat([h]), "label", idx);
            });
        };
        bRen.onClick = function () {
            withFolder("Rename folder", function (comp, h) {
                var n = prompt("New folder name:", baseName(h));
                if (n === null || n.replace(/\s/g, "") === "") { return 0; }
                h.name = (isCollapsed(h) ? CLOSED : OPEN) + n;
                return 0;
            });
        };
        bDel.onClick = function () {
            withFolder("Remove folder", function (comp, h) {
                var sk = 0;
                if (isCollapsed(h)) { sk = setAll(members(comp, h), "shy", false); }
                if (h.locked) { h.locked = false; }
                h.remove();
                syncHideShy(comp);
                return sk;
            });
        };
        try { pnl.addEventListener("focus", refresh); } catch (e) {}
        pnl.onResizing = pnl.onResize = function () { this.layout.resize(); };
        refresh();
        if (pnl instanceof Window) { pnl.center(); pnl.show(); } else { pnl.layout.layout(true); }
        return pnl;
    }

    buildUI(thisObj instanceof Panel ? thisObj : new Window("palette", versionText(), undefined, { resizeable: true }));
})(this);
