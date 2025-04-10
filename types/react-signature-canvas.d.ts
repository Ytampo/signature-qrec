declare module "react-signature-canvas" {
  import { Component } from "react";

  interface SignatureCanvasProps {
    penColor?: string;
    canvasProps?: object;
    clearOnResize?: boolean;
    maxWidth?: int;
    minWidth?: int;
  }

  export default class SignatureCanvas extends Component<SignatureCanvasProps> {
    clear(): void;
    toDataURL(): string;
    getTrimmedCanvas(): canvas;
  }
}
