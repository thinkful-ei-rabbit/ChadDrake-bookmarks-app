const BASE_URL = 'https://thinkful-list-api.herokuapp.com/ChadDrake/bookmarks';

function listApiFetch(...args) {
  let error;
  return fetch(...args)
    .then(res => {
      if (!res.ok) {
        error = { code: res.status };
        if (!res.headers.get('content-type').includes('json')) {
          error.message = res.statusText;
          return Promise.reject(error);
        }
      }
      return res.json();
    })
    .then(data => {
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }
      return data;
    });
}

function getMarks() {
  return listApiFetch(`${BASE_URL}`);
}

function createMark(mark) {
  const newMark = JSON.stringify(mark);
  return (listApiFetch(`${BASE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: newMark
  }));
}

function deleteMark(id) {
  return listApiFetch(`${BASE_URL}/${id}`,{
    method:'DELETE'
  });
}



export default {
  getMarks,
  createMark,
  deleteMark
};