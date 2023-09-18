import React from 'react';

import { group37Prefix } from '../../shared/js/apps';
import GroupUpdateComponent from '../../shared/react/GroupUpdate';
import { groupActions, groupSelectors } from '../../store/group/groupStore';

function GroupUpdate({ params }) {
  return (
    <GroupUpdateComponent
      params={params}
      group37Prefix={group37Prefix.file37}
      groupSelectors={groupSelectors}
      groupActions={groupActions}
    />
  );
}

export default GroupUpdate;
