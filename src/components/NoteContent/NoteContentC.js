import { connect } from 'react-redux';

import { noteActions, noteSelectors } from '../../store/note/noteStore';
import NoteContent from './NoteContent';

const mapStateToProps = (state, { noteId }) => {
  return {
    noteId,
    isLoading: noteSelectors.fetchItem.isPending(state),
  };
};

const mapDispatchToProps = {
  onUpdate: noteActions.updateRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteContent);
