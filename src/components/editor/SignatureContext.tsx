"use client";

import { createContext, use, useMemo, type Dispatch, type ReactNode } from "react";
import type {
  CustomField,
  DetailField,
  ImageKind,
  SignatureAction,
  SignatureState,
  SignatureStyle,
  SocialNetwork,
} from "@/types/signature";
import { createId } from "@/utils/id";

interface SignatureActions {
  updateDetail: (field: DetailField, value: string) => void;
  updateSocial: (network: SocialNetwork, value: string) => void;
  setImage: (kind: ImageKind, url: string) => void;
  updateStyle: (style: Partial<SignatureStyle>) => void;
  updateLegal: (value: string) => void;
  addCustomField: () => void;
  updateCustomField: (id: string, patch: Partial<Omit<CustomField, "id">>) => void;
  removeCustomField: (id: string) => void;
  reset: () => void;
}

interface SignatureContextValue {
  state: SignatureState;
  actions: SignatureActions;
}

const SignatureContext = createContext<SignatureContextValue | null>(null);

interface SignatureProviderProps {
  state: SignatureState;
  dispatch: Dispatch<SignatureAction>;
  children: ReactNode;
}

export function SignatureProvider({ state, dispatch, children }: SignatureProviderProps) {
  const actions = useMemo<SignatureActions>(
    () => ({
      updateDetail: (field, value) => dispatch({ type: "updateDetail", field, value }),
      updateSocial: (network, value) => dispatch({ type: "updateSocial", network, value }),
      setImage: (kind, url) => dispatch({ type: "setImage", kind, url }),
      updateStyle: (style) => dispatch({ type: "updateStyle", style }),
      updateLegal: (value) => dispatch({ type: "updateLegal", value }),
      // Ids are created here, not in the reducer, so the reducer stays pure.
      addCustomField: () => dispatch({ type: "addCustomField", id: createId() }),
      updateCustomField: (id, patch) => dispatch({ type: "updateCustomField", id, patch }),
      removeCustomField: (id) => dispatch({ type: "removeCustomField", id }),
      reset: () => dispatch({ type: "reset" }),
    }),
    [dispatch],
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return <SignatureContext value={value}>{children}</SignatureContext>;
}

export function useSignature(): SignatureContextValue {
  const context = use(SignatureContext);
  if (!context) throw new Error("useSignature must be used inside <SignatureProvider>.");
  return context;
}
