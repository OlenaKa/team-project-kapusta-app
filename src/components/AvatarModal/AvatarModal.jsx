import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPortal } from 'react-dom';
import { uploadAvatar, getUserName } from 'redux/auth';
import useOnClickOutside from 'hooks/useOnClickOutside';
import s from './AvatarModal.module.css';

const modalRoot = document.querySelector('#modal-root');

const AvatarModal = ({ closeAvatarModal }) => {
  const dispatch = useDispatch();
  const userName = useSelector(state => getUserName(state));
  const [file, setFile] = useState(null);
  const [userNewName, setUserNewName] = useState(userName);
  const [dragged, setDragged] = useState(false);
  const ref = useRef();
  useOnClickOutside(ref, closeAvatarModal);
  useEffect(() => {
    window.document.body.style.overflowY = 'hidden';
    return () => {
      window.document.body.style.overflowY = 'visible';
    };
  });
  const handleDropAvatar = e => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    console.log(files[0].type.includes('image'));
    if (files[0].type.includes('image')) {
      setFile(files[0]);
    } else {
      alert('формат файла может быть .png или.jpg');
    }
  };
  const handleDragOver = e => {
    e.preventDefault();
    setDragged(true);
  };
  const handleDelFile = () => {
    setFile(null);
  };

  const handleChangeAvatar = e => {
    setFile(e.target.files[0]);
  };
  const onHandleChangeName = e => {
    setUserNewName(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.set('name', userNewName);
    formData.append('avatar', file);
    dispatch(uploadAvatar(formData));
    setFile(null);
    closeAvatarModal();
  };

  return createPortal(
    <div className={s.avatarModallWrapper}>
      <form className={s.changeAvatarForm} onSubmit={handleSubmit} ref={ref}>
        <span className={s.closeIcon} onClick={closeAvatarModal}>
          &#10006;
        </span>
        <p className={s.modalAvatarTitle}>Редактировать профиль </p>
        <div
          className={s.dropZone}
          onDrop={handleDropAvatar}
          onDragOver={handleDragOver}
        >
          Аватар
          {file ? (
            <>
              <p className={s.fileName}>{file.name}</p>
              <button
                type="button"
                className={s.buttonDelFile}
                onClick={handleDelFile}
              >
                &#10006;
              </button>
            </>
          ) : (
            <p className={dragged ? `${s.arrowDownOrange}` : `${s.arrowDown}`}>
              &#11147;
            </p>
          )}
        </div>
        <span> или </span>
        <label className={s.avatarInputFileLabel}>
          Выберите файл
          <input
            type="file"
            name="avatar"
            className={s.inputFileAvatar}
            onChange={handleChangeAvatar}
            accept="image/*"
          />{' '}
        </label>
        <label className={s.nameLabel}>
          Имя:
          <input
            type="text"
            className={s.nameInput}
            placeholder={userNewName}
            value={userNewName}
            name="name"
            onChange={onHandleChangeName}
            pattern="^[A-Za-zА-Яа-яЁёЄєЇї' '\-()0-9]{3,30}$"
            title="Имя может состоять только от трёх до 30 букв, апострофа, тире и пробелов. Например Adrian, Jac Mercer, d'Artagnan, Александр Репета и т.п."
            required
          />
        </label>
        <div className={s.buttonContainer}>
          <button type="submit" className={s.buttonOk}>
            ОК
          </button>
          <button
            type="button"
            className={s.buttonCancel}
            onClick={closeAvatarModal}
          >
            НАЗАД
          </button>
        </div>
      </form>
    </div>,
    modalRoot,
  );
};

export default AvatarModal;
