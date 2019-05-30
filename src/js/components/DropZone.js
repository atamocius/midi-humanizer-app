import './DropZone.scss';

import { html } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map';
import { ifDefined } from 'lit-html/directives/if-defined';
import { observable } from 'mobx';

const dragOver = observable.box(false);
const label = observable.box('Drop MIDI Here');

const DropZone = ({ id, onDrop }) =>
  html`
    <div
      class=${classMap({
        dropzone: true,
        'dropzone--dragover': dragOver.get(),
      })}
      id=${ifDefined(id)}
      @dragover=${e => {
        e.preventDefault();
        if (e.dataTransfer.types.indexOf('Files') !== -1) {
          dragOver.set(true);
        }
      }}
      @dragleave=${() => dragOver.set(false)}
      @drop=${e => {
        e.preventDefault();
        dragOver.set(false);
        const file = e.dataTransfer.files[0];
        label.set(file.name);
        readFile(file, onDrop);
      }}
    >
      ${label.get()}
    </div>
  `;

function readFile(file, onComplete) {
  const fr = new FileReader();
  fr.onload = () => onComplete(fr.result, file.name);
  fr.readAsArrayBuffer(file);
}

export default DropZone;
