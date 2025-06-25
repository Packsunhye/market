import { useEffect, useReducer } from 'react';
import CartContext from './CartContext';

const getInitialCartState = () => {
  const cartState = localStorage.getItem('cartstate');
  return cartState
    ? JSON.parse(cartState)
    : {
      items: [],
      totalAmount: 0,
    };
}; // 초기 바구니 상태 설정 함수
// 만약 로컬 스토리지에 저장된 카트 스테이스가 있음 불러와 객체로 변환
// 없으면 아이템 빈 배열과 토탈 0으로 초기값

const cartReducer = (state, action) => { // cartReducer는 상태 변화 로직을 담당하는 함
  switch (action.type) {
    case 'ADD': {
      const index = state.items.findIndex((i) => i.id === action.item.id);
      const foundItem = state.items[index];

      let items;

      if (foundItem) {
        const newItem = {
          ...foundItem,
          amount: foundItem.amount + action.item.amount,
        };
        items = [...state.items];
        items[index] = newItem;
      } else {
        items = state.items.concat(action.item);
      }

      const total = state.totalAmount + action.item.price * action.item.amount;

      return {
        items: items,
        totalAmount: total,
      };
      // 총 금액 ( 새 아이템 가격 * 수량 )
      // 새로운 상태 객체를 만들어 반환
    }
    case 'REMOVE': {
      const index = state.items.findIndex((i) => i.id === action.id);
      const targetItem = state.items[index];

      const total = state.totalAmount - targetItem.price;

      let items;

      if (targetItem.amount === 1) {
        items = state.items.filter((i) => i.id !== action.id);
      } else {
        const newItem = {
          ...targetItem,
          amount: targetItem.amount - 1,
        };
        items = [...state.items];
        items[index] = newItem;
      }

      return {
        items: items,
        totalAmount: total,
      };
    }
    case 'CLEAR': {
      return {
        items: [],
        totalAmount: 0,
      };
    }
    default: {
      return state;
    }
  }
};

const CartProvider = ({ children }) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    getInitialCartState()
  );

  const addToCartHandler = (item) => {
    dispatchCartAction({
      type: 'ADD',
      item,
    });
  };

  const removeCartItemHandler = (id) => {
    dispatchCartAction({
      type: 'REMOVE',
      id,
    });
  };

  const clearCartHandler = () => {
    dispatchCartAction({ type: 'CLEAR' });
  };

  useEffect(() => {
    localStorage.setItem('cartstate', JSON.stringify(cartState));
  }, [cartState]);

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addToCartHandler,
    removeItem: removeCartItemHandler,
    clearCart: clearCartHandler,
  };
  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
    // CartContext.Provider로 하위 컴포넌트들이 이 상태와 함수에 접근할 수 있게 함
  );
};

export default CartProvider; // 이 컴포넌트를 외부에서 사용할 수 있도록 내보냄