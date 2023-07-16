export function extractTimeComponents(timeString: string): number | null {
  const timeRegex = /^(\d{2}):(\d{2}):(\d{2})\.(\d{3})$/;
  const matches = timeString.match(timeRegex);

  if (matches) {
    const hours = parseInt(matches[1], 10);
    const minutes = parseInt(matches[2], 10);
    const seconds = parseInt(matches[3], 10);
    const milliseconds = parseInt(matches[4], 10);

    const totalSeconds =
      hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;

    return totalSeconds;
  }

  return null; // Return null if the input string format is incorrect
}
