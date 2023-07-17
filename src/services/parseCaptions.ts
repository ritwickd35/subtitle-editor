import { Caption } from "../types/CaptionObjType";
function extractCaptionContent(line: string): string {
  // Find the index of the timestamp portion
  const timestampIndex = line.indexOf("-->");

  // Extract the caption content by removing the timestamp and any leading/trailing whitespace
  const captionContent = line.substring(timestampIndex + 16).trim();

  return captionContent;
}

export function parseWebVttCaptions(captions: string[]): Caption[] {
  const timestampRegex =
    /(\d{2}):(\d{2}):(\d{2})\.(\d{3}) --> (\d{2}):(\d{2}):(\d{2})\.(\d{3})/;
  const parsedCaptions: Caption[] = [];

  for (let i = 0; i < captions.length; i++) {
    const caption = captions[i].trim();
    const matches = caption.match(timestampRegex);

    if (matches) {
      const content = extractCaptionContent(caption);
      const startHour = parseInt(matches[1]);
      const startMinute = parseInt(matches[2]);
      const startSecond = parseInt(matches[3]);
      const startMillisecond = parseInt(matches[4]);
      const endHour = parseInt(matches[5]);
      const endMinute = parseInt(matches[6]);
      const endSecond = parseInt(matches[7]);
      const endMillisecond = parseInt(matches[8]);

      const startTimeSeconds =
        startHour * 3600 +
        startMinute * 60 +
        startSecond +
        startMillisecond / 1000;
      const endTimeSeconds =
        endHour * 3600 + endMinute * 60 + endSecond + endMillisecond / 1000;

      parsedCaptions.push({
        startTimeSeconds,
        endTimeSeconds,
        content,
        startTime: `${matches[1]}:${matches[2]}:${matches[3]}.${matches[4]}`,
        endTime: `${matches[5]}:${matches[6]}:${matches[7]}.${matches[8]}`,
      });
    }
  }

  return parsedCaptions;
}
