import { Button } from 'grommet';
import React, { useState } from 'react';

import GroupsSelector from '../../components/GroupsSelector';
import { uniqBy } from '../../shared/js/uniq';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import FilesInput from './FilesInput';

function FilesUpload({ isCreating, onUpload }) {
  const [files, setFiles] = useState([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);

  function handleUpload(filesToUpload) {
    if (!filesToUpload?.length) {
      return;
    }

    onUpload({
      file: filesToUpload[0],
      groupIds: selectedGroupIds,
      goBack: filesToUpload.length === 1,
      onSucceeded: uploadedFile => {
        const left = filesToUpload.filter(f => f.name !== uploadedFile.name);
        setFiles(left);
        handleUpload(left);
      },
    });
  }

  return (
    <>
      <AppBar title="Upload files" hasBack isLoading={isCreating} />
      <ContentWrapper>
        <FilesInput
          files={files}
          onSelected={value => {
            if (!value?.length) {
              return;
            }

            setFiles(uniqBy([...value, ...files], 'name'));
          }}
          onRemove={file => {
            setFiles(files.filter(f => f.name !== file.name));
          }}
        />
        <Spacer size="2rem" />
        <GroupsSelector selectedGroups={selectedGroupIds} onSelect={setSelectedGroupIds} />

        <Spacer />
        <Button
          label="Upload"
          onClick={() => {
            handleUpload(files);
          }}
          disabled={!files?.length || isCreating}
          margin="1rem 0 0"
        />
      </ContentWrapper>
    </>
  );
}

export default FilesUpload;
