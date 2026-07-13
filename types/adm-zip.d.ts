declare module "adm-zip" {
  class AdmZip {
    constructor(input: string | Buffer | Uint8Array);
    getEntries(): Array<{ entryName: string }>;
    readAsText(entryName: string): string;
  }

  export default AdmZip;
}
