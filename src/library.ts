const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const popularProgressions = [
  [1, 4, 6, 5],
  [1, 5, 6, 4],
  [6, 4, 1, 5],
];

/**
 *
 * @returns index of a tonal key (0-11)
 */
function getRandomKey() {
  return Math.floor(Math.random() * 12);
}

/**
 * @param key index of the tonal key (0-11)
 * @returns array of indexes of notes
 */
function generateRandomMelody(key: number, length: number) {
  const scale = getMajorScale(key);
  const melody = [];

  for (let i = 0; i < length; i++) {
    melody.push(scale[Math.floor(Math.random() * scale.length)]);
  }

  return melody;
}

/**
 *
 * @param key index of a tonal key (0-11)
 *
 * w-w-h-w-w-w-h -> +0 +2 +2 +1 +2 +2 +2
 * @returns array of indexes of notes in scale
 */
function getMajorScale(key: number) {
  const scale: number[] = [];
  let i = 0;

  //12: number of half-steps in an octave
  while (i < 12) {
    scale.push((key + i) % 12);

    if (i == 4) {
      i++;
      continue;
    }

    i += 2;
  }

  return scale;
}

/**
 *
 * @param index index of a note (0-11)
 * @returns name of the note using American notation (C, C#, D, D#, E, F, F#, G, G#, A, A#, B)
 */
function getNoteName(index: number) {
  return notes[index];
}
