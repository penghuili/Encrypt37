import { Button, TextArea } from 'grommet';
import React, { useState } from 'react';

import FileContent from '../../components/FileContent';
import GroupsUpdater from '../../components/GroupsUpdater';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';
import { useListener } from '../../shared/react/hooks/useListener';

function GroupUpdate({ fileId, fileMeta, isLoading, isUpdating, onFetch, onUpdate }) {
  const [note, setNote] = useState('');
  useListener(fileMeta?.note, value => setNote(value || ''));

  useEffectOnce(() => {
    onFetch({ itemId: fileId });
  });

  return (
    <>
      <AppBar title="Update file" hasBack isLoading={isLoading || isUpdating} />
      <ContentWrapper>
        {!!fileMeta && <FileContent fileId={fileId} fileMeta={fileMeta} />}

        <Spacer />
        <TextArea
          value={note}
          onChange={e => {
            setNote(e.target.value);
          }}
        />

        <Spacer />
        <GroupsUpdater file={fileMeta} />

        <Spacer />
        <Button
          label="Update"
          onClick={() => {
            onUpdate({ itemId: fileId, note, goBack: true });
          }}
          disabled={note === fileMeta?.note || isLoading || isUpdating}
        />
      </ContentWrapper>
    </>
  );
}

export default GroupUpdate;
