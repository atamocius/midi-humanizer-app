import Midi from '@tonejs/midi';

/**
 * Humanizes MIDI data.
 * @param {Midi} midi The MIDI data.
 * @param {number} timing Upper bound timing offset.
 * @param {number} velocity Upper bound velocity offset.
 * @param {number} globalOffset Global timing offset.
 * @returns {Midi} The humanized MIDI data.
 */
function humanize(midi, timing, velocity, globalOffset) {
  const midiCopy = midi.clone();

  midiCopy.name = `${midiCopy.name} - Humanized`;

  const globalTimingOffset = globalOffset / 1000;

  const minTimingOffset = -timing / 1000;
  const maxTimingOffset = timing / 1000;

  const minVelocityOffset = -velocity / 127;
  const maxVelocityOffset = velocity / 127;

  midiCopy.tracks.forEach(track => {
    // 1st pass: Humanize
    track.notes.forEach(note => {
      note.time = humanizeTiming(
        note.time,
        minTimingOffset,
        maxTimingOffset,
        globalTimingOffset
      );
      note.velocity = humanizeVelocity(
        note.velocity,
        minVelocityOffset,
        maxVelocityOffset
      );
    });

    // 2nd pass: trim overlapped notes
    track.notes.forEach((note, i) => {
      const nextNote = track.notes[i + 1];
      if (!nextNote) return;
      if (nextNote.name !== note.name) return;

      let noteOffTime = note.time + note.duration;
      if (nextNote.time < noteOffTime) {
        noteOffTime = nextNote.time;
        note.duration = noteOffTime - note.time;
      }
    });
  });

  return midiCopy;
}

function humanizeTiming(time, minOffset, maxOffset, globalOffset) {
  const offset = getRandomArbitrary(minOffset, maxOffset);
  const computed = time + offset + globalOffset;

  if (computed < 0) {
    return 0;
  }

  return computed;
}

function humanizeVelocity(velocity, minOffset, maxOffset) {
  const offset = getRandomArbitrary(minOffset, maxOffset);
  const computed = velocity + offset;

  if (computed < 0) {
    return 0;
  } else if (computed > 127) {
    return 127;
  }

  return computed;
}

/**
 * Returns a random number between the specified values. The returned value is
 * no lower than (and may possibly equal) min, and is less than (and not equal)
 * max.
 * @param {number} min Inclusive lower bound.
 * @param {number} max Exclusive upper bound.
 * @returns {number} The generated random number.
 */
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

export default humanize;
