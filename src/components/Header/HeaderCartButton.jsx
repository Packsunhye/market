import { useContext, useEffect, useReducer } from 'react';
import { HiShoppingCart } from 'react-icons/hi';
import CartContext from '../../context/CartContext';
import styles from './HeaderCartButton.module.css';

const aniReducer = (state, action) => {
  switch (action.type) {
    case 'BUMP': return true;
    case 'RESET': return false;
    default: return state;
  }
};

export default function HeaderCartButton({ onShowCart }) {
  const cartCtx = useContext(CartContext);
  const { items } = cartCtx;

  const [btnIsAnimated, dispatchAni] = useReducer(aniReducer, false);
  const numberOfCartItems = items.reduce((el, target) => el + target.amount, 0);
  const btnClasses = `${styles.button} ${btnIsAnimated ? styles.bump : ''}`;

  useEffect(() => {
    if (items.length === 0) return;

    dispatchAni({ type: 'BUMP' });
    const timer = setTimeout(() => { dispatchAni({ type: 'RESET' }); }, 300);
    return () => clearTimeout(timer);
  }, [items]);

  return (
    <button className={btnClasses} onClick={onShowCart}>
      <span className={styles.icon}>
        <HiShoppingCart />
      </span>
      <span className={styles.badge}>{numberOfCartItems}</span>
    </button>
  );
}