import './NumberField.scss';

import { html } from 'lit-html';

const NumberField = ({ id, label, min, max, step, value, onChange }) =>
  html`
    <div class="number-field">
      <input
        class="number-field__input"
        id=${id}
        name=${id}
        type="number"
        min=${min}
        max=${max}
        step=${step}
        value=${value}
        @change=${e => onChange(e.target.value)}
      />
      <label class="number-field__label" for=${id}>${label}</label>
    </div>
  `;

export default NumberField;
