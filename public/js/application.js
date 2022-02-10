// Отслеживаем отправку формы на удаление и перенаправление на страницу редактирования поста
const products = document.querySelector('.products');

products?.addEventListener('click', async (event) => {
  event.preventDefault();
  const { id } = event.target;
  const card = event.target.closest('.card');
  const cardId = card.dataset.id;
  // если нажали на удаление
  if (id === 'deletePost') {
    try {
      const response = await fetch(`http://localhost:3000/post/${cardId}`, { method: 'DELETE' });
      if (response.status === 200) {
        const entry = await response.json();
        card.remove();
      } else {
        throw new Error('cannot reject');
      }
    } catch (error) {
      console.log(error);
    }
  }

  // если нажали на редактирование
  if (id === 'editPost') {
    window.location = `http://localhost:3000/post/cost/${cardId}`;
  }

  // если нажали на лайк
  if (id === 'like') {
    try {
      const response = await fetch('http://localhost:3000/post/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: cardId,
        }),
      });
      if (response.status === 200) {
        const entry = await response.json();
        const element = card.querySelector('#amount');
        element.innerText = entry.amount;
      } else {
        throw new Error('cannot reject');
      }
    } catch (error) {
      console.log(error);
    }
  }
});

// Отслеживаем отправку формы на редактирование
const editForm = document.querySelector('.postEditor');

editForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const { value } = event.target.closest('.postEditor').querySelector('textarea');

  try {
    const response = await fetch('/post', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: value,
        postId: event.target.dataset.id,
      }),
    });
    if (response.status === 200) {
      window.location = 'http://localhost:3000/user/profile';
    } else {
      throw new Error('cannot reject');
    }
  } catch (error) {
    console.log(error);
  }
});
