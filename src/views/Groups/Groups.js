import { Anchor, Box, Spinner, Text } from 'grommet';
import React, { useState } from 'react';

import { group37Prefix } from '../../shared/js/apps';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Divider from '../../shared/react-pure/Divider';
import HorizontalCenter from '../../shared/react-pure/HorizontalCenter';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';
import RouteLink from '../../shared/react/RouteLink';

function Groups({ groups, isLoading, isDeleting, onFetch, onDelete }) {
  const [focusedGroup, setFocusedGroup] = useState(null);

  useEffectOnce(() => {
    onFetch({ prefix: group37Prefix.file37 });
  });

  return (
    <>
      <AppBar title="Tags" hasBack isLoading={isLoading || isDeleting} />
      <ContentWrapper>
        <HorizontalCenter margin="0 0 1rem">
          <RouteLink to={`/groups/add`} label="Add tag" color="status-ok" margin="0 1rem 1rem 0" />
          <RouteLink
            to={`/groups/reorder`}
            label="Reorder tags"
            color="status-ok"
            margin="0 1rem 1rem 0"
          />
        </HorizontalCenter>
        <Divider />
        <Spacer />

        {(groups || []).map(group => (
          <Box key={group.sortKey} margin="0 0 1rem">
            <HorizontalCenter>
              <Text>{group.title}</Text>
              {focusedGroup?.sortKey === group.sortKey && isDeleting && <Spinner size="small" />}
            </HorizontalCenter>
            <HorizontalCenter>
              <RouteLink
                to={`/groups/${group.sortKey}/update`}
                label="Edit"
                color="status-ok"
                margin="0 1rem 1rem 0"
              />
              <Anchor
                label="Delete"
                onClick={() => {
                  setFocusedGroup(group);
                  onDelete({ itemId: group.sortKey, goBack: false });
                }}
                color="status-error"
                margin="0 1rem 1rem 0"
              />
            </HorizontalCenter>
          </Box>
        ))}
      </ContentWrapper>
    </>
  );
}

export default Groups;
