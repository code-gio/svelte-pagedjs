import type { PagedOptions } from "./types.js";

// StyleGenerator.ts
export class StyleGenerator {
    static generateCSS(options: PagedOptions): string {
        let css = '@media print {\n';

        // Base @page rule
        css += this.generatePageRule(options);

        // Specific page rules
        if (options.pageRules) {
            if (options.pageRules.left) {
                css += this.generatePageRule(options, ':left');
            }
            if (options.pageRules.right) {
                css += this.generatePageRule(options, ':right');
            }
            if (options.pageRules.first) {
                css += this.generatePageRule(options, ':first');
            }
            if (options.pageRules.blank) {
                css += this.generatePageRule(options, ':blank');
            }
        }

        // Add break rules
        css += `
            .page-break-before-right {
                break-before: right;
            }
            .page-break-before-left {
                break-before: left;
            }
            .page-break-before-page {
                break-before: page;
            }
            .page-break-after-right {
                break-after: right;
            }
            .page-break-after-left {
                break-after: left;
            }
            .page-break-after-page {
                break-after: page;
            }
        `;

        css += '\n}';
        return css;
    }

    private static generatePageRule(options: PagedOptions, selector: string = ''): string {
        let rule = `@page${selector} {\n`;

        // Size and orientation
        if (options.pageSize) {
            rule += `    size: ${options.pageSize}${options.orientation ? ` ${options.orientation}` : ''};\n`;
        }

        // Margins
        if (options.margins) {
            if (options.margins.general) {
                rule += `    margin: ${options.margins.general};\n`;
            } else {
                if (options.margins.top) rule += `    margin-top: ${options.margins.top};\n`;
                if (options.margins.right) rule += `    margin-right: ${options.margins.right};\n`;
                if (options.margins.bottom) rule += `    margin-bottom: ${options.margins.bottom};\n`;
                if (options.margins.left) rule += `    margin-left: ${options.margins.left};\n`;
            }
        }

        // Bleed
        if (options.bleed) {
            rule += `    bleed: ${options.bleed};\n`;
        }

        // Marks
        if (options.marks) {
            rule += `    marks: ${options.marks};\n`;
        }

        rule += '}\n';
        return rule;
    }
}