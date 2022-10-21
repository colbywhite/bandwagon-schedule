import type {GatsbyNode} from 'gatsby';
import {getGameNodes} from './src/source-nodes';
import {createScheduleResolvers} from './src/resolvers';
import schema from './src/schema.sdl';

export const onPreInit: GatsbyNode['onPreInit'] = ({reporter: {success}}) => success('gatsby-powerschedules-plugin loaded');

export const sourceNodes: GatsbyNode['sourceNodes'] = getGameNodes;

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization']
  = ({actions: {createTypes}}) => createTypes(schema);

export const createResolvers: GatsbyNode['createResolvers'] = createScheduleResolvers;
