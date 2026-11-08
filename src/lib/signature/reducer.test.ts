import { describe, expect, it } from "vitest";
import { DEFAULT_SIGNATURE } from "@/constants/signature-defaults";
import { MAX_CUSTOM_FIELDS } from "@/constants/signature-options";
import { signatureReducer } from "./reducer";

describe("custom field actions", () => {
  it("adds, updates and removes custom fields", () => {
    let state = signatureReducer(DEFAULT_SIGNATURE, { type: "addCustomField", id: "a" });
    state = signatureReducer(state, { type: "updateCustomField", id: "a", patch: { label: "Skype", value: "jane" } });
    expect(state.footer.customFields).toEqual([{ id: "a", label: "Skype", value: "jane" }]);

    state = signatureReducer(state, { type: "removeCustomField", id: "a" });
    expect(state.footer.customFields).toEqual([]);
  });

  it(`stops at ${MAX_CUSTOM_FIELDS} fields`, () => {
    let state = DEFAULT_SIGNATURE;
    for (let index = 0; index < MAX_CUSTOM_FIELDS + 2; index++) {
      state = signatureReducer(state, { type: "addCustomField", id: String(index) });
    }
    expect(state.footer.customFields).toHaveLength(MAX_CUSTOM_FIELDS);
  });

  it("updates legal text", () => {
    expect(signatureReducer(DEFAULT_SIGNATURE, { type: "updateLegal", value: "Notice" }).footer.legal).toBe("Notice");
  });
});
