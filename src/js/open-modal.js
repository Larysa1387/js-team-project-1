// import card from '../templates/eventCardsTpl.hbs';
import { refs } from './refs';
import modalTpl from '../templates/modalTpl.hbs';
import SearchService from './api_service';
import eventsModalTpl from '../templates/events__modal.hbs';
<<<<<<< HEAD
import CountdownTimer from '../js/timer';
=======
import { pnotifySuccess, pnotifyError } from '../js/pnotify.js';
import { favEventsId } from './favEventsId';
import { updateFavoriteCounter } from './favorite';
>>>>>>> dev

export default (() => {
  refs.openModalBtn.addEventListener('click', onOpenModal);
  refs.closeModalBtn.addEventListener('click', onCloseModal);

  function onOpenModal(e) {
    if ((e.target.nodeName !== 'IMG') & 'P') {
      return;
    }

    document.body.classList.add('data-modal-open');
    refs.modal.classList.remove('is-hidden');
    window.addEventListener('keydown', onKeydownClose);
    refs.modal.addEventListener('click', onOverlay);

    const searchServiceId = new SearchService();
    const targetId = e.target.dataset.id;

    searchServiceId
      .fetchApiById(targetId)
      .then(el => {
        // modalTpl(el);
        const { start } = el.dates;
        const { localDate, localTime } = start;
        const eventTime = {
          date: localDate,
          time: localTime,
        }
        const date = eventTime;
        const str =
        Object.values(date)[0].split("-").join(" ") + " " + Object.values(date)[1];
        console.log(str);

        const newDate = new CountdownTimer({
          selector: "#timer-2",
          targetDate: new Date(str),
        });
        newDate.updateDate();
        // newDate.stopTimer();

        return modalTpl(el);
      })
      .then(el => {
        refs.mainModal.innerHTML = el;
        const addToFaforitBtn = document.querySelector('.basket'); //! не добавляти в файл refs ні в якому разі
        addToFaforitBtn.addEventListener('click', onAddToFaforiteBtn);
        // console.log(buyTicketsBtn);
      });

    function onAddToFaforiteBtn() {
      if (favEventsId.includes(targetId)) {
        pnotifyError('Already exist');
      } else {
        searchServiceId
          .fetchApiById(targetId)
          .then(el => eventsModalTpl(el))
          .then(el => {
            refs.eventsList.insertAdjacentHTML('beforeend', el);
            // el.classList.remove('.hover');
            favEventsId.push(targetId);
            updateFavoriteCounter();
            pnotifySuccess('Event added to favorite');
          });
      }
    }
  }

  function onCloseModal() {
    document.body.classList.remove('data-modal-open');
    refs.modal.classList.add('is-hidden');
    window.removeEventListener('keydown', onKeydownClose);
    refs.modal.removeEventListener('click', onOverlay);
    refs.mainModal.innerHTML = '';
  }

  function onKeydownClose(e) {
    if (e.code === 'Escape') onCloseModal();
  }

  function onOverlay(e) {
    if (e.target === refs.modal) onCloseModal();
  }
})();
