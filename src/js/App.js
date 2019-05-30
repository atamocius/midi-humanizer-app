import './App.scss';

import { html } from 'lit-html';
import { observable } from 'mobx';
import { saveAs } from 'file-saver';
import Midi from '@tonejs/midi';
import DropZone from './components/DropZone';
import NumberField from './components/NumberField';
import RadioGroup from './components/RadioGroup';

const midi = observable.box(null);
let midiFilename = '';

const App = store =>
  html`
    <div class="app">
      ${DropZone({
        onDrop: (data, filename) => {
          midiFilename = filename;
          midi.set(new Midi(data));
        },
      })}

      <div class="app__section">
        <div class="app__header">Settings</div>

        <div class="app__settings">
          ${NumberField({
            id: 'timingVar',
            label: 'Timing (0ms - 200ms)',
            min: 0,
            max: 200,
            value: store.timingVariance,
            onChange: v => (store.timingVariance = v),
          })}
          ${NumberField({
            id: 'velVar',
            label: 'Velocity (0 - 127)',
            min: 0,
            max: 127,
            value: store.velocityVariance,
            onChange: v => (store.velocityVariance = v),
          })}
          ${NumberField({
            id: 'globalOffset',
            label: 'Global Offset (-200ms - 200ms)',
            min: -200,
            max: 200,
            value: store.globalOffset,
            onChange: v => (store.globalOffset = v),
          })}
        </div>

        <div class="app__header">Presets</div>

        <div class="app__header app__header--small">Timing</div>

        <div class="app__timing-presets">
          ${RadioGroup({
            id: 'timingPresetChoice',
            choices: store.timingPresetChoices,
            selected: store.timingPreset,
            onChange: (i, v) => {
              store.timingPreset = i;
              store.loadTimingPreset();
            },
          })}
        </div>

        <div class="app__header app__header--small">Velocity</div>

        <div class="app__velocity-presets">
          ${RadioGroup({
            id: 'velocityPresetChoice',
            choices: store.velocityPresetChoices,
            selected: store.velocityPreset,
            onChange: (i, v) => {
              store.velocityPreset = i;
              store.loadVelocityPreset();
            },
          })}
        </div>

        <div class="app__header app__header--small">Global Offset</div>

        <div class="app__global-offset-presets">
          ${RadioGroup({
            id: 'globalOffsetChoice',
            choices: store.globalOffsetChoices,
            selected: store.globalOffsetPreset,
            onChange: (i, v) => {
              store.globalOffsetPreset = i;
              store.loadGlobalOffsetPreset();
            },
          })}
        </div>

        <button
          class="app__apply-settings"
          @click=${() => {
            const loaded = midi.get();
            if (loaded) {
              const modifiedMidi = store.apply(loaded);
              const blob = new Blob([modifiedMidi.toArray()]);
              saveAs(blob, `humanized-${midiFilename}`);
            }
          }}
        >
          Humanize
        </button>
      </div>
    </div>
  `;

export default App;
