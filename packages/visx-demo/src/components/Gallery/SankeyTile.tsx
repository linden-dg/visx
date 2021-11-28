import React from 'react';
import Sankey, { SankeyProps } from '../../sandboxes/visx-sankey/Example';
import GalleryTile from '../GalleryTile';

export { default as packageJson } from '../../sandboxes/visx-sankey/package.json';

const tileStyles = {
  background: 'white',
  borderRadius: 14,
  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 6px',
  overflow: 'hidden'
};
const detailsStyles = { color: '#280C7A' };

export default function SankeyTile() {
  return (
    <GalleryTile<SankeyProps>
      title="Sankey"
      description="<Sankey.Sankey />"
      exampleRenderer={Sankey}
      exampleUrl="/sankey"
      tileStyles={tileStyles}
      detailsStyles={detailsStyles}
    />
  );
}
