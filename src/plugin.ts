import HtmlWebpackPlugin from 'html-webpack-plugin';
import type { HtmlTagObject } from 'html-webpack-plugin';

export {
  HtmlWebpackScriptAttributesPlugin
};

const C_SLASH = '/';

const PLUGIN_NAME = 'HtmlWebpackScriptAttributesPlugin';

class HtmlWebpackScriptAttributesPlugin {
  private options: Array<Record<string, any>>;

  constructor(options: any) {
    this.options = this.normalizeOptions(options);
  }

  apply (compiler: any) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: any) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tap(PLUGIN_NAME, data => {
        data.assetTags.scripts = this.transformScriptTags(compilation, data.assetTags.scripts);
        return data;
      });
    });
  }

  private transformScriptTags(compilation: any, scripts: Array<HtmlTagObject>): Array<HtmlTagObject> {
    const publicPath = this.getPublicPath(compilation);
    return scripts.map(tag => {
      const scriptName = this.getScriptName(tag, publicPath)
      const additionalAttributes = this.getMatchedAttributes(scriptName);
      return { ...tag, attributes: { ...tag.attributes, ...additionalAttributes } }
    });
  }

  private getMatchedAttributes(scriptName: string): { [name: string]: string|boolean } {
    return this.options
      .filter(hash => this.isMatched(scriptName, hash.test))
      .reduce((attributes, hash) => {
        // exlude `test` property cuz it is not part of attributes
        const { test, ...rest } = hash;
        return { ...attributes, ...rest };
      }, {});
  }

  private isMatched(scriptName: string, testPattern: any): boolean {
    if (testPattern === undefined) return true;

    if (testPattern instanceof RegExp) {
      return testPattern.test(scriptName);
    }

    if (typeof testPattern === 'string') {
      return scriptName.includes(testPattern);
    }

    throw new Error(`Expected test to be RegExp or String but got ${testPattern}`);
  }

  private getScriptName(tag: HtmlTagObject, publicPath?: string): string {
    let scriptName = tag.attributes.src as string
    if (publicPath) {
      scriptName = scriptName.replace(publicPath, '');
    }
    return scriptName.split('?', 1)[0];
  }

  private getPublicPath(compilation: any) {
    const publicPath: string|undefined = compilation.options.output?.publicPath;
    if (publicPath) {
      return publicPath.endsWith(C_SLASH) ? publicPath : publicPath + C_SLASH;
    }
  }

  private normalizeOptions(options: any): Array<Object> {
    if (!options || (!Array.isArray(options) && options.constructor !== Object)) {
      throw Error(`Expected options to be array or object but got ${options}`);
    }

    if (options.constructor === Object) {
      return [options];
    }

    return options;
  }
}
