import { connect } from 'react-redux';

import { noteActions, noteSelectors } from '../../store/note/noteStore';
import NoteUpdate from './NoteUpdate';

const mapStateToProps = (state, { params: { noteId } }) => ({
  noteId,
  note: noteSelectors.data.getItem(state, noteId),
  isLoading: noteSelectors.fetchItem.isPending(state),
  isUpdating: noteSelectors.updateItem.isPending(state),
});

const mapDispatchToProps = {
  onFetch: noteActions.fetchItemRequested,
  onUpdate: noteActions.updateRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteUpdate);
