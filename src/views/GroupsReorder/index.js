import React from 'react';

import { group37Prefix } from '../../shared/js/apps';
import GroupsReorderComponent from '../../shared/react/GroupsReorder';
import { groupActions, groupSelectors } from '../../store/group/groupStore';

function GroupsReorder() {
  return (
    <GroupsReorderComponent
      group37Prefix={group37Prefix.file37}
      groupSelectors={groupSelectors}
      groupActions={groupActions}
    />
  );
}

export default GroupsReorder;
