/// <reference path="nfc/nfc.utility.ts" />
/// <reference path="nfc/nfc.workspace.ts" />
/// <reference path="nfc/nfc.map.ts" />
/// <reference path="nfc/nfc.controls.container.ts" />
/// <reference path="nfc/nfc.controls.modes.ts" />

(() => {
    window['workspace'] = new NFC.Workspace('drawing');

    window['workspaceMap'] = new NFC.WorkspaceMap({
        container: document.getElementById('workspace'),
        workspace: window['workspace']
    });

    window['workspaceControls'] = new NFC.Controls.Container({
        container: document.getElementById('workspace'),
        workspace: window['workspace']
    });

    var rszFn = function () {
        var d = document.getElementById('workspace');
        var h = window.innerHeight;

        d.style.height = h + 'px';
    };

    window.addEventListener('resize', rszFn);

    rszFn();
}).call(this); 