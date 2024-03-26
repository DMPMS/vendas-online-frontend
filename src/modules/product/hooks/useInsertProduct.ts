import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { URL_PRODUCT, URL_PRODUCT_ID } from '../../../shared/constants/urls';
import { InsertProduct } from '../../../shared/dtos/InsertProduct.dto';
import { MethodsEnum } from '../../../shared/enums/methods.enum';
import { useRequests } from '../../../shared/hooks/useRequest';
import { useProductReducer } from '../../../store/reducers/productReducer/useProductReducer';
import { ProductRoutesEnum } from '../routes';

const DEFAULT_PRODUCT = {
  name: '',
  price: 0,
  image: '',
};

export const useInsertProduct = (productId?: string) => {
  const navigate = useNavigate();
  const { request, loading } = useRequests();
  const { product: productReducer, setProduct: setProductReducer } = useProductReducer();
  const [disabledButton, setDisabledButton] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [product, setProduct] = useState<InsertProduct>(DEFAULT_PRODUCT);

  useEffect(() => {
    if (productReducer) {
      setProduct({
        name: productReducer.name,
        price: productReducer.price,
        image: productReducer.image,
        categoryId: productReducer.category?.id,
      });
    }
  }, [productReducer]);

  useEffect(() => {
    if (productId) {
      setIsEdit(true);
      request(URL_PRODUCT_ID.replace('{productId}', productId), MethodsEnum.GET, setProductReducer);
    } else {
      setProductReducer(undefined);
      setProduct(DEFAULT_PRODUCT);
    }
  }, [productId]);

  useEffect(() => {
    if (product.name && product.categoryId && product.image && product.price > 0) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
  }, [product]);

  const handleOnClickCancel = () => {
    navigate(ProductRoutesEnum.PRODUCT);
  };

  const onChangeInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    nameObject: string,
    isNumber?: boolean,
  ) => {
    setProduct({
      ...product,
      [nameObject]: isNumber ? Number(event.target.value) : event.target.value,
    });
  };

  const handleChangeSelect = (value: string) => {
    setProduct({
      ...product,
      categoryId: Number(value),
    });
  };

  const handleInsertProduct = async () => {
    if (productId) {
      await request(
        URL_PRODUCT_ID.replace('{productId}', productId),
        MethodsEnum.PUT,
        undefined,
        product,
      );
    } else {
      await request(URL_PRODUCT, MethodsEnum.POST, undefined, product);
    }
    navigate(ProductRoutesEnum.PRODUCT);
  };

  return {
    product,
    loading,
    disabledButton,
    isEdit,
    onChangeInput,
    handleInsertProduct,
    handleChangeSelect,
    handleOnClickCancel,
  };
};
