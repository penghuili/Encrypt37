import { Button } from 'grommet';
import React, { useState } from 'react';

import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import InputField from '../../shared/react-pure/InputField';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';
import { useListener } from '../../shared/react/hooks/useListener';

function GroupUpdate({ groupId, group, isLoading, isUpdating, onFetchGroup, onUpdate }) {
  const [title, setTitle] = useState('');
  useListener(group?.title, value => setTitle(value || ''));

  useEffectOnce(() => {
    onFetchGroup({ itemId: groupId });
  });

  return (
    <>
      <AppBar title="Update tag" hasBack isLoading={isLoading || isUpdating} />
      <ContentWrapper>
        <InputField label="Title" placeholder="Title" value={title} onChange={setTitle} />

        <Spacer />
        <Button
          label="Update tag"
          onClick={() => {
            onUpdate({ itemId: groupId, title, goBack: true });
          }}
          disabled={!title || isLoading || isUpdating}
        />
      </ContentWrapper>
    </>
  );
}

export default GroupUpdate;
