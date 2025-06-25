import { useReducer } from 'react';
import Header from './components/Header/Header';
import Meals from './components/Meals/Meals';
import Cart from './components/Cart/Cart';
import CartProvider from './context/CartProvider';

function App() {
  // const [cartIsShown, setCartIsShown] = useState(false);

  // const showCartHandler = () => {
  //   setCartIsShown(true);
  // };

  // const hideCartHandler = () => {
  //   setCartIsShown(false);
  // };

  const cartReducer = (state, action) => {
    switch (action.type) {
      case 'SHOW':
        return true;
      case 'HIDE':
        return false;
      default:
        return state;
    }
  };

  const [cartIsShown, dispatchCart] = useReducer(cartReducer, false);

  const showCartHandler = () => dispatchCart({ type: 'SHOW' });
  const hideCartHandler = () => dispatchCart({ type: 'HIDE' });

  return (
    <CartProvider>
      <Header onShowCart={showCartHandler} />
      {!cartIsShown && <Meals />}
      {cartIsShown && <Cart onClose={hideCartHandler} />}
    </CartProvider>
  );
}

export default App;