import {getGatsbyImageResolver} from 'gatsby-plugin-image/graphql-utils';
import type {IGatsbyImageHelperArgs} from 'gatsby-plugin-image/dist/src/image-utils';
import {generateImageData} from 'gatsby-plugin-image';

const generateLogoSource: IGatsbyImageHelperArgs['generateImageSource'] = (baseURL, width, height, format, fit, options) => {
  console.log('generateLogoSource', {baseURL, width, height, format, fit, options});
  return {src: baseURL, width, height, format};
};


const resolveLogoImageData = async ({logoUrl}, options) => {
  console.log('resolveLogoImageData', {logoUrl, options});

  const sourceMetadata: IGatsbyImageHelperArgs['sourceMetadata'] = {
    width: options.width,
    height: options.height,
    format: 'png'
  };

  const imageDataArgs: IGatsbyImageHelperArgs = {
    pluginName: 'gatsby-source-powerschedules',
    sourceMetadata,
    filename: logoUrl,
    generateImageSource: generateLogoSource,
    options
  };
  return generateImageData(imageDataArgs);
};
export const logoResolver = getGatsbyImageResolver(resolveLogoImageData)
