declare module 'react-signature-canvas' {
  import { Component } from 'react';

  interface SignatureCanvasProps {
    penColor?: string;
    canvasProps?: object;
    clearOnResize?: boolean;
  }

  export default class SignatureCanvas extends Component<SignatureCanvasProps> {
    clear(): void;
    toDataURL(): string;
  }
}