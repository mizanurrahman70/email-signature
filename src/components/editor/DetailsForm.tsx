"use client";

import { Fragment } from "react";
import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import { DETAIL_FIELDS, DETAIL_GROUPS } from "@/constants/signature-options";
import { CustomFieldsSection } from "./CustomFieldsSection";
import { FooterFields } from "./FooterFields";
import { useSignature } from "./SignatureContext";

/** Order mirrors the signature: identity, custom fields, contact details, then the legal footer. */
export function DetailsForm() {
  const { state, actions } = useSignature();

  return (
    <div className="flex flex-col gap-8">
      {DETAIL_GROUPS.map((group) => (
        <Fragment key={group.id}>
          <FormSection title={group.title}>
            <div className="grid gap-4 sm:grid-cols-2">
              {DETAIL_FIELDS.filter((field) => field.group === group.id).map(
                ({ field, label, placeholder, type, autoComplete, wide }) => (
                  <TextField
                    key={field}
                    label={label}
                    type={type}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    value={state.details[field]}
                    onValueChange={(value) => actions.updateDetail(field, value)}
                    className={wide ? "sm:col-span-2" : undefined}
                  />
                ),
              )}
            </div>
          </FormSection>
          {group.id === "identity" && <CustomFieldsSection />}
        </Fragment>
      ))}
      <FooterFields />
    </div>
  );
}
