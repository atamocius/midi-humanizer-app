import './RadioGroup.scss';

import { html } from 'lit-html';

const Choice = ({ index, id, checked, onChange, label, value }) =>
  html`
    <div class="radio-group__choice">
      <input
        class="radio-group__choice-input"
        id=${`${id}-${index}`}
        name=${id}
        type="radio"
        value=${value}
        ?checked=${checked}
        @change=${e => onChange(index, e.target.value)}
      />
      <label class="radio-group__choice-label" for=${`${id}-${index}`}>
        ${label}
      </label>
    </div>
  `;

const RadioGroup = ({ id, onChange, choices, selected }) =>
  html`
    <div class="radio-group">
      ${createChoices(id, onChange, choices, selected)}
    </div>
  `;

function createChoices(id, onChange, choices, selected) {
  const templates = [];
  choices.forEach((v, i) => {
    templates.push(
      Choice({ index: i, id, checked: selected === i, onChange, ...v })
    );
  });
  return templates;
}

export default RadioGroup;
