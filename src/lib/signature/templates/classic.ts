import type { SignatureViewModel } from "@/types/signature";
import { joinHtml, toInlineStyle } from "@/utils/html";
import {
  renderLabeledContacts,
  renderLogo,
  renderMutedText,
  renderName,
  renderPhoto,
  renderSocialIcons,
  renderSpacer,
  renderTable,
  renderTitleLine,
  rootStyle,
  verticalDivider,
} from "./parts";

const PHOTO_SIZE = 96;
const LOGO_WIDTH = 120;

/** Photo on the left, a colored divider, details on the right. */
export function renderClassicTemplate(vm: SignatureViewModel): string {
  const photo = renderPhoto(vm, PHOTO_SIZE);
  const photoCell = photo ? `<td style="${toInlineStyle({ verticalAlign: "top", paddingRight: "16px" })}">${photo}</td>` : "";

  const logo = renderLogo(vm, LOGO_WIDTH);
  const details = joinHtml([
    renderName(vm),
    renderMutedText(vm, renderTitleLine(vm, " &middot; ")),
    vm.contacts.length > 0 && renderSpacer(8),
    renderLabeledContacts(vm),
    renderSocialIcons(vm),
    logo && `${renderSpacer(10)}${logo}`,
  ]);
  const detailsStyle = toInlineStyle({
    verticalAlign: "top",
    borderLeft: verticalDivider(3, vm.primaryColor),
    paddingLeft: "16px",
  });

  return renderTable(`<tr>${photoCell}<td style="${detailsStyle}">${details}</td></tr>`, rootStyle(vm));
}
