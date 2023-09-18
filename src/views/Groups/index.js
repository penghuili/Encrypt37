import React from 'react';

import { group37Prefix } from '../../shared/js/apps';
import GroupsComponent from '../../shared/react/Groups';
import { groupActions, groupSelectors } from '../../store/group/groupStore';

function Groups() {
  return (
    <GroupsComponent
      group37Prefix={group37Prefix.file37}
      groupSelectors={groupSelectors}
      groupActions={groupActions}
    />
  );
}

export default Groups;
