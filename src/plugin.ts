import HtmlWebpackPlugin from 'html-webpack-plugin';
import type { HtmlTagObject } from 'html-webpack-plugin';

export {
  HtmlWebpackScriptAttributesPlugin
};

const PLUGIN_NAME = 'HtmlWebpackScriptAttributesPlugin';

class HtmlWebpackScriptAttributesPlugin {
  private options: Array<Object>;

  constructor(options: any) {
    this.options = this.normalizeOptions(options);
  }

  apply (compiler: any) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: any) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tap(PLUGIN_NAME, data => {
        data.assetTags.scripts = this.transformScriptTags(data.assetTags.scripts);
        return data;
      });
    });
  }

  private transformScriptTags(scripts: Array<HtmlTagObject>): Array<HtmlTagObject> {
    // TODO
    return scripts.map(it => {
      return it;
    });
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
