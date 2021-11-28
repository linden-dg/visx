import React from 'react';
import Show from '../components/Show';
import Sankey from '../sandboxes/visx-sankey/Example';
import SankeySource from '!!raw-loader!../sandboxes/visx-sankey/Example';
import packageJson from '../sandboxes/visx-sankey/package.json';

const ChordPage = () => {
  return (
    <Show
      component={Sankey}
      title="Sankey"
      codeSandboxDirectoryName="visx-sankey"
      packageJson={packageJson}
    >
      {SankeySource}
    </Show>
  );
};
export default ChordPage;
