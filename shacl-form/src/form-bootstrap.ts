import { ShaclForm as FormBase } from "./form"
import { BootstrapTheme } from "./themes/bootstrap"

export * from './exports'

export class ShaclForm extends FormBase {
    constructor() {
        super(new BootstrapTheme())
    }
}

window.customElements.define('shacl-form', ShaclForm)
