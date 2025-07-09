declare module "pdf-parse" {
    import { Buffer } from "buffer";
    function pdfParse(
      buffer: Buffer | Uint8Array
    ): Promise<{ text: string }>;
    export default pdfParse;
  }