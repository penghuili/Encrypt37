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
  const [notes, setNotes] = useState({});
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);

  function handleUpload(filesToUpload, notesToUpload) {
    if (!filesToUpload?.length) {
      return;
    }

    const firstFile = filesToUpload[0];
    onUpload({
      file: firstFile,
      note: notesToUpload[firstFile.name],
      groupIds: selectedGroupIds,
      goBack: filesToUpload.length === 1,
      onSucceeded: () => {
        const left = filesToUpload.slice(1);
        setFiles(left);
        handleUpload(left, notesToUpload);
      },
    });
  }

  return (
    <>
      <AppBar title="Upload files" hasBack isLoading={isCreating} />
      <ContentWrapper>
        <FilesInput
          files={files}
          notes={notes}
          onNotesChange={setNotes}
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
            handleUpload(files, notes);
          }}
          disabled={!files?.length || isCreating}
          margin="1rem 0 0"
        />
      </ContentWrapper>
    </>
  );
}

export default FilesUpload;
