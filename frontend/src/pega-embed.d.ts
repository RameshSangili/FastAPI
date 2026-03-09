declare namespace JSX {
    interface IntrinsicElements {
      'pega-embed': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        id?: string;
        action?: string;
        pageID?: string;
        pageClass?: string;
        themeID?: string;
        casePage?: string;
        appAlias?: string;
        pegaServerUrl?: string;
        authService?: string;
        clientId?: string;
      }, HTMLElement>;
    }
  }