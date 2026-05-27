import { OpenFooterConfig } from './schema';
export declare class OpenFooterElement extends HTMLElement {
    static get observedAttributes(): string[];
    private root;
    config: OpenFooterConfig;
    private hasConnected;
    private renderQueued;
    private lastRequestKey?;
    connectedCallback(): void;
    attributeChangedCallback(): void;
    private syncAttributes;
    private requestRender;
    refresh(force?: boolean): Promise<void>;
}
