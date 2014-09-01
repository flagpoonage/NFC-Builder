﻿interface NFCControlOptions {   
    container: HTMLElement;
    workspace: NFC.Workspace;
}

module NFC {
    export class Controls {
        container: HTMLElement;
        workspace: NFC.Workspace;
        el: HTMLElement;
        navigate: HTMLAnchorElement;
        walls: HTMLAnchorElement;
        mode: string;
        constructor(options?: NFCControlOptions) {
            this.container = options.container;
            this.workspace = options.workspace;

            this.workspace._addControls(this);
        }

        generateControls() {
            this.el = document.createElement('div');
            this.el.setAttribute('class', 'workspace-controls');

            this.navigate = document.createElement('a');
            this.navigate.setAttribute('class', 'workspace-control');
            this.navigate.innerHTML = 'Navigate';

            var self = this;
            this.navigate.addEventListener('click', function (ev) {
                var m = 'navigate';
                if (self.mode !== m) {
                    self.changeMode(m);
                    self.workspace.changeMode(self.mode);
                }
            });

            this.walls = document.createElement('a');
            this.walls.setAttribute('class', 'workspace-control');
            this.walls.innerHTML = 'Walls';

            this.walls.addEventListener('click', function (ev) {
                var m = 'walls';
                if (self.mode !== m) {
                    self.changeMode(m);
                    self.workspace.changeMode(self.mode);
                }
            });

            this.el.appendChild(this.navigate);
            this.el.appendChild(this.walls);

            this.container.appendChild(this.el);
        }

        changeMode(mode: string) {
            NFC.Utility.RemoveClass(this[this.mode], 'selected');
            NFC.Utility.AddClass(this[mode], 'selected');    
            this.mode = mode;        
        }

        initializeMode(mode: string) {
            this.mode = mode;
            NFC.Utility.AddClass(this[mode], 'selected');
            this.workspace.changeMode(mode);
        }
    }
} 