import type { SignatureViewModel } from "@/types/signature";
import { joinHtml, toInlineStyle } from "@/utils/html";
import {
  centerBlock,
  renderAddress,
  renderCustomFields,
  renderInlineContacts,
  renderLogo,
  renderMutedText,
  renderName,
  renderPhoto,
  renderSocialIcons,
  renderSpacer,
  renderTable,
  renderText,
  renderTitleLine,
  rootStyle,
} from "./parts";

const PHOTO_SIZE = 88;
const LOGO_WIDTH = 120;

/** Everything centered: round photo, name, title, contacts, social icons, logo. */
export function renderCenteredTemplate(vm: SignatureViewModel): string {
  const photo = renderPhoto(vm, PHOTO_SIZE);
  const logo = renderLogo(vm, LOGO_WIDTH);

  const content = joinHtml([
    photo && `${centerBlock(photo)}${renderSpacer(10)}`,
    renderName(vm, { color: vm.primaryColor }),
    renderMutedText(vm, renderTitleLine(vm, " &middot; ")),
    renderCustomFields(vm),
    renderText(renderInlineContacts(vm, "&middot;"), { fontSize: "13px", marginTop: "8px" }),
    renderAddress(vm),
    renderSocialIcons(vm, "center"),
    logo && `${renderSpacer(12)}${centerBlock(logo)}`,
  ]);

  const cellStyle = toInlineStyle({ textAlign: "center", padding: "0 8px" });
  return renderTable(`<tr><td align="center" style="${cellStyle}">${content}</td></tr>`, rootStyle(vm));
}
