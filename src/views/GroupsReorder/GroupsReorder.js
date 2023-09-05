import React from 'react';

import { calculateItemPosition } from '../../shared/js/position';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import DragDrop from '../../shared/react-pure/DragDrop';
import AppBar from '../../shared/react/AppBar';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';
import { group37Prefix } from '../../shared/js/apps';

function GroupsReorder({ isLoading, groups, onFetch, onUpdate }) {
  useEffectOnce(() => {
    onFetch({ prefix: group37Prefix.file37 });
  });

  return (
    <>
      <AppBar title="Reorder tags" isLoading={isLoading} hasBack />
      <ContentWrapper>
        <DragDrop
          items={groups}
          onDragEnd={(sourceId, targetId) => {
            const newPosition = calculateItemPosition(groups, sourceId, targetId);
            onUpdate({ itemId: sourceId, position: newPosition, goBack: false, reorder: true });
          }}
        />
      </ContentWrapper>
    </>
  );
}

export default GroupsReorder;
