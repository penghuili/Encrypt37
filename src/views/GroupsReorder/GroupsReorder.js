import React from 'react';

import { group37Prefix } from '../../shared/js/apps';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Reorder from '../../shared/react-pure/Reorder';
import AppBar from '../../shared/react/AppBar';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';

function GroupsReorder({ groups, isLoading, onFetch, onUpdate }) {
  useEffectOnce(() => {
    onFetch({ prefix: group37Prefix.file37 });
  });

  return (
    <>
      <AppBar title="Reorder tags" isLoading={isLoading} hasBack />
      <ContentWrapper>
        <Reorder
          items={groups}
          onReorder={({ itemId, newPosition, onSucceeded }) => {
            onUpdate({
              itemId,
              position: newPosition,
              goBack: false,
              reorder: true,
              onSucceeded,
            });
          }}
        />
      </ContentWrapper>
    </>
  );
}

export default GroupsReorder;
