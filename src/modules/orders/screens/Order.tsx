import Screen from '../../../shared/components/screen/Screen';
import { useOrder } from '../hooks/useOrder';

const Order = () => {
  const { orders } = useOrder();

  console.log('orders', orders);

  return (
    <Screen>
      <div>Orders</div>
    </Screen>
  );
};

export default Order;
