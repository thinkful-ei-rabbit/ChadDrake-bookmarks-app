import $ from 'jquery';
import api from './api';
import store from './store';
import bookmarkList from './bookmark-list';
import './style.css';

function main() {
  api.getMarks()
    .then((marks) => {
      marks.forEach((mark) => store.addMark(mark));
      bookmarkList.render();
    });
  bookmarkList.bindEventListeners();
  bookmarkList.render();
}

$(main);