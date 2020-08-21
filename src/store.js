

const store = {
  bookmarks: [],
  adding: false,
  error: null,
  filter: 0

};

function findById(id){
  return this.store.bookmarks.find(currentMark => currentMark.id === id);
}

function addMark(mark){
  mark.expanded = false;
  store.bookmarks.push(mark);
}

function findAndDelete(id) {
  this.store.bookmarks = this.store.bookmarks.filter(currentMark => currentMark.id !== id);
}

function setError(error){
  this.store.error = error;
}

export default {
  store,
  findById,
  addMark,
  findAndDelete,
  setError
};