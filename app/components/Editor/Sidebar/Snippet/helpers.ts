import { edgeSize } from "../../../../theme/theme";

const ClickActions = ["Click", "Hover", "Upload image"] as const;
const FillActions = ["Fill", "Fill email", "Hover"] as const;

export type ActionType =
  | "Assert text"
  | typeof ClickActions[number]
  | typeof FillActions[number];

export const buildActionOptions = (
  hasText: boolean,
  isFillable: boolean
): ActionType[] => {
  const options: ActionType[] = isFillable
    ? [...FillActions]
    : [...ClickActions];

  if (hasText) options.unshift("Assert text");

  return options;
};

export const buildCode = (
  action: ActionType,
  selector: string,
  text: string
): string => {
  if (action === "Assert text") {
    return `await assertText(page, ${formatArgument(text)});`;
  }

  const selectorArgument = formatArgument(selector);

  if (action === "Click") return `await page.click(${selectorArgument});`;

  if (action === "Fill") {
    return `await page.fill(${selectorArgument}, ${formatArgument(text)});`;
  }

  if (action === "Fill email") {
    return `const { email, waitForMessage } = getInbox();\nawait page.fill(${selectorArgument}, email);\n// send the email then check the message \n// const message = await waitForMessage();\n// console.log(message);`;
  }

  if (action === "Hover") return `await page.hover(${selectorArgument});`;

  if (action === "Upload image") {
    return `page.on('filechooser', (chooser) => chooser.setFiles('/root/files/avatar.png'));\nawait page.click(${selectorArgument});`;
  }

  return "";
};

export const formatArgument = (value: string | null): string => {
  if (value === null) return "";

  // serialize newlines etc
  let escaped = JSON.stringify(value);
  // remove wrapper quotes
  escaped = escaped.substring(1, escaped.length - 1);
  // allow unescaped quotes
  escaped = escaped.replace(/\\"/g, '"');

  if (!escaped.includes(`"`)) return `"${escaped}"`;
  if (!escaped.includes(`'`)) return `'${escaped}'`;
  return "`" + escaped.replace(/`/g, "\\`") + "`";
};

export const labelProps = {
  color: "gray0",
  margin: { bottom: edgeSize.xxsmall },
  size: "componentBold" as const,
};

export const selectWidth = `calc(50% - ${edgeSize.small} /2)`;
