import React from 'react';
import SankeyReadme from '!!raw-loader!../../../../visx-sankey/Readme.md';
import DocPage from '../../components/DocPage';
import Sankey from '../../../../visx-sankey/src/components/Sankey';
import SankeyNode from '../../../../visx-sankey/src/components/SankeyNode';
import SankeyLink from '../../../../visx-sankey/src/components/SankeyLink';
import useSankey from '../../../../visx-sankey/src/useSankey';
import SankeyTile from '../../components/Gallery/SankeyTile';

const components = [Sankey, SankeyLink, SankeyNode, useSankey];

const examples = [SankeyTile];

const SankeyDocs = () => (
  <DocPage components={components} examples={examples} readme={SankeyReadme} visxPackage="sankey" />
);
export default SankeyDocs;
