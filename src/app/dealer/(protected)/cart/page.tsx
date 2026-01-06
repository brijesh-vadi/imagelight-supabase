import { getCartItems } from "@/actions/dealer/cart.action";
import DealerCartView from "@/components/role/dealer/views/cart/DealerCartView";

const DealerCartPage = async () => {
  const { data: cartItems } = await getCartItems();

  return <DealerCartView initialCartItems={cartItems || []} />;
};

export default DealerCartPage;
