import { Button } from 'grommet';
import React, { useState } from 'react';

import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import InputField from '../../shared/react-pure/InputField';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import { group37Prefix } from '../../shared/js/apps';

function GroupAdd({ isCreating, onCreate }) {
  const [title, setTitle] = useState('');

  return (
    <>
      <AppBar title="Add tag" hasBack isLoading={isCreating} />
      <ContentWrapper>
        <InputField label="Title" placeholder="Title" value={title} onChange={setTitle} />

        <Spacer />
        <Button
          label="Create tag"
          onClick={() => {
            onCreate({ title, sortKeyPrefix: group37Prefix.file37, goBack: true });
          }}
          disabled={!title || isCreating}
        />
      </ContentWrapper>
    </>
  );
}

export default GroupAdd;
