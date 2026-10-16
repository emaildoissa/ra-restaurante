declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      src?: string;
      iosSrc?: string;
      ar?: boolean | string;
      arModes?: string;
      cameraControls?: boolean | string;
      autoRotate?: boolean | string;
      shadowIntensity?: number | string;
      exposure?: number | string;
      alt?: string;
      backgroundColor?: string;
      environmentImage?: string;
      reveal?: string;
      id?: string;
      [key: string]: any;
    };
  }
}
