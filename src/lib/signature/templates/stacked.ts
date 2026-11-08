import type { SignatureViewModel } from "@/types/signature";
import { joinHtml, toInlineStyle } from "@/utils/html";
import {
  renderAddress,
  renderCustomFields,
  renderInlineContacts,
  renderLogo,
  renderMutedText,
  renderName,
  renderPhoto,
  renderSocialIcons,
  renderTable,
  renderTitleLine,
  rootStyle,
} from "./parts";

const PHOTO_SIZE = 56;
const LOGO_WIDTH = 140;

/** Logo on top, name block with optional photo, contacts on one line, accent bar below. */
export function renderStackedTemplate(vm: SignatureViewModel): string {
  const photo = renderPhoto(vm, PHOTO_SIZE);
  const photoCell = photo ? `<td style="${toInlineStyle({ verticalAlign: "middle", paddingRight: "12px" })}">${photo}</td>` : "";
  const nameBlock = joinHtml([
    renderName(vm, { color: vm.primaryColor }),
    renderMutedText(vm, renderTitleLine(vm, " | ")),
    renderCustomFields(vm),
  ]);
  const identity = renderTable(`<tr>${photoCell}<td style="vertical-align:middle">${nameBlock}</td></tr>`);

  const accentBarStyle = toInlineStyle({ height: "3px", lineHeight: "3px", fontSize: 0, backgroundColor: vm.primaryColor });
  const accentBar = renderTable(
    `<tr><td height="3" bgcolor="${vm.primaryColor}" style="${accentBarStyle}">&nbsp;</td></tr>`,
    {},
    'width="100%"',
  );

  const rows = joinHtml([
    row(renderLogo(vm, LOGO_WIDTH), { paddingBottom: "12px" }),
    row(identity),
    row(renderInlineContacts(vm), { paddingTop: "8px", fontSize: "13px" }),
    row(renderAddress(vm)),
    row(renderSocialIcons(vm)),
    row(accentBar, { paddingTop: "12px" }),
  ]);

  return renderTable(rows, rootStyle(vm));
}

function row(html: string, style: Parameters<typeof toInlineStyle>[0] = {}): string {
  if (!html) return "";
  const styleAttr = toInlineStyle(style);
  return `<tr><td${styleAttr ? ` style="${styleAttr}"` : ""}>${html}</td></tr>`;
}
