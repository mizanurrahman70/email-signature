export interface InstallGuide {
  id: string;
  client: string;
  steps: ReadonlyArray<string>;
  tip?: string;
}
