import { Plugin, PluginOptions } from '../plugin'
import { Term } from '@rdfjs/types'

import { ShaclPropertyTemplate } from '../property-template'
import {  InputListEntry } from '../theme'

export class ImageUploadPlugin extends Plugin {   
  	onChange: any
    constructor(options: PluginOptions, onChange?: (event: any) => void) {
        super(options)
      	this.onChange = onChange
    }

    createEditor(template: ShaclPropertyTemplate, value?: Term ): HTMLElement {
        const required = template.minCount !== undefined && template.minCount > 0
        let editor
        editor = document.createElement('input')
        editor.type = 'file'
        // editor.setAttribute('type', 'file')
        editor.setAttribute('accept', 'image/*') 
        // if ( this.onChange )
        //   editor.setAttribute('onchange', this.onChange.toString()) ;
        // editor.setAttribute('onchange', "(e) => console.log('event logged', e") ;
        // editor.setAttribute('onchange', (e) => console.log('event logged', e) ;
      	editor.addEventListener('change', this.onChange);

        editor.setAttribute('id', 'imageupload2')
        editor.setAttribute('className', 'imageupload')
        return template.config.theme.createDefaultTemplate(
        	template.label,
        	value || null,
        	required,
        	editor,
        	template)
    }
}
