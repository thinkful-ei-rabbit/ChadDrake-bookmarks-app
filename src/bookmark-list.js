import $ from 'jquery';
import api from './api';
import store from './store';

function generateBookmarkElement(mark) {
  let dragon = 'Dragons';
  if (mark.rating === 1) {
    dragon = 'Dragon';
  }
  let markName = `<h2>${mark.title} ${mark.rating} ${dragon} </h2>`;
  if (mark.expanded === true) {
    markName = `
    <h2>${mark.title} ${mark.rating} ${dragon}</h2>
    <div class = "details">
      <button type = button class="visit-site">Visit Site!</button>
      <p>${mark.desc}</p>
    </div>`;
  } 
  if (mark.rating >= store.store.filter) {
    return `
    <li class="bookmark" data-mark-id="${mark.id}">
      <div class="buttons-container">
        <div class="buttons"><button type="button" class ="details-btn">Details?</button>
          <button type="button" class ="dlt" >Delete</button>
        </div>
      </div>
      ${markName}
    </li>`;
  }
}

function generateBookmarkListString(markList) {
  const marks = markList.map((mark) => generateBookmarkElement(mark));
  return marks.join('');
}

function generateError(message) {
  return `
    <section class = 'err-message'>
      <button id = 'close-error'>Close</button>
      <p>${message}</p>
    </section>`;
}

function renderError() {
  if (store.store.error !== null) {
    const alert = generateError(store.store.error);
    $('.error-message').html(alert);
  } else {
    $('.error-message').empty();
  }
}

function handleCloseError() {
  $('main').on('click', '#close-error', () => {
    store.setError(null);
    renderError();
  });
}

function render() {
  let bookmarks = [...store.store.bookmarks];
  const bookmarkListString = generateBookmarkListString(bookmarks);
  $('.bookmarks-list').html(bookmarkListString);
  $('.selection-bar').html(`<h1>My Bookmarks</h1>
    <div class =group>
      <form>
        <button type="button" class='add'>Add a 'mark!</button>
      </form>
      <form class ='filter'>
        <label for="filter">Filter?</label>
        <select name="filter" id="filter">
          <option value="1">1 Dragon</option>
          <option value="2">2 Dragons</option>
          <option value="3">3 Dragons</option>
          <option value="4">4 Dragons</option>
          <option value="5">5 Dragons</option>
        </select>
        <input type="submit" value="Filter">
      </form>
    </div>`);

  if (store.store.adding === true) {
    $('.selection-bar').html(`<h1>My Bookmarks</h1>
      <div class =group>
        <form>
          <label for="name">'Mark Name:</label>
          <input type="text" id = name placeholder="Name of site?">
          <label for="url">Url:</label>
          <input type="text" id = url placeholder="Url of site?">
          <div>
            <label for="rating">Rating:</label>
            <select name="rating" id="rating">
              <option value="1">1 Dragon</option>
              <option value="2">2 Dragons</option>
              <option value="3">3 Dragons</option>
              <option value="4">4 Dragons</option>
              <option value="5">5 Dragons</option>
            </select>
          </div>
        </form>
      </div>
    <form>
      <label for="url">Description</label>
      <input type="text" id = desc placeholder="Description?">
      <button type="submit">Leave your 'mark!</button>
      <button type="button" class = "cancel">Cancel</button>
    </form>`);
  }
  renderError();
}

function getIdFromElement(item) {
  return $(item)
    .closest('.bookmark')
    .data('mark-id');
}

function handleDeleteClicked() {
  $('main').on('click', '.dlt', function (event) {
    const id = getIdFromElement(event.currentTarget);
    api.deleteMark(id)
      .then(store.findAndDelete(id))
      .then(render());
  });
}

function handleDetailsButtonClicked() {
  $('main').on('click', '.details-btn', function (event) {
    const id = getIdFromElement(event.currentTarget);
    showDetails(id);
  });
}

function showDetails(id) {
  let mark = store.findById(id);
  mark.expanded = !mark.expanded;
  render();
}

function handleFilterSubmit() {
  $('main').on('submit', '.filter', function (event) {
    event.preventDefault();
    store.store.filter = $('#filter').val();
    render();
  });
}

function handleVisitSiteClicked() {
  $('main').on('click', '.visit-site', function (event) {
    openTab(event.currentTarget);
  });
}

function openTab(mark) {
  let id = getIdFromElement(mark);
  let link = store.findById(id);
  window.open(link.url, '_blank');
}

function toggleAddHtml() {
  store.store.adding = !store.store.adding;
}

function handleAddClicked() {
  $('main').on('click', '.add', function () {
    toggleAddHtml();
    render();
  });

}

function handleCancelClicked() {
  $('main').on('click', '.cancel', function () {
    toggleAddHtml();
    render();
  });
}

function handleAddSubmit() {
  $('main').on('submit', function (event) {
    event.preventDefault();
    if (store.store.adding === true) {
      let address = $('#url').val();
      if (!address.includes('http')) {
        address = `http://${address}`;
      }

      const newMark = {
        title: $('#name').val(),
        url: address,
        rating: $('#rating').val(),
        desc: $('#desc').val()
      };
      api.createMark(newMark)
        .then((newMark) => {
          store.addMark(newMark);
          toggleAddHtml();
          render();
        })
        .catch((error) => {
          store.setError(error.message);
          renderError();
        });
    }
  });
}

function bindEventListeners() {
  handleAddSubmit();
  handleAddClicked();
  handleVisitSiteClicked();
  handleFilterSubmit();
  handleDetailsButtonClicked();
  handleDeleteClicked();
  handleCloseError();
  renderError();
  handleCancelClicked();
}

export default {
  bindEventListeners,
  render,
  renderError
};