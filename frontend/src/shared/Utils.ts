export function truncateString(str: string) {
  if (str.length > 200) {
    return str.slice(0, 200) + "...";
  } else {
    return str;
  }
}
